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
  <td><div class="btn-press btn-editar" data-id="${cliente.id_clientes}">Editar</div></td>
`;

                tr.querySelector(".btn-editar").addEventListener("click", (e) => {
                    const clienteId = e.target.dataset.id;
                    gerenciar_clientes();

                    fetch(`/clientes/buscar/${clienteId}`)
                        .then(res => res.json())
                        .then(cliente => {
                            if (cliente.erro) {
                                alert("Cliente não encontrado.");
                                return;
                            }

                            // Preenche os campos
                            document.getElementById("editar-id").value = cliente.id_clientes;
                            document.getElementById("editar-nome").value = cliente.nome;
                            document.getElementById("editar-cpf").value = cliente.cpf;
                            document.getElementById("editar-rg").value = cliente.rg || "";
                            document.getElementById("editar-data_nascimento").value = cliente.data_nascimento || "";
                            document.getElementById("editar-email").value = cliente.email || "";
                            document.getElementById("editar-numero_telefone").value = cliente.numero_telefone || "";
                            document.getElementById("editar-estado").value = cliente.estado || "";
                            document.getElementById("editar-cidade").value = cliente.cidade || "";
                            document.getElementById("editar-rua").value = cliente.rua || "";
                            document.getElementById("editar-cep").value = cliente.cep || "";
                            document.getElementById("editar-bairro").value = cliente.bairro || "";
                            document.getElementById("editar-complemento").value = cliente.complemento || "";
                        });
                });

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


document.querySelector("form").addEventListener("submit", function (event) {
    const nomeInput = document.getElementById("nome");
    const nome = nomeInput.value.trim();
    const cpfInput = document.getElementsByName("CPF")[0];
    const cpf = cpfInput.value.trim();
    const inputData = document.getElementById("data_nascimento");
    let data_nascimento = inputData.value.trim();
    const emailInput = document.getElementsByName("email")[0];
    const email = emailInput.value.trim();
    const celularInput = document.getElementsByName("numero_telefone")[0];
    const celular = celularInput.value.trim();
    const cepInput = document.getElementsByName("CEP")[0];
    const cep = cepInput.value.trim();

    // Validação do Nome (como antes)
    if (nome === "") {
        alert("O campo Nome é obrigatório.");
        nomeInput.focus();
        event.preventDefault();
        return;
    }

    // Validação do CPF (como antes)
    if (cpf === "") {
        alert("O campo CPF é obrigatório.");
        cpfInput.focus();
        event.preventDefault();
        return;
    }
    if (!/^\d{11}$/.test(cpf)) {
        alert("CPF deve ter 11 dígitos numéricos.");
        cpfInput.focus();
        event.preventDefault();
        return;
    }

    // Validação da Data de Nascimento
    if (data_nascimento === "") {
        alert("O campo Data de Nascimento é obrigatório.");
        inputData.focus();
        event.preventDefault();
        return;
    }

    // Remove não dígitos
    data_nascimento = data_nascimento.replace(/\D/g, "");

    if (data_nascimento.length !== 8) {
        alert("Data inválida. Use o formato dd/mm/aaaa ou ddmmaaaa.");
        inputData.focus();
        event.preventDefault();
        return;
    }

    const dia = parseInt(data_nascimento.substring(0, 2));
    const mes = parseInt(data_nascimento.substring(2, 4));
    const ano = parseInt(data_nascimento.substring(4, 8));

    // Validação real com Date
    const data = new Date(ano, mes - 1, dia); // mês começa do zero
    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia
    ) {
        alert("Data inválida.");
        inputData.focus();
        event.preventDefault();
        return;
    }

    // Converte para o formato AAAA-MM-DD
    const dataFormatada = `${ano.toString().padStart(4, '0')}-${mes
        .toString()
        .padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    inputData.value = dataFormatada;

    // Validação do Email (como antes)
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Formato de E-mail inválido.");
        emailInput.focus();
        event.preventDefault();
        return;
    }

    // Validação do Celular (como antes)
    if (celular && !/^\d{10,11}$/.test(celular)) {
        alert("Celular deve ter 10 ou 11 dígitos numéricos.");
        celularInput.focus();
        event.preventDefault();
        return;
    }

    // Validação do CEP (como antes)
    if (cep && !/^\d{8}$/.test(cep)) {
        alert("CEP deve ter 8 dígitos numéricos.");
        cepInput.focus();
        event.preventDefault();
        return;
    }

    // Se todas as validações passarem, o formulário é enviado
});