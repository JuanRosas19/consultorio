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
      <form class="formulario" @submit.prevent="actualizarPaciente">
        <span class="formulario-titulo">
          Actualizar paciente <i class="fa-solid fa-rotate"></i>
        </span>

        <div class="contenedor-input background width-50">
          <span class="label">Nombre</span>
          <input
            class="input-style"
            type="text"
            v-model.trim="paciente.nombre"
            placeholder="Ingresar nombre"
            required
          />
        </div>

        <div class="contenedor-input background width-50">
          <span class="label">Apellido</span>
          <input
            class="input-style"
            type="text"
            v-model.trim="paciente.apellido"
            placeholder="Ingresas apellido del paciente"
            required
          />
        </div>

        <div class="contenedor-input background width-50">
          <span class="label">Identificación</span>
          <input
            class="input-style"
            type="number"
            v-model.trim="paciente.identificacion"
            placeholder="Identificacion del paciente, esta es única"
            required
          />
        </div>
        <div class="contenedor-input background width-50">
          <span class="label">Edad</span>
          <input
            max="100"
            min="1"
            class="input-style"
            type="number"
            v-model.number="paciente.edad"
            placeholder="Ingrese la edad del paciente"
            required
          />
        </div>

        <div class="contenedor-input width-50 background">
          <span class="label">Sexo</span>
          <div>
            <select required v-model="paciente.sexo">
              <option
                v-for="(genero, index) in generoPaciente"
                :key="index + genero"
                :value="genero"
              >
                {{ genero }}
              </option>
            </select>
          </div>
        </div>
        <div class="contenedor-input width-50 background">
          <span class="label">Tipo de sangre</span>
          <div>
            <select required v-model="paciente.tipoSangre">
              <option value="" selected disabled>
                Tipo de sangre del paciente
              </option>
              <option
                v-for="(tipoSangre, index) in tiposDeSangre"
                :key="index + tipoSangre"
                :value="tipoSangre"
              >
                {{ tipoSangre }}
              </option>
            </select>
          </div>
        </div>

        <div class="contenedor-input background">
          <span class="label">Alergias</span>
          <div>
            <input
              v-model="tieneAlergias"
              type="radio"
              id="si"
              name="alergias"
              :value="true"
            />
            <label for="si">Si</label>
            <input
              v-model="tieneAlergias"
              type="radio"
              id="no"
              name="alergias"
              :value="false"
            />
            <label for="no">No</label>
          </div>
        </div>
        <div v-if="tieneAlergias" class="contenedor-input background">
          <span class="label">Alergias</span>
          <textarea
            required
            v-model.trim="paciente.alergias"
            class="input-style"
            placeholder="Indica si el paciente presenta alguna alergia..."
          ></textarea>
        </div>

        <div class="contenedor-formulario-form-btn">
          <button class="formulario-btn" type="submit">
            <span>
              Actualizar paciente
              <i class="fa-solid fa-file-medical"></i>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { tiposDeSangre, generoPaciente } from "../constantes/main";
import {
  obtenerPaciente,
  actualizarPaciente,
} from "../servicios/pacientes/index";
export default {
  name: "PacienteEditar",
  data() {
    return {
      paciente: {
        nombre: "",
        apellido: "",
        edad: "",
        identificacion: "",
        sexo: "",
        tipoSangre: "",
        alergias: "",
      },
      tieneAlergias: false,
      tiposDeSangre,
      generoPaciente,
    };
  },
  mounted() {
    this.obtenerPaciente();
  },
  methods: {
    async obtenerPaciente() {
      try {
        const response = await obtenerPaciente(this.$route.params.id);
        const paciente = await response.json();
        if (paciente.alergias && !paciente.alergias.includes("Ninguna")) {
          this.tieneAlergias = true;
        } else {
          paciente.alergias = "";
        }
        this.paciente = paciente;
      } catch (error) {
        Swal.fire("Error", "Ocurrió un error obteniendo el paciente", "error");
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      }
    },
    actualizarPaciente() {
      if (this.tieneAlergias) {
        this.paciente.alergias = this.paciente.alergias;
      } else {
        this.paciente.alergias = "Ninguna";
      }
      if (
        this.paciente.nombre == "" ||
        this.paciente.apellido == "" ||
        this.paciente.sexo == "" ||
        this.paciente.tipoSangre == "" ||
        this.paciente.alergias == "" ||
        !this.paciente.edad ||
        this.paciente.identificacion == ""
      ) {
        Swal.fire({
          title: "Error",
          text: "Por favor, llene todos los campos del formulario",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
      actualizarPaciente(this.$route.params.id, this.paciente)
        .then((response) => response.json())
        .then((data) => {
          if (data.message.includes("correctamente")) {
            Swal.fire({
              title: "Éxito",
              text: data.message,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
            setTimeout(() => {
              this.$router.push("/");
            }, 1000);
          }
          if (data && data.error && data.error.code == 11000) {
            Swal.fire({
              title: "Error",
              text: "Ya existe un paciente registrado con la identificación ingresada",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        })
        .catch(() => {
          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error creando el paciente. Por favor, intente nuevamente",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        });
    },
  },
};
</script>
