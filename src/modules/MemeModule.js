import { db, storage, auth } from "../config/firebase";
import { ref , deleteObject } from "firebase/storage";
import { arrayRemove, arrayUnion } from "firebase/firestore";

import { editarEstadoNoti } from "./UserModule";
import { referenciaNoti , borrarNoti, crearNoti, obtenerNotisXMeme } from "./NotificationModule";

export const referenciaMemes = db.collection("memes");

export async function obtenerMemes() {
  let errorCodigo = null;

  //Consultar los documentos y ser ordenan por fecha
  const querySnapshot = await referenciaMemes.orderBy("fecha", "desc").get()
    .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo === null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function obtenerPorId(id) {
  let errorCodigo = null;
  //Consultar un documento con el id del meme
  const doc = await referenciaMemes.doc(id).get()
    .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
  if (doc.exists & (errorCodigo === null)) {
    return { id: doc.id, ...doc.data() };
  } else {
    return errorCodigo;
  }
}

export async function obtenerPorUsuario(uid) {
  let errorCodigo = null;
  //Consultar el los documentos en los que el uid sea igual al ingresado
  const querySnapshot = await referenciaMemes.where("user.uid", "==", uid).orderBy("fecha", "desc").get()
    .catch(error =>errorCodigo = { message: error.message, code: error.code });
    
  if (errorCodigo === null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function obtenerPorCategoria(idCategoria) {
  let errorCodigo = null;
  //Consultar el los documentos en los que el id sea igual al ingresado
  const querySnapshot = await referenciaMemes.where("categoria", "array-contains", idCategoria)
    .orderBy("fecha", "desc").get()
    .catch(error =>errorCodigo = { message: error.message, code: error.code });
  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo === null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function reaccionar(state) {
  let errorCodigo = null;

  //Se determina si el id del usuario NO se encuentra en los likes del meme
  if (!state.likes.includes(auth.currentUser.uid)) {
    //En caso de ser asi se actualiza añadiendo al usuario al arreglo de likes
    await referenciaMemes.doc(state.id)
      .update({likes: arrayUnion(auth.currentUser.uid)})
      .catch(error =>errorCodigo = { message: error.message, code: error.code });

    //Si no hay errores y el creador del meme no esta reaccionando a su mismo meme se crea la notificacion
    if (errorCodigo === null && state.user.uid !== auth.currentUser.uid) {

      //Crear notificacion
      const respuesta = await crearNoti(state);
      if (respuesta === "completado") {
        const respuesta = await editarEstadoNoti(state, false);
        if (respuesta !== "completado") {
          errorCodigo = respuesta;
        }
      } else {
        errorCodigo = respuesta;
      }
    }
  } else {
    //De lo contrario quiere decir que el usuario dio like por lo que se elimina la reaccion
    await referenciaMemes.doc(state.id)
      .update({likes: arrayRemove(auth.currentUser.uid),})
      .catch(error =>errorCodigo = { message: error.message, code: error.code });

    //Si no hay errores y el creador del meme no esta reaccionando a su mismo meme se elimina la notificacion 
    if (errorCodigo === null && state.user.uid !== auth.currentUser.uid) {
      //Borrar notificacion
      const respuesta = await borrarNoti(state);
      if (respuesta !== "completado") {
        errorCodigo = respuesta;
      }
    }
  }

  //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function borrar(state) {
  let errorCodigo = null;

  //Obtener la referencia de la imagen a borrar
  const desertRef = ref(storage, `meme/${state.fecha}`);

  //Se borra la imagen
  await deleteObject(desertRef).then(async () => {
    
      //Crear batch para eliminar los documentos asociados al meme
      const batch = db.batch();
      //lote que se encarga de eliminar el documento del meme
      batch.delete(referenciaMemes.doc(state.id));
      //Se consultan los documentos de las notificaciones relacionadas con el meme
      const notis = await obtenerNotisXMeme(state.photoURL);
      notis.forEach(noti=>{
          //Se recorre cada notificacion y se obtiene su referencia para agregarla al lote del batch
          const notiRef = referenciaNoti.doc(noti.id);
          batch.delete(notiRef);
      })

      //Se ejecuta el batch y devuelve error en caso de falla
      await batch.commit()
      .catch(error => errorCodigo = {message: error.message, code: error.code});
    })
  .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}