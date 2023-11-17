import { db, auth } from "../config/firebase";
import { passwordValido } from "../config/funciones";

export const referenciaUsuarios = db.collection("users");

export async function ingresar(state) {
  let errorCodigo = null;

  //Ingresar usuario con email y password

  if(!state.email){
    errorCodigo = {code: "auth/invalid-email"};
  }else if (!state.password){
    errorCodigo = {code: "auth/missing-password"};
  } else{
    await auth.signInWithEmailAndPassword(state.email, state.password)
        .catch(error =>errorCodigo = { message: error.message, code: error.code });
  }

  //Retornar "completado" en caso de que haya errores, o el error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function crear(state) {
  let errorCodigo = null;

  //Validacion de los campos
  if (!state.username) {
    errorCodigo = {code: "no-username"};
  } else if (!state.email) {
    errorCodigo = { code: "auth/invalid-email"};
  } else if (!passwordValido(state.password)) {
    errorCodigo = {code: "invalid-password"};
  } else if (state.password !== state.confirmPassword) {
    errorCodigo = {code: "no-confirm-password"};
  } else {
    //Consultar si ya hay un usuario con el username
    const consultaUsername = await obtenerPorUsername(state.username);

    if (consultaUsername.code === "no-user") {
      //Crear el usuario con el email y el password
      //En caso de que se haya creado el usuario con exito se crea el documento con el usuario
      await auth.createUserWithEmailAndPassword(state.email, state.password)
        .then(async (result) => {
            await referenciaUsuarios.doc(result.user.uid).set({
              username: state.username,
              email: state.email,
              photoURL: "",
              notiReaded: true,
            })
            .catch(error =>errorCodigo = { message: error.message, code: error.code });
        })
        .catch(error =>errorCodigo = { message: error.message, code: error.code });
    } else if (consultaUsername.code === "user-registered") {
      errorCodigo = {code: "user-registered"};
    } else {
      errorCodigo = consultaUsername;
    }
  }

  //Retornar "completado" en caso de que haya errores, o el error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function cerrarSesion() {
  let errorCodigo = "";
  //Cerrar sesion con el auth del usuario actual
  await auth.signOut()
    .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar "completado" en caso de que haya errores, o el error en caso de falla
  if (errorCodigo === "") {
    return "completado";
  } else {
    return errorCodigo;
  }
}

export async function obtenerUsuario(idUsuario) {
  let errorCodigo = null;

  //Consultar un documento con el id del usuario
  const doc = await referenciaUsuarios.doc(idUsuario).get()
        .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
  if (doc.exists & (errorCodigo === null)) {
    return { uid: idUsuario, ...doc.data() };
  } else {
    return errorCodigo;
  }
}

export async function obtenerPorUsername(username) {
  let errorCodigo = null;

  //Consultar el los documentos en los que el username sea igual al ingresado
  const querySnapshot = await referenciaUsuarios.where("username", "==", username).get()
  .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Mapear el resultado en un arreglo
  const usuario = await querySnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));

  //Retornar el error del codigo en caso de haya uno
  if (errorCodigo !== null) {
    return errorCodigo;
  }
  //Retornar "no-user" en caso de que el usuario con el username no se encuentre
  if (usuario.length === 0) {
    return {code:"no-user"};
  }
  //Retornar "user-registered" en caso de que el usuario con el username se encuentre
  if (usuario.length > 0) {
    return {code:"user-registered"};
  }
}

export async function editarEstadoNoti(state, boolean) {
  let errorCodigo = null;

  //Actualizar el campo del usuario con el id
  await referenciaUsuarios.doc(state.user.uid).update({notiReaded: boolean})
    .catch(error =>errorCodigo = { message: error.message, code: error.code });

  //Retornar "completado" en caso de que haya errores, o el error en caso de falla
  if (errorCodigo === null) {
    return "completado";
  } else {
    return errorCodigo;
  }
}