import bcryptjs from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const salt = await bcryptjs.genSalt(5);
const hashedPassword = await bcryptjs.hash("a",salt);

export const usuarios= [{
    user: "a",
    email: "a@a.com",
    password: hashedPassword,
}]

async function login(req,res) {
    //console.log(req.body);
    const user=req.body.user;   
    const password=req.body.password;
    if (!user || !password) 
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});

    console.log(usuarios);
    const usuarioARevisar= usuarios.find(usuario => usuario.user===user);
    if (!usuarioARevisar) 
        return res.status(400).send({status:"Error",message:"Error durante el login"});

    const loginCorrecto = await bcryptjs.compare(password,usuarioARevisar.password);
    console.log(`${loginCorrecto} ${password} ${usuarioARevisar.password}`);
    if(!loginCorrecto) 
        return res.status(400).send({status:"Error",message:"Error durante el login"});
    
    const token = JsonWebToken.sign(
        {user:usuarioARevisar.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOptions = {
        expires:new Date (Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt",token,cookieOptions);
    res.send({status:"ok",message:"Usuario logeado",redirect:"/"});


}

async function register(req,res) {
    console.log(req.body);
    const user=req.body.user;
    const password=req.body.password;
    const email=req.body.email;
    if (!user || !password || !email) {
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});
    }
    const usuarioARevisar= usuarios.find(usuario => usuario.user===user);
    if (usuarioARevisar) {
        return res.status(400).send({status:"Error",message:"El usuario ya existe"});
    }
    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(password,salt);
    const newUser={
        user,
        email,
        password:hashedPassword,
    }
    
    usuarios.push(newUser);
    console.log(usuarios);
    return res.status(201).send({status:"Ok",message:`Usuario ${newUser.user} registrado`,redirect:"/"});

}

export const methods = {
     login, 
     register
     };