const db = require('../models');
const { success, error, validation } = require("../utils/responseApi");
const { validationResult } = require("express-validator");

var mongoose = require('mongoose');
var Orcamento = mongoose.model('Orcamento');
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      '850242234526-d0e0c9legc7kv52lncufa2ft6brcg841.apps.googleusercontent.com',
      'QByRZoAj6QEAJx3wK4_TB-Ub',
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: '1//04B-ULrZwszCTCgYIARAAGAQSNwF-L9IrI_VKsm_vDHHjpwMf41KN8YmieBjNf7SdoACY73w9CdhJSnCWGDtjA_Oz1csjZW7hKBg'
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: 'atendimentosantamao@gmail.com',
        accessToken,
        clientId: '850242234526-d0e0c9legc7kv52lncufa2ft6brcg841.apps.googleusercontent.com',
        clientSecret: 'QByRZoAj6QEAJx3wK4_TB-Ub',
        refreshToken: '1//04B-ULrZwszCTCgYIARAAGAQSNwF-L9IrI_VKsm_vDHHjpwMf41KN8YmieBjNf7SdoACY73w9CdhJSnCWGDtjA_Oz1csjZW7hKBg'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    return transporter;
  }
  catch(e) {
    console.log('----------------------------------------------------')
    console.log(e);
    console.log('----------------------------------------------------')
  }
};


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
          from: 'eduardolacerda2@outlook.com',
          to: 'atendimentosantamao@gmail.com',
          subject: 'Orçamento '+novoOrcamento.nome,
          text: message
        }

        const sendEmail = async (emailOptions) => {
          try {
            let emailTransporter = await createTransporter();
            await emailTransporter.sendMail(emailOptions, (function(error){
              if (error) {
                console.log(error);
              }
              else {
                console.log('Email enviado com sucesso.');
              }
            }));
          }
          catch (e) {
            console.log(e)
          }
        };

        sendEmail(emailASerEnviado);

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
