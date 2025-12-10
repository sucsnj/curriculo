var express = require('express');
var router = express.Router();

/* POST submit */
router.post('/submit', (req, res) => {
  const { nome, idade, telefone, email } = req.body;
  res.json({
    sucesso: true,
    mensagem: `Dados recebidos: ${nome}, ${idade}, ${telefone}, ${email}`
  });
});

module.exports = router;
