const mongoose = require("mongoose");
    var schema = mongoose.Schema(
        {
          prodotto: {type: String, index: true},
          pesoTotale: {type: Number, index: true},
          pezzatura: {type: String, index: true}
        },
        { timestamps: true }
      );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
  
    const Prodottisplit = mongoose.model("prodottisplit", schema);
    module.exports = Prodottisplit;