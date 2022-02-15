const Pacientes = require('../models/Pacientes');
const Consultas = require('../models/Consultas');

const getPacientes = async (req, res) => {
  try {
    const pacientes = await Pacientes.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los pacientes',
    });
  }
};
const getPaciente = async (req, res) => {
  try {
    const paciente = await Pacientes.findById(req.params.id);
    res.json(paciente);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el paciente',
    });
  }
};

const createPaciente = async (req, res) => {
  try {
    const paciente = new Pacientes(req.body);
    await paciente.save();
    res.json({
      message: 'Paciente creado correctamente',
      paciente,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el paciente',
      error,
    });
  }
};

const updatePaciente = async (req, res) => {
  try {
    /* En caso el paciente actualice su edad, se debe actualizar el tipoConsulta en caso existan consultas asociadas al pacient */
    let message = 'Paciente actualizado correctamente';
    const paciente = await Pacientes.findById(req.params.id);
    if (paciente.edad !== req.body.edad) {
      const consultas = await Consultas.find({ pacienteId: req.params.id });
      if (consultas.length > 0) {
        if (req.body.edad < 18) {
          await Consultas.updateMany(
            { paciente: req.params.id },
            { $set: { tipoConsulta: 'Niño' } }
          );
        } else if (req.body.edad >= 18 && req.body.edad < 60) {
          await Consultas.updateMany(
            { paciente: req.params.id },
            { $set: { tipoConsulta: 'Adulto' } }
          );
        } else if (req.body.edad >= 60) {
          await Consultas.updateMany(
            { paciente: req.params.id },
            { $set: { tipoConsulta: 'Tercera Edad' } }
          );
        }
        message =
          'Paciente y tipos de consultas asociadas al cliente han sido actualizadas correctamente';
      }
    }
    await Pacientes.findByIdAndUpdate(req.params.id, req.body);
    return res.json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el paciente',
      error,
    });
  }
  const paciente = await Pacientes.findByIdAndUpdate(req.params.id, req.body);
  res.json({
    message: 'Paciente actualizado correctamente',
    paciente,
  });
};

const deletePaciente = async (req, res) => {
  try {
    await Consultas.deleteMany({ pacienteId: req.params.id });
    await Pacientes.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Paciente y citas eliminadas correctamente',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el paciente',
    });
  }
};

const getConsultas = async (req, res) => {
  try {
    const consultas = await Consultas.find().populate('pacienteId');
    res.json(consultas);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las consultas',
    });
  }
};
const getConsulta = async (req, res) => {
  try {
    const consulta = await Consultas.findById(req.params.id).populate(
      'pacienteId'
    );
    res.json(consulta);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la consulta',
    });
  }
};

const getConsultaByTipo = async (req, res) => {
  try {
    const consulta = await Consultas.find({
      tipoConsulta: req.params.tipo,
    }).populate('pacienteId');
    res.json(consulta);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la consulta',
      error,
    });
  }
};

const getConsultaByPaciente = async (req, res) => {
  try {
    const consulta = await Consultas.find({
      pacienteId: req.params.id,
    }).populate('pacienteId');
    res.json(consulta);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la consulta',
      error,
    });
  }
};
const getConsultaByFecha = async (req, res) => {
  try {
    let consultas = await Consultas.find().populate('pacienteId');
    consultas = consultas.filter(
      (consulta) =>
        new Date(consulta.fecha).toISOString().substring(0, 10) ===
        req.params.fecha
    );
    res.json(consultas);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la consulta',
      error,
    });
  }
};

const buscadorDePacientes = async (req, res) => {
  try {
    const pacientes = await Pacientes.find({
      nombre: { $regex: req.params.nombre, $options: 'i' },
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los pacientes',
      error,
    });
  }
};

const createConsulta = async (req, res) => {
  const { observacion, pacienteId, enfermedad, tipoConsulta } = req.body;
  try {
    /* 
      En caso el tipoConsulta sea tercera edad o niño. Comprueba la edad del paciente seleccionado
    */
    const paciente = await Pacientes.findById(pacienteId);
    if (tipoConsulta === 'Tercera Edad') {
      if (paciente.edad >= 60) {
        const consulta = new Consultas({
          observacion,
          pacienteId,
          enfermedad,
          tipoConsulta,
        });
        await consulta.save();
        return res.json({
          message: 'Consulta creada correctamente',
          consulta,
        });
      } else {
        return res.status(500).json({
          message:
            'El paciente debe ser mayor a 60 años para realizar la consulta de tercera edad',
        });
      }
    }
    if (tipoConsulta === 'Niño') {
      if (paciente.edad < 18) {
        const consulta = new Consultas({
          observacion,
          pacienteId,
          enfermedad,
          tipoConsulta,
        });
        await consulta.save();
        return res.json({
          message: 'Consulta creada correctamente',
          consulta,
        });
      } else {
        return res.status(500).json({
          message:
            'El paciente debe ser menor a 18 años para realizar la consulta de niño',
        });
      }
    }
    if (tipoConsulta === 'Adulto') {
      if (paciente.edad >= 18 && paciente.edad < 60) {
        const consulta = new Consultas({
          observacion,
          pacienteId,
          enfermedad,
          tipoConsulta,
        });
        await consulta.save();
        return res.json({
          message: 'Consulta creada correctamente',
          consulta,
        });
      } else {
        return res.status(500).json({
          message:
            'El paciente debe ser mayor a 18 años y menor a 60 años para realizar la consulta de adulto',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la consulta',
      error,
    });
  }
};
const deleteConsulta = async (req, res) => {
  try {
    await Consultas.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Consulta eliminada correctamente',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar la Consulta',
      error,
    });
  }
};
const updateConsulta = async (req, res) => {
  try {
    /* Verificar que el tipoConsulta corresponda con la edad del paciente */
    const { tipoConsulta } = req.body;
    const { pacienteId } = await Consultas.findById(req.params.id).populate(
      'pacienteId'
    );
    if (tipoConsulta === 'Tercera Edad') {
      if (pacienteId.edad >= 60) {
        const consulta = await Consultas.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        res.json({
          message: 'Consulta actualizada correctamente',
          consulta,
        });
      } else {
        res.status(500).json({
          message:
            'El paciente debe ser mayor a 60 años para realizar la consulta de tercera edad',
        });
      }
    }
    if (tipoConsulta === 'Niño') {
      if (pacienteId.edad < 18) {
        const consulta = await Consultas.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        res.json({
          message: 'Consulta actualizada correctamente',
          consulta,
        });
      } else {
        res.status(500).json({
          message:
            'El paciente debe ser menor a 18 años para realizar la consulta de niño',
        });
      }
    }
    if (tipoConsulta === 'Adulto') {
      if (pacienteId.edad >= 18 && pacienteId.edad < 60) {
        const consulta = await Consultas.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        res.json({
          message: 'Consulta actualizada correctamente',
          consulta,
        });
      } else {
        res.status(500).json({
          message:
            'El paciente debe ser mayor a 18 años y menor a 60 años para realizar la consulta de adulto',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la consulta',
      error,
    });
  }
};
module.exports = {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getConsultas,
  getConsulta,
  getConsultaByTipo,
  getConsultaByPaciente,
  buscadorDePacientes,
  createConsulta,
  deleteConsulta,
  updateConsulta,
  getConsultaByFecha,
};
