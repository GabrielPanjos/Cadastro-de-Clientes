from flask import request, redirect, url_for, flash, Blueprint, render_template, jsonify
from db import get_db_connection
import re
import traceback  # Importe traceback
from datetime import datetime

cliente_route = Blueprint('cliente', __name__)

@cliente_route.route('/', methods=['POST'])
def obter_cliente():
    try:
        print("Requisição POST recebida!")
        print("Dados do formulário:", request.form)

        nome = request.form.get('nome', '').strip()
        cpf = request.form.get('CPF', '').strip()
        data_nascimento = request.form.get('data_nascimento', '').strip()
        email = request.form.get('email', '').strip()
        numero_telefone = request.form.get('numero_telefone', '').strip()
        cep = request.form.get('CEP', '').strip()

        # Validação do Nome
        if not nome:
            return jsonify({"error": "Erro: Nome não pode estar vazio."}), 400

        # Validação do CPF
        if not cpf:
            return jsonify({"error": "Erro: CPF não pode estar vazio."}), 400
        if not re.match(r'^\d{11}$', cpf):
            return jsonify({"error": "Erro: CPF deve ter 11 dígitos numéricos."}), 400

        # Validação da Data de Nascimento
        if not data_nascimento:
            return jsonify({"error": "Erro: Data de Nascimento não pode estar vazia."}), 400
        try:
            datetime.strptime(data_nascimento, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Erro: Data de Nascimento em formato inválido (AAAA-MM-DD)."}), 400

        # Validação do Email
        if email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return jsonify({"error": "Erro: Formato de E-mail inválido."}), 400

        # Validação do Celular
        if numero_telefone and not re.match(r'^\d{10,11}$', numero_telefone):
            return jsonify({"error": "Erro: Celular deve ter 10 ou 11 dígitos numéricos."}), 400

        # Validação do CEP
        if cep and not re.match(r'^\d{8}$', cep):
            return jsonify({"error": "Erro: CEP deve ter 8 dígitos numéricos."}), 400

        # Se todas as validações passarem, continua com o cadastro
        rg = request.form['RG']
        estado = request.form['estado']
        cidade = request.form['cidade']
        rua = request.form['rua']
        bairro = request.form['bairro']
        complemento = request.form['complemento']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO clientes 
            (nome, cpf, rg, data_nascimento, numero_telefone, email, estado, cidade, rua, cep, bairro, complemento)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (nome, cpf, rg, data_nascimento, numero_telefone, email, estado, cidade, rua, cep, bairro, complemento))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Cliente cadastrado com sucesso!'}), 200

    except Exception as e:
        print("Erro no servidor:", e)
        traceback.print_exc()  # Imprime o traceback completo
        return jsonify({"error": "Erro interno no servidor."}), 500

@cliente_route.route('/')
def lista_clientes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    conn.close()
    return render_template('index.html', clientes=clientes)

@cliente_route.route('/clientes_api')
def clientes_api():
    pagina = int(request.args.get('pagina', 0))
    por_pagina = 5
    offset = pagina * por_pagina

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total FROM clientes")
    total = cursor.fetchone()['total']

    cursor.execute("SELECT * FROM clientes LIMIT %s OFFSET %s", (por_pagina, offset))
    clientes = cursor.fetchall()
    conn.close()

    return jsonify({
        'clientes': clientes,
        'total': total
    })

@cliente_route.route('/new')
def form_cliente():
    """ formulário para cadastrar um cliente """
    return render_template('index.html')

