$(document).ready(function () {

    curriculo(dadosId);

    aplicarMascaras();

});

// função para pegar o formulário
async function curriculo(id) {
    // carregar dados.json
    const response = await fetch("/leitura");
    const registros = await response.json();
    const registro = registros.find(item => item.id === id);

    if (!registro) {
        M.toast({ html: "Identificador não encontrado", displayLength: 4000 });
        return;
    }

    $("#nome").text(registro.nome);
    $("#idade").text(registro.idade + " anos");
    $("#telefone").text(registro.telefone);
    $("#email").text(registro.email);
    $("#logradouro").text(registro.logradouro);
    $("#cep").text(registro.cep);
    $("#estado").text(registro.estado);
    $("#cidade").text(registro.cidade);
    $("#nacionalidade").text(registro.nacionalidade);
    $("#linkedin").text(registro.linkedin);
    $("#github").text(registro.github);
    $("#resumo").text(registro.resumo);

    // formações
    $("#formacao").empty(); // limpa o conteúdo anterior
    registro.formacoes.forEach(f => { // preenche o conteúdo
        $("#formacao").append(`<p>${f}</p>`);
    });

    // projetos
    $("#projeto").empty();
    registro.projetos.forEach(p => {
        $("#projeto").append(`<p>${p}</p>`);
    });

    // links dos projetos
    $("#links").empty();
    registro.links.forEach(l => {
        // $("#links").append(`<li class="collection-item"><a href="${l}" target="_blank">${l}</a></li>`);
        $("#links").append(`<p><a href="${l}" target="_blank">${l}</a></p>`);
    });

    // tecnologias dos projetos
    //TODO

    $("#tecnologias").text(registro.tecnologias);
    $("#complementar").text(registro.complementar);
}

function aplicarMascaras() {
    $("#telefone").mask("(00) 00000-0000");
    $("#cep").mask("00000-000");
    $("#idade").mask("00");
}
