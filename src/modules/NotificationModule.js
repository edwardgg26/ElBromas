import { db, auth } from "../config/firebase";
import { obtenerUsuario } from "./UserModule";

export const referenciaNoti = db.collection("notificaciones");

export async function crearNoti(meme) {
  let errorCodigo = null;

  const usuario = await obtenerUsuario(auth.currentUser.uid)
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  if (errorCodigo === null) {
    await referenciaNoti.doc().set({
        usuarioLike: {
          uid: usuario.uid,
          username: usuario.username,
        },
        fecha: new Date().toISOString(),
        creadorMeme: meme.user.uid,
        memeURL: meme.photoURL,
      })
    .catch(error => errorCodigo = { message: error.message, code: error.code });
  }

  //Retornar "completado" en caso de que haya errores, o el error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function borrarNoti(meme) {
  let errorCodigo = null;

  await referenciaNoti
    .where("usuarioLike.uid", "==", auth.currentUser.uid)
    .where("memeURL", "==", meme.photoURL)
    .get()
    .then((querySnapshot) => {
      // Itera sobre los documentos y borra cada uno
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function obtenerNotis(uid) {
  let errorCodigo = null;

  //Consultar el los documentos en los que el uid sea igual al ingresado
  const querySnapshot = await referenciaNoti
    .where("creadorMeme", "==", uid)
    .orderBy("fecha", "desc")
    .get()
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo == null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function obtenerNotisXUsuarioLike(uid) {
  let errorCodigo = null;

  //Consultar el los documentos en los que el uid sea igual al ingresado
  const querySnapshot = await referenciaNoti.where("usuarioLike.uid", "==", uid).get()
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo == null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}

export async function obtenerNotisXMeme(url) {
  let errorCodigo = null;

  //Consultar el los documentos en los que el uid sea igual al ingresado
  const querySnapshot = await referenciaNoti.where("memeURL", "==", url).get()
    .catch(error => errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
  if (errorCodigo == null) {
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    return errorCodigo;
  }
}