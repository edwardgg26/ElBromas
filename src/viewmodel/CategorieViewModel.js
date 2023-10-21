import { db } from "../config/firebase";

export default class CategorieViewModel {

    static referenciaCategorias = db.collection('categorias');

    static async obtener() {
        let errorCodigo = "";

        //Consultar los documentos y ser ordenan por fecha
        const querySnapshot = await CategorieViewModel.referenciaCategorias.get()
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
        //Consultar un documento con el id de la categoria
        const doc = await CategorieViewModel.referenciaCategorias.doc(id).get()
        .catch(error => errorCodigo = {message: error.message, code: error.code});

        //Retornar los datos en un objeto en caso de que haya errores, o el error en caso de falla
        if(doc.exists & errorCodigo === ""){
            return {id: doc.id,  ...doc.data()};
        }else{
            return errorCodigo;
        }
    }
}