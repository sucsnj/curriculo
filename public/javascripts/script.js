document.addEventListener('DOMContentLoaded', function () {
    var textNeedResize = document.querySelectorAll('textarea');
    M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
});

$(document).ready(function () {
    $('.modal').modal();

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
        M.toast({ html: "Preencha todos os campos", displayLength: 4000 });
        return;
    }

    let data = {};
    formulario.id = id;
    delete formulario.enviar;

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

    $.each(dados, function (id, valor) {
        const $campo = $("#" + id);
        if ($campo.length) {
            $campo.val(valor);
            if ($campo.is("textarea")) {
                M.textareaAutoResize($campo[0]);
            }
        }
    });
    M.updateTextFields();
}

async function atualizarFormulario(id) {

    const formulario = await preencherFormulario();
    formulario.id = id;
    delete formulario.enviar;

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
    $("#formulario [id]").each(function () {
        const id = $(this).attr("id");
        const valor = $(this).val();
        formulario[id] = valor;
    });
    return formulario;
}
