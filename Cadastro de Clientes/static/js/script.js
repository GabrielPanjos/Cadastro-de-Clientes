


function mostrarSecao(secaoId) {
    document.getElementById("geral").style.display = "none";
    document.getElementById('endereco').style.display = "none";
    document.getElementById('h2-contatos').style.display = "none";

    document.getElementById(secaoId).style.display = "";
    if (secaoId == "geral") {
        document.getElementById('h2-contatos').style.display = "";
        document.getElementById("btn-geral").style.backgroundColor = " #ffffff"
        document.getElementById("btn-geral").style.color = " #5634E0"
        document.getElementById("btn-endereco").style.backgroundColor = " #5634E0"
        document.getElementById("btn-endereco").style.color = " #ffffff"
    } else {
        document.getElementById("btn-endereco").style.backgroundColor = " #ffffff"
        document.getElementById("btn-endereco").style.color = " #5634E0"
        document.getElementById("btn-geral").style.backgroundColor = " #5634E0"
        document.getElementById("btn-geral").style.color = " #ffffff"
    }
}

document.getElementById('btn-geral').addEventListener("click", () => {
    mostrarSecao("geral")
})

document.getElementById('btn-endereco').addEventListener("click", () => {
    mostrarSecao("endereco")
})



function listar_clientes() {
    document.getElementById("geral").style.display = "none";
    document.getElementById('endereco').style.display = "none";
    document.getElementById('h2-contatos').style.display = "none";
    document.getElementById('h2-cadastrar').style.display = "none";
    document.getElementById("btn-geral").style.display = "none";
    document.getElementById("btn-endereco").style.display = "none";

    document.getElementById("listar").style.display = "";

}

document.getElementById('btn-pesquisar').addEventListener("click", () => {
    listar_clientes();       // mostra a seção da tabela
    carregarClientes(0);     // carrega os dados da API
})

document.getElementById('btn-total').addEventListener("click", () => {
    listar_clientes();       // mostra a seção da tabela
    carregarClientes(0);     // carrega os dados da API
})



function gerenciar_clientes() {
    document.getElementById('pesquisar-clientes').style.display = "none";
    document.getElementById('cadastrar-clientes').style.display = "none";
    document.getElementById('listar').style.display = "none";

    document.getElementById('gerenciar-clientes').style.display = "";
}

// Pega todos os botões com a classe "btn-editar"
const botoesEditar = document.getElementsByClassName('btn-editar');

// Percorre cada botão e adiciona o evento de clique
for (let btn of botoesEditar) {
    btn.addEventListener("click", () => {
        gerenciar_clientes();
        // Aqui você pode mostrar o form de edição também, ex:
        document.getElementById("editar-cliente").style.display = "block";
    });
}



document.querySelector("form").addEventListener("submit", function (event) {
    const inputData = document.getElementById("data_nascimento");
    let valor = inputData.value.trim();

    // Remove qualquer caractere que não seja número
    valor = valor.replace(/\D/g, "");

    // Verifica se tem 8 dígitos (ddmmaaaa)
    if (valor.length !== 8) {
        alert("Data inválida. Use o formato dd/mm/aaaa ou ddmmaaaa.");
        event.preventDefault();
        return;
    }

    const dia = parseInt(valor.substring(0, 2));
    const mes = parseInt(valor.substring(2, 4));
    const ano = parseInt(valor.substring(4, 8));

    // Validação real com Date
    const data = new Date(ano, mes - 1, dia); // mês começa do zero
    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia
    ) {
        alert("Data inválida.");
        event.preventDefault();
        return;
    }

    // Converte para o formato yyyy-mm-dd
    const dataFormatada = `${ano.toString().padStart(4, '0')}-${mes
        .toString()
        .padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    inputData.value = dataFormatada;
});



let paginaAtual = 0;
const clientesPorPagina = 5;
let totalClientes = 0;

function carregarClientes(pagina = 0) {
    fetch(`/clientes/clientes_api?pagina=${pagina}`)
        .then(res => res.json())
        .then(data => {
            console.log("Clientes recebidos:", data); // 👈 ver isso no console
            const tbody = document.getElementById("corpo-tabela");
            tbody.innerHTML = "";

            data.clientes.forEach(cliente => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${cliente.id_clientes}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.cpf}</td>
          <td><div class="btn-press btn-editar">Editar</div></td>
        `;
                tbody.appendChild(tr);
            });

            totalClientes = data.total;
            paginaAtual = pagina;
            atualizarBotoes();
        });
}

function atualizarBotoes() {
    document.getElementById("btn-anterior").disabled = paginaAtual === 0;
    document.getElementById("btn-proximo").disabled = (paginaAtual + 1) * clientesPorPagina >= totalClientes;
}

document.getElementById("btn-anterior").addEventListener("click", () => {
    if (paginaAtual > 0) carregarClientes(paginaAtual - 1);
});

document.getElementById("btn-proximo").addEventListener("click", () => {
    if ((paginaAtual + 1) * clientesPorPagina < totalClientes) {
        carregarClientes(paginaAtual + 1);
    }
});

document.getElementById("btn-total").addEventListener("click", () => {
    listar_clientes(); // já existente
    carregarClientes(0); // novo
});
