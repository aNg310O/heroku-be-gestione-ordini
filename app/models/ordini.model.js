const mongoose = require("mongoose");
    var schema = mongoose.Schema(
      {
        desc: String,
        seller: String,
        dataInserimento: String,
        qty: Number,
        grammatura: String,
        pesoTotale: Number,
        pesoProdotto: Number,
        note: String,
        isCustom: Boolean     
      },
      { timestamps: true }
    );

    schema.index({dataInserimento: 1, desc: 1});
    schema.index({dataInserimento: 1, seller: 1});
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
  
    const Ordini = mongoose.model("ordini", schema);
    module.exports = Ordini;