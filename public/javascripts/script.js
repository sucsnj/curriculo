$(document).ready(function() {
  
    // quando botão enviar for clicado
    $("#enviar").click(async function(event) {
        event.preventDefault();
        criarFormulario();
    });

    $("#leitura").click(async function(event) {
        event.preventDefault();
        pegarFormulario();
    });

});

// função para pegar o formulário
async function criarFormulario() {

    let dados;
    // pega o valor do input
    let nome = $("#nome").val();
    let idade = $("#idade").val();
    let telefone = $("#telefone").val();
    let email = $("#email").val();

    // se algum input não tiver valor
    if (!nome || !idade || !telefone || !email) {
        // mostra mensagem de erro
        M.toast({html: "Preencha todos os campos", displayLength: 4000});
        return;
    }

    // se todos os inputs tiverem valor
    if (nome && idade && telefone && email) {
        // faz fetch para enviar dados
        const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                nome: nome,
                idade: idade,
                telefone: telefone,
                email: email
            })
        });

        const data = await response.json();
        dados = data;

        // se o fetch tiver sucesso
        if (response.ok) {
            // mostra mensagem de sucesso
            console.log(data.mensagem);
            M.toast({html: data.mensagem, displayLength: 4000});
        } else {
            // mostra mensagem de erro
            console.log(data.mensagem);
            M.toast({html: data.mensagem, displayLength: 4000});
        }
    }
    return dados;
};

async function pegarFormulario() {
    const response = await fetch("/leitura");
    const registros = await response.json();
    console.log(registros);

    M.toast({html: "Foram encontrados " + registros.length + " registros", displayLength: 4000});
};