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
  try {
    const dados = fs.readFileSync('dados.json', 'utf8');
    const registros = JSON.parse(dados);
    res.json(Array.isArray(registros) ? registros : []);
  } catch (err) {
    // se arquivo não existe, retorna array vazio
    res.json([]);
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
    // se não achar, pode renderizar uma página de erro ou cai no último registro
    return res.render('form', { dados: null });
  }

  res.render('form', { dados: registro });
});

router.patch('/atualizar', (req, res) => {
  try {
    const dados = req.body;
    const id = dados.id;
    let registros = [];
    if (fs.existsSync("dados.json")) {
      registros = JSON.parse(fs.readFileSync("dados.json"));
    }

    const index = registros.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ mensagem: "Registro não encontrado" });
    }
    registros[index] = { ...registros[index], ...dados };

    fs.writeFileSync("dados.json", JSON.stringify(registros, null, 2));

    res.json({ mensagem: "Dados atualizados com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar dados" });
  }
});

module.exports = router;
