import JsonWebToken from 'jsonwebtoken';
import dotenv from "dotenv";
import {usuarios} from "./../controllers/authentication.controller.js";

dotenv.config();


function soloAdmin(req,res,next){
    console.log("solo admin");  
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/")
}
    
function soloPublico(req,res,next){
    const logueado = revisarCookie (req);
    if (!logueado) return next();
    return res.redirect("/")

}

function revisarCookie(req){
    try{
        
        const cookieJWT = req.headers.cookie.split(";").find(cookie => cookie.startsWith("jwt=")).slice(4);
        //console.log(`Cookies: ${cookieJWT}`);
        const decodificada = JsonWebToken.verify(cookieJWT,process.env.JWT_SECRET);
        //console.log(decodificada);
        //console.log(usuarios);
        const usuarioARevisar= usuarios.find(usuario => usuario.user===decodificada.user);
        return usuarioARevisar;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

export const methods = {
    soloAdmin,
    soloPublico,
    
     };