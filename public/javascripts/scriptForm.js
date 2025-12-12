// document.addEventListener('DOMContentLoaded', function() {
//   var textNeedResize = document.querySelectorAll('textarea');
//   M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
// });

$(document).ready(function() {

    $('#telefone').mask('(00) 00000-0000');
    $('#cep').mask('00000-000');
    $('#idade').mask('00');

    curriculo();

});

// função para pegar o formulário
async function curriculo() {
    // carregar dados.json
    const response = await fetch("/leitura");
    const registros = await response.json();
    console.log(registros);

    $("#nome").text(registros[registros.length - 1].nome);
    $("#idade").text(registros[registros.length - 1].idade + " anos");
    $("#telefone").text(registros[registros.length - 1].telefone);
    $("#email").text(registros[registros.length - 1].email);
    $("#logradouro").text(registros[registros.length - 1].logradouro);
    $("#cep").text(registros[registros.length - 1].cep);
    $("#estado").text(registros[registros.length - 1].estado);
    $("#cidade").text(registros[registros.length - 1].cidade);
    $("#nacionalidade").text(registros[registros.length - 1].nacionalidade);
    $("#linkedin").text(registros[registros.length - 1].linkedin);
    $("#github").text(registros[registros.length - 1].github);
    $("#resumo").text(registros[registros.length - 1].resumo);
    $("#formacao").text(registros[registros.length - 1].formacao);
    $("#projeto").text(registros[registros.length - 1].projeto);
    $("#tecnologias").text(registros[registros.length - 1].tecnologias);
    $("#complementar").text(registros[registros.length - 1].complementar);
}
