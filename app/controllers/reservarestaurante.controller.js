import { pool } from "../database/conexionMysql.js";

export async function iniciar_reserva_restaurante(req, res) {
  const { id } = req.params;

  // Aquí consultas el restaurante por ID
  const [restaurantes] = await pool.query("SELECT * FROM restaurantes WHERE id = ?", [id]);

  if (restaurantes.length === 0) {
    return res.status(404).send("Restaurante no encontrado");
  }

  const restaurante = restaurantes[0];
  const usuario = req.user || null;
//     console.log(hotel);
//   console.log(usuario);
  res.render('reserva-restaurante', { restaurante,usuario });
}


export async function guardar_reserva_restaurante(req, res)  {
  const { restaurante_id, usuario_id, num_personas,fecha_reserva, hora_reserva } = req.body;

  try {
    // Verificar si el restaurante existe
    const [restaurantes] = await pool.query("SELECT * FROM restaurantes WHERE id = ?", [restaurante_id]);
    if (restaurantes.length === 0) {
      return res.status(404).send("restaurante no encontrado");
    }

  
    //Verificar si hay disponibilidad
    const [reservas_existentes] = await pool.query( 
     `SELECT COUNT(*) AS total 
       FROM reservas_restaurantes 
       WHERE restaurante_id = ? 
       AND fecha_reserva = ? 
       AND hora_reserva = ?`,
  {
    restaurante_id,
    fecha_reserva,
    hora_reserva
  }
);


    if (reservas_existentes[0].total> 0) {
    res.status(500).send("❌ ya esxiste una reserva para esta fecha y hora");  
    }

    // Insertar en la BD
    await pool.query(
      `INSERT INTO reservas_restaurantes
        (usuario_id, restaurante_id, num_personas, fecha_reserva, hora_reserva, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario_id || null,
        restaurante_id,
        num_personas,
        fecha_reserva,
        hora_reserva,
        "pendiente" // Estado inicial
        
      ]
    );

    // 🔥 Redirigir a confirmación con mensaje
    res.redirect(`/reservar/restaurante/${restaurante_id}/confirmacion`);

  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Error al guardar la reserva");
  }
}


export async function confirmar_Reserva_restaurante (req, res) {
  const { id } = req.params;
  try {
    const [restaurantes] = await pool.query("SELECT * FROM restaurantes WHERE id = ?", [id]);
    if (restaurantes.length === 0) {
      return res.status(404).send("restaurante no encontrado");
    }

    // Obtener la última reserva de ese hotel (puedes mejorar esto con WHERE usuario_id=? si quieres personalizar más)
    const [reservas] = await pool.query(
      "SELECT * FROM reservas_restaurantes WHERE restaurante_id = ? ORDER BY id DESC LIMIT 1",
      [id]
    );
  const usuario = req.user || null;
    res.render('confirmacion-reserva-restaurante', { 
      restaurante: restaurantes[0], 
      reserva: reservas[0] ,
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la confirmación");
  }
}