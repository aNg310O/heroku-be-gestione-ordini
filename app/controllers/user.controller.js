const db = require("../models");
const Prodotti = db.prodotti;
const Ordini = db.ordini;

/*#########################
    API GESTIONE PRODOTTI
  #########################*/

exports.findAllProduct = (req, res) => {
  const desc = req.query.desc;
  var condition = desc ? { desc: { $regex: new RegExp(desc), $options: "i" } } : {};
  Prodotti.find(condition).sort({'desc': 1})
    .then(data => {
      res.status(200).send(data);
    })
   .catch(err => {
      res.status(500).send({
        message: `${err.message} - Errore nel recupero dei prodotti.`
      });
    });
};

exports.createProduct = (req, res) => {
  if (!req.body.desc) {
      res.status(400).send({ message: "Il prodotto non può essere vuoto!" });
      return;
    }
    const prodotti = new Prodotti({
      desc: req.body.desc,
      grammatura: req.body.grammatura,
      pesoTotale: req.body.pesoTotale
    });
    prodotti
      .save(prodotti)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `${err.message} - Errore nella creazione del prodotto.`
        });
      });
};

exports.deleteProduct = (req, res) => {
  const prodDaCanc = req.params.id;
  Prodotti.findByIdAndDelete(prodDaCanc)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `${err.message} - Non posso cancellare il prodotto ${prodDaCanc} con id=${id}`
        });
      } else {
        res.status(200).send({
          message: `Prodotto ${prodDaCanc} cancellato!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `${err.message} - Non posso cancellare il prodotto ${prodDaCanc} con id=${id}`
      });
    });
};

/*#########################
     API GESTIONE ORDINI
  #########################*/

exports.createOrdine = (req, res) => {
  if (!req.body.qty) {
      res.status(400).send({ message: "L'ordine non può essere vuoto!" });
      return;
    }
    if (!req.body.isCustom) { 
      var myQty = req.body.qty * req.body.pesoProdotto;
    } else {
      var myQty = req.body.pesoProdotto;
    }

    var day;
    if((new Date().getDate().toString().length) === 1) {
      day = "0" + new Date().getDate();
    } else {
      day = new Date().getDate();
    }

    const ordini = new Ordini({
      desc: req.body.desc,
      seller: req.body.seller,
      qty: req.body.qty,
      dataInserimento: `${new Date().getFullYear()}${new Date().getMonth() + 1}${day}`,
      pesoTotale: myQty,
      note: req.body.note,
      isCustom: req.body.isCustom
    });
    ordini
      .save(ordini)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Errore nella creazione dell'ordine."
        });
      });
};

exports.findAllTodayUser = (req, res) => {
  var day;
  if((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }
  Ordini.find({ $and: [{ dataInserimento: `${new Date().getFullYear()}${new Date().getMonth() + 1}${day}` }, { seller: req.params.seller }] }).sort({'desc': 1})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Errore nel recupero degli utenti."
      });
    });
};

exports.findAllOrdini = (req, res) => {
  var day;
  if((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }
  Ordini.find({ dataInserimento: `${new Date().getFullYear()}${new Date().getMonth() + 1}${day}` }).sort({'desc': 1})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Errore nel recupero degli ordini."
      });
    });
};

exports.deleteOrdine = (req, res) => {
  const id = req.params.id;
  Ordini.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Errore nella cancellazione dell'ordine con id=${id}. Non è stato trovato!`
        });
      } else {
        res.send({
          message: "Ordine cancellato!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Errore nella cancellazione del prodotto con id: " + id
      });
    });
};

/*#########################
     API REPORTISTICA
  #########################*/
exports.todayOrder = (req,res) => {
  var day;
  if((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }
  const today=String( `${new Date().getFullYear()}${new Date().getMonth() + 1}${day}`);
  Ordini.aggregate([{
    $match: {
      dataInserimento: today
    }
  },
    { $group: {
      _id: "$desc",
      ordini: {
        $sum: 1
      }, 
      totale: {
        $sum: "$pesoTotale"
      }, 
      qty: {
        $sum: "$qty"
      },
      dataInserimento: {
        $first: today
      }, 
    }},
    { $sort: 
      { _id: 1 }
    }
  ], function(err, result) {
    if (err) {
      res.send({
        message: `Non riesco ad aggregare gli ordini ${err}`
      })
    }
    res.send(result);
  }
  )
}

exports.dateOrder = (req,res) => {
  const today=String(req.params.orderDate);
  Ordini.aggregate([{
    $match: {
      dataInserimento: today
    }
  },
    { $group: {
      _id: "$desc",
      ordini: {
        $sum: 1
      }, 
      totale: {
        $sum: "$pesoTotale"
      }, 
      qty: {
        $sum: "$qty"
      },
      dataInserimento: {
        $first: today
      }, 
    }},
    { $sort: 
      { _id: 1 }
    }
  ], function(err, result) {
    if (err) {
      res.send({
        message: `Non riesco ad aggregare gli ordini ${err}`
      })
    }
    res.send(result);
  }
  )
}

exports.dateOrderAll = (req,res) => {
  if(req.params.orderDate) {
    Ordini.find({ dataInserimento: req.params.orderDate }).sort({'desc': 1})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Errore nel recupero degli ordini."
      });
    });
  } else {
    Ordini.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Errore nel recupero degli ordini."
      });
    });
  }
};

//TEST EXPORTS
exports.allAccess = (req, res) => {
  res.status(200).send("Benvenuto, gestisci i tuoi otdini da qui.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
