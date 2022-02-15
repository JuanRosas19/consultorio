<template>
  <div class="contenedor-formulario">
    <button
      title="Regresar en el historial de navegación"
      class="btn btn-secondary btn-regresar"
      @click="$router.go(-1)"
    >
      <i class="fa-solid fa-arrow-left"></i> Regresar
    </button>
    <div class="contenedor">
      <form class="formulario" @submit.prevent="agregarConsulta">
        <span class="formulario-titulo">
          Crear consulta <i class="fa-solid fa-book-medical"></i>
        </span>

        <div class="contenedor-input background width-50">
          <span class="label">Seleccione el Tipo de consulta</span>
          <select v-model.trim="consulta.tipoConsulta" required>
            <option selected value="" disabled>
              Tipo de consulta a registrar
            </option>
            <option
              v-for="tipo in tiposConsulta"
              :key="tipo"
              :value="tiposConsultaSelect[tipo]"
            >
              {{ tipo }}
            </option>
          </select>
        </div>

        <div class="contenedor-input background width-50">
          <span class="label">Enfermedad del paciente</span>
          <input
            v-model.trim="consulta.enfermedad"
            class="input-style"
            type="text"
            placeholder="Sintomas que presenta"
          />
        </div>
        <div class="contenedor-input background">
          <span class="label">Seleccione el paciente</span>
          <select v-model="consulta.pacienteId" required>
            <option selected value="" disabled>
              Paciente que presenta los sintomas
            </option>
            <option
              v-for="paciente in pacientes"
              :key="paciente._id"
              :value="paciente._id"
            >
              {{ paciente.nombre }} {{ paciente.apellido }}. V-{{
                paciente.identificacion
              }}
            </option>
          </select>
        </div>

        <div class="contenedor-input background">
          <span class="label">Observación</span>
          <textarea
            v-model.trim="consulta.observacion"
            required
            class="input-style"
            placeholder="Observaciones de la consulta..."
          ></textarea>
        </div>

        <div class="contenedor-formulario-form-btn">
          <button class="formulario-btn" type="submit">
            <span>
              Agregar consulta
              <i class="fa-solid fa-laptop-medical"></i>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { tiposConsulta, tiposConsultaSelect } from "../constantes/main";
import { obtenerPacientes } from "../servicios/pacientes/index";
import { consultaCrear } from "../servicios/consultas/index";
export default {
  name: "ConsultaCrear",
  data() {
    return {
      pacientes: [],
      tiposConsulta,
      tiposConsultaSelect,
      consulta: {
        tipoConsulta: "",
        enfermedad: "",
        pacienteId: "",
        observacion: "",
      },
    };
  },
  mounted() {
    this.obtenerPacientesSelect();
  },
  methods: {
    async obtenerPacientesSelect() {
      try {
        const response = await obtenerPacientes();
        const pacientes = await response.json();
        if (!pacientes.length)
          return Swal.fire(
            "Advertencia!",
            "No hay pacientes registrados. Debes registrar uno para crear la cita",
            "warning"
          );
        this.pacientes = pacientes;
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error obteniendo los pacientes",
          "error"
        );
      }
    },
    async agregarConsulta() {
      if (Object.values(this.consulta).includes("")) {
        return Swal.fire(
          "Campos oblígatorios",
          "Todos los datos son requeridos",
          "warning"
        );
      }
      try {
        const response = await consultaCrear(this.consulta);
        const { message } = await response.json();
        if (message.endsWith("correctamente")) {
          Swal.fire(
            "Éxito!",
            "Consulta regitrada satisfactoriamente",
            "success"
          );
          setTimeout(() => {
            this.$router.push("/consultas");
          }, 2000);
          return;
        }
        Swal.fire(
          "Advertencia!",
          "La consulta no pudo ser registrada. " + message,
          "warning"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "Ocurrió un error registrando la consulta",
          "error"
        );
      }
    },
  },
};
</script>

<style>
form {
  background: #dfdfdf;
  padding: 4em;
  border-radius: 4em;
}
</style>