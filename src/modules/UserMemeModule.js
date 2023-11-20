import { db , storage , auth} from "../config/firebase";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { referenciaMemes , obtenerPorUsuario } from "./MemeModule";
import { referenciaUsuarios , obtenerPorUsername , obtenerUsuario } from "./UserModule";
import { referenciaNoti , obtenerNotisXUsuarioLike } from "./NotificationModule";
import { passwordValido } from "../config/funciones";

export async function subirMeme(idUsuario , uri, categorias){
    let errorCodigo = null;

    //Convertir la imagen en un blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    //Se apunta a la referencia del storage del meme junto con la fecha de creacion
    const fecha = new Date().toISOString();
    const referenciaImagen =  ref(storage,`meme/${fecha}`);

    const usuario = await obtenerUsuario(idUsuario)
    .catch(error => errorCodigo = {message: error.message, code: error.code});

    if(errorCodigo === null){
        //Se sube el blob en la referencia
        await uploadBytes(referenciaImagen, blob)
        .then(async() => {
            //Se obtiene la url del archivo subido
            const url = await getDownloadURL(referenciaImagen).catch(error=>errorCodigo = {message: error.message, code: error.code});

            //Verificar si la url se obtuvo
            if(url){
                await referenciaMemes.doc().set({
                    fecha: fecha,
                    photoURL: url,
                    categoria: categorias,
                    user: usuario,
                    likes: []
                }).catch(error => errorCodigo = {message: error.message, code: error.code});
            }
        }).catch(error => errorCodigo = {message: error.message, code: error.code});
    }

    //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
    if(errorCodigo === null){
        return "completado"
    }else{
        return errorCodigo
    }
}

export async function editarInformacion(state) {

    let errorCodigo = null;

    //Iniciar sesion para verificar el usuario antes de cambiar todo
    const userCredentials = await auth.signInWithEmailAndPassword(auth.currentUser.email, state.passwordActual.trim())
    .catch(error => errorCodigo = {message: error.message, code: error.code});

    //Validar si la sesion se creo correctamente
    if(errorCodigo === null){
        //Validar si el usuario va a cambiar el username
        if(state.displayName.trim() !== state.comparaDisplayname){
            
            //Consultar si ya hay un usuario con el username
            const consultaUsername = await obtenerPorUsername(state.displayName.trim());
            if(consultaUsername.code === "no-user"){
                //Crear batch para actualizar los documentos asociados al usuario
                const batch = db.batch();
                //lote que se encarga de actualizar el documento del usuario
                batch.update(referenciaUsuarios.doc(userCredentials.user.uid),{
                    username: state.displayName
                });
                //Se consultan los documentos de los memes del usuario para editarlos 
                const memes = await obtenerPorUsuario(userCredentials.user.uid);
                memes.forEach(meme=>{
                    //Se recorre cada meme y se obtiene su referencia para agregarlo al lote del batch
                    const memeRef = referenciaMemes.doc(meme.id);
                    batch.update(memeRef, {"user.username": state.displayName});
                })
                //Se consultan los documentos de las notificaciones a las que pertenece el usuario para editarlas 
                const notis = await obtenerNotisXUsuarioLike(userCredentials.user.uid);
                notis.forEach(noti=>{
                    //Se recorre cada notificacion y se obtiene su referencia para agregarla al lote del batch
                    const notiRef = referenciaNoti.doc(noti.id);
                    batch.update(notiRef, {"usuarioLike.username": state.displayName});
                })
                //Se ejecuta el batch y devuelve error en caso de falla
                await batch.commit()
                .catch(error => errorCodigo = {message: error.message, code: error.code});

            }else if(consultaUsername.code === "user-registered"){
                errorCodigo = {code: "user-registered"};
            }else{
                errorCodigo = consultaUsername;
            }
        }

        //Actualizar el password en caso de haberlo ingresado
        if (state.password) {
            //Comprobar si el usuario confirmo el password correctamente
            if(state.password === state.confirmPassword){
                //Comprobar que es un password valido
                if (!passwordValido(state.password)) {
                    errorCodigo = {code: "invalid-password"};
                } else {
                    //Actualizar el password
                    await userCredentials.user.updatePassword(state.password)
                    .catch(error => errorCodigo = {message: error.message, code: error.code});
                }
            }else{
                errorCodigo = {code: "no-confirm-password"}
            }
        }
    }

    //Retornar "completado" en caso de que haya errores, o el error en caso de falla
    if(errorCodigo === null){
        return "completado"
    }else{
        return errorCodigo
    }
}

export async function editarFotoDePerfil(idUsuario , uri) {

    let errorCodigo = "";

    //Convertir la imagen en un blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    //Se apunta a la referencia del storage del usuario
    const referenciaStorage = ref(storage,`profilePhoto/${idUsuario}`);

    //Se sube el blob en la referencia
    await uploadBytes(referenciaStorage, blob)
    .then(async() => {
        
        //Se obtiene la url del archivo subido
        const url = await getDownloadURL(referenciaStorage).catch(error=>errorCodigo = {message: error.message, code: error.code});

        //Verificar si la url se obtuvo
        if(url){
            //Crear batch para actualizar los documentos asociados al usuario
            const batch = db.batch();

            //lote que se encarga de actualizar el documento del usuario
            batch.update(referenciaUsuarios.doc(idUsuario),{
                photoURL: url
            })
            //Se consultan los documentos de los memes del usuario para editarlos 
            const memes = await obtenerPorUsuario(idUsuario);
            memes.forEach(meme=>{
                //Se recorre cada meme y se obtiene su referencia para agregarlo al lote del batch
                const memeRef = db.collection("memes").doc(meme.id);
                batch.update(memeRef, {"user.photoURL": url});
            });
            //Se ejecuta el batch y devuelve error en caso de falla
            await batch.commit()
            .catch(error => errorCodigo = {message: error.message, code: error.code});
        }
    }).catch(error => {
        errorCodigo = {message: error.message, code: error.code};
    });

    //Retornar "completado" en caso de que haya errores, o el error en caso de falla
    if(errorCodigo === ""){
        return "completado"
    }else{
        return errorCodigo
    }
}