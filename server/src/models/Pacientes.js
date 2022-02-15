const { Schema, model } = require('mongoose');

const pacientesSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  sexo: {
    type: String,
    required: true,
  },
  tipoSangre: {
    type: String,
    required: true,
  },
  alergias: {
    type: String,
    required: true,
  },
});

module.exports = model('Pacientes', pacientesSchema);
