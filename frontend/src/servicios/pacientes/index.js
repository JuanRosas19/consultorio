import { URL } from '../../constantes/main';
const obtenerPacientes = () => {
  return fetch(URL + 'pacientes');
};

const eliminarPaciente = (id) => {
  return fetch(URL + 'eliminar-paciente/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const crearPaciente = (datosPaciente) => {
  return fetch(URL + 'crear-paciente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosPaciente),
  });
};

const obtenerPaciente = (pacienteId) => {
  return fetch(URL + 'paciente/' + pacienteId);
};

const actualizarPaciente = (pacienteId, datosPaciente) => {
  return fetch(URL + 'actualizar-paciente/' + pacienteId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosPaciente),
  });
};

const buscarPacientesPorNombre = (nombre) => {
  return fetch(URL + 'buscador-pacientes/' + nombre);
};
export {
  obtenerPacientes,
  eliminarPaciente,
  crearPaciente,
  obtenerPaciente,
  actualizarPaciente,
  buscarPacientesPorNombre,
};
