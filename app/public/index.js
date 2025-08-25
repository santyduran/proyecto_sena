document.addEventListener("DOMContentLoaded", () => {
  const btnCerrar = document.getElementById("cerrar_session");
  // 🔍 Verificar autenticación
  const autenticado = document.cookie.split("; ").some(row => row.startsWith("jwt="));

  if (!autenticado) {
    
    document.getElementById("loginDiv").style.display = "block";
        document.getElementById("logoutDiv").style.display = "none";
         } else {
    
        document.getElementById("loginDiv").style.display = "none";
    document.getElementById("logoutDiv").style.display = "block";
   
  }
});


const btnCerrar = document.getElementById("cerrar_session");
if (btnCerrar) {
    btnCerrar.addEventListener("click", (e) => {
        e.preventDefault();
        // 🔴 Eliminar cookie
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // 🔄 Redirigir al login
        window.location.href = "/";
    });
}

const btnIniciar = document.getElementById("iniciar_session");
if (btnIniciar) {
    btnIniciar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/login";
    });
}
