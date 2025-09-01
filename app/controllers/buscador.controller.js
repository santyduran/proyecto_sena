import { pool } from "../database/conexionMysql.js";

export async function buscador(req,res){
const { filter } = req.body;
if(filter)
{
    const [ciudades] = await pool.query(
        "SELECT * FROM ciudades WHERE nombre like ?",
        [filter]
    );

    console.log(ciudades);
    const ciudad = ciudades[0];

    const [hoteles] = await pool.query("SELECT * FROM hoteles WHERE ciudad_id = ? limit 5",
        [ciudad.id],
    );

    const [restaurantes] = await pool.query(
        "SELECT * FROM restaurantes WHERE ciudad_id = ? limit 5",
        [ciudad.id]
    );

    const [actividades] = await pool.query(
        "SELECT * FROM actividades WHERE ciudad_id = ? limit 5",+
        [ciudad.id]
    );
    res.json({

        hoteles:hoteles,
        restaurantes:restaurantes,
        actividades: actividades
    });

}
else{
    const [hoteles] = await pool.query("SELECT * FROM hoteles limit 5");

    const [restaurantes] = await pool.query("SELECT * FROM restaurantes limit 5" );

    const [actividades] = await pool.query("SELECT * FROM actividades limit 5");

    res.json({

        hoteles:hoteles,
        restaurantes:restaurantes,
        actividades: actividades
    });
}
  
};


export async function buscador2(filter){
if(filter)
{
    const [ciudades] = await pool.query(
        "SELECT * FROM ciudades WHERE nombre like ?",
        [filter]
    );

    console.log(ciudades);
    const ciudad = ciudades[0];

    const [hoteles] = await pool.query("SELECT * FROM hoteles WHERE ciudad_id = ? limit 5",
        [ciudad.id],
    );

    const [restaurantes] = await pool.query(
        "SELECT * FROM restaurantes WHERE ciudad_id = ? limit 5",
        [ciudad.id]
    );

    const [actividades] = await pool.query(
        "SELECT * FROM actividades WHERE ciudad_id = ? limit 5",
        [ciudad.id]
    );
    return {

        hoteles:hoteles,
        restaurantes:restaurantes,
        actividades: actividades
    };

}
else{
    const [hoteles] = await pool.query("SELECT * FROM hoteles limit 5");

    const [restaurantes] = await pool.query("SELECT * FROM restaurantes limit 5" );

    const [actividades] = await pool.query("SELECT * FROM actividades limit 5");

    return {

        hoteles:hoteles,
        restaurantes:restaurantes,
        actividades: actividades
    };
}
  
};
