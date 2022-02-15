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
      <form class="formulario" @submit.prevent="enviarPacienteAgregar">
        <span class="formulario-titulo">
          Agregar paciente <i class="fa-solid fa-user-plus"></i>
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
              <option selected value="" disabled>Seleccionar genero</option>
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
              Agregar paciente
              <i class="fa-solid fa-plus"></i>
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
import { crearPaciente } from "../servicios/pacientes/index";
export default {
  name: "PacienteAgregar",
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
  methods: {
    enviarPacienteAgregar() {
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
      } else {
        crearPaciente(this.paciente)
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
              }, 2000);
            }
            if (data && data.error && data.error.code == 11000) {
              Swal.fire({
                title: "Error",
                text: "La identificación del paciente ya existe",
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
      }
    },
  },
};
</script>

<style>
ul,
li {
  margin: 0px;
  list-style-type: none;
}
input[type="radio"] {
  appearance: none;
  background-color: #008060;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="radio"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em #37e96f;
}

input[type="radio"]:checked::before {
  transform: scale(1);
}

input {
  outline: none;
  border: none;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: none;
  -webkit-appearance: none;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

textarea {
  outline: none;
  resize: none;
  border: none;
}

textarea:focus,
input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder {
  color: transparent;
}
input:focus:-moz-placeholder {
  color: transparent;
}
input:focus::-moz-placeholder {
  color: transparent;
}
input:focus:-ms-input-placeholder {
  color: transparent;
}

input::-webkit-input-placeholder {
  color: #adadad;
}
input:-moz-placeholder {
  color: #adadad;
}
input::-moz-placeholder {
  color: #adadad;
}
input:-ms-input-placeholder {
  color: #adadad;
}

button {
  outline: none !important;
  border: none;
  background: transparent;
}

button:hover {
  cursor: pointer;
}

.container {
  max-width: 1200px;
}

.background {
  background-color: #f7f7f7;
}

.contenedor-formulario {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
}
.contenedor {
  width: 920px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 62px 55px 90px 55px;
}

select {
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
}

.formulario {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.formulario-titulo {
  display: block;
  width: 100%;
  font-family: Montserrat-Black;
  font-size: 39px;
  color: #333333;
  line-height: 1.2;
  text-align: center;
  padding-bottom: 59px;
}

.contenedor-input {
  width: 100%;
  position: relative;
  border: 1px solid #e6e6e6;
  border-radius: 13px;
  padding: 10px 30px 9px 22px;
  margin-bottom: 20px;
}

.width-50 {
  width: calc((100% - 30px) / 2);
}
.width-25 {
  width: calc((100% - 15) / 2);
}

.label {
  font-family: Montserrat-SemiBold;
  font-size: 10px;
  color: #393939;
  line-height: 1.5;
  text-transform: uppercase;
}

.input-style {
  display: block;
  width: 100%;
  background: transparent;
  font-family: Montserrat-SemiBold;
  font-size: 18px;
  color: #555555;
  line-height: 1.2;
  padding-right: 15px;
}

input.input-style {
  height: 40px;
}

textarea.input-style {
  min-height: 120px;
  padding-top: 9px;
  padding-bottom: 13px;
}

.input-style:focus + .focus-input-style::before {
  width: 100%;
}
.contenedor-formulario-form-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  width: 41%;
  margin-right: 25%;
  margin-left: 30%;
}

.formulario-btn {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  background-color: #008060;
  border-radius: 25px;
  font-family: Montserrat-Medium;
  font-size: 16px;
  color: #fff;
  line-height: 1.2;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.formulario-btn i {
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.formulario-btn:hover {
  background-color: #11a763;
}

.formulario-btn:hover i {
  -webkit-transform: translateX(10px);
  -moz-transform: translateX(10px);
  -ms-transform: translateX(10px);
  -o-transform: translateX(10px);
  transform: translateX(10px);
}

@media (max-width: 768px) {
  .width-50 {
    width: 100%;
  }
  .width-25 {
    width: 50%;
  }
}

@media (max-width: 576px) {
  .contenedor {
    padding: 62px 15px 90px 15px;
  }

  .contenedor-input {
    padding: 10px 10px 9px 10px;
  }
}
</style>