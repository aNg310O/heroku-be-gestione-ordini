const mongoose = require("mongoose");
    var schema = mongoose.Schema(
        {
          desc: String,
          grammatura: Number,
          pesoTotale: Number
        },
        { timestamps: true }
      );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
  
    const Prodotti = mongoose.model("prodotti", schema);
    module.exports = Prodotti;