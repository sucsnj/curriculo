// document.addEventListener('DOMContentLoaded', function() {
//   var textNeedResize = document.querySelectorAll('textarea');
//   M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
// });

$(document).ready(function() {

    curriculo(dadosId);

});

// função para pegar o formulário
async function curriculo(id) {
    // carregar dados.json
    const response = await fetch("/leitura");
    const registros = await response.json();
    const registro = registros.find(item => item.id === id);
    
    if (!registro) {
        M.toast({html: "Identificador não encontrado", displayLength: 4000});
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
    $("#formacao").text(registro.formacao);
    $("#projeto").text(registro.projeto);
    $("#tecnologias").text(registro.tecnologias);
    $("#complementar").text(registro.complementar);
}
