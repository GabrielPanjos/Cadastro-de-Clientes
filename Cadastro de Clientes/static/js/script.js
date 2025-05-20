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

function trocarSecao(selecionarId) {
    document.getElementById("selecionar-clientes")
    document.getElementById("selecionar-historico")

    if (selecionarId == "selecionar-clientes") {
        document.getElementById("selecionar-clientes").style.backgroundColor = " #5634E0"
        document.getElementById("selecionar-clientes").style.color = " #fff"
        document.getElementById("selecionar-historico").style.color = " #5634E0"
        document.getElementById("selecionar-historico").style.backgroundColor = " #fff"
    } else {
        document.getElementById("selecionar-clientes").style.backgroundColor = " #fff"
        document.getElementById("selecionar-clientes").style.color = " #5634E0"
        document.getElementById("selecionar-historico").style.color = " #fff"
        document.getElementById("selecionar-historico").style.backgroundColor = " #5634E0"
    }
}

document.getElementById("selecionar-clientes").addEventListener("click", () => {
    trocarSecao("selecionar-clientes")
})

document.getElementById("selecionar-historico").addEventListener("click", () => {
    trocarSecao("selecionar-historico")
})

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
                tbody.appendChild(tr);
                configurarBotoesEditar();

                tr.querySelector(".btn-editar").addEventListener("click", (e) => {
                    const clienteId = e.target.dataset.id;
                    gerenciar_clientes();

                    fetch(`/clientes/buscar/${clienteId}`)
                        .then(res => res.json())
                        .then(cliente => {
                            if (cliente.erro) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Cliente não encontrado',
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                                return;
                            }

                            // Preenche os campos
                            document.getElementById("editar-id").value = cliente.id_clientes;
                            document.getElementById("editar-nome").value = cliente.nome;
                            document.getElementById("editar-cpf").value = cliente.cpf;
                            document.getElementById("editar-rg").value = cliente.rg || "";
                            if (cliente.data_nascimento) {
                                const dataObj = new Date(cliente.data_nascimento);
                                const ano = dataObj.getFullYear();
                                const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
                                const dia = String(dataObj.getDate()).padStart(2, '0');
                                document.getElementById("editar-data_nascimento").value = `${dia}/${mes}/${ano}`;
                            } else {
                                document.getElementById("editar-data_nascimento").value = "";
                            }
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

document.querySelector("form").addEventListener("submit", async function (event) {
    // 1. Obter os valores dos campos E os elementos dos inputs/spans de erro
    const nomeInput = document.getElementById("nome");
    const nome = nomeInput.value.trim();
    const erroNomeSpan = document.getElementById("nome-error"); // <-- OK, ID correto do span do nome

    // --- CORREÇÃO AQUI para o CPF ---
    const cpfInput = document.getElementById("input-cpf"); // <-- OBTENDE O INPUT DO CPF PELO ID
    const cpf = cpfInput.value.trim();
    const erroCPFSpan = document.getElementById("cpf-error"); // <-- OK, ID correto do span do CPF
    // --- FIM DA CORREÇÃO DO CPF ---

    const inputData = document.getElementById("data_nascimento"); // Certifique-se que o ID para data é este
    let data_nascimento = inputData.value.trim();

    const emailInput = document.getElementsByName("email")[0]; // Supondo que não tem ID para email input
    const email = emailInput.value.trim();

    const celularInput = document.getElementsByName("numero_telefone")[0]; // Supondo que não tem ID para celular input
    const celular = celularInput.value.trim();

    const cepInput = document.getElementsByName("CEP")[0]; // Supondo que não tem ID para CEP input
    const cep = cepInput.value.trim();

    // Validação de Número de telefone
    function validarTelefone(telefone) {
        telefone = telefone.replace(/[^\d]/g, '');

        if (telefone.length === 10) {
            return true; // Fixo: DDD + número fixo
        }

        if (telefone.length === 11) {
            return telefone[2] === '9'; // Celular: DDD + 9 + número
        }

        return false;
    }

    // Validador de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); // remove pontos e traços

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let digito1 = 11 - (soma % 11);
        digito1 = (digito1 >= 10) ? 0 : digito1;

        if (digito1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let digito2 = 11 - (soma % 11);
        digito2 = (digito2 >= 10) ? 0 : digito2;

        return digito2 === parseInt(cpf.charAt(10));
    }

    // Validações
    // VALIDAÇÃO DO NÚMERO DO CELULAR
    if (celular && !validarTelefone(celular)) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido',
            text: 'Número deve conter 10 ou 11 dígitos válidos',
            showConfirmButton: false,
            timer: 3000
        });
        celularInput.focus();
        event.preventDefault();
        return;
    }

    // --- VALIDAÇÃO DE NOME ---
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    let nomeValido = true;
    let mensagemErroNome = "";

    if (nome === "") {
        Swal.fire({
            icon: 'error',
            title: 'Nome obrigatório',
            showConfirmButton: false,
            timer: 3000
        });
        nomeInput.focus();
        nomeValido = false;
        mensagemErroNome = "Nome é obrigatório.";
    } else if (!nomeRegex.test(nome)) {
        Swal.fire({
            icon: 'error',
            title: 'Nome inválido',
            text: 'O nome deve conter apenas letras e espaços.',
            showConfirmButton: false,
            timer: 3000
        });
        nomeInput.focus();
        nomeValido = false;
        mensagemErroNome = "O nome deve conter apenas letras e espaços.";
    }

    // Aplica a borda vermelha e a mensagem no span do nome, ou remove
    if (!nomeValido) {
        nomeInput.style.border = "1.5px solid #FF3D51";
        if (erroNomeSpan) { // Verifica se o span existe
            erroNomeSpan.textContent = mensagemErroNome;
            erroNomeSpan.classList.add("visible");
        }
        event.preventDefault();
        return;
    } else {
        nomeInput.style.border = "";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = "";
            erroNomeSpan.classList.remove("visible");
        }
    }

    // VALIDAÇÃO DO CPF
    if (cpf === "") {
        Swal.fire({
            icon: 'error',
            title: 'CPF obrigatório',
            showConfirmButton: false,
            timer: 3000
        });
        cpfInput.focus();
        event.preventDefault();
        return;
    }
    if (cpf === "") {
        Swal.fire({
            icon: 'error',
            title: 'CPF obrigatório',
            showConfirmButton: false,
            timer: 3000
        });
        cpfInput.focus();
        event.preventDefault();
        return;
    }
    if (!validarCPF(cpf)) {
        if (erroCPFSpan) { // Verifica se o span existe
            erroCPFSpan.textContent = "CPF inválido.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.style.border = "1.5px solid #FF3D51";
        event.preventDefault();
        return;
    } else {
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "";
            erroCPFSpan.classList.remove("visible");
        }
        cpfInput.style.border = "";
    }

    // Remove não dígitos
    data_nascimento = data_nascimento.replace(/\D/g, "");
    if (data_nascimento.length !== 8) {
        const erroData = document.getElementById("data-nascimento-error");
        erroData.textContent = "Data inválida. Use o formato dd/mm/aaaa.";
        erroData.classList.add("visible");
        inputData.style.border = "1.5px solid #FF3D51";
        event.preventDefault();
        return;
    } else {
        const erroData = document.getElementById("data-nascimento-error");
        erroData.textContent = "";
        erroData.classList.remove("visible");
        inputData.style.border = "";
    }

    const dia = parseInt(data_nascimento.substring(0, 2));
    const mes = parseInt(data_nascimento.substring(2, 4));
    const ano = parseInt(data_nascimento.substring(4, 8));

    const data = new Date(ano, mes - 1, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida',
            showConfirmButton: false,
            timer: 3000
        });
        inputData.focus();
        event.preventDefault();
        return;
    }

    const dataFormatada = `${ano.toString().padStart(4, '0')}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    inputData.value = dataFormatada;

    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Formato de Email inválido',
            showConfirmButton: false,
            timer: 3000
        });
        emailInput.focus();
        event.preventDefault();
        return;
    }

    if (celular && !/^\d{10,11}$/.test(celular)) {
        Swal.fire({
            icon: 'error',
            title: 'Celular deve ter 10 ou 11 digitos numéricos',
            showConfirmButton: false,
            timer: 3000
        });
        celularInput.focus();
        event.preventDefault();
        return;
    }

    if (cep && !/^\d{8}$/.test(cep)) {
        Swal.fire({
            icon: 'error',
            title: 'CEP não encontrado',
            showConfirmButton: false,
            timer: 3000
        });
        cepInput.focus();
        event.preventDefault();
        return;
    }

    // **Aqui é onde você deve adicionar o fetch para enviar os dados**
    try {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("CPF", cpf);
        formData.append("data_nascimento", dataFormatada);
        formData.append("email", email);
        formData.append("numero_telefone", celular);
        formData.append("CEP", cep);
        // Adicione outros campos conforme necessário

        const response = await fetch('/clientes/', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Cadastro realizado com sucesso!',
                text: result.message,
                timer: 3000,
                showConfirmButton: false
            });
            // Opcional: Redirecionar ou limpar o formulário
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar',
                text: result.error || 'Erro desconhecido.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão',
            text: 'Não foi possível se conectar ao servidor.',
            timer: 3000,
            showConfirmButton: false
        });
    }
});

document.getElementById("btn-pesquisar").addEventListener("click", () => {
    const termo = document.getElementById("input-pesquisar").value.trim();
    const erroPesquisar = document.getElementById("erro-pesquisar");

    if (!termo) {
        erroPesquisar.textContent = "Digite um nome ou CPF para pesquisar.";
        erroPesquisar.classList.add("visible");
        document.getElementById("input-pesquisar").style.border = "1.5px solid #FF3D51";
        return;
    }

    fetch(`/clientes/buscar?termo=${encodeURIComponent(termo)}`)
        .then(res => res.json())
        .then(clientes => {
            const inputPesquisar = document.getElementById("input-pesquisar");
            const tbody = document.getElementById("corpo-tabela");
            tbody.innerHTML = "";

            if (clientes.length === 0) {
                erroPesquisar.textContent = "Nenhum cliente encontrado com esse nome ou CPF.";
                erroPesquisar.classList.add("visible");
                inputPesquisar.style.border = "1.5px solid #FF3D51";
                return;
            }

            // Limpa erro, pois clientes foram encontrados
            erroPesquisar.textContent = "";
            erroPesquisar.classList.remove("visible");
            inputPesquisar.style.border = "1px solid #323136";

            clientes.forEach(cliente => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
        <td>${cliente.id_clientes}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td><div class="btn-press btn-editar" data-id="${cliente.id_clientes}">Editar</div></td>
    `;
                tbody.appendChild(tr);
            });

            // ⬇️ AQUI entra o tratamento do botão editar
            const botoesEditar = document.getElementsByClassName('btn-editar');
            for (let btn of botoesEditar) {
                btn.addEventListener("click", (e) => {
                    const clienteId = e.target.dataset.id;
                    gerenciar_clientes();

                    fetch(`/clientes/buscar/${clienteId}`)
                        .then(res => res.json())
                        .then(cliente => {
                            if (cliente.erro) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Cliente não encontrado',
                                    showConfirmButton: false,
                                    timer: 3000
                                });

                                return;
                            }

                            document.getElementById("editar-id").value = cliente.id_clientes;
                            document.getElementById("editar-nome").value = cliente.nome;
                            document.getElementById("editar-cpf").value = cliente.cpf;
                            document.getElementById("editar-rg").value = cliente.rg || "";

                            if (cliente.data_nascimento) {
                                const dataObj = new Date(cliente.data_nascimento);
                                const ano = dataObj.getFullYear();
                                const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
                                const dia = String(dataObj.getDate()).padStart(2, '0');
                                document.getElementById("editar-data_nascimento").value = `${dia}/${mes}/${ano}`;
                            } else {
                                document.getElementById("editar-data_nascimento").value = "";
                            }

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
            }

            // Exibe a seção da tabela e esconde o restante
            document.getElementById("geral").style.display = "none";
            document.getElementById('endereco').style.display = "none";
            document.getElementById('h2-contatos').style.display = "none";
            document.getElementById('h2-cadastrar').style.display = "none";
            document.getElementById("btn-geral").style.display = "none";
            document.getElementById("btn-endereco").style.display = "none";
            document.getElementById("listar").style.display = "block";
        })
        .catch(err => {
            console.error("Erro ao buscar clientes:", err);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar cliente',
                showConfirmButton: false,
                timer: 3000
            });

        });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cadastro');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const cpf = formData.get("CPF");

            // Limpa pontos e traços do CPF antes de enviar
            formData.set("CPF", cpf.replace(/[^\d]+/g, ""));

            // Você pode fazer o mesmo com outros campos como CEP aqui no JS antes de enviar

            try {
                const response = await fetch('/clientes/', {
                    method: 'POST',
                    body: formData
                });

                // --- PONTO CRÍTICO: VERIFIQUE response.ok ---
                if (response.ok) { // Isso verifica se o status HTTP está no range 200-299
                    const result = await response.json(); // Se OK, então o corpo é JSON
                    console.log("Cadastro bem-sucedido:", result.message);
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: result.message, // Usa a mensagem que veio do Flask
                        timer: 3000,
                        showConfirmButton: false
                    });
                    form.reset(); // Opcional: limpa o formulário após o sucesso
                } else {
                    // Se response.ok for false, significa que o servidor respondeu com um erro (4xx, 5xx)
                    // Tente ler o JSON de erro, se houver
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (e) {
                        // Se o corpo não for JSON (ex: HTML de erro), capture o erro
                        errorData = { error: 'Resposta do servidor não é JSON ou vazia.', status: response.status };
                        console.error("Erro ao parsear JSON de erro:", e, response);
                    }

                    const errorMessage = errorData.error || `Erro desconhecido do servidor. Status: ${response.status}`;
                    console.error("Erro do servidor:", errorMessage, errorData);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro no Cadastro',
                        text: errorMessage,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                // Este bloco 'catch' AGORA só será acionado se houver um problema REAL de rede
                // (por exemplo, servidor offline, CORS bloqueando a requisição, etc.)
                console.error("Erro de conexão (problema de rede real):", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de conexão',
                    text: 'Não foi possível se conectar ao servidor. Verifique sua conexão.',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        });
    }
});


