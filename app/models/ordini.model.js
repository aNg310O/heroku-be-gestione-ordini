const mongoose = require("mongoose");
    var schema = mongoose.Schema(
      {
        desc: String,
        seller: String,
        dataInserimento: String,
        qty: Number,
        grammatura: Number,
        pesoTotale: Number,
        note: String,
        isCustom: Boolean     
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
  
    const Ordini = mongoose.model("ordini", schema);
    module.exports = Ordini;