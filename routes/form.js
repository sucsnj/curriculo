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

module.exports = router;
