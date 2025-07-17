<template>
    <div>
        <button v-on:click="guardar()">Guardar</button>
        <button v-on:click="actualizar()">Actualizar</button>
        <button v-on:click="actualizarParcial()">Actualizar Parcial</button>
        <button v-on:click="borrar()">Borrar</button>
    </div>
</template>

<script>
import {
    guardarFachada,
    actualizarFachada,
    actualizarParcialFachada,
    borrarPorIdFachada

}
    from "../clients/EstudianteClient.js";
export default {
    methods: {
        async guardar() {
            //EstudianteTo
            //private Integer id;
            //private String nombre;
            //private String apellido;
            //private LocalDate fechaNacimiento;
            //private String genero;
            let fecha = '2000-08-06';

            const estudianteToBody = {
                nombre: 'Belen',
                apellido: 'Paca',
                fechaNacimiento: fecha + 'T00:00:00',
                genero: 'F'

            };
            await guardarFachada(estudianteToBody);
        },
        async actualizar() {
            let fecha = '2000-07-06';
            const estudianteToBody = {
                nombre: 'Pepito',
                apellido: 'Perez',
                fechaNacimiento: fecha + 'T00:00:00',
                genero: 'M'

            };
            await actualizarFachada(estudianteToBody,9);

        },

        async actualizarParcial() {
            const estudianteToBody = {
                apellido: 'Silva',
            };
            await actualizarParcialFachada(estudianteToBody, 9);

        },
        async borrar() {
            await borrarPorIdFachada(10);
        }
    }

}
</script>

<style></style>