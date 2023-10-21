import { db , storage , auth} from "../config/firebase";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import MemeViewModel from "./MemeViewModel";
import { passwordValido } from "../config/funciones";

export default class UserViewModel {

    static referenciaUsuarios = db.collection('users');

    static async crear(state){
        let errorCodigo = ""

        //Validacion de los campos
        if(!state.username){
            errorCodigo = "no-username"
        }else if(!state.email){
            errorCodigo = {code: "auth/invalid-email"}
        }else if(!passwordValido(state.password)){
            errorCodigo = "invalid-password"
        }else if(state.password !== state.confirmPassword){
            errorCodigo = "no-confirm-password"
        }else{

            //Consultar si ya hay un usuario con el username
            const consultaUsername = await UserViewModel.obtenerPorUsername(state.username);

            if(consultaUsername === "no-user"){

                //Crear el usuario con el email y el password
                //En caso de que se haya creado el usuario con exito se crea el documento con el usuario
                await auth.createUserWithEmailAndPassword(state.email,state.password).then(async result=>{
                    await UserViewModel.referenciaUsuarios.doc(result.user.uid).set({
                        username: state.username,
                        email: state.email,
                        photoURL: ""
                    }).catch(error => errorCodigo = {message: error.message, code: error.code});
                })
                .catch(error=>errorCodigo = {message: error.message, code: error.code});
            }else if(consultaUsername === "user-registered"){
                errorCodigo = "user-registered";
            }else{
                errorCodigo = consultaUsername;
            }
        }

        //Retornar "completado" en caso de que haya errores, o el error en caso de falla
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async ingresar(state){
        let errorCodigo = "";

        //Ingresar usuario con email y password
        await auth.signInWithEmailAndPassword(state.email,state.password)
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar "completado" en caso de que haya errores, o el error en caso de falla
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async cerrarSesion(){
        let errorCodigo = "";
        //Cerrar sesion con el auth del usuario actual
        await auth.signOut().catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar "completado" en caso de que haya errores, o el error en caso de falla
        if(errorCodigo ===""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async obtener(idUsuario) {
        let errorCodigo = "";

        //Consultar un documento con el id del usuario
        const doc = await UserViewModel.referenciaUsuarios.doc(idUsuario).get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
        if(doc.exists & errorCodigo === ""){
            return {uid: idUsuario,  ...doc.data()};
        }else{
            return errorCodigo;
        }
    }

    static async obtenerPorUsername(username) {
        let errorCodigo = "";

        //Consultar el los documentos en los que el username sea igual al ingresado
        const querySnapshot = await UserViewModel.referenciaUsuarios.where("username","==",username).get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Mapear el resultado en un arreglo
        const usuario = await querySnapshot.docs.map((doc)=>({uid: doc.id, ...doc.data()}))
        
        //Retornar el error del codigo en caso de haya uno
        if(errorCodigo !== ""){
            return errorCodigo;
        }
        //Retornar "no-user" en caso de que el usuario con el username no se encuentre
        if(usuario.length === 0){
            return "no-user";
        }
        //Retornar "user-registered" en caso de que el usuario con el username se encuentre
        if(usuario.length > 0){
            return "user-registered";
        }
    }

    static async editarInformacion(state) {

        let errorCodigo = "";

        //Iniciar sesion para verificar el usuario antes de cambiar todo
        const userCredentials = await auth.signInWithEmailAndPassword(auth.currentUser.email, state.passwordActual.trim())
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Validar si la sesion se creo correctamente
        if(userCredentials){
            //Validar si el usuario va a cambiar el username
            if(state.displayName.trim() !== state.comparaDisplayname){
                
                //Consultar si ya hay un usuario con el username
                const consultaUsername = await UserViewModel.obtenerPorUsername(state.displayName.trim());
                if(consultaUsername === "no-user"){
                    //Crear batch para actualizar los documentos asociados al usuario
                    const batch = db.batch();
                    //lote que se encarga de actualizar el documento del usuario
                    batch.update(UserViewModel.referenciaUsuarios.doc(userCredentials.user.uid),{
                        username: state.displayName
                    });
                    //Se consultan los documentos de los memes del usuario para editarlos 
                    const memes = await MemeViewModel.obtenerPorUsuario(userCredentials.user.uid);
                    memes.forEach(meme=>{
                        //Se recorre cada meme y se obtiene su referencia para agregarlo al lote del batch
                        const memeRef = MemeViewModel.referenciaMemes.doc(meme.id);
                        batch.update(memeRef, {"user.username": state.displayName});
                    })
                    //Se ejecuta el batch y devuelve error en caso de falla
                    await batch.commit()
                    .catch(error => errorCodigo = {message: error.message, code: error.code});

                }else if(consultaUsername === "user-registered"){
                    errorCodigo = "user-registered";
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
                        errorCodigo = "invalid-password";
                    } else {
                        //Actualizar el password
                        await userCredentials.user.updatePassword(state.password)
                        .catch(error => errorCodigo = {message: error.message, code: error.code});
                    }
                }else{
                    errorCodigo = "no-confirm-password"
                }
            }
        }
    
        //Retornar "completado" en caso de que haya errores, o el error en caso de falla
        if(errorCodigo === ""){
            return "completado"
        }else{
            return errorCodigo
        }
    }

    static async editarFotoDePerfil(idUsuario , uri) {

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
                batch.update(UserViewModel.referenciaUsuarios.doc(idUsuario),{
                    photoURL: url
                })
                //Se consultan los documentos de los memes del usuario para editarlos 
                const memes = await MemeViewModel.obtenerPorUsuario(idUsuario);
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
}