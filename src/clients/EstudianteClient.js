import axios from "axios";

const URL_API = "http://localhost:8081/api/matricula/v1/estudiantes";
//Consultar API
const consultarPorId = async (id) => {
  const respuesta = await axios.get(`${URL_API}/${id}`);
  return respuesta.data;
};

//Guardar API
//public Response guardar(@RequestBody EstudianteTo estudianteTo)
const guardar = async (body) => {
  const respuesta = await axios.post(`${URL_API}`, body);
  return respuesta.data; // ¡Devolvemos la data!
};
//Actualizar API
//public Response actualizarPorId(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id)

const actualizar = async (body, id) => {
  const respuesta = await axios.put(`${URL_API}/${id}`, body);
  return respuesta.data;
};

//Actualizar Parcial API
//public Response actualizarParcialPorId(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id)

const actualizarParcial = async (body, id) => {
  const respuesta = await axios.patch(`${URL_API}/${id}`, body);
  return respuesta.data;
};

//Borrar API
// public Response borrarPorId(@PathParam("id") Integer id)
const borrarPorId = async (id) => {
  const respuesta = await axios.delete(`${URL_API}/${id}`);
  return respuesta.data;
};

//fachada
export const guardarFachada = async (body) => {
  return await guardar(body);
};

export const actualizarFachada = async (body, id) => {
  return await actualizar(body, id);
};

export const actualizarParcialFachada = async (body, id) => {
  return await actualizarParcial(body, id);
};
export const borrarPorIdFachada = async (id) => {
  return await borrarPorId(id);
};

export const consultarPorIdFachada = async (id) => {
  return await consultarPorId(id);
};