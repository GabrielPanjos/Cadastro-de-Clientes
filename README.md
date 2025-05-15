# Cadastro de Clientes - School Universe

Este repositório contém o código de um sistema web para cadastro e gerenciamento de clientes, desenvolvido como parte de um projeto acadêmico. A aplicação foi construída utilizando Python (Flask) no backend e HTML, CSS e JavaScript no frontend, com um banco de dados MySQL para persistência dos dados.

## Funcionalidades Principais

* **Cadastro de Clientes:** Permite a inclusão de novos clientes no sistema, coletando informações como nome, CPF, RG, dados de contato e endereço.
* **Listagem de Clientes:** Exibe uma lista paginada de clientes cadastrados, facilitando a navegação e visualização dos dados.
* **Edição de Clientes:** Possibilita a modificação das informações de clientes existentes.
* **Pesquisa de Clientes:** Implementa a funcionalidade de busca de clientes por nome ou CPF.
* **Interface Amigável:** Apresenta uma interface web intuitiva e fácil de usar.

## Tecnologias Utilizadas

* **Backend:**
    * Python 3.x
    * Flask (framework web)
    * MySQL (banco de dados)
    * `mysql-connector-python` (driver MySQL para Python)
* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript
* **Banco de Dados:**
    * MySQL

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```html
├── main.py           # Ponto de entrada da aplicação Flask
├── routes/           # Módulos Flask (rotas)
│   ├── home.py       # Rotas da página inicial
│   └── cliente.py    # Rotas relacionadas a clientes
├── templates/        # Arquivos HTML
│   ├── index.html    # Página principal (listagem e formulários)
│   └── ...           # Outros templates (se houver)
├── static/           # Arquivos estáticos (CSS, JavaScript, imagens)
│   ├── style.css     # Estilos CSS
│   └── script.js     # Lógica JavaScript
├── db.py             # Conexão com o banco de dados
├── school_universe.sql # Script SQL para criação do banco de dados
└── README.md         # Este arquivo
```
## Configuração e Execução

Para executar o projeto localmente, siga os passos:

1.  **Pré-requisitos:**
    * Python 3.x instalado
    * MySQL Server instalado
2.  **Configurar o Banco de Dados:**
    * Crie um banco de dados no MySQL com o nome `school_universe`.
    * Execute o script `school_universe.sql` para criar as tabelas necessárias.
    * Atualize as configurações de conexão no arquivo `db.py` com suas credenciais do MySQL (host, usuário, senha).
3.  **Instalar as Dependências:**
    * Crie um ambiente virtual (opcional, mas recomendado): `python3 -m venv venv`
    * Ative o ambiente virtual:
        * No Linux/macOS: `source venv/bin/activate`
        * No Windows: `venv\Scripts\activate`
    * Instale as dependências do Python: `pip install Flask mysql-connector-python`
4.  **Executar a Aplicação:**
    * Execute o arquivo `main.py`: `python main.py`
    * Acesse a aplicação no seu navegador em `http://127.0.0.1:5000/`

## Considerações sobre o Desenvolvimento

* O projeto foi desenvolvido com foco em atender aos requisitos do trabalho acadêmico, buscando implementar as funcionalidades básicas de um sistema de cadastro de clientes.
* Melhorias futuras podem incluir:
    * Validação de dados no frontend e backend para aumentar a robustez.
    * Implementação de autenticação e autorização para garantir a segurança.
    * Tratamento de erros mais amigável para o usuário.
    * Testes unitários e de integração para garantir a qualidade do código.
    * Refatoração do código para seguir melhores práticas de desenvolvimento.

## Contribuição

Contribuições são bem-vindas! Se você tiver sugestões de melhorias ou correções, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Autor

* \[Gabriel Pereira dos Anjos]
