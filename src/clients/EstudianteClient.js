import axios from "axios";

const URL_API = "http://localhost:8081/api/matricula/v1/estudiantes";

//Guardar API
//public Response guardar(@RequestBody EstudianteTo estudianteTo)

const guardar = async (body) => {
  const data = axios
    .post(`${URL_API}`, body)
    .then(r => r.data);
  console.log(data);
};
//Actualizar API
//public Response actualizarPorId(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id)

const actualizar = async (body,id) => {
    axios.put(`http://localhost:8081/api/matricula/v1/estudiantes/${id}`, body)
    .then(r => r.data);
};

//Actualizar Parcial API
//public Response actualizarParcialPorId(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id)

const actualizarParcial = async (body,id) =>{
    axios.patch(`${URL_API}/${id}`, body)
    .then(r => r.data);
};

//Borrar API
// public Response borrarPorId(@PathParam("id") Integer id) 
const borrarPorId = async (id) => {
  axios.delete(`${URL_API}/${id}`)
    .then(r => r.data);
};

//fachada
export const guardarFachada = async (body) => {
  await guardar(body);
};

export const actualizarFachada = async ( body,id) => {
  await actualizar(body,id);
};

export const actualizarParcialFachada = async (body,id,) =>{
    await actualizarParcial( body,id);
};
export const borrarPorIdFachada = async (id) => {
    await borrarPorId(id);

}

