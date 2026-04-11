// URL base del backend (en Docker usa el nombre del servicio)
const API_URL = 'http://localhost:5000/api';

// ── Mostrar mensaje de éxito o error ──────────────────────────────────────────
function mostrarMensaje(texto, tipo) {
  const el = document.getElementById('mensaje');
  el.textContent = texto;
  el.className = `mensaje ${tipo}`;
  setTimeout(() => { el.className = 'mensaje hidden'; }, 3000);
}

// ── Cargar y mostrar reservas ─────────────────────────────────────────────────
async function cargarReservas() {
  const contenedor = document.getElementById('lista-reservas');
  try {
    const res = await fetch(`${API_URL}/reservas`);
    const reservas = await res.json();

    if (reservas.length === 0) {
      contenedor.innerHTML = '<p class="vacio">No hay reservas aún.</p>';
      return;
    }

    contenedor.innerHTML = reservas.map(r => `
      <div class="tarjeta">
        <div class="tarjeta-info">
          <strong>${r.nombre}</strong>
          <span>📅 ${r.fecha} &nbsp;⏰ ${r.hora} &nbsp;👥 ${r.personas} persona(s)</span>
        </div>
        <button class="btn-eliminar" onclick="eliminarReserva('${r._id}')">✕</button>
      </div>
    `).join('');
  } catch (error) {
    contenedor.innerHTML = '<p class="error">Error al cargar reservas.</p>';
  }
}

// ── Crear nueva reserva ───────────────────────────────────────────────────────
async function crearReserva() {
  const nombre   = document.getElementById('nombre').value.trim();
  const fecha    = document.getElementById('fecha').value;
  const hora     = document.getElementById('hora').value;
  const personas = parseInt(document.getElementById('personas').value);

  if (!nombre || !fecha || !hora || !personas) {
    mostrarMensaje('Por favor completa todos los campos.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, fecha, hora, personas }),
    });

    if (!res.ok) {
      const data = await res.json();
      mostrarMensaje(data.error || 'Error al crear la reserva.', 'error');
      return;
    }

    // Limpiar formulario
    document.getElementById('nombre').value   = '';
    document.getElementById('fecha').value    = '';
    document.getElementById('hora').value     = '';
    document.getElementById('personas').value = '';

    mostrarMensaje('¡Reserva creada exitosamente!', 'exito');
    cargarReservas();
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor.', 'error');
  }
}

// ── Eliminar reserva ──────────────────────────────────────────────────────────
async function eliminarReserva(id) {
  if (!confirm('¿Seguro que deseas eliminar esta reserva?')) return;

  try {
    const res = await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      mostrarMensaje('Error al eliminar la reserva.', 'error');
      return;
    }

    mostrarMensaje('Reserva eliminada.', 'exito');
    cargarReservas();
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor.', 'error');
  }
}

// ── Eventos ───────────────────────────────────────────────────────────────────
document.getElementById('btn-reservar').addEventListener('click', crearReserva);

// Cargar reservas al iniciar
cargarReservas();