const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const routerPix = require('./api/webhook/bb/pix/');
const router3061856 = require('./api/webhook/bb/cobranca/convenio/3061856');
const router2814485 = require('./api/webhook/bb/cobranca/convenio/2814485');

const routerUsers = require('./api/painel/users');
const routerClients = require('./api/painel/clients');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json()); // Aceita no formato json


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Cache-Control, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS');
    return res.status(200).send({

    });
  }
  next();
});


app.use('/api/webhook/bb/pix/', routerPix);
app.use('/api/webhook/bb/cobranca/convenio/2814485', router2814485);
app.use('/api/webhook/bb/cobranca/convenio/3061856', router3061856);

app.use('/api/painel/users', routerUsers);
app.use('/api/painel/clients', routerClients);

app.use((req, res, next) =>{
    const erro = new Error('404 - Rota não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;