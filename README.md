# curriculo
API simples para criação de pdf de currículos

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-18-green)

## Instalação
1. Instale o [Node.js](https://nodejs.org/en/)
2. Faça um clone desse repositório/fork
3. Entre na pasta do projeto e execute `npm install`
4. Opcional: Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo
```
PORT=5000
```
5. Execute `npm start`
5.1 Opcional: Instale o nodemon `npm install -g nodemon`
5.2 Opcional: Execute `npm run dev` para iniciar o servidor em modo de desenvolvimento
6. Acesse a aplicação em `http://localhost:5000`

## Requisitos
- Node.js
- NPM
- IDE (Visual Studio Code recomendado)

## Uso 
### Criar currículo 
```bash 
curl -X POST http://localhost:5000/submit \
-H "Content-Type: application/json" \
-d '{"nome":"Nome completo","idade":25,"email":"email@email.com", "id":"0001"}'
```

## Resposta
```json
{
  "mensagem": "Dados salvos com sucesso"
}
```
```json
[
  {
    "id": 0001,
    "nome": "Nome completo",
    "idade": 25,
    "email": "email@email.com"
  }
]
```

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Tecnologias
- HTML
- CSS
- Node.js
- JavaScript
- Materialize
- jQuery
- Mask
- HTML2Canvas
- JSPDF
- Express (Node.js)

## Estrutura do projeto
```
.
├── README.md
├── app.js
├── package.json
├── package-lock.json
├── LICENSE
├── .env *
├── dados.json *
├── node_modules *
├── .gitignore
├── bin
├── public
│   ├── javascripts
│   │   └── script.js
│   ├── stylesheets
│   │   └── style.css
│   └── views
│       ├── form.ejs
│       ├── index.ejs
│       └── modal.ejs
├── routes
│   └── form.js
├── views
│   ├── form.ejs
│   ├── index.ejs
│   └── modal.ejs
└── views
    ├── form.ejs
    ├── index.ejs
    └── modal.ejs
```

## API
### POST /submit
Retorna um array de registros

### GET /leitura
Retorna um array de registros

### GET /form?id=id
Retorna um array de registros com o id informado

### PATCH /atualizar
Atualiza um registro com o id informado

## Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
