document.addEventListener('DOMContentLoaded', function() {
  var textNeedResize = document.querySelectorAll('textarea');
  M.textareaAutoResize(textNeedResize[0]); // aplica autoresize
});

$(document).ready(function() {
  
    // quando botão enviar for clicado
    $("#enviar").click(async function(event) {
        event.preventDefault();
        criarFormulario();
    });

    $("#form").click(async function(event) {
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
    let logradouro = $("#logradouro").val();
    let cep = $("#cep").val();
    let estado = $("#estado").val();
    let cidade = $("#cidade").val();
    let nacionalidade = $("#nacionalidade").val();
    let resumo = $("#resumo").val();
    let linkedin = $("#linkedin").val();
    let github = $("#github").val();
    let formacao = $("#formacao").val();
    let projeto = $("#projeto").val();
    let tecnologias = $("#tecnologias").val();
    let complementar = $("#complementar").val();

    // se algum input não tiver valor
    if (!nome || !idade || !telefone || !email || !logradouro) {
        // mostra mensagem de erro
        M.toast({html: "Preencha todos os campos", displayLength: 4000});
        return;
    }

    // prompt perguntando o nome da pessoa
    const id = prompt("Digite um identificador");
    if (!id) {
        // mostra mensagem de erro
        M.toast({html: "Preencha o identificador", displayLength: 4000});
        return;
    }
    if (id.length < 4) {
        // mostra mensagem de erro
        M.toast({html: "Identificador deve ter pelo menos 4 caracteres", displayLength: 4000});
        return;
    }
    // se o id já existir
    const response = await fetch("/leitura");
    const registros = await response.json();
    if (registros.find(item => item.id === id)) {
        // mostra mensagem de erro
        M.toast({html: "Identificador já existe", displayLength: 4000});
        return;
    }

    // se todos os inputs tiverem valor
    if (nome && idade && telefone && email && logradouro) {
        // faz fetch para enviar dados
        const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                id: id,
                nome: nome,
                idade: idade,
                telefone: telefone,
                email: email,
                logradouro: logradouro,
                cep: cep,
                estado: estado,
                cidade: cidade,
                nacionalidade: nacionalidade,
                resumo: resumo,
                linkedin: linkedin,
                github: github,
                formacao: formacao,
                projeto: projeto,
                tecnologias: tecnologias,
                complementar: complementar
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

    // verifica o id
    const id = prompt("Digite o identificador");
    if (!id) {
        // mostra mensagem de erro
        M.toast({html: "Preencha o identificador", displayLength: 4000});
        return;
    }

    // verifica o id dentro do registro
    const registro = registros.find(item => item.id === id);
    if (!registro) {
        // mostra mensagem de erro
        M.toast({html: "Identificador não encontrado", displayLength: 4000});
        return;
    } else {
        // vai para  rota leitura
        window.location.href = "/form?id=" + id;;

        M.toast({html: "Identificador encontrado", displayLength: 4000});
    }
};