@cliente_route.route('/<int:cliente_id>')
def detalhe_cliente(cliente_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes WHERE id_clientes = %s", (cliente_id,))
        cliente = cursor.fetchone()
        conn.close()

        if cliente:
            print("Cliente encontrado:", cliente)  # Para depuração
            return jsonify(cliente)
        else:
            print("Cliente não encontrado")  # Para depuração
            return jsonify({'error': 'Cliente não encontrado'}), 404
    except Exception as e:
        print("Erro ao buscar cliente:", e)
        traceback.print_exc()
        return jsonify({'error': 'Erro ao buscar cliente'}), 500

@cliente_route.route('/<int:cliente_id>/edit')
def form_edit_cliente(cliente_id):
    """ formulário para editar um cliente """
    return render_template('form_edit_cliente.html')

@cliente_route.route('/<int:cliente_id>', methods=['PUT'])
def atualizar_cliente(cliente_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obter dados do formulário
        nome = request.form.get('editar-nome', '').strip()
        cpf = request.form.get('editar-cpf', '').strip()
        rg = request.form.get('editar-rg', '').strip()
        numero_telefone = request.form.get('editar-numero_telefone', '').strip()
        email = request.form.get('editar-email', '').strip()
        data_nascimento = request.form.get('editar-data_nascimento', '').strip()
        estado = request.form.get('editar-estado', '').strip()
        cidade = request.form.get('editar-cidade', '').strip()
        rua = request.form.get('editar-rua', '').strip()
        cep = request.form.get('editar-cep', '').strip()
        bairro = request.form.get('editar-bairro', '').strip()
        complemento = request.form.get('editar-complemento', '').strip()

        # Validação (Opcional, mas recomendado)
        if not nome or not cpf or not data_nascimento:
            return jsonify({'error': 'Nome, CPF e Data de Nascimento são obrigatórios.'}), 400

        # Executar a atualização
        cursor.execute('''
            UPDATE clientes
            SET nome = %s, cpf = %s, rg = %s, numero_telefone = %s, email = %s,
                data_nascimento = %s, estado = %s, cidade = %s, rua = %s,
                cep = %s, bairro = %s, complemento = %s
            WHERE id_clientes = %s
        ''', (nome, cpf, rg, numero_telefone, email, data_nascimento, estado,
              cidade, rua, cep, bairro, complemento, cliente_id))

        conn.commit()

        if cursor.rowcount > 0:
            conn.close()
            return jsonify({'message': 'Cliente atualizado com sucesso!'}), 200
        else:
            conn.close()
            return jsonify({'message': 'Cliente não encontrado ou nenhuma alteração realizada.'}), 404

    except Exception as e:
        conn.close()
        print('Erro ao atualizar cliente:', e)
        traceback.print_exc()
        return jsonify({'error': 'Erro ao atualizar cliente.'}), 500

@cliente_route.route('/<int:cliente_id>/delete', methods=['DELETE'])
def deletar_cliente(cliente_id):
    """ deletar informações do cliente """
    pass

@cliente_route.route('/buscar/<int:id_cliente>', methods=['GET'])
def buscar_cliente(id_cliente):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes WHERE id_clientes = %s", (id_cliente,))
    cliente = cursor.fetchone()
    conn.close()

    if cliente:
        return jsonify(cliente)
    else:
        return jsonify({'erro': 'Cliente não encontrado'}), 404

@cliente_route.route('/buscar', methods=['GET'])
def buscar_clientes():
    termo = request.args.get('termo', '').strip()

    if not termo:
        return jsonify([])

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Se for só números → busca por CPF
    if termo.isdigit():
        cursor.execute("SELECT * FROM clientes WHERE cpf LIKE %s", (f"%{termo}%",))
    else:
        cursor.execute("SELECT * FROM clientes WHERE nome LIKE %s", (f"%{termo}%",))

    clientes = cursor.fetchall()
    conn.close()

    return jsonify(clientes)

@cliente_route.route('/<int:cliente_id>/edit', methods=['POST'])
def atualizar_cliente_post(cliente_id):
       try:
           conn = get_db_connection()
           cursor = conn.cursor()

           # Obter dados do formulário
           nome = request.form.get('nome', '').strip()
           cpf = request.form.get('CPF', '').strip()
           rg = request.form.get('RG', '').strip()
           numero_telefone = request.form.get('numero_telefone', '').strip()
           email = request.form.get('email', '').strip()
           data_nascimento = request.form.get('data_nascimento', '').strip()
           estado = request.form.get('estado', '').strip()
           cidade = request.form.get('cidade', '').strip()
           rua = request.form.get('rua', '').strip()
           cep = request.form.get('CEP', '').strip()
           bairro = request.form.get('bairro', '').strip()
           complemento = request.form.get('complemento', '').strip()

           # Log dos dados recebidos
           print(f"Dados recebidos para atualização: {request.form}")

           # Validação (Opcional, mas recomendado)
           if not nome or not cpf or not data_nascimento:
               return jsonify({'error': 'Nome, CPF e Data de Nascimento são obrigatórios.'}), 400

           # Executar a atualização
           cursor.execute('''
               UPDATE clientes
               SET nome = %s, cpf = %s, rg = %s, numero_telefone = %s, email = %s,
                   data_nascimento = %s, estado = %s, cidade = %s, rua = %s,
                   cep = %s, bairro = %s, complemento = %s
               WHERE id_clientes = %s
           ''', (nome, cpf, rg, numero_telefone, email, data_nascimento, estado,
                 cidade, rua, cep, bairro, complemento, cliente_id))

           conn.commit()

           if cursor.rowcount > 0:
               conn.close()
               return jsonify({'message': 'Cliente atualizado com sucesso!'}), 200
           else:
               conn.close()
               return jsonify({'message': 'Cliente não encontrado ou nenhuma alteração realizada.'}), 404

       except Exception as e:
           conn.close()
           print('Erro ao atualizar cliente:', e)  # Log do erro
           traceback.print_exc()  # Imprime o traceback completo
           return jsonify({'error': 'Erro ao atualizar cliente.'}), 500
   
   


