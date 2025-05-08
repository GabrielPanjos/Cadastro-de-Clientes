from flask import request, redirect, url_for, flash, Blueprint, render_template, jsonify
from db import get_db_connection
from datetime import datetime

cliente_route = Blueprint('cliente', __name__)



@cliente_route.route('/')
def lista_clientes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    conn.close()
    return render_template('index.html', clientes=clientes)

@cliente_route.route('/', methods=['POST'])
def obter_cliente():
    nome = request.form['nome']
    cpf = request.form['CPF']
    rg = request.form['RG']
    data_nascimento = request.form['data_nascimento']
    numero_telefone = request.form['numero_telefone']
    email = request.form['email']
    estado = request.form['estado']
    cidade = request.form['cidade']
    rua = request.form['rua']
    cep = request.form['CEP']
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

    return redirect(url_for('cliente.lista_clientes'))  # Volta para lista de clientes

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
    """ exibir detalhes do cliente """
    return render_template('detalhe_cliente.html')

@cliente_route.route('/<int:cliente_id>/edit')
def form_edit_cliente(cliente_id):
    """ formulário para editar um cliente """
    return render_template('form_edit_cliente.html')

@cliente_route.route('/<int:cliente_id>/update', methods=['PUT'])
def atualizar_cliente(cliente_id):
    """ atualizar informações do cliente """
    pass

@cliente_route.route('/<int:cliente_id>/delete', methods=['DELETE'])
def deletar_cliente(cliente_id):
    """ deletar informações do cliente """
    pass