<template>
  <div class="container">
    <div>
      <div>
        <div class="container-filtros">
          <div class="row">
            <div class="d-flex justify-between">
              <button
                class="btn rounded btn-secondary"
                @click="
                  buscarPorTipoConsulta = '';
                  buscarPorPaciente = '';
                  buscarPorFecha = '';
                  obtenerConsultas();
                "
              >
                <i class="fa-solid fa-list"></i> Todos
              </button>
              <select
                @change="actualizarConsultas('tipo')"
                v-model="buscarPorTipoConsulta"
                class="width-25"
              >
                <option value="" disabled selected>
                  Seleccionar tipo de consulta
                </option>
                <option
                  v-for="consulta in tiposConsulta"
                  :key="consulta"
                  :value="tiposConsultaSelect[consulta]"
                >
                  {{ consulta }}
                </option>
              </select>
              <select
                @change="actualizarConsultas('paciente')"
                v-model="buscarPorPaciente"
                class="width-25"
              >
                <option value="" disabled selected>
                  Seleccionar tipo de pacientes
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
              <input
                type="date"
                v-model="buscarPorFecha"
                @change="buscarConsultasFecha"
              />
            </div>
          </div>
        </div>
        <h1 class="titulo">Consultas disponibles</h1>
      </div>
      <template v-if="consultas && consultas.length">
        <div class="contenedor-tabla">
          <table class="tabla">
            <thead>
              <tr>
                <th>Tipo consulta</th>
                <th>Padecimiento</th>
                <th>Paciente</th>
                <th>Sexo / Edad / Identificacion</th>
                <th>Alergías / T. Sangre</th>
                <th>Observación</th>
                <th>Fecha Consulta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="consulta in consultas" :key="consulta._id">
                <td>
                  {{
                    tiposConsulta[consulta.tipoConsulta] ||
                    "Consulta no especifícada"
                  }}
                </td>
                <td>{{ consulta.enfermedad }}</td>
                <td>
                  {{ consulta.pacienteId.nombre }}
                  {{ consulta.pacienteId.apellido }}
                </td>
                <td>
                  {{ consulta.pacienteId.sexo }} /
                  {{ consulta.pacienteId.edad }} años / CI:
                  {{ consulta.pacienteId.identificacion }}
                </td>
                <td>
                  {{ consulta.pacienteId.alergias }} /
                  {{ consulta.pacienteId.tipoSangre }}
                </td>
                <td>
                  {{
                    consulta.observacion.length > 20
                      ? consulta.observacion.substring(0, 20) + "..."
                      : consulta.observacion
                  }}
                </td>
                <td>
                  {{ new Date(consulta.fecha).toISOString().substring(0, 10) }}
                </td>
                <td>
                  <button
                    title="Editar cita"
                    class="btn btn-primary"
                    @click="
                      $router.push({
                        name: 'ConsultaEditar',
                        params: { id: consulta._id },
                      })
                    "
                  >
                    <i class="fa-solid fa-file-medical"></i>
                  </button>
                  <button
                    title="Eliminar cita"
                    class="btn btn-danger margin-left"
                    @click="eliminarConsulta(consulta._id)"
                  >
                    <i class="fa-solid fa-file-medical"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <p class="text-center text-muted margin-top">
          No existen consultas registrados actualmente. Navega a "Crear
          Consulta"
          <i class="fa-solid fa-book-medical"></i>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import {
  obtenerConsultas,
  consultaEliminar,
  buscarConsultasPorTipo,
  buscarConsultasPorPaciente,
  buscarConsultasPorFecha,
} from "../servicios/consultas/index";
import { obtenerPacientes } from "../servicios/pacientes/index";
import { tiposConsulta, tiposConsultaSelect } from "../constantes/main";
export default {
  name: "Consultas",
  data() {
    return {
      consultas: [],
      pacientes: [],
      tiposConsulta,
      tiposConsultaSelect,
      buscarPorTipoConsulta: "",
      buscarPorPaciente: "",
      buscarPorFecha: "",
    };
  },
  mounted() {
    this.obtenerConsultas();
    this.obtenerPacientes();
  },
  methods: {
    async actualizarConsultas(filtro) {
      try {
        if (this.buscarPorTipoConsulta.length && filtro === "tipo") {
          const response = await buscarConsultasPorTipo(
            this.buscarPorTipoConsulta
          );
          const consultas = await response.json();
          this.consultas = consultas;
          return;
        }
        if (this.buscarPorPaciente.length && filtro === "paciente") {
          const response = await buscarConsultasPorPaciente(
            this.buscarPorPaciente
          );
          const consultas = await response.json();
          this.consultas = consultas;
          return;
        }
        if (
          this.buscarPorTipoConsulta.length &&
          this.buscarPorPaciente.length
        ) {
          const response = await buscarConsultasPorTipo(
            this.buscarPorTipoConsulta
          );
          const consultas = await response.json();
          this.consultas = consultas.filter(
            (consulta) => consulta.pacienteId._id === this.buscarPorPaciente
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error obteniendo las consultas por tipo"
        );
      }
    },
    async buscarConsultasFecha() {
      if (!this.buscarPorFecha.length) return;
      this.buscarPorTipoConsulta = "";
      this.buscarPorPaciente = "";
      try {
        const response = await buscarConsultasPorFecha(this.buscarPorFecha);
        const consultas = await response.json();
        this.consultas = consultas;
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo obtener los clientes consultados por fecha",
          "error"
        );
      }
    },
    async obtenerConsultas() {
      try {
        const response = await obtenerConsultas();
        const consultas = await response.json();
        this.consultas = consultas;
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error obteniendo las consultas",
          "error"
        );
      }
    },
    async obtenerPacientes() {
      try {
        const response = await obtenerPacientes();
        const pacientes = await response.json();
        this.pacientes = pacientes;
      } catch (error) {
        Swal.fire(
          "Error",
          "Ocurrió un error obteniendo los pacientes",
          "error"
        );
      }
    },
    eliminarConsulta(consultaId) {
      const nombrePacienteEliminar = this.consultas
        .filter((c) => c._id === consultaId)
        ?.at(0)?.pacienteId?.nombre;
      Swal.fire({
        title: "¿Desea eliminar la cita registrada?",
        text: "Se eliminara la cita del paciente " + nombrePacienteEliminar,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.value) {
          try {
            const response = await consultaEliminar(consultaId);
            const respuesta = await response.json();
            if (respuesta.message.includes("correctamente")) {
              Swal.fire("¡Eliminado!", respuesta.message, "success");
              this.obtenerConsultas();
            } else {
              Swal.fire("Algo salió mal!", respuesta.message, "warning");
            }
          } catch (error) {
            Swal.fire("Error!", respuesta.message, "error");
          }
        }
      });
    },
  },
};
</script>

