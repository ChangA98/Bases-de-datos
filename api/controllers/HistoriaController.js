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
    var fumador;
    var diabetes;
    var intervenido;
    var hipertenso;
    if (req.param('fumador') == 'on') {
      fumador = 1;
    }
    else {
      fumador = 0;
    }
    if (req.param('diabetico') == 'on') {
      diabetes = 1;
    }
    else {
      diabetes = 0;
    }
    if (req.param('intervenido') == 'on') {
      intervenido = 1;
    }
    else {
      intervenido = 0;
    }
    if (req.param('hipertenso') == 'on') {
      hipertenso = 1;
    }
    else {
      hipertenso = 0;
    }
    Paciente.findOne(req.param('paciente')).exec(function(err, paciente){
      Medico.findOne(req.param('medico')).exec(function(err, medico){
         Historia.create({
          fechaHist: req.param('fechaHist'),
          sintomas: req.param('sintoma'),
          peso: req.param('peso'),
          estatura: req.param('estatura'),
          notas: req.param('notas'),
          diagnostico: req.param('diagnostico'),
          referidoPor: '10000',
          diabetes: diabetes,
          intervenido: intervenido,
          hipertenso: hipertenso,
          fumador: fumador
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
    Historia.find(req.param('id'), function(err, historia){
      res.view({
        historia: historia
      })
    });
  },

  refrescar: function(req, res) {
    var fumador;
    var diabetes;
    var intervenido;
    var hipertenso;
    if (req.param('fumador') == 'on') {
      fumador = 1;
    }
    else {
      fumador = 0;
    }
    if (req.param('diabetico') == 'on') {
      diabetes = 1;
    }
    else {
      diabetes = 0;
    }
    if (req.param('intervenido') == 'on') {
      intervenido = 1;
    }
    else {
      intervenido = 0;
    }
    if (req.param('hipertenso') == 'on') {
      hipertenso = 1;
    }
    else {
      hipertenso = 0;
    }
    Historia.update(req.param('id'), {
      fechaHist: req.param('fechaHist'),
      sintomas: req.param('sintomas'),
      peso: req.param('peso'),
      estatura: req.param('estatura'),
      notas: req.param('notas'),
      diagnostico: req.param('diagnostico'),
      referidoPor: '10000',
      diabetes: diabetes,
      intervenido: intervenido,
      hipertenso: hipertenso,
      fumador: fumador
    }, function(err){
      if (err) sails.log(err);
      res.redirect('back');
    });
  },

  bye: function(req, res) {
    Tiene.find(req.param('id')).exec(function(err, tiene){
      if (err) sails.log(err);
      if (tiene) {
        Tiene.destroy({historia: req.param('id')}).exec(function(err, tiene2){
          if (err) sails.log(err);
        });
        Describe.find({historia: req.param('id')}).exec(function(err, describe){
          if (err) sails.log(err);
          if (describe) {
            Describe.destroy({historia: req.param('id')}).exec(function(err, describe2){
              if (err) sails.log(err);
            });
          }
          Historia.destroy(req.param('id')).exec(function(err, historia){
            if (err) sails.log(err);
            res.redirect('back');
          });
        });
      }
      else {
        res.redirect('/500');
      }
    });
  },
};

