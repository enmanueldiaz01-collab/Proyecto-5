// ==========================================
//   CONFIGURACIÓN DE LA IA (GEMINI)
// ==========================================

// TU API KEY REAL (La que me pasaste)
const API_KEY = 'AIzaSyCeinbThuBPDQhdaitjMN1rAWUKxaYHC8k';

// URL del modelo (Usamos gemini-1.5-flash por ser rápido y gratuito)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// ==========================================
//   LÓGICA DEL CHAT
// ==========================================

// Función principal para llamar a la API
async function enviarMensajeAI(textoUsuario) {
    if (!textoUsuario) return;

    try {
        // 1. Preparamos los datos para enviar a Google
        const requestBody = {
            contents: [{
                parts: [{ text: textoUsuario }]
            }]
        };

        // 2. Hacemos la petición (fetch)
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // 3. Verificamos si hubo error
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        // 4. Obtenemos la respuesta
        const data = await response.json();
        
        // 5. Extraemos el texto de la IA
        const respuestaTexto = data.candidates[0].content.parts[0].text;
        
        return respuestaTexto;

    } catch (error) {
        console.error("Falló la conexión:", error);
        return "Lo siento, hubo un error al conectar con la IA. Revisa la consola (F12) para más detalles.";
    }
}


// ==========================================
//   INTERACCIÓN CON TU DISEÑO (DOM)
// ==========================================
// IMPORTANTE: Asegúrate de que los IDs aquí coincidan con tu HTML
// Si en tu HTML tus inputs tienen otros nombres, cámbialos abajo.

document.addEventListener('DOMContentLoaded', () => {
    
    // Busca el botón y el input en tu HTML (ajusta los selectores si es necesario)
    // Supondré que usas un <input> o <textarea> y un <button>
    const inputUsuario = document.querySelector('input[type="text"], textarea'); 
    const botonEnviar = document.querySelector('button'); 
    const contenedorChat = document.querySelector('#chat-container') || document.body; // Donde se mostrarán los mensajes

    // Función para mostrar mensajes en pantalla
    function agregarMensajePantalla(texto, esUsuario) {
        const div = document.createElement('div');
        div.style.padding = "10px";
        div.style.margin = "5px";
        div.style.borderRadius = "5px";
        div.style.backgroundColor = esUsuario ? "#e0f7fa" : "#f1f8e9";
        div.style.textAlign = esUsuario ? "right" : "left";
        div.innerHTML = `<strong>${esUsuario ? 'Tú' : 'IA'}:</strong> ${texto}`;
        
        // Si tienes un contenedor específico, agrégalo ahí, si no, al final del cuerpo
        if(contenedorChat) contenedorChat.appendChild(div);
    }

    // Evento al hacer clic en el botón
    if (botonEnviar && inputUsuario) {
        botonEnviar.addEventListener('click', async () => {
            const texto = inputUsuario.value;
            if (!texto) return;

            // 1. Mostrar mensaje del usuario
            agregarMensajePantalla(texto, true);
            inputUsuario.value = ''; // Limpiar input

            // 2. Mostrar "Escribiendo..."
            const loadingDiv = document.createElement('div');
            loadingDiv.innerText = "Pensando...";
            if(contenedorChat) contenedorChat.appendChild(loadingDiv);

            // 3. Llamar a la IA
            const respuesta = await enviarMensajeAI(texto);

            // 4. Quitar "Pensando..." y mostrar respuesta real
            loadingDiv.remove();
            agregarMensajePantalla(respuesta, false);
        });
    } else {
        console.warn("No encontré el botón o el input en el HTML. Revisa los selectores en el código JS.");
    }
});