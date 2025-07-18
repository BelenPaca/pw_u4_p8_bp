import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import EstudianteView from "@/views/EstudianteView.vue";

import AboutView from "@/views/AboutView.vue";
import NotasIngresoView from "@/views/NotasIngresoView.vue";
import RecursoProhibidoView from "@/views/RecursoProhibidoView.vue";

import { obtenerPaginasPermitidas } from "../helpers/Autorizacion";

function estaAutenticado() {
  let resul = localStorage.getItem('auth') === "true";
  console.log(resul);
  return resul;
}

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiereAutenticacion: true, //protegida
    },
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      requiereAutenticacion: true, //protegida
    },
  },

  {
    path: '/estudiante',
    name: 'estudiante',
    component: EstudianteView,
    meta: {
      requiereAutenticacion: true, //protegida
    },
  },
  {
    path: '/notas',
    name: 'notas',
    component: NotasIngresoView,
    meta: {
      requiereAutenticacion: true, //protegida
    },
  },
  {
    path: '/403',
    name: '403',
    component: RecursoProhibidoView,
    meta: {
      requiereAutenticacion: true, //protegida
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//Guardian
router.beforeEach((to, from, next) => {
  console.log("Antes");
  //Validando si la pagina debe estar autenticada (true)
  if (to.meta.requiereAutenticacion) {
    console.log("Auth");
    //Si no esta autenticado
    if (!estaAutenticado()) {
      next("/login");
    } else {
      //autenticado
      //Aqui valido si esta autorizado
      let usuario = localStorage.getItem('usuario')
      let paginas = obtenerPaginasPermitidas(usuario);
      console.log('Usuario:', usuario, 'Paginas:', paginas, 'Ruta:', to.path);
      if (paginas.includes(to.path)) {
        next();
        console.log('permitido');
        
      }else {
        next('/403');
      }
    }
  } else {
    next();
  }
});

export default router;