document.getElementById('form-editar-cliente').addEventListener('submit', async function (e) {
    e.preventDefault();
    const clienteId = document.getElementById('editar-id').value;
    const formData = new FormData(e.target);

    // Conversão da data de nascimento
    let dataOriginal = document.getElementById('editar-data_nascimento').value;
    let dataConvertida = "";

    const partesData = dataOriginal.split('/');
    if (partesData.length === 3) {
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10); // Mantenha o mês como está
        const ano = parseInt(partesData[2], 10);

        // Formatar a data para AAAA-MM-DD sem conversão para UTC
        dataConvertida = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        formData.set('data_nascimento', dataConvertida);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Data de nascimento inválida. Use o formato dd/mm/aaaa',
            showConfirmButton: false,
            timer: 3000
        });

        return;
    }

    // O restante do código para enviar o formData para o servidor
    try {
        const response = await fetch(`/clientes/${clienteId}/edit`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar cliente',
                showConfirmButton: false,
                timer: 3000
            });

        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão com o servidor',
            showConfirmButton: false,
            timer: 3000
        });

    }
});

function configurarBotoesEditar() {
    const botoesEditar = document.getElementsByClassName('btn-editar');
    for (let btn of botoesEditar) {
        btn.addEventListener("click", (e) => {
            const clienteId = e.target.dataset.id;
            gerenciar_clientes();

            fetch(`/clientes/buscar/${clienteId}`)
                .then(res => res.json())
                .then(cliente => {
                    if (cliente.erro) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Cliente não encontrado',
                            showConfirmButton: false,
                            timer: 3000
                        });

                        return;
                    }

                    document.getElementById("editar-id").value = cliente.id_clientes;
                    document.getElementById("editar-nome").value = cliente.nome;
                    document.getElementById("editar-cpf").value = cliente.cpf;
                    document.getElementById("editar-rg").value = cliente.rg || "";

                    if (cliente.data_nascimento) {
                        const dataObj = new Date(cliente.data_nascimento);
                        const ano = dataObj.getFullYear();
                        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
                        const dia = String(dataObj.getDate()).padStart(2, '0');
                        document.getElementById("editar-data_nascimento").value = `${dia}/${mes}/${ano}`;
                    } else {
                        document.getElementById("editar-data_nascimento").value = "";
                    }

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
    }
}

// Evento para botão "DELETAR" no formulário de edição
document.querySelector(".btn-deletar").addEventListener("click", async function (e) {
    e.preventDefault(); // impede envio padrão do formulário

    const clienteId = document.getElementById("editar-id").value;

    if (!clienteId) {
        Swal.fire({
            icon: 'error',
            title: 'nenhum cliente selecionado',
            showConfirmButton: false,
            timer: 3000
        });

        return;
    }

    const confirmar = confirm("Tem certeza que deseja deletar este cliente?");
    if (!confirmar) return;

    try {
        const response = await fetch(`/clientes/${clienteId}/deletar`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            document.getElementById("form-editar-cliente").reset();
            listar_clientes();     // mostra a lista
            carregarClientes(0);   // recarrega a tabela
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao detectar cliente',
                showConfirmButton: false,
                timer: 3000
            });

        }
    } catch (err) {
        console.error("Erro ao deletar cliente:", err);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão ao servidor',
            showConfirmButton: false,
            timer: 3000
        });

    }
});

