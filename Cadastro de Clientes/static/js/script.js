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
    event.preventDefault();

    const nomeInput = document.getElementById("nome");
    const nome = nomeInput.value.trim();
    const erroNomeSpan = document.getElementById("nome-error");

    const cpfInput = document.getElementById("input-cpf");
    const cpf = cpfInput.value.trim();
    const erroCPFSpan = document.getElementById("cpf-error");

    const inputData = document.getElementById("data_nascimento");
    const erroDataSpan = document.getElementById("data-nascimento-error");
    let data_nascimento = inputData.value.trim();

    const emailInput = document.getElementsByName("email")[0];
    const email = emailInput.value.trim();
    const erroEmailSpan = document.getElementById("email-error");

    const celularInput = document.getElementsByName("numero_telefone")[0];
    const celular = celularInput.value.trim();
    const erroTelefoneSpan = document.getElementById("telefone-error");

    const cepInput = document.getElementsByName("CEP")[0];
    const cep = cepInput.value.trim();
    const erroCepSpan = document.getElementById("cep-error");

    const rgInput = document.getElementById("input-rg");
    let rg = rgInput.value.trim();
    const erroRGSpan = document.getElementById("rg-error");

    const estadoInput = document.getElementsByName("estado")[0];
    const estado = estadoInput.value.trim();
    const erroEstadoSpan = document.getElementById("estado-error");

    const cidadeInput = document.getElementsByName("cidade")[0];
    const cidade = cidadeInput.value.trim();
    const erroCidadeSpan = document.getElementById("cidade-error");

    const ruaInput = document.getElementsByName("rua")[0];
    const rua = ruaInput.value.trim();
    const erroRuaSpan = document.getElementById("rua-error");

    const bairroInput = document.getElementsByName("bairro")[0];
    const bairro = bairroInput.value.trim();
    const erroBairroSpan = document.getElementById("bairro-error");

    const complementoInput = document.getElementsByName("complemento")[0];
    const complemento = complementoInput.value.trim();
    const erroComplementoSpan = document.getElementById("complemento-error");

    function validarRG(rg) {
        rg = rg.replace(/[^\d]/g, '');
        if (!/^\d{5,15}$/.test(rg)) return false;
        if (/^(\d)\1+$/.test(rg)) return false;
        return true;
    }

    function validarTelefone(telefone) {
        telefone = telefone.replace(/[^\d]/g, '');

        if (telefone.length === 10) {
            return true; // fixo: DDD (2) + número (8)
        }

        if (telefone.length === 11) {
            return telefone[2] === '9'; // celular: DDD (2) + 9 + número (8)
        }

        return false;
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let digito1 = 11 - (soma % 11);
        digito1 = (digito1 >= 10) ? 0 : digito1;
        if (digito1 !== parseInt(cpf.charAt(9))) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        let digito2 = 11 - (soma % 11);
        digito2 = (digito2 >= 10) ? 0 : digito2;
        return digito2 === parseInt(cpf.charAt(10));
    }

    // Verificar estado (letras e espaços, se preenchido)
    if (estado && !/^[A-Za-zÀ-ÿ\s]{2,}$/.test(estado)) {
        Swal.fire({
            icon: 'error',
            title: 'Estado inválido',
            text: 'O estado deve conter apenas letras.',
            timer: 3000,
            showConfirmButton: false
        });
        estadoInput.style.border = "1.5px solid #FF3D51";
        if (erroEstadoSpan) {
            erroEstadoSpan.textContent = "O estado deve conter apenas letras.";
            erroEstadoSpan.classList.add("visible");
        }
        estadoInput.focus();
        return;
    } else {
        estadoInput.style.border = "";
        if (erroEstadoSpan) {
            erroEstadoSpan.textContent = "";
            erroEstadoSpan.classList.remove("visible");
        }
    }

    // Verificar cidade
    if (cidade && !/^[A-Za-zÀ-ÿ\s]{2,}$/.test(cidade)) {
        Swal.fire({
            icon: 'error',
            title: 'Cidade inválida',
            text: 'A cidade deve conter apenas letras.',
            timer: 3000,
            showConfirmButton: false
        });
        cidadeInput.style.border = "1.5px solid #FF3D51";
        if (erroCidadeSpan) {
            erroCidadeSpan.textContent = "A cidade deve conter apenas letras.";
            erroCidadeSpan.classList.add("visible");
        }
        cidadeInput.focus();
        return;
    } else {
        cidadeInput.style.border = "";
        if (erroCidadeSpan) {
            erroCidadeSpan.textContent = "";
            erroCidadeSpan.classList.remove("visible");
        }
    }

    // Verificar rua
    if (rua && rua.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Rua inválida',
            text: 'A rua deve conter no mínimo 3 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        ruaInput.style.border = "1.5px solid #FF3D51";
        if (erroRuaSpan) {
            erroRuaSpan.textContent = "A rua está muito curta.";
            erroRuaSpan.classList.add("visible");
        }
        ruaInput.focus();
        return;
    } else {
        ruaInput.style.border = "";
        if (erroRuaSpan) {
            erroRuaSpan.textContent = "";
            erroRuaSpan.classList.remove("visible");
        }
    }

    // Verificar bairro
    if (bairro && bairro.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Bairro inválido',
            text: 'O bairro deve conter no mínimo 3 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        bairroInput.style.border = "1.5px solid #FF3D51";
        if (erroBairroSpan) {
            erroBairroSpan.textContent = "O bairro está muito curto.";
            erroBairroSpan.classList.add("visible");
        }
        bairroInput.focus();
        return;
    } else {
        bairroInput.style.border = "";
        if (erroBairroSpan) {
            erroBairroSpan.textContent = "";
            erroBairroSpan.classList.remove("visible");
        }
    }

    // Verificar complemento (apenas se quiser limitar caracteres especiais)
    if (complemento && complemento.length < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Complemento inválido',
            text: 'O complemento está muito curto.',
            timer: 3000,
            showConfirmButton: false
        });
        complementoInput.style.border = "1.5px solid #FF3D51";
        if (erroComplementoSpan) {
            erroComplementoSpan.textContent = "Complemento muito curto.";
            erroComplementoSpan.classList.add("visible");
        }
        complementoInput.focus();
        return;
    } else {
        complementoInput.style.border = "";
        if (erroComplementoSpan) {
            erroComplementoSpan.textContent = "";
            erroComplementoSpan.classList.remove("visible");
        }
    }

    // verificar celular
    const celularLimpo = celular.replace(/[^\d]/g, '');

    if (celular && !validarTelefone(celular)) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido',
            text: 'Número deve conter 10 ou 11 dígitos válidos',
            timer: 3000,
            showConfirmButton: false
        });
        celularInput.style.border = "1.5px solid #FF3D51";
        if (erroTelefoneSpan) {
            erroTelefoneSpan.textContent = "Número inválido.";
            erroTelefoneSpan.classList.add("visible");
        }
        celularInput.focus();
        return;
    }

    // Verifica duplicidade
    if (celular) {
        const resTel = await fetch(`/clientes/buscar?termo=${celularLimpo}`);
        const resTelData = await resTel.json();

        if (resTelData.some(c => c.numero_telefone && c.numero_telefone.replace(/[^\d]/g, '') === celularLimpo)) {
            Swal.fire({
                icon: 'error',
                title: 'Celular já cadastrado',
                text: 'Este número de telefone já está registrado.',
                timer: 3000,
                showConfirmButton: false
            });
            celularInput.style.border = "1.5px solid #FF3D51";
            if (erroTelefoneSpan) {
                erroTelefoneSpan.textContent = "Telefone já cadastrado.";
                erroTelefoneSpan.classList.add("visible");
            }
            celularInput.focus();
            return;
        } else {
            celularInput.style.border = "";
            if (erroTelefoneSpan) {
                erroTelefoneSpan.textContent = "";
                erroTelefoneSpan.classList.remove("visible");
            }
        }
    }

    // verificar nome
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (nome === "") {
        Swal.fire({
            icon: 'error',
            title: 'Nome obrigatório',
            timer: 3000,
            showConfirmButton: false
        });
        nomeInput.style.border = "1.5px solid #FF3D51";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = "Nome é obrigatório.";
            erroNomeSpan.classList.add("visible");
        }
        nomeInput.focus();
        return;
    } else if (!nomeRegex.test(nome)) {
        Swal.fire({
            icon: 'error',
            title: 'Nome inválido',
            text: 'O nome deve conter apenas letras e espaços.',
            timer: 3000,
            showConfirmButton: false
        });
        nomeInput.style.border = "1.5px solid #FF3D51";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = "O nome deve conter apenas letras e espaços.";
            erroNomeSpan.classList.add("visible");
        }
        nomeInput.focus();
        return;
    } else {
        nomeInput.style.border = "";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = "";
            erroNomeSpan.classList.remove("visible");
        }
    }

    // verificar cpf
    if (cpf === "") {
        Swal.fire({
            icon: 'error',
            title: 'CPF obrigatório',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.focus();
        return;
    }
    if (!validarCPF(cpf)) {
        Swal.fire({
            icon: 'error',
            title: 'CPF inválido',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.style.border = "1.5px solid #FF3D51";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "CPF inválido.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.focus();
        return;
    } else {
        cpfInput.style.border = "";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "";
            erroCPFSpan.classList.remove("visible");
        }
    }

    // verificar duplicidade de CPF
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');
    const resCpf = await fetch(`/clientes/buscar?termo=${cpfLimpo}`);
    const resCpfData = await resCpf.json();

    if (resCpfData.some(c => c.cpf === cpfLimpo)) {
        Swal.fire({
            icon: 'error',
            title: 'CPF já cadastrado',
            text: 'Este CPF já está registrado no sistema.',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.style.border = "1.5px solid #FF3D51";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "CPF já cadastrado.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.focus();
        return;
    }

    // verificar data de nascimento
    data_nascimento = data_nascimento.replace(/\D/g, "");
    if (data_nascimento.length !== 8) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida',
            text: 'Use o formato dd/mm/aaaa.',
            timer: 3000,
            showConfirmButton: false
        });
        inputData.style.border = "1.5px solid #FF3D51";
        if (erroDataSpan) {
            erroDataSpan.textContent = "Data inválida. Use o formato dd/mm/aaaa.";
            erroDataSpan.classList.add("visible");
        }
        inputData.focus();
        return;
    } else {
        inputData.style.border = "";
        if (erroDataSpan) {
            erroDataSpan.textContent = "";
            erroDataSpan.classList.remove("visible");
        }
    }

    const dia = parseInt(data_nascimento.substring(0, 2));
    const mes = parseInt(data_nascimento.substring(2, 4));
    const ano = parseInt(data_nascimento.substring(4, 8));
    const data = new Date(ano, mes - 1, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida',
            timer: 3000,
            showConfirmButton: false
        });
        inputData.focus();
        return;
    }

    const dataFormatada = `${ano.toString().padStart(4, '0')}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    inputData.value = dataFormatada;

    // verificar email
    if (email) {
        let emailValido = true;
        let mensagemErroEmail = "";

        if (!email.includes("@")) {
            emailValido = false;
            mensagemErroEmail = "Email deve conter '@'.";
        } else if (!/(gmail|hotmail|outlook)/i.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Email deve conter domínio válido (gmail, hotmail ou outlook).";
        } else if (!/\.[a-z]{2,}$/.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Email deve terminar com domínio (.com, .net etc).";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Formato de email inválido.";
        }

        if (!emailValido) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: mensagemErroEmail,
                timer: 3000,
                showConfirmButton: false
            });
            emailInput.style.border = "1.5px solid #FF3D51";
            if (erroEmailSpan) {
                erroEmailSpan.textContent = mensagemErroEmail;
                erroEmailSpan.classList.add("visible");
            }
            emailInput.focus();
            return;
        } else {
            emailInput.style.border = "";
            if (erroEmailSpan) {
                erroEmailSpan.textContent = "";
                erroEmailSpan.classList.remove("visible");
            }
        }

        // verificar duplicidade de email
        if (email) {
            const resEmail = await fetch(`/clientes/buscar?termo=${email}`);
            const resEmailData = await resEmail.json();

            if (resEmailData.some(c => c.email === email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email já cadastrado',
                    text: 'Este email já está registrado no sistema.',
                    timer: 3000,
                    showConfirmButton: false
                });
                emailInput.style.border = "1.5px solid #FF3D51";
                if (erroEmailSpan) {
                    erroEmailSpan.textContent = "Email já cadastrado.";
                    erroEmailSpan.classList.add("visible");
                }
                emailInput.focus();
                return;
            }
        }

    }

    // verificar RG
    const rgLimpo = rg.replace(/[^\d]+/g, '');

    if (rg) {
        rgInput.style.border = "";
        if (erroRGSpan) {
            erroRGSpan.textContent = "";
            erroRGSpan.classList.remove("visible");
        }

        // Validação de RG com função
        if (!validarRG(rg)) {
            Swal.fire({
                icon: 'error',
                title: 'RG inválido',
                text: 'O RG deve conter entre 5 e 15 dígitos e não pode ter todos os dígitos iguais.',
                timer: 3000,
                showConfirmButton: false
            });
            rgInput.style.border = "1.5px solid #FF3D51";
            if (erroRGSpan) {
                erroRGSpan.textContent = "RG inválido.";
                erroRGSpan.classList.add("visible");
            }
            rgInput.focus();
            return;
        }

        // Duplicidade de RG
        const resRG = await fetch(`/clientes/buscar?termo=${rgLimpo}`);
        const resRGData = await resRG.json();

        if (resRGData.some(c => c.rg && c.rg.replace(/[^\d]+/g, '') === rgLimpo)) {
            Swal.fire({
                icon: 'error',
                title: 'RG já cadastrado',
                text: 'Este RG já está registrado no sistema.',
                timer: 3000,
                showConfirmButton: false
            });
            rgInput.style.border = "1.5px solid #FF3D51";
            if (erroRGSpan) {
                erroRGSpan.textContent = "RG já cadastrado.";
                erroRGSpan.classList.add("visible");
            }
            rgInput.focus();
            return;
        }
    }

    // verificar cep
    if (cep && !/^\d{8}$/.test(cep)) {
        Swal.fire({
            icon: 'error',
            title: 'CEP inválido',
            text: 'CEP deve conter exatamente 8 dígitos numéricos.',
            timer: 3000,
            showConfirmButton: false
        });
        cepInput.style.border = "1.5px solid #FF3D51";
        if (erroCepSpan) {
            erroCepSpan.textContent = "CEP inválido.";
            erroCepSpan.classList.add("visible");
        }
        cepInput.focus();
        return;
    } else {
        cepInput.style.border = "";
        if (erroCepSpan) {
            erroCepSpan.textContent = "";
            erroCepSpan.classList.remove("visible");
        }
    }

    try {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("CPF", cpfLimpo);
        formData.append("data_nascimento", dataFormatada);
        formData.append("email", email);
        formData.append("numero_telefone", celular);
        formData.append("CEP", cep);
        formData.append("RG", rgLimpo);
        formData.append("estado", estado);
        formData.append("cidade", cidade);
        formData.append("rua", rua);
        formData.append("bairro", bairro);
        formData.append("complemento", complemento);

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
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                location.reload(); // Recarrega a página após o alerta
            });

            // Limpa bordas e mensagens
            [cpfInput, rgInput, emailInput, celularInput].forEach(input => input.style.border = "");
            [erroCPFSpan, erroRGSpan, erroEmailSpan, erroTelefoneSpan].forEach(span => {
                if (span) {
                    span.textContent = "";
                    span.classList.remove("visible");
                }
            });

        } else {
            const erroMsg = result.error || "Erro desconhecido.";

            // CPF
            if (erroMsg.includes("CPF")) {
                cpfInput.style.border = "1.5px solid #FF3D51";
                if (erroCPFSpan) {
                    erroCPFSpan.textContent = erroMsg;
                    erroCPFSpan.classList.add("visible");
                }
                cpfInput.focus();
            }

            // RG
            else if (erroMsg.includes("RG")) {
                rgInput.style.border = "1.5px solid #FF3D51";
                if (erroRGSpan) {
                    erroRGSpan.textContent = erroMsg;
                    erroRGSpan.classList.add("visible");
                }
                rgInput.focus();
            }

            // Email
            else if (erroMsg.includes("Email")) {
                emailInput.style.border = "1.5px solid #FF3D51";
                if (erroEmailSpan) {
                    erroEmailSpan.textContent = erroMsg;
                    erroEmailSpan.classList.add("visible");
                }
                emailInput.focus();
            }

            // Telefone
            else if (erroMsg.includes("telefone")) {
                celularInput.style.border = "1.5px solid #FF3D51";
                if (erroTelefoneSpan) {
                    erroTelefoneSpan.textContent = erroMsg;
                    erroTelefoneSpan.classList.add("visible");
                }
                celularInput.focus();
            }

            // Mensagem geral
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar',
                text: erroMsg,
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
    e.preventDefault();

    const clienteId = document.getElementById("editar-id").value;

    if (!clienteId) {
        Swal.fire({
            icon: 'error',
            title: 'Nenhum cliente selecionado',
            showConfirmButton: false,
            timer: 3000
        });
        return;
    }

    const confirmar = await Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, deletar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) return;

    try {
        const response = await fetch(`/clientes/${clienteId}/deletar`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            await Swal.fire({
                icon: 'success',
                title: 'Cliente deletado com sucesso!',
                showConfirmButton: false,
                timer: 2000
            });

            // Redireciona para a página inicial
            window.location.href = "/clientes";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao deletar cliente',
                showConfirmButton: false,
                timer: 3000
            });
        }
    } catch (err) {
        console.error("Erro ao deletar cliente:", err);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão com o servidor',
            showConfirmButton: false,
            timer: 3000
        });
    }
});

// Funções de Validações
function validarTelefone(telefone) {
    telefone = telefone.replace(/[^\d]/g, '');
    if (telefone.length === 10) return true; // fixo
    if (telefone.length === 11) return telefone[2] === '9'; // celular com 9
    return false;
}

async function atualizarCliente(e) {
    if (e) e.preventDefault();

    // PEGANDO OS VALORES
    const clienteId = document.getElementById("editar-id").value;

    const nomeInput = document.getElementById("editar-nome");
    const nome = nomeInput.value.trim();
    const erroNomeSpan = document.getElementById("editar-nome-error");

    const cpfInput = document.getElementById("editar-cpf");
    let cpf = cpfInput.value.trim();
    const erroCPFSpan = document.getElementById("editar-cpf-error");

    const rgInput = document.getElementById("editar-rg");
    let rg = rgInput.value.trim();
    const erroRGSpan = document.getElementById("editar-rg-error");

    const dataNascimento = document.getElementById("editar-data_nascimento").value;

    // converte de DD/MM/AAAA para AAAA-MM-DD
    function formatarDataParaISO(data) {
        const partes = data.split('/');
        if (partes.length !== 3) return data;
        const [dia, mes, ano] = partes;
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    const dataNascimentoFormatada = formatarDataParaISO(dataNascimento);

    const emailInput = document.getElementById("editar-email");
    const email = emailInput.value.trim();
    const erroEmailSpan = document.getElementById("editar-email-error");

    const celularInput = document.getElementById("editar-numero_telefone");
    const celular = celularInput.value.trim().replace(/[^\d]+/g, '');
    const erroTelefoneSpan = document.getElementById("editar-telefone-error");

    const estadoInput = document.getElementById("editar-estado");
    const estado = estadoInput.value.trim();
    const erroEstadoSpan = document.getElementById("editar-estado-error");

    const cidadeInput = document.getElementById("editar-cidade");
    const cidade = cidadeInput.value.trim();
    const erroCidadeSpan = document.getElementById("editar-cidade-error");

    const ruaInput = document.getElementById("editar-rua");
    const rua = ruaInput.value.trim();
    const erroRuaSpan = document.getElementById("editar-rua-error");

    const cepInput = document.getElementById("editar-cep");
    const cep = cepInput.value.trim();
    const erroCepSpan = document.getElementById("editar-cep-error");

    const bairroInput = document.getElementById("editar-bairro");
    const bairro = bairroInput.value.trim();
    const erroBairroSpan = document.getElementById("editar-bairro-error");

    const complementoInput = document.getElementById("editar-complemento");
    const complemento = complementoInput.value.trim();
    const erroComplementoSpan = document.getElementById("editar-complemento-error");

    // ✅ VALIDAÇÃO DO NOME
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    let nomeValido = true;
    let mensagemErroNome = "";

    if (nome === "") {
        mensagemErroNome = "Nome é obrigatório.";
        nomeValido = false;
    } else if (!nomeRegex.test(nome)) {
        mensagemErroNome = "O nome deve conter apenas letras e espaços.";
        nomeValido = false;
    }

    if (!nomeValido) {
        Swal.fire({
            icon: 'error',
            title: 'Nome inválido',
            text: mensagemErroNome,
            timer: 3000,
            showConfirmButton: false
        });
        nomeInput.style.border = "1.5px solid #FF3D51";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = mensagemErroNome;
            erroNomeSpan.classList.add("visible");
        }
        nomeInput.focus();
        return;
    } else {
        nomeInput.style.border = "";
        if (erroNomeSpan) {
            erroNomeSpan.textContent = "";
            erroNomeSpan.classList.remove("visible");
        }
    }

    // 🔧 remove pontos/traços
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');

    // ⚠️ CPF obrigatório
    if (!cpfLimpo) {
        Swal.fire({
            icon: 'error',
            title: 'CPF obrigatório',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.style.border = "1.5px solid #FF3D51";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "O CPF é obrigatório.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.focus();
        return;
    }

    // ✅ Validação do CPF (função reutilizável)
    function validarCPF(cpf) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let digito1 = 11 - (soma % 11);
        digito1 = digito1 >= 10 ? 0 : digito1;
        if (digito1 !== parseInt(cpf[9])) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        let digito2 = 11 - (soma % 11);
        digito2 = digito2 >= 10 ? 0 : digito2;
        return digito2 === parseInt(cpf[10]);
    }

    if (!validarCPF(cpfLimpo)) {
        Swal.fire({
            icon: 'error',
            title: 'CPF inválido',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.style.border = "1.5px solid #FF3D51";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "CPF inválido.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.focus();
        return;
    }

    // ✅ Verifica se o CPF já está cadastrado
    const resCpf = await fetch(`/clientes/buscar?termo=${cpfLimpo}`);
    const resCpfData = await resCpf.json();

    if (resCpfData.some(c => c.cpf === cpfLimpo && c.id_clientes != clienteId)) {
        Swal.fire({
            icon: 'error',
            title: 'CPF já cadastrado',
            text: 'Este CPF já está registrado no sistema.',
            timer: 3000,
            showConfirmButton: false
        });
        cpfInput.style.border = "1.5px solid #FF3D51";
        if (erroCPFSpan) {
            erroCPFSpan.textContent = "CPF já cadastrado.";
            erroCPFSpan.classList.add("visible");
        }
        cpfInput.focus();
        return;
    }

    // ✅ CPF válido: limpa o erro
    cpfInput.style.border = "";
    if (erroCPFSpan) {
        erroCPFSpan.textContent = "";
        erroCPFSpan.classList.remove("visible");
    }

    // ⏩ Atualiza a variável original para o CPF limpo, sem pontuação
    cpf = cpfLimpo;

    if (cep && !/^\d{8}$/.test(cep)) {
        Swal.fire({
            icon: 'error',
            title: 'CEP inválido',
            text: 'O CEP deve conter exatamente 8 dígitos numéricos.',
            timer: 3000,
            showConfirmButton: false
        });
        cepInput.style.border = "1.5px solid #FF3D51";
        if (erroCepSpan) {
            erroCepSpan.textContent = "CEP inválido. Digite 8 números.";
            erroCepSpan.classList.add("visible");
        }
        cepInput.focus();
        return;
    } else {
        cepInput.style.border = "";
        if (erroCepSpan) {
            erroCepSpan.textContent = "";
            erroCepSpan.classList.remove("visible");
        }
    }

    // RG vazio ou válido → limpa estilos de erro
    rgInput.style.border = "";
    if (erroRGSpan) {
        erroRGSpan.textContent = "";
        erroRGSpan.classList.remove("visible");
    }

    if (email) {
        let emailValido = true;
        let mensagemErroEmail = "";

        if (!email.includes("@")) {
            emailValido = false;
            mensagemErroEmail = "Email deve conter '@'.";
        } else if (!/(gmail|hotmail|outlook)/i.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Email deve conter domínio válido (gmail, hotmail ou outlook).";
        } else if (!/\.[a-z]{2,}$/.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Email deve terminar com um domínio (.com, .net etc).";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            emailValido = false;
            mensagemErroEmail = "Formato de email inválido.";
        }

        if (!emailValido) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: mensagemErroEmail,
                timer: 3000,
                showConfirmButton: false
            });
            emailInput.style.border = "1.5px solid #FF3D51";
            if (erroEmailSpan) {
                erroEmailSpan.textContent = mensagemErroEmail;
                erroEmailSpan.classList.add("visible");
            }
            emailInput.focus();
            return;
        }

        // 🔁 Verifica duplicidade (ignorando o próprio cliente)
        const resEmail = await fetch(`/clientes/buscar?termo=${email}`);
        const resEmailData = await resEmail.json();

        if (resEmailData.some(c => c.email === email && c.id_clientes != clienteId)) {
            Swal.fire({
                icon: 'error',
                title: 'Email já cadastrado',
                text: 'Este email já está registrado no sistema.',
                timer: 3000,
                showConfirmButton: false
            });
            emailInput.style.border = "1.5px solid #FF3D51";
            if (erroEmailSpan) {
                erroEmailSpan.textContent = "Email já cadastrado.";
                erroEmailSpan.classList.add("visible");
            }
            emailInput.focus();
            return;
        }

        // Tudo certo → limpa estilo de erro
        emailInput.style.border = "";
        if (erroEmailSpan) {
            erroEmailSpan.textContent = "";
            erroEmailSpan.classList.remove("visible");
        }
    }

    if (celular) {
        if (!validarTelefone(celular)) {
            Swal.fire({
                icon: 'error',
                title: 'Telefone inválido',
                text: 'O número deve ter 10 ou 11 dígitos válidos.',
                timer: 3000,
                showConfirmButton: false
            });
            celularInput.style.border = "1.5px solid #FF3D51";
            if (erroTelefoneSpan) {
                erroTelefoneSpan.textContent = "Número inválido.";
                erroTelefoneSpan.classList.add("visible");
            }
            celularInput.focus();
            return;
        }

        // 🔁 Verificar duplicidade (ignorando o próprio cliente)
        const resTel = await fetch(`/clientes/buscar?termo=${celular}`);
        const resTelData = await resTel.json();

        if (resTelData.some(c => c.numero_telefone === celular && c.id_clientes != clienteId)) {
            Swal.fire({
                icon: 'error',
                title: 'Telefone já cadastrado',
                text: 'Este número já está registrado no sistema.',
                timer: 3000,
                showConfirmButton: false
            });
            celularInput.style.border = "1.5px solid #FF3D51";
            if (erroTelefoneSpan) {
                erroTelefoneSpan.textContent = "Telefone já cadastrado.";
                erroTelefoneSpan.classList.add("visible");
            }
            celularInput.focus();
            return;
        }

        // ✅ Remove erro se estiver tudo certo
        celularInput.style.border = "";
        if (erroTelefoneSpan) {
            erroTelefoneSpan.textContent = "";
            erroTelefoneSpan.classList.remove("visible");
        }
    }

    // ESTADO
    if (estado && estado.length < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Estado inválido',
            text: 'Digite pelo menos 2 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        estadoInput.style.border = "1.5px solid #FF3D51";
        erroEstadoSpan.textContent = "Estado inválido.";
        erroEstadoSpan.classList.add("visible");
        estadoInput.focus();
        return;
    } else {
        estadoInput.style.border = "";
        erroEstadoSpan.textContent = "";
        erroEstadoSpan.classList.remove("visible");
    }

    // CIDADE
    if (cidade && cidade.length < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Cidade inválida',
            text: 'Digite pelo menos 2 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        cidadeInput.style.border = "1.5px solid #FF3D51";
        erroCidadeSpan.textContent = "Cidade inválida.";
        erroCidadeSpan.classList.add("visible");
        cidadeInput.focus();
        return;
    } else {
        cidadeInput.style.border = "";
        erroCidadeSpan.textContent = "";
        erroCidadeSpan.classList.remove("visible");
    }

    // BAIRRO
    if (bairro && bairro.length < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Bairro inválido',
            text: 'Digite pelo menos 2 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        bairroInput.style.border = "1.5px solid #FF3D51";
        erroBairroSpan.textContent = "Bairro inválido.";
        erroBairroSpan.classList.add("visible");
        bairroInput.focus();
        return;
    } else {
        bairroInput.style.border = "";
        erroBairroSpan.textContent = "";
        erroBairroSpan.classList.remove("visible");
    }

    // RUA
    if (rua && rua.length < 2) {
        Swal.fire({
            icon: 'error',
            title: 'Rua inválida',
            text: 'Digite pelo menos 2 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        ruaInput.style.border = "1.5px solid #FF3D51";
        erroRuaSpan.textContent = "Rua inválida.";
        erroRuaSpan.classList.add("visible");
        ruaInput.focus();
        return;
    } else {
        ruaInput.style.border = "";
        erroRuaSpan.textContent = "";
        erroRuaSpan.classList.remove("visible");
    }

    // COMPLEMENTO
    if (complemento.length === 1) {
        Swal.fire({
            icon: 'error',
            title: 'Complemento inválido',
            text: 'Se preencher, use pelo menos 2 caracteres.',
            timer: 3000,
            showConfirmButton: false
        });
        complementoInput.style.border = "1.5px solid #FF3D51";
        erroComplementoSpan.textContent = "Complemento muito curto.";
        erroComplementoSpan.classList.add("visible");
        complementoInput.focus();
        return;
    } else {
        complementoInput.style.border = "";
        erroComplementoSpan.textContent = "";
        erroComplementoSpan.classList.remove("visible");
    }

    // ✅ Confirmação com SweetAlert2
    const confirmar = await Swal.fire({
        title: 'Deseja atualizar este cliente?',
        text: 'Tem certeza que deseja salvar as alterações?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, atualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    });

    if (!confirmar.isConfirmed) return; // usuário cancelou

    // ✅ Envio da atualização
    fetch(`/clientes/editar/${clienteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            cpf,
            rg,
            data_nascimento: dataNascimentoFormatada,
            email,
            numero_telefone: celular,
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
                    title: 'Atualizado!',
                    text: body.message || 'Cliente atualizado com sucesso!',
                    timer: 2000,
                    showConfirmButton: false
                });
                carregarClientes(); // Atualiza a tabela
            } else if (status === 404) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cliente não encontrado',
                    text: body.message || 'Cliente não encontrado.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar',
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
