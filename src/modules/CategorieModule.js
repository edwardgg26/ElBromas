import { db } from "../config/firebase";

export const referenciaCategorias = db.collection("categorias");

export async function obtenerCategorias() {
  let errorCodigo = null;

  //Consultar los documentos y ser ordenan por fecha
  const querySnapshot = await referenciaCategorias.get()
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo == null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function obtenerPorId(id) {
  let errorCodigo = null;
  //Consultar un documento con el id de la categoria
  const doc = await referenciaCategorias.doc(id).get()
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
  if (doc.exists & (errorCodigo === null)) {
    return { id: doc.id, ...doc.data() };
  } else {
    return errorCodigo;
  }
}