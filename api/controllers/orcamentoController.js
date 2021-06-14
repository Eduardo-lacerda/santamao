const db = require('../models');
const { success, error, validation } = require("../utils/responseApi");
const { validationResult } = require("express-validator");

var mongoose = require('mongoose');
var Orcamento = mongoose.model('Orcamento');
var nodemailer = require('nodemailer');
var remetente = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  service: "gmail",
  secure: true,
  auth:{
  user: 'atendimentosantamao@gmail.com',
  pass: 'onpedro12'},
  tls: {
    ciphers:'SSLv3'
  }
});

exports.criarOrcamento = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json(validation(errors.array()));
    try {
        var novoOrcamento = new Orcamento(req.body);

        await novoOrcamento.save();
        var message = 'Nome: ' + novoOrcamento.nome +'\nEmail: ' + novoOrcamento.email + '\nBairro: ' + novoOrcamento.bairro
        + '\nTelefone: ' + novoOrcamento.telefone +'\nComentário Extra: ' + novoOrcamento.comentario
        + '\nTipo de Limpeza: ' + novoOrcamento.limpeza +'\nTipo de Imóvel: ' + novoOrcamento.imovel
        + '\nQuartos: ' + novoOrcamento.quartos +'\nBanheiros: ' + novoOrcamento.banheiros
        + '\nSalas: ' + novoOrcamento.salas;

        if(novoOrcamento.imovel == 'Casa') {
          message = message + '\nAndares: ' + novoOrcamento.andares +'\nÁrea Externa: ' + (novoOrcamento.areaExterna? 'Sim': 'Não')
        }

        message = message + '\n\nServiços Extras: \nExtra Banheiro: ' + novoOrcamento.extraBanheiro
        + '\nExtra Cozinha Chão: ' + novoOrcamento.extraCozinhaChao +'\nExtra Quarto: ' + novoOrcamento.extraQuarto
        + '\nExtra Cozinha Limpeza Interna: ' + novoOrcamento.extraCozinhaInterna +'\nExtra Cozinha Paredes: ' + novoOrcamento.extraCozinhaParedes
        + '\nExtra Churrasqueira: ' + novoOrcamento.extraChurrasqueira +'\n\n\nPreço Total: ' + novoOrcamento.preco;

        var emailASerEnviado = {
          from: 'atendimentosantamao@gmail.com',
          to: 'atendimentosantamao@gmail.com',
          subject: 'Orçamento '+novoOrcamento.nome,
          text: message
        }

        remetente.sendMail(emailASerEnviado, function(error){
          if (error) {
            console.log(error);
          }
          else {
            console.log('Email enviado com sucesso.');
          }
        });

        res.status(201).json(
            success(
                "orçamento criado com sucesso",
                {
                    id: novoOrcamento._id,
                    nome: novoOrcamento.nome,
                    email: novoOrcamento.email,
                    bairro: novoOrcamento.bairro,
                    telefone: novoOrcamento.telefone,
                    comentario: novoOrcamento.comentario,
                    limpeza: novoOrcamento.limpeza,
                    imovel: novoOrcamento.imovel,
                    quartos: novoOrcamento.quartos,
                    banheiros: novoOrcamento.banheiros,
                    salas: novoOrcamento.salas,
                    andares: novoOrcamento.andares,
                    areaExterna: novoOrcamento.areaExterna,
                    extraBanheiro: novoOrcamento.extraBanheiro,
                    extraQuarto: novoOrcamento.extraQuarto,
                    extraCozinhaChao: novoOrcamento.extraCozinhaChao,
                    extraCozinhaInterna: novoOrcamento.extraCozinhaInterna,
                    extraCozinhaParedes: novoOrcamento.extraCozinhaParedes,
                    extraChurrasqueira: novoOrcamento.extraChurrasqueira,
                    preco: novoOrcamento.preco,
                    criadoEm: novoOrcamento.criadoEm
                },
                res.statusCode
            )
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json(error("Server error", res.statusCode));
    }
};
