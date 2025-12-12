const express = require('express');
const router = express.Router();
const fs = require('fs');

/* POST submit */
router.post('/submit', (req, res) => {
  const dados = req.body;

  let registros = [];

  if (fs.existsSync("dados.json")) {
    registros = JSON.parse(fs.readFileSync("dados.json"));
  }

  registros.push(dados);
  fs.writeFileSync("dados.json", JSON.stringify(registros, null, 2));

  res.json({ mensagem: "Dados salvos com sucesso" });

});

router.get('/leitura', (req, res) => {
  if (fs.existsSync("dados.json")) {
    const registros = JSON.parse(fs.readFileSync("dados.json"));
    res.json(registros); // retorna todos os registros

  } else {
    res.json({ mensagem: "Nenhum dado encontrado" });
  }
});

router.get('/form', (req, res) => {
  let registros = [];
  let idPrompt = req.query.id;

  if (fs.existsSync("dados.json")) {
    registros = JSON.parse(fs.readFileSync("dados.json"));
  }

  const registro = registros.find(item => item.id === idPrompt);
    if (!registro) {
    // se não achar, pode renderizar uma página de erro ou cair no último registro
    return res.render('form', { dados: null });
  }

  res.render('form', { dados: registro }); 
});

module.exports = router;
