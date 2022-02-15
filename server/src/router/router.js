const express = require('express');
const router = express.Router();
const {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  buscadorDePacientes,
  getConsultas,
  getConsulta,
  getConsultaByTipo,
  getConsultaByPaciente,
  createConsulta,
  deleteConsulta,
  updateConsulta,
  getConsultaByFecha,
} = require('../controller/controller');

// Pacientes
router.get('/pacientes', getPacientes);
router.get('/paciente/:id', getPaciente);
router.post('/crear-paciente', createPaciente);
router.put('/actualizar-paciente/:id', updatePaciente);
router.delete('/eliminar-paciente/:id', deletePaciente);
router.get('/buscador-pacientes/:nombre', buscadorDePacientes);

// Consultas
router.get('/consultas', getConsultas);
router.get('/consulta/:id', getConsulta);
router.get('/consulta-tipo/:tipo', getConsultaByTipo);
router.get('/consulta-paciente/:id', getConsultaByPaciente);
router.get('/consulta-fecha/:fecha', getConsultaByFecha);
router.post('/crear-consulta', createConsulta);
router.delete('/eliminar-consulta/:id', deleteConsulta);
router.put('/actualizar-consulta/:id', updateConsulta);

module.exports = router;
