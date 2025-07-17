import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EstudianteView from "@/views/EstudianteView.vue";
import LoginView from "@/views/LoginView.vue";

function estaAutenticado (){
  let resul = localStorage.getItem('auth') === 'true';
  console.log(resul);
  return resul;
}

const routes = [
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta:{
      requiereAutenticacion: true//protegida
    }
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },

  {
    path: "/estudiante",
    name: "estudiante",
    component: EstudianteView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log('Antes')
  //Si no esta autenticado
  if(to.meta.requiereAutenticacion){
    console.log('Auth')
    if(!estaAutenticado ()){
      console.log('exito')
      next ('/login')
    }else{
      next();
    }
  }else{
    next();
  }

})

export default router;
