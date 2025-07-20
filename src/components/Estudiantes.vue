<template>
  <div class="container-estudiantes">
    <h1>Gestión de Estudiantes</h1>

    <div v-if="statusMessage" :class="['mensaje-estado', statusType]">
      {{ statusMessage }}
    </div>
    <p v-show="cargando" class="mensaje-carga">Cargando operación...</p>

    <form @submit.prevent="guardarEstudiante" class="formulario-estudiante">
      <input type="hidden" v-model="estudianteActual.id" />

      <div class="container-formulario">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="estudianteActual.nombre" placeholder="Nombre del estudiante" required />
        <button
          type="button"
          @click="actualizarCampoParcial('nombre')"
          v-if="estudianteActual.id && estudianteActual.nombre !== estudianteOriginal.nombre"
          class="btn-parcial"
        >
          Actualizar Nombre
        </button>
      </div>

      <div class="container-formulario">
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" v-model="estudianteActual.apellido" placeholder="Apellido del estudiante" required />
        <button
          type="button"
          @click="actualizarCampoParcial('apellido')"
          v-if="estudianteActual.id && estudianteActual.apellido !== estudianteOriginal.apellido"
          class="btn-parcial"
        >
          Actualizar Apellido
        </button>
      </div>

      <div class="container-formulario">
        <label for="fechaNacimiento">F. Nacimiento:</label>
        <input type="date" id="fechaNacimiento" v-model="estudianteActual.fechaNacimiento" required />
        <button
          type="button"
          @click="actualizarCampoParcial('fechaNacimiento')"
          v-if="estudianteActual.id && estudianteActual.fechaNacimiento !== estudianteOriginal.fechaNacimiento"
          class="btn-parcial"
        >
          Actualizar Fecha
        </button>
      </div>

      <div class="container-formulario">
        <label for="genero">Género:</label>
        <select id="genero" v-model="estudianteActual.genero" required>
          <option value="">Seleccione</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <button
          type="button"
          @click="actualizarCampoParcial('genero')"
          v-if="estudianteActual.id && estudianteActual.genero !== estudianteOriginal.genero"
          class="btn-parcial"
        >
          Actualizar Género
        </button>
      </div>

      <div class="acciones-formulario">
        <button type="submit">
          {{ estudianteActual.id ? 'Actualizar Estudiante (Completo)' : 'Agregar Estudiante' }}
        </button>
        <button type="button" @click="limpiarFormulario" v-if="estudianteActual.id" class="btn-cancelar">
          Cancelar Edición
        </button>
      </div>
    </form>

    <hr />

    <h2>Consultar Estudiante por ID</h2>
    <div class="container-formulario">
      <label for="consultaId">ID a consultar:</label>
      <input type="number" id="consultaId" v-model.number="idAConsultar" placeholder="Ingrese ID" />
      <button @click="consultarEstudiantePorId" class="btn-buscar">Buscar</button>
    </div>

    <div v-if="estudianteConsultado.id" class="estudiante-consultado-id">
        <h3>Datos del Estudiante Consultado:</h3>
        <p><strong>ID:</strong> {{ estudianteConsultado.id }}</p>
        <p><strong>Nombre:</strong> {{ estudianteConsultado.nombre }} {{ estudianteConsultado.apellido }}</p>
        <p><strong>Fecha Nacimiento:</strong> {{ formatearFechaVisual(estudianteConsultado.fechaNacimiento) }}</p>
        <p><strong>Género:</strong> {{ estudianteConsultado.genero }}</p>
        <div class="acciones-id">
            <button @click="editarEstudiante(estudianteConsultado)" class="btn-editar">Editar en Formulario</button>
            <button @click="confirmarEliminacion(estudianteConsultado.id)" class="btn-eliminar">Eliminar</button>
        </div>
    </div>
    <p v-else-if="idAConsultar && !cargando && !statusMessage" class="mensaje-info">
      Ingrese un ID y presione "Buscar" para ver los detalles.
    </p>

    <div v-if="mostrarConfirmacionEliminar" class="supender">
      <div class="contenido">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que quieres eliminar al estudiante con ID: {{ idEstudianteAEliminar }}? Esta acción es irreversible.</p>
        <div class="acciones">
          <button @click="eliminarEstudiante(idEstudianteAEliminar)" class="btn-eliminar">Sí, Eliminar</button>
          <button @click="cancelarEliminacion" class="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  guardarFachada,
  actualizarFachada,
  actualizarParcialFachada,
  borrarPorIdFachada,
  consultarPorIdFachada
} from "../clients/EstudianteClient.js";