<style scoped>
input[type="date"] {
  font-size: 19px;
  text-transform: uppercase;
  background-color: #e6e4e4;
  outline: none;
  border: 1px solid #008060;
  border-radius: 3px;
  padding: 0 3px;
}
input[type="date"]::-webkit-datetime-edit-month-field {
  color: #008060;
}
input[type="date"]::-webkit-datetime-edit-day-field {
  color: #008060;
}
input[type="date"]::-webkit-datetime-edit-year-field {
  color: #008060;
}
input[type="date"]::-webkit-clear-button {
  font-size: 18px;
  height: 30px;
  position: relative;
  right: 5px;
  margin-right: 4px;
}
input[type="date"]::-webkit-inner-spin-button {
  height: 30px;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  font-size: 18px;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  background-color: #959595;
  color: #e6e6e6;
  cursor: pointer;
}
select {
  background: #e6e4e4;
  padding: 2em;
  border: 1px solid #008060;
}
.container-filtros {
  max-width: 1200px;
  margin-top: 2em;
  margin-bottom: 2em;
}

.d-flex {
  display: flex;
}
.justify-between {
  justify-content: space-evenly;
}
.rounded {
  border-radius: 2em;
}
.container {
  max-width: 100%;
}
.width-25 {
  width: 25%;
}
@media (max-width: 670px) {
  .d-flex {
    display: grid;
    flex-wrap: wrap;
    text-align: center;
    justify-content: center;
  }
  select {
    width: 20em !important;
    margin-top: 1em;
  }
  input[type="date"] {
    margin-top: 1em;
  }
}
@media (max-width: 1400px) {
  .tabla {
    display: block;
    width: 100%;
  }
  .contenedor-tabla:before {
    content: "Scroll horizontally >";
    display: block;
    text-align: right;
    font-size: 11px;
    color: white;
    padding: 0 0 10px;
  }
  .tabla thead,
  .tabla tbody,
  .tabla thead th {
    display: block;
  }
  .tabla thead th:last-child {
    border-bottom: none;
  }
  .tabla thead {
    float: left;
  }
  .tabla tbody {
    width: auto;
    position: relative;
    overflow-x: auto;
  }
  .tabla td,
  .tabla th {
    padding: 20px 0.625em 0.625em 0.625em;
    height: 60px;
    vertical-align: middle;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    width: 180px;
    font-size: 13px;
    text-overflow: ellipsis;
  }
  .tabla td {
    width: 220px !important;
  }
  .tabla thead tr {
    text-align: left;
    border-bottom: 1px solid #f7f7f9;
  }
  .tabla tbody tr {
    display: table-cell;
  }
  .tabla tbody tr:nth-child(odd) {
    background: none;
  }
  .tabla tr:nth-child(even) {
    background: transparent;
  }
  .tabla tr td:nth-child(odd) {
    background: #f8f8f8;
    border-right: 1px solid #e6e4e4;
  }
  .tabla tr td:nth-child(even) {
    border-right: 1px solid #e6e4e4;
  }
  .tabla tbody tr td:last-child {
    width: 212px;
    height: 104px;
  }
  .tabla tbody td {
    display: block;
    text-align: center;
  }
}
</style>