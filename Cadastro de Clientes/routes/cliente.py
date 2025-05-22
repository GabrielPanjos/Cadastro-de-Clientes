from flask import request, redirect, url_for, flash, Blueprint, render_template, jsonify
from db import get_db_connection
import re
import traceback  # Importe traceback
from datetime import datetime
import pytz

cliente_route = Blueprint('cliente', __name__)

@cliente_route.route('/', methods=['POST'])
def obter_cliente():
    try:
        print("Requisição POST recebida!")
        print("Dados do formulário:", request.form)

        nome = request.form.get('nome', '').strip()
        cpf = re.sub(r'[^0-9]', '', request.form.get('CPF', '').strip())
        data_nascimento = request.form.get('data_nascimento', '').strip()
        email = request.form.get('email', '').strip()
        numero_telefone = request.form.get('numero_telefone', '').strip()
        cep = request.form.get('CEP', '').strip()

        # Campos opcionais
        rg = request.form.get('RG', '').strip()
        estado = request.form.get('estado', '').strip()
        cidade = request.form.get('cidade', '').strip()
        rua = request.form.get('rua', '').strip()
        bairro = request.form.get('bairro', '').strip()
        complemento = request.form.get('complemento', '').strip()

        # ✅ Validação obrigatória
        if not nome or not cpf or not data_nascimento:
            return jsonify({'error': 'Nome, CPF e Data de Nascimento são obrigatórios.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # ✅ Verificação de duplicidade de CPF
        cursor.execute("SELECT * FROM clientes WHERE cpf = %s", (cpf,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'CPF já cadastrado.'}), 400

        # ✅ Verificação de duplicidade de RG (se preenchido)
        if rg:
            rg = re.sub(r'[^\d]', '', rg)
            cursor.execute("SELECT * FROM clientes WHERE rg = %s", (rg,))
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'RG já cadastrado.'}), 400

        # ✅ Verificação de duplicidade de email (se preenchido)
        if email:
            cursor.execute("SELECT * FROM clientes WHERE email = %s", (email,))
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'Email já cadastrado.'}), 400

        # ✅ Verificação de duplicidade de número de telefone (se preenchido)
        if numero_telefone:
            cursor.execute("SELECT * FROM clientes WHERE numero_telefone = %s", (numero_telefone,))
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'Número de telefone já cadastrado.'}), 400

        # ✅ Inserção segura
        cursor.execute('''
            INSERT INTO clientes 
            (nome, cpf, rg, data_nascimento, numero_telefone, email, estado, cidade, rua, cep, bairro, complemento)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            nome, cpf, rg, data_nascimento,
            numero_telefone, email,
            estado, cidade, rua, cep, bairro, complemento
        ))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Cliente cadastrado com sucesso!'}), 200

    except Exception as e:
        print("Erro no servidor:", e)
        traceback.print_exc()
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

@cliente_route.route('/editar/<int:cliente_id>', methods=['PUT'])
def atualizar_cliente(cliente_id):
    try:
        data = request.get_json()

        nome = data.get('nome', '').strip()
        cpf = data.get('cpf', '').strip()
        rg = data.get('rg', '').strip()
        numero_telefone = data.get('numero_telefone', '').strip()
        email = data.get('email', '').strip()
        data_nascimento = data.get('data_nascimento', '').strip()
        estado = data.get('estado', '').strip()
        cidade = data.get('cidade', '').strip()
        rua = data.get('rua', '').strip()
        cep = data.get('cep', '').strip()
        bairro = data.get('bairro', '').strip()
        complemento = data.get('complemento', '').strip()

        if not nome or not cpf or not data_nascimento:
            return jsonify({'error': 'Nome, CPF e Data de Nascimento são obrigatórios.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE clientes
            SET nome = %s, cpf = %s, rg = %s, numero_telefone = %s, email = %s,
                data_nascimento = %s, estado = %s, cidade = %s, rua = %s,
                cep = %s, bairro = %s, complemento = %s
            WHERE id_clientes = %s
        ''', (nome, cpf, rg, numero_telefone, email, data_nascimento, estado,
              cidade, rua, cep, bairro, complemento, cliente_id))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Cliente atualizado com sucesso!'}), 200

    except Exception as e:
        print('Erro ao atualizar cliente:', e)
        traceback.print_exc()
        return jsonify({'error': 'Erro ao atualizar cliente.'}), 500

@cliente_route.route('/<int:cliente_id>/deletar', methods=['DELETE'])
def deletar_cliente(cliente_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM clientes WHERE id_clientes = %s", (cliente_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Cliente deletado com sucesso."})

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
        cpf = re.sub(r'[^0-9]', '', request.form.get('CPF', '').strip())
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

        # Verificar se a data de nascimento está no formato correto
        if data_nascimento:
            # A data deve estar no formato AAAA-MM-DD
            # Se a data estiver no formato DD/MM/AAAA, converta-a
            partes_data = data_nascimento.split('/')
            if len(partes_data) == 3:
                dia = partes_data[0]
                mes = partes_data[1]
                ano = partes_data[2]
                data_nascimento = f"{ano}-{mes}-{dia}"  # Formato AAAA-MM-DD

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

    except Exception as e:
        conn.close()
        print('Erro ao atualizar cliente:', e)
        traceback.print_exc()
        return jsonify({'error': 'Erro ao atualizar cliente.'}), 500

@cliente_route.route('/historico')
def historico():
    return render_template('historico.html')
