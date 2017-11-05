/**
 * HistoriaController
 *
 * @description :: Server-side logic for managing Historias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  nuevo: function(req, res) {
    var pacientes = req.param('id').substring(0,1);
    var medicos = req.param('id').substring(2);
    Paciente.findOne(pacientes).exec(function(err, paciente){
      Medico.findOne(medicos).exec(function(err, medico){
        res.view({
          paciente: paciente,
          medico: medico
        });
      });
    });
  },

  'new': function(req, res) {
    Paciente.findOne(req.param('paciente')).exec(function(err, paciente){
      Medico.findOne(req.param('medico')).exec(function(err, medico){
         Historia.create({
          fechaHist: req.param('fechaHist'),
          sintomas: req.param('sintoma'),
          peso: req.param('peso'),
          estatura: req.param('estatura'),
          notas: req.param('notas'),
          diagnostico: req.param('diagnostico')
         }).exec(function(err, historia){
           Tiene.create({
             paciente: paciente.id,
             medico: medico.id,
             historia: historia.id
           }).exec(function(err) {
             if (err) sails.log(err);
             res.redirect('back');
           })
         });
      });
    });
  },

  delete: function(req, res) {
    var object = req[0];
    _.forEach(object, Historia.destroy({id: object.Historia_idHistoria}, function(err){
      if (err) sails.log(err);
      return;
    }));
  },

  editar: function(req, res) {
    Historia.find(req.params.all(), function(err, historia){
      res.view({
        historia: historia
      })
    });
  },

  refrescar: function(req, res) {
    Historia.update(req.param('id'), req.params.all(), function(err){
      if (err) sails.log(err);
      res.redirect('back');
    });
  },

  bye: function(req, res) {
    Tiene.find({historia: req.param('id')}).exec(function (err, tiene) {
      Tiene.destroy({
        paciente: tiene[0].paciente,
        medico: tiene[0].medico,
        historia: tiene[0].historia
      }).exec( function (err) {
        if (err) sails.log(err);
        Describe.find(req.param('id')).exec(function (err, describe){
          if (JSON.stringify(describe).length > 2) {
            Describe.destroy({
              historia: describe[0].historia,
              patologia: describe[0].patologia
            }).exec(function (err) {
              Historia.destroy(req.params.all(), function (err) {
                if (err) sails.log(err);
              });
            });
          }
          else {
            Historia.destroy(req.params.all(), function (err) {
              if (err) sails.log(err);
            });
          }
        });
      });
    });

    Describe.find({historia: req.param('id')}).exec( function(err, describe) {
      _.forEach(describe[0], Describe.destroy({historia: describe.historia} , function(err)  {
        if (err) sails.log(err);
      }));
    });
    Historia.destroy({id: req.param('id')}).exec(function(err) {
      if (err) sails.log(err);
    });
    res.redirect('back');
  }

};

