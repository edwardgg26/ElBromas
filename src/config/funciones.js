import * as ImagePicker from "expo-image-picker";

//Valida si una contraseña es valida o no
function passwordValido(password){
    if(password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)){
        return false
    }else{
        return true
    }
}

//Valida el codigo del error y retorna un mensaje acorde a ese error
function verificarError(error){

    //Errores de validacion
    if(error === "no-username"){
        return "Debe ingresar un nombre de usuario"
    } else if(error === "invalid-password"){
        return "La contraseña debe contener por lo menos 8 caracteres, combinando mayusculas, minusculas y numeros";
    } else if(error === "no-confirm-password"){
        return "Las contraseñas no son iguales";
    } else if(error === "no-image-selected"){
        return "Debes seleccionar una imagen";
    } else if(error === "user-registered"){
        return "Ya hay un usuario con ese username";
    } else if(error === "no-category-selected"){
        return "Debes seleccionar por lo menos una categoría";
    }
    
    //Errores de firebase
    else if(error.code === "auth/email-already-in-use"){
        return "Ya existe un usuario registrado con ese correo"
    } else if(error.code === "auth/invalid-email"){
        return "Debe ingresar un correo valido"
    } else if (error.code === "auth/invalid-login-credentials"){
        return "Email o contraseña incorrectos";
    } else if (error.code === "auth/missing-password"){
        return "Debe ingresar la contraseña original";
    } else if(error.code === "auth/network-request-failed"){
        return "Error de Red";
    } else if(error.code === "auth/too-many-requests"){
        return "Estas tratando de iniciar sesión muchas veces.";
    } else{
        console.log("Codigo: ",error.code, "Mensaje: ", error.message);
        return error.message;
    }
}

//Permite seleccionar una imagen
async function seleccionarImagen(tipoImagen) {
    let configImagen = null;

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // return;
    if (permissionResult.granted === false) {
      alert("Se necesitan los permisos para acceder a la galería.");
      return "no-permission";
    }else{
        if(tipoImagen === "perfil"){
            configImagen = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 0.5,
            }
        }else if(tipoImagen === "meme"){
            configImagen = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.5
            }
        }

        return await ImagePicker.launchImageLibraryAsync(configImagen);
    }
}

//Exporta las funciones
export{
    verificarError,
    seleccionarImagen,
    passwordValido
}