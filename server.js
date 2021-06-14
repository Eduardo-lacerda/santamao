var child_process = require('child_process');
child_process.execSync('npm install');
const dbConfig = require("./config/db.config.js");
var express = require('express');
var app = express();
const path = require('path')
const port = process.env.PORT || 3000;

//Redirecionamento HTTPS
app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP
      res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS
  else //Se a requisição já é HTTPS
      next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
});
//----------------

var db = require("./api/models");
var mongoose = db.mongoose;
var bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
console.log(dbConfig.url)
mongoose.connect(dbConfig.url).catch(err => {
  console.log(err)
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var orcamentoRoutes = require('./api/routes/orcamentoRoutes');
const { error } = require('@angular/compiler/src/util');
orcamentoRoutes(app); //register the route

app.use(express.static(path.join(__dirname, 'dist', 'santamao'
)))

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'dist', 'santamao', 'index.html'))
})

app.get('/orcamento', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'santamao', 'index.html'))
})

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
