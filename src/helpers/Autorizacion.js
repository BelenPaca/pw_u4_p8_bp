export function obtenerPaginasPermitidas(usuario) {
  let arreglo;
  if (usuario === "admin") {
    //Paginas del admin
    arreglo = ['/home', '/about', '/estudiante', '/notas', '/403'];
  }
  if (usuario === "estudiante") {
    //Paginas de estudiante
    arreglo = ['/home', '/about', '/estudiante', '/403'];
  }
  return arreglo;
}
