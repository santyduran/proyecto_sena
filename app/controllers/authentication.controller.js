import bcryptjs from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from './../database/conexionMysql.js';
dotenv.config();


async function login(req,res) {
    const user=req.body.email;   
    const password=req.body.password;
    if (!user || !password) {
         return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});
    }
    
    const [rows]= await pool.query('SELECT * FROM usuarios WHERE email=?',[user]);
      
    const usuarioARevisar = rows[0];
    if (!usuarioARevisar) 
        return res.status(400).send({status:"Error",message:"Error durante el login"});
    
     

    const loginCorrecto = await bcryptjs.compare(password,usuarioARevisar.contrasena);
    console.log(`${loginCorrecto} ${password} ${usuarioARevisar.contrasena}`);
    if(!loginCorrecto) 
        return res.status(400).send({status:"Error",message:"Error durante el login"});
    
    const token = JsonWebToken.sign(
        {user:usuarioARevisar.email},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOptions = {
        expires:new Date (Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt",token,cookieOptions);
    res.send({
        status:"ok",
        message:"Usuario logeado",
        redirect:"/"});


}

async function register(req,res) {
    console.log(req.body);
    const user=req.body.user;
    const password=req.body.password;
    const email=req.body.email;
    const birthday=req.body.birthday;
    const phone=req.body.phone; 

    if (!user || !password || !email||!birthday||!phone) {
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});
    }
    
    const [rows]= await pool.query('SELECT * FROM usuarios WHERE email=?',[user]);  
    if (rows[0]) {
    return res.status(400).send({status:"Error",message:"El usuario ya existe"});
    }   
    
    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(password,salt);
    const newUser={
        user,
        email,
        password:hashedPassword,
        birthday,
        phone
    }
    
    
    const r = await pool.query('INSERT INTO usuarios (nombre_completo,email,contrasena,fecha_nacimiento,telefono,fecha_registro) VALUES (?,?,?,?,?,NOW())',[user,email,hashedPassword,birthday,phone]);
    return res.status(201).send({status:"Ok",message:`Usuario ${newUser.user} registrado`,redirect:"/"});

}

export const methods = {
     login, 
     register
     };