<template>
  <div class="container">
    <div>
      <div class="contenedor-buscador">
        <input
          placeholder="Buscador de pacientes por nombre..."
          v-model="buscadorNombre"
          @input="buscadorPacientes"
          type="text"
          class="buscador"
        />
      </div>
      <div>
        <h1 class="titulo">Listado de Pacientes</h1>
      </div>
      <template v-if="pacientes && pacientes.length">
        <div class="contenedor-tabla">
          <table class="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Identificación</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Tipo de sangre</th>
                <th>Alergias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paciente in pacientes" :key="paciente._id">
                <td>{{ paciente.nombre }}</td>
                <td>{{ paciente.apellido }}</td>
                <td>{{ paciente.identificacion }}</td>
                <td>{{ paciente.edad }} años</td>
                <td>{{ paciente.sexo }}</td>
                <td>{{ paciente.tipoSangre }}</td>
                <td>{{ paciente.alergias }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    title="Editar paciente"
                    @click="
                      $router.push({
                        name: 'PacienteEditar',
                        params: { id: paciente._id },
                      })
                    "
                  >
                    <i class="fa-solid fa-hospital-user"></i>
                  </button>
                  <button
                    title="Eliminar paciente"
                    class="btn btn-danger margin-left"
                    @click="eliminarPaciente(paciente._id)"
                  >
                    <i class="fa-solid fa-hospital-user"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <p class="text-center text-muted margin-top">
          No existen pacientes registrados actualmente. Navega a "Crear
          Paciente"
          <i class="fa-solid fa-folder-open"></i>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import {
  obtenerPacientes,
  eliminarPaciente,
  buscarPacientesPorNombre,
} from "../servicios/pacientes/index";
export default {
  name: "Pacientes",
  data() {
    return {
      pacientes: [],
      buscadorNombre: "",
    };
  },
  mounted() {
    this.getPacientes();
  },
  methods: {
    eliminarPaciente(id) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto! Si eliminas el paciente se eliminaran todas sus consultas relacionadas",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, eliminar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          eliminarPaciente(id)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.message.includes("correctamente")) {
                Swal.fire("¡Eliminado!", data.message, "success");
                this.getPacientes();
              } else {
                Swal.fire("¡Error!", data.message, "error");
              }
            });
        }
      });
    },
    editarPaciente(id) {
      router.push({ name: "EditarPaciente", params: { id } });
    },
    async getPacientes() {
      try {
        const response = await obtenerPacientes();
        const pacientes = await response.json();
        this.pacientes = pacientes;
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo obtener los pacientes",
          icon: "error",
        });
      }
    },
    async buscadorPacientes() {
      if (this.buscadorNombre.length > 2) {
        try {
          const response = await buscarPacientesPorNombre(this.buscadorNombre);
          const pacientes = await response.json();
          this.pacientes = pacientes;
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo obtener los pacientes",
            icon: "error",
          });
        }
      } else {
        this.getPacientes();
      }
    },
  },
};
</script>
<style>
.contenedor-buscador {
  position: relative;
  display: flex;
  min-width: 100px;
  margin-top: 2em;
}
.btn-secondary {
  background: #008060;
}
.btn-regresar {
  position: absolute;
  top: 10%;
  left: 6em;
  border-radius: 6em !important;
  padding: 0.5em;
}
.buscador {
  border: 1px solid grey;
  border-radius: 5px;
  height: 4em;
  padding: 2px 23px 2px 30px;
  outline: 0;
  width: 27%;
  background-color: #f5f5f5;
  margin: 0 auto;
}

.buscador:hover,
.buscador:focus {
  border: 1px solid #009688;
  background-color: #eee;
}

.text-center {
  text-align: center;
}
.text-muted {
  color: gray;
}
.margin-top {
  margin-top: 1em;
}
.container {
  margin: 0 auto;
  text-align: center;
}
* {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
body {
  font-family: Helvetica;
  -webkit-font-smoothing: antialiased;
}
h2 {
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
  padding: 30px 0;
}
.btn {
  color: #fff;
  border-radius: 0;
  padding: 10px 20px;
  border: none;
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
  display: inline-block;
  cursor: pointer;
  outline: none;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}
.btn-danger {
  background: #f44336;
}
.btn-primary {
  background: #2196f3;
}
.btn-danger:hover {
  background: #ff6257;
}
.btn-primary:hover {
  background: #516bff;
}
.margin-left {
  margin-left: 10px;
}
.titulo {
  margin-top: 1em;
}
.contenedor-tabla {
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.tabla {
  border-radius: 5px;
  font-size: 1em;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
}

.tabla td,
.tabla th {
  text-align: center;
  padding: 8px;
}

.tabla td {
  border-right: 1px solid #f8f8f8;
  font-size: 14px;
}

.tabla thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.tabla thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.tabla tr:nth-child(even) {
  background: #f8f8f8;
}

@media (max-width: 881px) {
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
    width: 120px;
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
<style scoped>
.container-filtros {
  max-width: 1200px;
  margin-top: 2em;
  margin-bottom: 2em;
}
.btn-secondary {
  background: #008060;
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
</style>