export default {
  data() {
    return {
      estudianteActual: {
        id: null,
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        genero: '',
      },
      estudianteOriginal: {},
      estudianteConsultado: {},
      idAConsultar: null,
      mostrarConfirmacionEliminar: false,
      idEstudianteAEliminar: null,
      cargando: false,
      statusMessage: null,
      statusType: null,
      messageTimeout: null
    };
  },
  methods: {
    async ejecutarOperacion(operacionAsync, successMessage, errorMessage) {
      this.cargando = true;
      this.statusMessage = null;
      this.statusType = null;

      try {
        const resultado = await operacionAsync();
        this.showMessage(successMessage, 'success');
        return resultado;
      } catch (err) {
        console.error(`Error en la operación:`, err);
        const msg = err.response?.data?.message || err.message || errorMessage;
        this.showMessage(msg, 'error');
        throw err;
      } finally {
        this.cargando = false;
      }
    },

    showMessage(message, type = 'info', duration = 3000) {
      this.statusMessage = message;
      this.statusType = type;
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }
      this.messageTimeout = setTimeout(() => {
        this.statusMessage = null;
        this.statusType = null;
      }, duration);
    },

    async consultarEstudiantePorId() {
      if (!this.idAConsultar) {
        this.showMessage('Por favor, ingrese un ID para consultar.', 'info');
        this.estudianteConsultado = {};
        return;
      }

      try {
        const estudiante = await this.ejecutarOperacion(
          () => consultarPorIdFachada(this.idAConsultar),
          `Estudiante con ID ${this.idAConsultar} encontrado.`,
          `No se encontró estudiante con ID ${this.idAConsultar}.`
        );
        this.estudianteConsultado = estudiante;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.showMessage(`Estudiante con ID ${this.idAConsultar} no encontrado.`, 'error');
        }
        this.estudianteConsultado = {};
      }
    },

    async guardarEstudiante() {
      if (!this.estudianteActual.nombre || !this.estudianteActual.apellido ||
        !this.estudianteActual.fechaNacimiento || !this.estudianteActual.genero) {
        this.showMessage('Por favor, completa todos los campos del estudiante.', 'info');
        return;
      }

      const datosAEnviar = { ...this.estudianteActual };
      if (datosAEnviar.fechaNacimiento) {
        datosAEnviar.fechaNacimiento = datosAEnviar.fechaNacimiento + 'T00:00:00';
      }

      try {
        let resultadoOperacion;
        if (this.estudianteActual.id) {
          resultadoOperacion = await this.ejecutarOperacion(
            () => actualizarFachada(datosAEnviar, this.estudianteActual.id),
            'Estudiante actualizado completamente con éxito!',
            'Hubo un error al actualizar el estudiante.'
          );
        } else {
          resultadoOperacion = await this.ejecutarOperacion(
            () => guardarFachada(datosAEnviar),
            'Estudiante agregado con éxito! Puedes consultarlo por su ID.',
            'Hubo un error al agregar el estudiante.'
          );
        }
        console.log('Resultado de la operación (guardar/actualizar):', resultadoOperacion);

        if (this.estudianteConsultado.id === resultadoOperacion.id) {
          this.estudianteConsultado = { ...resultadoOperacion };
        }
        this.limpiarFormulario();
      } catch (err) {
      }
    },

    async actualizarCampoParcial(campo) {
      if (!this.estudianteActual.id) {
        this.showMessage('No se puede actualizar parcialmente sin un estudiante seleccionado para editar.', 'info');
        return;
      }

      let valorActualCampo = this.estudianteActual[campo];
      const valorOriginalCampo = this.estudianteOriginal[campo];

      if (valorActualCampo === valorOriginalCampo) {
        this.showMessage(`El campo '${campo}' no ha cambiado.`, 'info');
        return;
      }

      if (campo === 'fechaNacimiento' && valorActualCampo) {
        valorActualCampo = valorActualCampo + 'T00:00:00';
      }

      const datosAActualizar = { [campo]: valorActualCampo };

      try {
        const resultadoOperacion = await this.ejecutarOperacion(
          () => actualizarParcialFachada(datosAActualizar, this.estudianteActual.id),
          `Campo '${campo}' del estudiante actualizado parcialmente con éxito!`,
          `Hubo un error al actualizar el campo '${campo}'.`
        );
        console.log('Resultado de actualización parcial:', resultadoOperacion);

        await this.editarEstudiante(this.estudianteActual);

        if (this.estudianteConsultado.id === resultadoOperacion.id) {
          this.estudianteConsultado = { ...resultadoOperacion };
        }
      } catch (err) {
      }
    },

    async editarEstudiante(estudiante) {
      if (!estudiante || !estudiante.id) {
        this.showMessage('Error: Estudiante o ID no válidos para edición.', 'error');
        return;
      }

      try {
        const estudianteRecuperado = await this.ejecutarOperacion(
          () => consultarPorIdFachada(estudiante.id),
          `Estudiante con ID ${estudiante.id} cargado en el formulario para edición.`,
          `Error al cargar los detalles del estudiante ${estudiante.id} para edición.`
        );

        this.estudianteActual = { ...estudianteRecuperado };
        this.estudianteOriginal = { ...estudianteRecuperado };

        if (this.estudianteActual.fechaNacimiento) {
          const fechaApi = this.estudianteActual.fechaNacimiento;
          if (fechaApi.includes('T')) {
            this.estudianteActual.fechaNacimiento = fechaApi.split('T')[0];
          } else if (fechaApi.includes(' ')) {
            this.estudianteActual.fechaNacimiento = fechaApi.split(' ')[0];
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.showMessage(`Estudiante con ID ${estudiante.id} no encontrado para edición.`, 'error');
        }
        this.limpiarFormulario();
      }
    },

    confirmarEliminacion(id) {
      this.idEstudianteAEliminar = id;
      this.mostrarConfirmacionEliminar = true;
    },

    async eliminarEstudiante(id) {
      try {
        const resultadoOperacion = await this.ejecutarOperacion(
          () => borrarPorIdFachada(id),
          'Estudiante eliminado con éxito!',
          'Hubo un error al eliminar el estudiante.'
        );
        console.log('Resultado de eliminación:', resultadoOperacion);

        this.limpiarFormulario();
        this.idAConsultar = null;
        this.estudianteConsultado = {};
      } catch (err) {
      } finally {
        this.cancelarEliminacion();
      }
    },

    cancelarEliminacion() {
      this.mostrarConfirmacionEliminar = false;
      this.idEstudianteAEliminar = null;
    },

    limpiarFormulario() {
      this.estudianteActual = {
        id: null,
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        genero: '',
      };
      this.estudianteOriginal = {};
    },

    formatearFechaVisual(fechaString) {
      if (!fechaString) return '';
      try {
        const fecha = new Date(fechaString);
        if (!isNaN(fecha.getTime())) {
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
          return fecha.toLocaleDateString('es-ES', opciones);
        } else {
          return 'Fecha inválida';
        }
      } catch (e) {
        return 'Error de fecha';
      }
    }
  }
};
</script>

<style scoped>

.container-estudiantes {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

h1, h2 {
  text-align: center;
  color: #333;
}

.formulario-estudiante, .container-formulario {
  margin-bottom: 15px;
}

.container-formulario label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.container-formulario input,
.container-formulario select {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.acciones-formulario, .acciones-id, .acciones {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 10px 15px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.btn-cancelar {
  background-color: #6c757d;
}
.btn-editar {
  background-color: #ffc107; color: #333;
}
.btn-eliminar {
  background-color: #dc3545;
}
.btn-parcial {
  background-color: #28a745; font-size: 0.9em; padding: 8px 12px;
}
.btn-buscar {
  margin-top: 15px;
  background-color: #6f42c1;
}

.mensaje-estado {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  text-align: center;
}
.mensaje-estado.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb; }
.mensaje-estado.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb; }
.mensaje-estado.info {
  background-color: #cfe2ff;
  color: #052c65;
  border: 1px solid #b6d4fe; }


.mensaje-carga, .mensaje-info {
  text-align: center;
  padding: 10px;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  margin-top: 15px;
}

.estudiante-consultado-id {
  border: 1px solid #eee;
  padding: 15px;
  margin-top: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.superposicion {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.contenido {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>