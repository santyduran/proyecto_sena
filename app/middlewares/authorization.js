import JsonWebToken from 'jsonwebtoken';
import dotenv from "dotenv";


dotenv.config();


async function soloAdmin(req,res,next){
    console.log("solo admin");  
    const logueado = await revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/")
}
    
async function soloPublico(req,res,next){
    const logueado = await revisarCookie (req);
    if (!logueado) return next();
    return res.redirect("/")

}

async function revisarCookie(req){
    try{
        if (!req.headers.cookie) 
            return false;
        console.log(req.headers.cookie);
        const cookieJWT = req.headers.cookie.split(";").find(cookie => cookie.startsWith("jwt=")).slice(4);
        
        const decodificada = JsonWebToken.verify(cookieJWT,process.env.JWT_SECRET);
        if (!decodificada) 
            return false;
        
        //consultar la base de datos y buscar el usuarios si existe.
        const [rows]= await pool.query('SELECT * FROM usuarios WHERE email=?',[decodificada.user]);
        return rows[0];   
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