
# Cadastro de Clientes

Este projeto é um sistema de cadastro de clientes com interface web, desenvolvido em Python. Ele permite o registro, listagem, atualização e exclusão de informações de clientes, utilizando banco de dados e organização em rotas.

## 🛠 Tecnologias Utilizadas

- Python 3
- Flask
- SQL (MySQL ou SQLite)
- HTML, CSS (Bootstrap ou customizado)
- SweetAlert2 (para alertas e notificações)

## 📁 Estrutura do Projeto

```
Cadastro de Clientes/
├── main.py                  # Arquivo principal para executar o app Flask
├── db.py                    # Configuração do banco de dados
├── banco_de_dados/
│   └── school_universe.sql  # Script SQL para criação do banco
├── routes/
│   ├── cliente.py           # Rotas relacionadas aos clientes
│   └── home.py              # Rotas da página inicial
├── templates/               # Templates HTML (não listados aqui, mas esperados)
├── static/                  # CSS, JS, imagens (não listados aqui, mas esperados)
├── images/                  # Imagens utilizadas no projeto
└── __pycache__/             # Arquivos compilados automaticamente (ignorar)
```

## ⚙️ Como Executar

1. **Clone o repositório** (ou extraia o ZIP):
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd Cadastro\ de\ Clientes
   ```

2. **Crie um ambiente virtual (opcional, mas recomendado)**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências**:
   ```bash
   pip install flask
   ```

4. **Configure o banco de dados**:
   - Importe o arquivo `school_universe.sql` em seu servidor MySQL ou SQLite.
   - Altere as configurações de conexão no `db.py` conforme necessário.

5. **Execute o app**:
   ```bash
   python main.py
   ```

6. **Acesse no navegador**:
   ```
   http://localhost:5000
   ```

## ✅ Funcionalidades

- Cadastro de clientes com validação de dados
- Listagem e pesquisa de clientes
- Atualização e remoção de registros
- Interface amigável com alertas e mensagens de confirmação

## 📸 Imagens

O projeto inclui imagens e capturas de tela na pasta `images/`.

## 📌 Observações

- Certifique-se de que o banco de dados esteja corretamente configurado.
- O projeto pode requerer outras bibliotecas específicas dependendo da implementação (verifique `requirements.txt` se existir).
