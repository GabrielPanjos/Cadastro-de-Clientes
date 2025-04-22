from flask import Flask, url_for, render_template

# inicialização
app = Flask(__name__)

# rotas
@app.route('/')
def ola_mundo():
    return render_template('index.html')

@app.route('/sobre')
def pagina_sobre():
    return """
    <b>Pereira aprendendo Flask</b>
    """

# execução
app.run(debug=True)
