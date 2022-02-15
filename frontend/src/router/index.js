import Vue from 'vue';
import VueRouter from 'vue-router';
import Pacientes from '../views/Pacientes.vue';
import PacienteAgregar from '../views/PacienteAgregar.vue';
import PacienteEditar from '../views/PacienteEditar.vue';
import Consultas from '../views/Consultas.vue';
import ConsultaCrear from '../views/ConsultaCrear.vue';
import ConsultaEditar from '../views/ConsultaEditar.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Pacientes',
    component: Pacientes,
  },
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas,
  },
  {
    path: '/paciente-crear',
    name: 'PacienteAgregar',
    component: PacienteAgregar,
  },
  {
    path: '/paciente-editar/:id',
    name: 'PacienteEditar',
    component: PacienteEditar,
  },
  {
    path: '/consulta-crear',
    name: 'ConsultaCrear',
    component: ConsultaCrear,
  },
  {
    path: '/consulta-editar/:id',
    name: 'ConsultaEditar',
    component: ConsultaEditar,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
