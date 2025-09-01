import express from 'express';
import cookieParser from 'cookie-parser';  
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
import {methods as authentication} from "./controllers/authentication.controller.js";
import { buscador,buscador2 } from './controllers/buscador.controller.js';
import {methods as authorization} from "./middlewares/authorization.js";
import { iniciar_reserva,guardar_reserva,confirmarReserva } from './controllers/reservahotel.controller.js';
import {iniciar_reserva_restaurante,guardar_reserva_restaurante,confirmar_Reserva_restaurante} from './controllers/reservarestaurante.controller.js';
//rutas de la api
import dotenv from 'dotenv';
import { confirmar_reserva_actividad, guardar_reserva_actividad, iniciar_reserva_actividad } from './controllers/reservaactividad.controller.js';

dotenv.config();
const app = express();

app.set("views", path.join(__dirname, "views"));  
//server

app.set('port',4000);
app.set('view engine', 'ejs');
app.listen(app.get('port'));
console.log("servidor corriendo en puerto", app.get('port'));
//configuracion
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());


app.get('/login',(req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get('/register',(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get('/', async (req, res) => {
    
    const filter =req.query?.filter;
    const resultado = await buscador2(filter??"");
    res.render('buscador', resultado)
});

// 📌 Reserva de hoteles
app.get('/reservar/hotel/:id',authorization.soloPublico, iniciar_reserva);
app.post('/reservar/hotel/:id',authorization.soloPublico, guardar_reserva);
app.get('/reservar/hotel/:id/confirmacion', authorization.soloPublico,confirmarReserva);

// 📌 Reserva de restaurante
app.get('/reservar/restaurante/:id',authorization.soloPublico, iniciar_reserva_restaurante);
app.post('/reservar/restaurante/:id',authorization.soloPublico, guardar_reserva_restaurante);
app.get('/reservar/restaurante/:id/confirmacion', authorization.soloPublico,confirmar_Reserva_restaurante);

// 📌 Reserva de actividad
app.get('/reservar/actividad/:id',authorization.soloPublico, iniciar_reserva_actividad);
app.post('/reservar/actividad/:id',authorization.soloPublico, guardar_reserva_actividad);
app.get('/reservar/actividad/:id/confirmacion', authorization.soloPublico,confirmar_reserva_actividad);


//Registro de usuario
app.post('/api/login',authentication.login);
app.post('/api/register',authentication.register);

//buscador o index
 app.post('/api/busqueda',buscador);

