$(document).ready(function() {
  
    // quando botão enviar for clicado
    $("#enviar").click(async function(event) {
        event.preventDefault();
        pegarFormulario();
    });
  
});

// função para pegar o formulário
async function pegarFormulario() {
    // pega o valor do input
    var nome = $("#nome").val();
    var idade = $("#idade").val();
    var telefone = $("#telefone").val();
    var email = $("#email").val();

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
};
