document.addEventListener('DOMContentLoaded', function () {
    var textNeedResize = document.querySelectorAll('textarea');
    M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
});

let contFormacao = 1;
let contExperiencia = 1;
let contProjeto = 1;

$(document).ready(async function () {
    $('.modal').modal();

    // delegação para remover formação
    $("#formacao-container").on("click", "button[id^='btn-remover-formacao']", async function () {
        $(this).closest(".formacao-div").remove();
    });
    // delegação para remover experiência
    $("#experiencia-container").on("click", "button[id^='btn-remover-experiencia']", async function () {
        $(this).closest(".experiencia-div").remove();
    });
    // delegação para remover projeto e link
    $("#projeto-container").on("click", "button[id^='btn-remover-projeto']", async function () {
        $(this).closest(".projeto-div").remove();
    });

    $("#enviar").click(async function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        // esconde o dropdown
        $("#select").hide();

        $("#confirmarId").off('click').on('click', async function () {
            const id = $("#identificador").val().trim();
            if (!id) {
                M.toast({ html: "Insira um identificador", displayLength: 4000 });
                return;
            }
            await criarFormulario(id);
        });
    });

    $(".btn-form").click(async function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        // dropdown para escolher o registro
        await carregarDropdown();

        $("#confirmarId").off('click').on('click', async function () {
            const id = $("#identificador").val().trim();
            if (!id) {
                M.toast({ html: "Preencha o identificador", displayLength: 4000 });
                return;
            }
            await pegarFormulario(id);
        });
    });

    $("#carregar").click(async function (event) {
        event.preventDefault();
        $("#modal-id").modal('open');

        await carregarDropdown();

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

    $("#btn-experiencia").off('click').on('click', async function (event) {
        event.preventDefault();
        await adicionarExperiencia();
    });

    $("#btn-projeto").off('click').on('click', async function (event) {
        event.preventDefault();
        await adicionarProjeto();
    });

    $(".btn-limpar").click(async function (event) {
        event.preventDefault();
        await limparFormulario();
    });

    aplicarMascaras();
});

async function carregarJson() {
    const response = await fetch("/leitura");
    const registros = await response.json();
    return registros;
}

async function carregarDropdown() {
    $("#select").show();
    const registros = await carregarJson();

    $("#select").empty();
    $("#select").append(`<option value="" disabled selected>Selecione um id</option>`);
    registros.forEach(r => {
        $("#select").append(`<option value="${r.id}">${r.id}</option>`);
    });

    // quando selecionar uma opção, preenche o campo de texto
    $("#select").off("change").on("change", function () {
        const selectedId = $(this).val();
        $("#identificador").val(selectedId);
        // se estiver usando Materialize, precisa atualizar o label/validação
        M.updateTextFields();
    });
}

async function limparFormulario() {
    $.each($("#formulario [id]"), function () {
        $(this).val("");
    });

    $("#formacao-container").empty();
    $("#experiencia-container").empty();
    $("#projeto-container").empty();

    // reseta contadores
    contFormacao = 1;
    contExperiencia = 1;
    contProjeto = 1;

    const registros = await carregarJson();

    // atualiza contadores
    contFormacao = registros.formacoes ? Object.keys(registros.formacoes).length + 1 : 0;
    contFormacao = contFormacao + 1;
    contExperiencia = registros.experiencia ? Object.keys(registros.experiencia).length + 1 : 0;
    contExperiencia = contExperiencia + 1;
    contProjeto = registros.projetos ? Object.keys(registros.projetos).length / 2 : 0;
    contProjeto = contProjeto + 1;

    // remove classes de validação do Materialize
    $("#formulario input, #formulario textarea").each(function () {
        $(this).removeClass("valid invalid");
    });
    M.updateTextFields();
}

