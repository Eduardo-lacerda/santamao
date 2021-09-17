module.exports = (mongoose) => {
    const leadSchema = new mongoose.Schema({
        email: {
            type: String,
        },
        telefone: {
            type: String,
        },
        nome: {
            type: String,
        },
        criadoEm: {
            type: Date,
            default: Date.now(),
        },
    });
  
    const Lead = mongoose.model("Lead", leadSchema);
    return Lead;
  };
  