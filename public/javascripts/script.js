document.addEventListener('DOMContentLoaded', function () {
    var textNeedResize = document.querySelectorAll('textarea');
    M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
});

let camposFormacao = [];
let contFormacao = 1;
let contProjeto = 1;

$(document).ready(function () {
    $('.modal').modal();

    // delegação para remover formação
    $("#formacao-container").on("click", "button[id^='btn-remover-formacao']", function () {
        $(this).closest(".formacao-div").remove();
    });
    $("#projeto-container").on("click", "button[id^='btn-remover-projeto']", function () {
        $(this).closest(".projeto-div").remove();
    });

    $("#enviar").click(function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        $("#confirmarId").off('click').on('click', async function () {
            const id = $("#identificador").val().trim();
            if (!id) {
                M.toast({ html: "Insira um identificador", displayLength: 4000 });
                return;
            }
            await criarFormulario(id);
        });
    });

    $(".btn-form").click(function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        $("#confirmarId").off('click').on('click', async function () {
            const id = $("#identificador").val().trim();
            if (!id) {
                M.toast({ html: "Preencha o identificador", displayLength: 4000 });
                return;
            }
            await pegarFormulario(id);
        });
    });

    $("#carregar").click(function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        $("#confirmarId").off('click').on('click', async function () {
            const id = $("#identificador").val().trim();
            if (!id) {
                M.toast({ html: "Preencha o identificador", displayLength: 4000 });
                return;
            }
            await carregarDados(id);
        });
    });

    $("#atualizar").off('click').on('click', async function (event) {
        event.preventDefault();
        const id = $("#identificador").val().trim();
        await atualizarFormulario(id);
    });

    $("#btn-formacao").off('click').on('click', async function (event) {
        event.preventDefault();
        await adicionarFormacao();
    });

    $("#btn-projeto").off('click').on('click', async function (event) {
        event.preventDefault();
        await adicionarProjeto();
    });

    aplicarMascaras();
});

// função para pegar o formulário
async function criarFormulario(id) {

    if (id.length < 4) {
        // mostra mensagem de erro
        M.toast({ html: "Identificador deve ter pelo menos 4 caracteres", displayLength: 4000 });
        return;
    }

    // se o id já existir
    const response = await fetch("/leitura");
    const registros = await response.json();

    if (registros.find(item => item.id === id)) {
        // mostra mensagem de erro
        M.toast({ html: "Identificador já existe", displayLength: 4000 });
        return;
    }

    // preenche o formulário
    const formulario = await preencherFormulario();

    // se algum input não tiver valor
    if (!formulario.nome || !formulario.idade) {
        // mostra mensagem de erro
        console.log(formulario);
        M.toast({ html: "Preencha todos os campos", displayLength: 4000 });
        return;
    }

    let data = {};
    formulario.id = id;
    delete formulario.enviar;
    // deletar botões
    Object.keys(formulario).forEach(key => {
        if (key.startsWith("btn")) {
            delete formulario[key];
        }
    });
    // deletar campos que estejam vazios
    Object.keys(formulario).forEach(key => {
        if (formulario[key] === "") {
            delete formulario[key];
        }
    });

    // se todos os inputs tiverem valor
    if (formulario.nome && formulario.idade) {
        // faz fetch para enviar dados
        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formulario
            })
        });

        data = await response.json();

        // se o fetch tiver sucesso
        if (response.ok) {
            // mostra mensagem de sucesso
            console.log(data.mensagem);
            M.toast({ html: data.mensagem, displayLength: 4000 });
        } else {
            // mostra mensagem de erro
            console.log(data.mensagem);
            M.toast({ html: data.mensagem, displayLength: 4000 });
        }
    }
    return data;
};

async function pegarFormulario(id) {
    const response = await fetch("/leitura");
    const registros = await response.json();

    if (!registros.length) {
        M.toast({ html: "Não há registros", displayLength: 4000 });
        return;
    }

    // verifica o id dentro do registro
    const registro = registros.find(item => item.id === id);
    if (!registro) {
        // mostra mensagem de erro
        M.toast({ html: "Identificador não encontrado", displayLength: 4000 });
        return;
    } else {
        // vai para  rota leitura
        window.location.href = "/form?id=" + id;
        console.log(id);

        M.toast({ html: "Identificador encontrado", displayLength: 4000 });
    }
};

