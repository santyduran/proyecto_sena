const params = new URLSearchParams(window.location.search);
const ciudadId = params.get("id");

// Elementos del DOM
const tituloCiudad = document.getElementById("tituloCiudad");
const descripcionCiudad = document.getElementById("descripcionCiudad");
const listaHoteles = document.getElementById("listaHoteles");
const listaRestaurantes = document.getElementById("listaRestaurantes");
const listaActividades = document.getElementById("listaActividades");

// Función para renderizar listas
function renderLista(ul, items, campo) {
  ul.innerHTML = "";
  if (items.length === 0) {
    ul.innerHTML = "<li>No hay resultados</li>";
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item[campo];
    ul.appendChild(li);
  });
}

// Cargar info de la ciudad
async function cargarCiudad() {
  if (!ciudadId) {
    alert("No se especificó una ciudad");
    return;
  }

  try {
    const res = await fetch(`/api/ciudades/${ciudadId}/info`);
    const data = await res.json();

    // Pintar datos
    tituloCiudad.textContent = `🌍 ${data.ciudad.nombre}`;
    descripcionCiudad.textContent = data.ciudad.descripcion || "Sin descripción disponible";

    renderLista(listaHoteles, data.hoteles, "nombre");
    renderLista(listaRestaurantes, data.restaurantes, "nombre");
    renderLista(listaActividades, data.actividades, "nombre");

  } catch (error) {
    console.error("Error cargando ciudad:", error);
    alert("Error cargando la información de la ciudad");
  }
}

cargarCiudad();