// função para pegar o formulário
async function criarFormulario(id) {

    if (id.length < 4) {
        // mostra mensagem de erro
        M.toast({ html: "Identificador deve ter pelo menos 4 caracteres", displayLength: 4000 });
        return;
    }

    // se o id já existir
    const registros = await carregarJson();

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

    // normalizar campos de formação
    const valoresFormacao = Object.values(formulario.formacoes);
    const formacaoId = {};
    valoresFormacao.forEach((valor, idx) => {
        formacaoId[`formacao${idx + 1}`] = valor;
    });
    formulario.formacoes = formacaoId;

    // normalizar campos de experiência
    const valoresexperiencia = Object.values(formulario.experiencia);
    const experienciaId = {};
    valoresexperiencia.forEach((valor, idx) => {
        experienciaId[`experiencia${idx + 1}`] = valor;
    });
    formulario.experiencia = experienciaId;

    // normalizar campos de projetos e links
    const entradasProjeto = Object.entries(formulario.projetos)
        .sort((a, b) => {
            const numA = parseInt(a[0].replace(/\D/g, ""), 10);
            const numB = parseInt(b[0].replace(/\D/g, ""), 10);
            return numA - numB;
        });
    const projetoId = {};
    let contador = 1;
    for (let i = 0; i < entradasProjeto.length; i++) {
        const [chave, valor] = entradasProjeto[i];
        if (chave.startsWith("projeto")) {
            projetoId[`projeto${contador}`] = valor;
        }
        if (chave.startsWith("link-projeto")) {
            projetoId[`link-projeto${contador}`] = valor;
            contador++;
        }
    }
    formulario.projetos = projetoId;

    // se nome e idade estiverem vazios, retorna mensagem de erro
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
    const registros = await carregarJson();

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
    const registros = await carregarJson();
    const registro = registros.find(item => item.id === id);

    // atualiza contadores
    contFormacao = registro.formacoes ? Object.keys(registro.formacoes).length + 1 : 0;
    contExperiencia = registro.experiencia ? Object.keys(registro.experiencia).length + 1 : 0;
    contProjeto = registro.projetos ? Object.keys(registro.projetos).length / 2 : 0;
    contProjeto = contProjeto + 1;

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
    if (registro.formacoes && typeof registro.formacoes === "object") {

        Object.entries(registro.formacoes).forEach(([key, valor], idx) => {
            if (valor && valor.trim() !== "") {   // verifica se está vazio
                const campo = `
                <div class="row formacao-div">
                    <div class="input-field col s12">
                        <textarea id="${key}" name="${key}" class="materialize-textarea">${valor}</textarea>
                        <label for="${key}" class="active">Formação ${idx + 1}</label>
                    </div>

                    <button id="btn-remover-formacao${key}" class="btn waves-effect waves-light red">
                        Remover
                    </button>
                </div>
                `;
                $("#formacao-container").append(campo);
            }
        });
    }

    // experiência profissional
    $("#experiencia-container").empty();
    if (registro.experiencia && typeof registro.experiencia === "object") {

        Object.entries(registro.experiencia).forEach(([key, valor], idx) => {
            if (valor && valor.trim() !== "") {   // verifica se está vazio
                const campo = `
                <div class="row experiencia-div">
                    <div class="input-field col s12">
                        <textarea id="${key}" name="${key}" class="materialize-textarea">${valor}</textarea>
                        <label for="${key}" class="active">Experiência ${idx + 1}</label>
                    </div>

                    <button id="btn-remover-experiencia${key}" class="btn waves-effect waves-light red">
                        Remover
                    </button>
                </div>
                `;
                $("#experiencia-container").append(campo);
            }
        });
    }

    // projetos e links
    $("#projeto-container").empty();
    if (registro.projetos && typeof registro.projetos === "object") {
        const projetoLink = {};

        Object.entries(registro.projetos).forEach(([key, valor]) => {
            const match = key.match(/^projeto(\d+)$/);
            const matchLink = key.match(/^link-projeto(\d+)$/);

            if (match) {
                const idx = match[1];
                projetoLink[idx] = projetoLink[idx] || {};
                projetoLink[idx].projeto = valor;
            }
            if (matchLink) {
                const idx = matchLink[1];
                projetoLink[idx] = projetoLink[idx] || {};
                projetoLink[idx].link = valor;
            }
        });

        Object.entries(projetoLink).forEach(([idx, proj]) => {
            const campo = `
            <div class="row projeto-div">
                <div class="input-field col s6">
                    <textarea id="projeto${idx}" name="projeto${idx}" class="materialize-textarea">${proj.projeto || ""}</textarea>
                    <label for="projeto${idx}" class="active">Projeto ${idx}</label>
                </div>
                <div class="input-field col s6">
                    <input id="link-projeto${idx}" name="link-projeto${idx}" type="url" value="${proj.link || ""}">
                    <label for="link-projeto${idx}" class="active">Link Projeto ${idx}</label>
                </div>

                <button id="btn-remover-projeto${idx}" class="btn waves-effect waves-light red">
                    Remover
                </button>
            </div>
            `;
            $("#projeto-container").append(campo);
        });
    }

    // atualiza contadores

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

    // normalizar campos de formação
    const valoresFormacao = Object.values(formulario.formacoes);
    const formacaoId = {};
    valoresFormacao.forEach((valor, idx) => {
        formacaoId[`formacao${idx + 1}`] = valor;
    });
    formulario.formacoes = formacaoId;

    // normalizar campos de experiência
    const valoresexperiencia = Object.values(formulario.experiencia);
    const experienciaId = {};
    valoresexperiencia.forEach((valor, idx) => {
        experienciaId[`experiencia${idx + 1}`] = valor;
    });
    formulario.experiencia = experienciaId;

    // normalizar campos de projetos e links
    const entradasProjeto = Object.entries(formulario.projetos)
        .sort((a, b) => {
            const numA = parseInt(a[0].replace(/\D/g, ""), 10);
            const numB = parseInt(b[0].replace(/\D/g, ""), 10);
            return numA - numB;
        });
    const projetoId = {};
    let contador = 1;
    for (let i = 0; i < entradasProjeto.length; i++) {
        const [chave, valor] = entradasProjeto[i];
        if (chave.startsWith("projeto")) {
            projetoId[`projeto${contador}`] = valor;
        }
        if (chave.startsWith("link-projeto")) {
            projetoId[`link-projeto${contador}`] = valor;
            contador++;
        }
    }
    formulario.projetos = projetoId;

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
    const experiencia = {};
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
        } else if (key.startsWith("experiencia")) {
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

    // experiência profissional
    $("#experiencia-container [id]").each(function () {
        const id = $(this).attr("id");
        const valor = $(this).val();

        experiencia[id] = valor;
    });
    Object.keys(experiencia).forEach(key => {
        if (key.startsWith("btn")) {
            delete experiencia[key];
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
    formulario.experiencia = experiencia;
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
    contFormacao = contFormacao + 1;
}

async function adicionarExperiencia() {
    const novoCampo = `
        <div class="row experiencia-div">
            <div class="input-field col s12">
                <textarea id="experiencia${contExperiencia}" name="experiencia${contExperiencia}" class="materialize-textarea"></textarea>
                <label for="experiencia${contExperiencia}">Experiência ${contExperiencia}</label>
            </div>

            <button id="btn-remover-experiencia${contExperiencia}" class="btn waves-effect waves-light red">
                Remover
            </button>
        </div>
    `;

    $("#experiencia-container").append(novoCampo);
    contExperiencia = contExperiencia + 1;
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