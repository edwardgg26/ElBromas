
function verificarErrorFirebase(codigoError,mensaje){

    if(codigoError === "auth/invalid-email"){
        return "Debe ingresar un correo valido"
    } else if(codigoError === "auth/email-already-in-use"){
        return "Ya existe un usuario registrado con ese correo"
    } else if (codigoError === "auth/invalid-login-credentials"){
        return "Email o contraseña incorrectos";
    } else if (codigoError === "auth/missing-password"){
        return "Debe ingresar la contraseña original";
    } else if(codigoError === "auth/network-request-failed"){
        return "Error de Red";
    }else{
        console.log("Codigo: ",codigoError, ", Mensaje: ",mensaje);
        return codigoError;
    }
}

export{
    verificarErrorFirebase
}