function atualizarCliente() {
    const clienteId = document.getElementById("editar-id").value;
    const nome = document.getElementById("editar-nome").value;
    const cpf = document.getElementById("editar-cpf").value;
    const rg = document.getElementById("editar-rg").value;
    const dataNascimento = document.getElementById("editar-data_nascimento").value;
    const email = document.getElementById("editar-email").value;
    const telefone = document.getElementById("editar-numero_telefone").value;
    const estado = document.getElementById("editar-estado").value;
    const cidade = document.getElementById("editar-cidade").value;
    const rua = document.getElementById("editar-rua").value;
    const cep = document.getElementById("editar-cep").value;
    const bairro = document.getElementById("editar-bairro").value;
    const complemento = document.getElementById("editar-complemento").value;

    fetch(`/clientes/editar/${clienteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            cpf,
            rg,
            data_nascimento: dataNascimento,
            email,
            numero_telefone: telefone,
            estado,
            cidade,
            rua,
            cep,
            bairro,
            complemento
        })
    })
        .then(async res => {
            const data = await res.json().catch(() => ({}));
            return { status: res.status, ok: res.ok, body: data };
        })
        .then(({ status, ok, body }) => {
            if (ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: body.message || 'Cliente atualizado com sucesso!',
                    timer: 2000,
                    showConfirmButton: false
                });
                carregarClientes(); // Atualiza a tabela
            } else if (status === 404) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção!',
                    text: body.message || 'Cliente não encontrado.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: body.error || 'Erro ao atualizar cliente.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Erro de conexão',
                text: 'Não foi possível se conectar ao servidor.'
            });
            console.error("Erro na requisição:", error);
        });


}

document.querySelectorAll(".btn-salvar").forEach(botao => {
    botao.addEventListener("click", atualizarCliente);
});
