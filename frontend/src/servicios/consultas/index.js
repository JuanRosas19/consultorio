import { URL } from '../../constantes/main';

const obtenerConsultas = () => {
  return fetch(URL + 'consultas');
};

const consultaEliminar = (id) => {
  return fetch(URL + 'eliminar-consulta/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const consultaCrear = (datosConsulta) => {
  return fetch(URL + 'crear-consulta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosConsulta),
  });
};

const obtenerConsulta = (id) => {
  return fetch(URL + 'consulta/' + id);
};

const consultaEditar = (consultaId, datosConsulta) => {
  return fetch(URL + 'actualizar-consulta/' + consultaId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosConsulta),
  });
};
const buscarConsultasPorTipo = (tipo) => {
  return fetch(URL + '/consulta-tipo/' + tipo);
};
const buscarConsultasPorPaciente = (pacienteId) => {
  return fetch(URL + 'consulta-paciente/' + pacienteId);
};
const buscarConsultasPorFecha = (fecha) => {
  return fetch(URL + 'consulta-fecha/' + fecha);
};
export {
  obtenerConsultas,
  consultaEliminar,
  consultaCrear,
  obtenerConsulta,
  consultaEditar,
  buscarConsultasPorTipo,
  buscarConsultasPorPaciente,
  buscarConsultasPorFecha,
};
