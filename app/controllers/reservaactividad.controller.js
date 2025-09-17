import { pool } from "../database/conexionMysql.js";

// 📌 Mostrar formulario para iniciar reserva de actividad
export async function iniciar_reserva_actividad(req, res) {
  const { id } = req.params;

  // Buscar la actividad por ID
  const [actividades] = await pool.query("SELECT * FROM actividades WHERE id = ?", [id]);

  if (actividades.length === 0) {
    return res.status(404).send("Actividad no encontrada");
  }

  const actividad = actividades[0];
  console.log(actividad);
  const usuario = req.user || null;

  res.render("reserva-actividad", { actividad, usuario });
}

// 📌 Guardar una nueva reserva de actividad
export async function guardar_reserva_actividad(req, res) {
  const { actividad_id, usuario_id, num_personas, fecha_reserva, hora_reserva } = req.body;

  try {
    // Verificar si la actividad existe
    const [actividades] = await pool.query("SELECT * FROM actividades WHERE id = ?", [actividad_id]);
    if (actividades.length === 0) {
      return res.status(404).send("Actividad no encontrada");
    }

    // Verificar disponibilidad
    const [reservas_existentes] = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM reservas_actividades 
       WHERE actividad_id = ? 
       AND fecha_reserva = ? 
       AND hora_reserva = ?`,
     [  actividad_id, 
        fecha_reserva, 
        hora_reserva
    ] 
    );

    if (reservas_existentes[0].total > 0) {
      return res.status(400).send("❌ Ya existe una reserva para esta fecha y hora.");
    }

    // Insertar reserva
    await pool.query(
      `INSERT INTO reservas_actividades
        (usuario_id, actividad_id, num_personas, fecha_reserva, hora_reserva, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario_id || null,
        actividad_id,
        num_personas,
        fecha_reserva,
        hora_reserva,
        "pendiente"
      ]
    );

    // Redirigir a la confirmación
    res.redirect(`/reservar/actividad/${actividad_id}/confirmacion`);

  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Error al guardar la reserva de la actividad");
  }
}

// 📌 Confirmar reserva
export async function confirmar_reserva_actividad(req, res) {
  const { id } = req.params;
  try {
    const [actividades] = await pool.query("SELECT * FROM actividades WHERE id = ?", [id]);
    if (actividades.length === 0) {
      return res.status(404).send("Actividad no encontrada");
    }

    // Traer la última reserva
    const [reservas] = await pool.query(
      "SELECT * FROM reservas_actividades WHERE actividad_id = ? ORDER BY id DESC LIMIT 1",
      [id]
    );
    const usuario = req.user || null;
    res.render("confirmacion-reserva-actividad", {
      actividad: actividades[0],
      reserva: reservas[0],
      usuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la confirmación de la reserva de actividad");
  }
}