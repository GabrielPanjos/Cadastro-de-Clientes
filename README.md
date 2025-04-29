# School Universe

Sistema web simples para gerenciamento de **clientes** utilizando **Flask**, **MySQL** e **HTML/CSS/JS**. Este projeto simula o cadastro e listagem de clientes com separação de dados pessoais e endereço, sendo ideal para fins educacionais e prática com desenvolvimento web e bancos de dados relacionais.

## 📁 Estrutura do Projeto

```
├── main.py               # Ponto de entrada da aplicação Flask
├── db.py                 # Conexão com banco de dados MySQL
├── cliente.py            # Rotas para operações com clientes
├── home.py               # Rota da página inicial
├── templates/
│   └── index.html        # Página principal do sistema
├── static/
│   ├── style.css         # Estilos personalizados
│   └── js/
│       └── script.js     # Scripts para alternar seções da interface
└── school_universe.sql   # Script SQL para criar a base de dados
```

## 🚀 Tecnologias Utilizadas

- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [MySQL](https://www.mysql.com/)
- HTML5, CSS3, JavaScript

## ⚙️ Como Executar

### Pré-requisitos

- Python 3 instalado
- MySQL Server ativo
- Criar o banco de dados com o script `school_universe.sql`

### Passos

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/school-universe.git
   cd school-universe
   ```

2. Instale as dependências:
   ```bash
   pip install flask mysql-connector-python
   ```

3. Configure o banco de dados (verifique se os dados de acesso estão corretos em `db.py` e `main.py`):
   ```sql
   -- No MySQL Workbench ou terminal:
   SOURCE school_universe.sql;
   ```

4. Inicie o servidor Flask:
   ```bash
   python main.py
   ```

5. Acesse no navegador:
   ```
   http://127.0.0.1:5000
   ```

## ✍️ Funcionalidades

- Cadastro de clientes com informações pessoais e endereço
- Listagem com contagem total
- Interface amigável com abas e botões interativos
- Estilo visual limpo e responsivo

## 📌 Observações

- Algumas rotas ainda estão em desenvolvimento (`edit`, `delete`).
- O botão "Pesquisar" e "Total" ainda não possuem back-end funcional.
- Use esse projeto como base para expandir CRUDs mais completos.

---

**Projeto desenvolvido para fins de estudo.**
