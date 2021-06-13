module.exports = (mongoose) => {
  const orcamentoSchema = new mongoose.Schema({
      nome: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
      },
      email: {
          type: String,
          required: true,
          unique: false,
          minlength: 5,
          maxlength: 255,
      },
      bairro: {
        type: String,
        required: true,
      },
      telefone: {
        type: String,
        required: true,
      },
      comentario: {
        type: String,
        required: true,
      },
      limpeza: {
        type: [{
            type: String,
            enum: ['Expressa', 'Pesada']
        }],
        default: 'Expressa'
      },
      imovel: {
        type: [{
            type: String,
            enum: ['Casa', 'Apartamento']
        }],
        default: 'Casa'
      },
      quartos: {
        type: Number,
      },
      banheiros: {
        type: Number,
      },
      salas: {
        type: Number,
      },
      andares: {
        type: Number,
      },
      areaExterna: {
        type: Boolean,
      },
      extraBanheiro: {
        type: Boolean,
      },
      extraQuarto: {
        type: Boolean,
      },
      extraCozinhaChao: {
        type: Boolean,
      },
      extraCozinhaInterna: {
        type: Boolean,
      },
      extraCozinhaParedes: {
        type: Boolean,
      },
      extraChurrasqueira: {
        type: Boolean
      },
      preco: {
        type: Number
      },
      criadoEm: {
          type: Date,
          default: Date.now(),
      },
  });

  const Orcamento = mongoose.model("Orcamento", orcamentoSchema);
  return Orcamento;
};
