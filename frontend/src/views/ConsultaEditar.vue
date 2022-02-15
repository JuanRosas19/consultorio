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
      <form class="formulario" @submit.prevent="editarConsulta">
        <span class="formulario-titulo">
          Modificar consulta <i class="fa-solid fa-rotate"></i>
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
              Actualizar consulta
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
import { obtenerConsulta, consultaEditar } from "../servicios/consultas/index";
export default {
  name: "ConsultaEditar",
  data() {
    return {
      tiposConsulta,
      tiposConsultaSelect,
      consulta: {
        tipoConsulta: "",
        enfermedad: "",
        observacion: "",
      },
    };
  },
  mounted() {
    this.obtenerConsultaId();
  },
  methods: {
    async obtenerConsultaId() {
      try {
        const response = await obtenerConsulta(this.$route.params.id);
        this.consulta = await response.json();
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error obteniendo los datos de la consulta a editar",
          "error"
        );
      }
    },
    async editarConsulta() {
      if (Object.values(this.consulta).includes("")) {
        return Swal.fire(
          "Campos oblígatorios",
          "Todos los datos son requeridos",
          "warning"
        );
      }
      try {
        const response = await consultaEditar(
          this.$route.params.id,
          this.consulta
        );
        const { message } = await response.json();
        if (message.endsWith("correctamente")) {
          Swal.fire("Éxito!", "Consulta actualizada correctmente", "success");
          setTimeout(() => {
            this.$router.push("/consultas");
          }, 2000);
          return;
        }
        Swal.fire(
          "Advertencia!",
          "La consulta no pudo ser actualizada. " + message,
          "warning"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "Ocurrió un error actualizando la consulta",
          "error"
        );
      }
    },
  },
};
</script>