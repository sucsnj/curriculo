$(document).ready(function () {

    curriculo(dadosId);
    aplicarMascaras();

    $("#pdf").click(function () {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfName = `${dadosId}.pdf`;

        pdf.html(document.querySelector(".curriculo"), {
            callback: function (doc) {
                doc.save(pdfName);
            },
            x: 10,
            y: 10,
            html2canvas: { scale: 0.2 }
        });
    });
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
    $("#cidade").text(`${registro.cidade} - ${registro.estado}`);
    $("#nacionalidade").text(registro.nacionalidade);
    $("#urllinkedin").html(`<a href="${registro.urllinkedin}" target="_blank">${registro.urllinkedin}</a>`);
    $("#github").html(`<a href="${registro.github}" target="_blank">${registro.github}</a>`);
    $("#resumo").text(registro.resumo);

    // formações
    $("#formacao").empty(); // limpa o conteúdo anterior
    if (registro.formacoes && typeof registro.formacoes === "object") {
        Object.entries(registro.formacoes).forEach(([key, valor]) => {
            if (valor && valor.trim() !== "") {   // verifica se está vazio
                const campo = `<p id="${key}">${valor}</p>`;
                $("#formacao").append(campo);
            }
        });
    }

    // experiência profissional
    $("#experiencia").empty(); // limpa o conteúdo anterior
    if (registro.experiencia && typeof registro.experiencia === "object") {
        Object.entries(registro.experiencia).forEach(([key, valor]) => {
            if (valor && valor.trim() !== "") {
                const campo = `<p id="${key}">${valor}</p>`;
                $("#experiencia").append(campo);
            }
        });
    }

    $("#competencias").text(registro.competencias);
    $("#comportamentos").text(registro.comportamentos);

    // projetos e links
    $("#projeto").empty();
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
                <p id="projeto${idx}">${proj.projeto || ""}</p>
                <a href="${proj.link || ""}" target="_blank">${proj.link || ""}</a>
            `;
            $("#projeto").append(campo);
        });
    }

    $("#tecnologias").text(registro.tecnologias);
    $("#complementar").text(registro.complementar);
}

function aplicarMascaras() {
    $("#telefone").mask("(00) 00000-0000");
    $("#cep").mask("00000-000");
    $("#idade").mask("00");
}
