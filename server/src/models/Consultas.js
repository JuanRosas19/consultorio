const { Schema, model } = require('mongoose');

const consultasSchema = new Schema({
  tipoConsulta: {
    type: String,
    enum: ['Niño', 'Adulto', 'Tercera Edad'],
    required: true,
  },
  enfermedad: {
    type: String,
    required: true,
  },
  pacienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Pacientes',
    required: true,
  },

  fecha: {
    type: Date,
    default: Date.now,
    required: false,
  },
  observacion: {
    required: true,
    type: String,
  },
});

module.exports = model('Consultas', consultasSchema);
