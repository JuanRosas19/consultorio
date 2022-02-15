const URL = 'http://localhost:3000/api/';

const tiposDeSangre = [
  'A +',
  'A -',
  'B +',
  'B -',
  'O +',
  'O -',
  'AB +',
  'AB -',
];
const generoPaciente = ['Femenino', 'Masculino', 'Otro'];

const tiposConsulta = {
  Niño: 'Consulta para niños',
  Adulto: 'Consulta para personas adultas',
  'Tercera Edad': 'Consulta para adultos mayores',
};
const tiposConsultaSelect = {
  'Consulta para niños': 'Niño',
  'Consulta para personas adultas': 'Adulto',
  'Consulta para adultos mayores': 'Tercera Edad',
};

export {
  URL,
  tiposDeSangre,
  generoPaciente,
  tiposConsulta,
  tiposConsultaSelect,
};
