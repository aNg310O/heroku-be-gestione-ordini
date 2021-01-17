const db = require("../models");
const Prodotti = db.prodotti;
const Prodottisplit = db.prodottisplit;
const Ordini = db.ordini;
const Log = db.logs;

/*#########################
    API GESTIONE PRODOTTI
  #########################*/

exports.findAllProduct = (req, res) => {
  const desc = req.query.desc;
  var condition = desc ? { desc: { $regex: new RegExp(desc), $options: "i" } } : {};
  Prodotti.find(condition).sort({ 'desc': 1 })
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

/*###############################
    API GESTIONE PRODOTTI SPLIT
  ###############################*/

  exports.findAllProductsplit = (req, res) => {
    const prodotto = req.query.prodotto;
    var condition = prodotto ? { prodotto: { $regex: new RegExp(prodotto), $options: "i" } } : {};
    Prodottisplit.find(condition).sort({ 'prodotto': 1, 'pesoTotale': 1, 'pezzatura': 1 }).collation({ locale: "en_US", numericOrdering: true })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `${err.message} - Errore nel recupero dei prodotti.`
        });
      });
  };

  exports.findProductsplit = (req, res) => {
    Prodottisplit.find().distinct('prodotto')
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `${err.message} - Errore nel recupero dei prodotti.`
        });
      });
  };

  exports.findPesosplit = (req, res) => {
    const prodotto = req.params.prodotto;
    var condition = { prodotto: { $regex: new RegExp(prodotto), $options: "i" } };
    Prodottisplit.find(condition).distinct('pesoTotale')
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `${err.message} - Errore nel recupero dei prodotti.`
        });
      });
  };
  
  exports.findPezzaturasplit = (req, res) => {
    const prodotto = req.query.prodotto;
    const peso = req.query.peso;
    Prodottisplit.find({ $and: [{ prodotto: prodotto }, { pesoTotale: peso }] }).distinct('pezzatura').collation({ locale: "en_US", numericOrdering: true })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: `${err.message} - Errore nel recupero dei prodotti.`
        });
      });
  };

  exports.createProductsplit = (req, res) => {
    if (!req.body.prodotto) {
      res.status(400).send({ message: "Il prodotto non può essere vuoto!" });
      return;
    }
    const prodotti = new Prodottisplit({
      prodotto: req.body.prodotto,
      pesoTotale: req.body.pesoTotale,
      pezzatura: req.body.pezzatura
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
  
  exports.deleteProductsplit = (req, res) => {
    const prodDaCanc = req.params.id;
    Prodottisplit.findByIdAndDelete(prodDaCanc)
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
  if ((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }
  var month;
  switch (new Date().getMonth().toString()) {
    case "0":
      month = "01";
      break; 
    case "1":
      month = "02";
      break; 
    case "2":
      month = "03";
      break; 
    case "3":
      month = "04";
      break;
    case "4":
      month = "05";
      break;
    case "5":
      month = "06";
      break;
    case "6":
      month = "07";
      break; 
    case "7":
      month = "08";
      break;
    case "8":
      month = "09";
       break; 
    case "9":
      month = "10";
      break; 
    case "10":
      month = "11";
      break; 
    case "11":
      month = "12";
      break; 
  }

  const ordini = new Ordini({
    desc: req.body.desc,
    seller: req.body.seller,
    qty: req.body.qty,
    dataInserimento: `${new Date().getFullYear()}${month}${day}`,
    pesoTotale: req.body.pesoTotale,
    grammatura: req.body.grammatura,
    pesoProdotto: req.body.pesoProdotto,
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
  if ((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }

  var month;
  switch (new Date().getMonth().toString()) {
    case "0":
      month = "01";
      break; 
    case "1":
      month = "02";
      break; 
    case "2":
      month = "03";
      break; 
    case "3":
      month = "04";
      break;
    case "4":
      month = "05";
      break;
    case "5":
      month = "06";
      break;
    case "6":
      month = "07";
      break; 
    case "7":
      month = "08";
      break;
    case "8":
      month = "09";
       break; 
    case "9":
      month = "10";
      break; 
    case "10":
      month = "11";
      break; 
    case "11":
      month = "12";
      break; 
  }

  Ordini.find({ $and: [{ dataInserimento: `${new Date().getFullYear()}${month}${day}` }, { seller: req.params.seller }] }).sort({ 'desc': 1 })
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
  if ((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }

  var month;
  switch (new Date().getMonth().toString()) {
    case "0":
      month = "01";
      break; 
    case "1":
      month = "02";
      break; 
    case "2":
      month = "03";
      break; 
    case "3":
      month = "04";
      break;
    case "4":
      month = "05";
      break;
    case "5":
      month = "06";
      break;
    case "6":
      month = "07";
      break; 
    case "7":
      month = "08";
      break;
    case "8":
      month = "09";
       break; 
    case "9":
      month = "10";
      break; 
    case "10":
      month = "11";
      break; 
    case "11":
      month = "12";
      break; 
  }
  Ordini.find({ dataInserimento: `${new Date().getFullYear()}${month}${day}` }).sort({ 'desc': 1 })
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


exports.findAllDayUser = (req, res) => {
  Ordini.find({ $and: [{ dataInserimento: req.query.orderDate }, { seller: req.query.seller }] }).sort({ 'desc': 1 })
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
exports.todayOrder = (req, res) => {
  var day;
  if ((new Date().getDate().toString().length) === 1) {
    day = "0" + new Date().getDate();
  } else {
    day = new Date().getDate();
  }

  var month;
  switch (new Date().getMonth().toString()) {
    case "0":
      month = "01";
      break; 
    case "1":
      month = "02";
      break; 
    case "2":
      month = "03";
      break; 
    case "3":
      month = "04";
      break;
    case "4":
      month = "05";
      break;
    case "5":
      month = "06";
      break;
    case "6":
      month = "07";
      break; 
    case "7":
      month = "08";
      break;
    case "8":
      month = "09";
       break; 
    case "9":
      month = "10";
      break; 
    case "10":
      month = "11";
      break; 
    case "11":
      month = "12";
      break; 
  }

  const today = String(`${new Date().getFullYear()}${month}${day}`);
  Ordini.aggregate([{
    $match: {
      dataInserimento: today
    }
  },
  {
    $group: {
      _id: {
    "desc": "$desc",
    "pesoProdotto": "$pesoProdotto",
    "pezzatura": "$grammatura"
  },
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
    }
  },
  {
    $sort:
      { _id: 1 }
  }
  ], function (err, result) {
    if (err) {
      res.send({
        message: `Non riesco ad aggregare gli ordini ${err}`
      })
    }
    res.send(result);
  }
  )
}

exports.dateOrder = (req, res) => {
  const today = String(req.params.orderDate);
  Ordini.aggregate([{
    $match: {
      dataInserimento: today
    }
  },
  {
    $group: {
      _id: {
    "desc": "$desc",
    "pesoProdotto": "$pesoProdotto",
    "pezzatura": "$grammatura"
  },
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
    }
  },
  {
    $sort:
      { _id: 1 }
  }
  ], function (err, result) {
    if (err) {
      res.send({
        message: `Non riesco ad aggregare gli ordini ${err}`
      })
    }
    res.send(result);
  }
  )
}

exports.dateOrderAll = (req, res) => {
  if (req.params.orderDate) {
    Ordini.find({ dataInserimento: req.params.orderDate }).sort({ 'desc': 1 })
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


/*#########################
         API LOGGING
  #########################*/
exports.createLog = (req, res) => {
  const line = new Log({
    severity: req.body.severity,
    username: req.body.username,
    page: req.body.page,
    text: req.body.text
  });
  line
    .save(line)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Errore nella creazione del log"
      });
    });
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
