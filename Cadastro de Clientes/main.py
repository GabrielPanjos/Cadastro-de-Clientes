from flask import Flask
from routes.home import home_route
from routes.cliente import cliente_route

# inicialização
app = Flask(__name__)

app.register_blueprint(home_route)
app.register_blueprint(cliente_route, url_prefix='/clientes')

@app.route('/')
def index():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM clientes")  # Conta o número total de clientes
    total_clientes = cursor.fetchone()[0]  # Recupera o número de clientes
    conn.close()
    return render_template('index.html', total_clientes=total_clientes)  # Passa a contagem para o template 

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mamae38.",
        database="school_universe"  # Certifique-se de que o banco de dados é o correto
    )
    return conn

# execução
if __name__ == "__main__":
    app.run(debug=True)