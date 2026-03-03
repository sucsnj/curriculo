const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images');
    // Criar pasta se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Salvar sempre como foto.jpg
    cb(null, 'foto.jpg');
  }
});

const fileFilter = (req, file, cb) => {
  // Aceitar apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'), false);
  }
};

const upload = multer({ storage, fileFilter });

/* POST submit */
router.post('/submit', upload.single('foto'), (req, res) => {
  const dados = req.body;
  
  // Adicionar o caminho da foto se foi feito upload
  if (req.file) {
    dados.foto = '/images/foto.jpg';
  }

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

router.patch('/atualizar', upload.single('foto'), (req, res) => {
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

    // Adicionar o caminho da foto se foi feito upload
    if (req.file) {
      dados.foto = '/images/foto.jpg';
    }

    registros[index] = { ...registros[index], ...dados };

    fs.writeFileSync("dados.json", JSON.stringify(registros, null, 2));

    res.json({ mensagem: "Dados atualizados com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar dados" });
  }
});

module.exports = router;
