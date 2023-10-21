import { db , storage , auth } from "../config/firebase";
import UserViewModel from "./UserViewModel";
import { uploadBytes, ref, getDownloadURL , deleteObject } from 'firebase/storage';
import { arrayRemove, arrayUnion } from "firebase/firestore";

export default class MemeViewModel {

    static referenciaMemes = db.collection('memes');

    static async obtener() {
        let errorCodigo = "";
        
        //Consultar los documentos y ser ordenan por fecha
        const querySnapshot = await MemeViewModel.referenciaMemes.orderBy("fecha","desc").get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
        if(errorCodigo == ""){
            return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        }else{
            return errorCodigo;
        }
    }

    static async obtenerPorId(id){
        let errorCodigo = "";
        //Consultar un documento con el id del meme
        const doc = await MemeViewModel.referenciaMemes.doc(id).get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
        if(doc.exists & errorCodigo === ""){
            return {id: doc.id,  ...doc.data()};
        }else{
            return errorCodigo;
        }
    }

    static async obtenerPorUsuario(uid) {
        let errorCodigo = "";
        //Consultar el los documentos en los que el uid sea igual al ingresado
        const querySnapshot = await MemeViewModel.referenciaMemes.where("user.uid","==",uid).orderBy("fecha","desc").get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});
        //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
        if(errorCodigo == ""){
            return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        }else{
            return errorCodigo;
        }
    }

    static async obtenerPorCategoria(idCategoria) {
        let errorCodigo = "";
        //Consultar el los documentos en los que el id sea igual al ingresado
        const querySnapshot = await MemeViewModel.referenciaMemes.where("categoria","array-contains",idCategoria).orderBy("fecha","desc").get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});
        //Retornar los datos en un arreglo, en caso de que haya errores retorna la falla
        if(errorCodigo == ""){
            return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        }else{
            return errorCodigo;
        }
    }

    static async subirMeme(idUsuario , uri, categorias){
        let errorCodigo = "";

        //Convertir la imagen en un blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        //Se apunta a la referencia del storage del meme junto con la fecha de creacion
        const fecha = new Date().toISOString();
        const referenciaImagen =  ref(storage,`meme/${fecha}`);

        const usuario = await UserViewModel.obtener(idUsuario)
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        if(errorCodigo === ""){
            //Se sube el blob en la referencia
            await uploadBytes(referenciaImagen, blob)
            .then(async() => {
                //Se obtiene la url del archivo subido
                const url = await getDownloadURL(referenciaImagen).catch(error=>errorCodigo = {message: error.message, code: error.code});

                //Verificar si la url se obtuvo
                if(url){
                    await MemeViewModel.referenciaMemes.doc().set({
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
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async reaccionar(state){

        let errorCodigo = "";

        //Se determina si el id del usuario NO se encuentra en los likes del meme
        if(!state.likes.includes(auth.currentUser.uid)){

            //En caso de ser asi se actualiza añadiendo al usuario
            await MemeViewModel.referenciaMemes.doc(state.id).update({
                likes: arrayUnion(auth.currentUser.uid)
            }).catch(error => errorCodigo = {code: error.code, message: error.message});
        }else{

            //De lo contrario quiere decir que el usuario dio like por lo que se elimina la reaccion
            await MemeViewModel.referenciaMemes.doc(state.id).update({
                likes: arrayRemove(auth.currentUser.uid)
            }).catch(error => errorCodigo = {code: error.code, message: error.message});
        }

        //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async borrar(state){

        let errorCodigo = "";

        //Obtener la referencia de la imagen a borrar
        const desertRef = ref(storage, `meme/${state.fecha}`);
        
        //Se borra la imagen
        await deleteObject(desertRef).then(async() => {
            
            //Se borra del documento
            await MemeViewModel.referenciaMemes.doc(state.id).delete()
            .catch(error => errorCodigo = {code: error.code, message: error.message})
        }).catch(error => errorCodigo = {code: error.code, message: error.message});

        //Retornar "completado" en caso de que haya errores, o el codigo del error en caso de falla
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }
}