async function carregarDados(id) {
    const response = await fetch("/leitura");
    const registros = await response.json();
    const registro = registros.find(item => item.id === id);

    if (!registro) {
        M.toast({ html: "Identificador não encontrado", displayLength: 4000 });
        return;
    }

    let dados = { ...registro };

    // preenche campos fixos
    $.each(dados, function (id, valor) {
        const $campo = $("#" + id);
        if ($campo.length) {
            $campo.val(valor);
            if ($campo.is("textarea")) {
                M.textareaAutoResize($campo[0]);
            }
        }
    });

    // agora trata os arrays dinâmicos (criados pelo javascript)
    // Formação
    $("#formacao-container").empty();
    if (Array.isArray(registro.formacoes)) {
        registro.formacoes.forEach((f, i) => {
            if (f && f.trim() !== "") {   // verifica se está vazio
                const campo = `
        <div class="row formacao-div">
          <div class="input-field col s12">
            <textarea id="formacao${i}" name="formacao${i}" class="materialize-textarea">${f}</textarea>
            <label for="formacao${i}" class="active">Formação ${i}</label>
          </div>
        </div>
      `;
                $("#formacao-container").append(campo);
            }
        });
    }

    // Projetos
    $("#projeto-container").empty();
    if (Array.isArray(registro.projetos)) {
        registro.projetos.forEach((p, i) => {
            if (p && p.trim() !== "") {
                const campo = `
        <div class="row projeto-div">
          <div class="input-field col s12">
            <textarea id="projeto${i}" name="projeto${i}" class="materialize-textarea">${p}</textarea>
            <label for="projeto${i}" class="active">Projeto ${i}</label>
          </div>
        </div>
      `;
                $("#projeto-container").append(campo);
            }
        });
    }

    // Links
    $("#links-container").empty();
    if (Array.isArray(registro.links)) {
        registro.links.forEach((l, i) => {
            if (l && l.trim() !== "") {
                const campo = `
        <div class="row link-div">
          <div class="input-field col s12">
            <input id="link${i}" name="link${i}" type="url" value="${l}">
            <label for="link${i}" class="active">Link ${i}</label>
          </div>
        </div>
      `;
                $("#links-container").append(campo);
            }
        });
    }

    M.updateTextFields();
}

async function atualizarFormulario(id) {

    const formulario = await preencherFormulario();
    formulario.id = id;
    delete formulario.enviar;
    // deletar botões
    Object.keys(formulario).forEach(key => {
        if (key.startsWith("btn")) {
            delete formulario[key];
        }
    });

    const response = await fetch("/atualizar", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formulario })
    });

    const data = await response.json();

    if (response.ok) {
        // mostra mensagem de sucesso
        console.log(data.mensagem);
        M.toast({ html: data.mensagem, displayLength: 4000 });
    } else {
        // mostra mensagem de erro
        console.log(data.mensagem);
        M.toast({ html: data.mensagem, displayLength: 4000 });
    }
};

async function preencherFormulario() {
    const formulario = {};
    const formacoes = {};
    const projetos = {};

    // formulário base
    $("#formulario [id]").each(function () {
        const id = $(this).attr("id");
        const valor = $(this).val();

        formulario[id] = valor;
    });
    Object.keys(formulario).forEach(key => {
        if (key.startsWith("formacao")) {
            delete formulario[key];
        } else if (key.startsWith("projeto")) {
            delete formulario[key];
        } else if (key.startsWith("link-projeto")) {
            delete formulario[key];
        }
    });

    // formações
    $("#formacao-container [id]").each(function () {
        const id = $(this).attr("id");
        const valor = $(this).val();

        formacoes[id] = valor;
    });
    Object.keys(formacoes).forEach(key => {
        if (key.startsWith("btn")) {
            delete formacoes[key];
        }
    });

    // projetos e links
    $("#projeto-container [id]").each(function () {
        const id = $(this).attr("id");
        const valor = $(this).val();

        projetos[id] = valor;
    });
    Object.keys(projetos).forEach(key => {
        if (key.startsWith("btn")) {
            delete projetos[key];
        }
    });

    formulario.formacoes = formacoes;
    formulario.projetos = projetos;
    return formulario;
}

function aplicarMascaras() {
    $("#telefone").mask("(00) 00000-0000");
    $("#cep").mask("00000-000");
    $("#idade").mask("00");
}

async function adicionarFormacao() {
    const novoCampo = `
        <div class="row formacao-div">
            <div class="input-field col s6">
                <textarea id="formacao${contFormacao}" name="formacao${contFormacao}" class="materialize-textarea"></textarea>
                <label for="formacao${contFormacao}">Formação ${contFormacao}</label>
            </div>

            <button id="btn-remover-formacao${contFormacao}" class="btn waves-effect waves-light red">
                Remover
            </button>
        </div>
    `;

    $("#formacao-container").append(novoCampo);
    contFormacao++;
}

async function adicionarProjeto() {
    const novoCampo = `
        <div class="row projeto-div">
            <div class="input-field col s12">
                <textarea id="projeto${contProjeto}" name="projeto${contProjeto}" class="materialize-textarea"></textarea>
                <label for="projeto${contProjeto}">Projeto ${contProjeto}</label>
            </div>

            <div class="input-field col s12">
                <input id="link-projeto${contProjeto}" name="link-projeto${contProjeto}" type="url" class="validate">
                <label for="link-projeto${contProjeto}">Link do Projeto ${contProjeto}</label>
            </div>

            <button id="btn-remover-projeto${contProjeto}" class="btn waves-effect waves-light red">
                Remover
            </button>
        </div>
    `;

    $("#projeto-container").append(novoCampo);
    contProjeto++;
}