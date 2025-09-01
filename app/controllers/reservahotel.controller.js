
import { pool } from "../database/conexionMysql.js";

export async function iniciar_reserva(req, res) {
  const { id } = req.params;

  // Aquí consultas el hotel por ID
  const [hoteles] = await pool.query("SELECT * FROM hoteles WHERE id = ?", [id]);

  if (hoteles.length === 0) {
    return res.status(404).send("Hotel no encontrado");
  }

  const hotel = hoteles[0];
  const usuario = req.user || null;
//     console.log(hotel);
//   console.log(usuario);
  res.render('reserva-hotel', { hotel,usuario });
}


export async function guardar_reserva(req, res)  {
  const { hotel_id, usuario_id, numero_personas,fecha_entrada, fecha_salida } = req.body;

  try {
    // Verificar si el hotel existe
    const [hoteles] = await pool.query("SELECT * FROM hoteles WHERE id = ?", [hotel_id]);
    if (hoteles.length === 0) {
      return res.status(404).send("Hotel no encontrado");
    }

    console.log(fecha_entrada, fecha_salida);
    //Verificar si hay disponibilidad
    const [reservas_hoteles] = await pool.query(
  `SELECT COUNT(*) AS total 
   FROM reservas_hoteles 
   WHERE hotel_id = :hotel_id 
   AND (
        (fecha_entrada <= :fecha_entrada AND fecha_salida >= :fecha_entrada) 
     OR (fecha_entrada <= :fecha_salida AND fecha_salida >= :fecha_salida) 
     OR (fecha_entrada >= :fecha_entrada AND fecha_salida <= :fecha_salida)
   )`,
  {
    hotel_id,
    fecha_entrada,
    fecha_salida
  }
);

    const totalReservas = reservas_hoteles[0].total;

    if (totalReservas >0) {
    res.status(500).send("❌ Error al guardar la reserva: las fechas de la nueva reserva se solapan con una existente.");  
    }

    // Insertar en la BD
    await pool.query(
      `INSERT INTO reservas_hoteles
        (usuario_id, hotel_id, num_personas,fecha_entrada, fecha_salida )
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario_id || null, // puede ser null si el cliente no está logueado
        hotel_id,
        numero_personas,
        fecha_entrada,
        fecha_salida
        
      ]
    );

    // 🔥 Redirigir a confirmación con mensaje
    res.redirect(`/reservar/hotel/${hotel_id}/confirmacion`);

  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Error al guardar la reserva");
  }
}


export async function confirmarReserva (req, res) {
  const { id } = req.params;
  try {
    const [hoteles] = await pool.query("SELECT * FROM hoteles WHERE id = ?", [id]);
    if (hoteles.length === 0) {
      return res.status(404).send("Hotel no encontrado");
    }

    // Obtener la última reserva de ese hotel (puedes mejorar esto con WHERE usuario_id=? si quieres personalizar más)
    const [reservas] = await pool.query(
      "SELECT * FROM reservas_hoteles WHERE hotel_id = ? ORDER BY id DESC LIMIT 1",
      [id]
    );
  const usuario = req.user || null;
    res.render('confirmacion-reserva', { 
      hotel: hoteles[0], 
      reserva: reservas[0] ,
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la confirmación");
  }
}