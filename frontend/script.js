/* ── Configuración ────────────────────────────────────────────────────────── */
const API_URL = 'http://localhost:5000/api';

/* ── Estado de la selección ───────────────────────────────────────────────── */
let personas = 2;
let fechaSeleccionada = null;
let horaSeleccionada  = null;

const HORARIOS = ['13:00','14:00','14:30','15:00','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];

/* ── NAV scroll ───────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Stepper de personas ──────────────────────────────────────────────────── */
document.getElementById('inc-personas').addEventListener('click', () => {
  if (personas < 20) { personas++; document.getElementById('personas-display').textContent = personas; }
});
document.getElementById('dec-personas').addEventListener('click', () => {
  if (personas > 1)  { personas--; document.getElementById('personas-display').textContent = personas; }
});

/* ── Calendario strip ─────────────────────────────────────────────────────── */
function buildCalendar() {
  const strip = document.getElementById('calendar-strip');
  strip.innerHTML = '';
  const hoy = new Date();
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  for (let i = 0; i < 14; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);

    const el = document.createElement('div');
    el.className = 'cal-day' + (i === 0 ? ' selected' : '');
    el.dataset.fecha = d.toISOString().split('T')[0];
    el.innerHTML = `
      <div class="cal-dow">${dias[d.getDay()]}</div>
      <div class="cal-num">${d.getDate()}</div>
    `;
    el.addEventListener('click', () => selectDate(el, d.toISOString().split('T')[0]));
    strip.appendChild(el);

    if (i === 0) fechaSeleccionada = d.toISOString().split('T')[0];
  }
}

function selectDate(el, fecha) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  fechaSeleccionada = fecha;
  horaSeleccionada  = null;
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
}

/* ── Time slots ───────────────────────────────────────────────────────────── */
function buildTimeSlots() {
  const container = document.getElementById('time-slots');
  container.innerHTML = '';
  HORARIOS.forEach(h => {
    const el = document.createElement('div');
    el.className = 'time-slot';
    el.textContent = h;
    el.addEventListener('click', () => selectHora(el, h));
    container.appendChild(el);
  });
}

function selectHora(el, hora) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  horaSeleccionada = hora;
}

/* ── Paso 1 → 2 ───────────────────────────────────────────────────────────── */
document.getElementById('btn-siguiente').addEventListener('click', () => {
  if (!fechaSeleccionada || !horaSeleccionada) {
    alert('Por favor selecciona una fecha y un horario.');
    return;
  }
  const fecha = new Date(fechaSeleccionada + 'T12:00:00');
  const opts  = { weekday: 'long', day: 'numeric', month: 'long' };
  const str   = fecha.toLocaleDateString('es-MX', opts);
  document.getElementById('resumen-texto').textContent =
    `${personas} persona(s) · ${str} · ${horaSeleccionada}`;
  document.getElementById('widget-step1').classList.add('hidden');
  document.getElementById('widget-step2').classList.remove('hidden');
});

/* ── Paso 2 → 1 (editar) ──────────────────────────────────────────────────── */
document.getElementById('btn-editar').addEventListener('click', irAlPaso1);
document.getElementById('btn-volver').addEventListener('click', irAlPaso1);
function irAlPaso1() {
  document.getElementById('widget-step2').classList.add('hidden');
  document.getElementById('widget-step1').classList.remove('hidden');
}

/* ── Confirmar reserva ────────────────────────────────────────────────────── */
document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const msgEl  = document.getElementById('mensaje');

  if (!nombre) {
    msgEl.textContent = 'Por favor ingresa tu nombre.';
    msgEl.className = 'ot-mensaje error';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, fecha: fechaSeleccionada, hora: horaSeleccionada, personas }),
    });

    if (!res.ok) {
      const data = await res.json();
      msgEl.textContent = data.error || 'Error al crear la reserva.';
      msgEl.className = 'ot-mensaje error';
      return;
    }

    // Paso 3
    const fecha = new Date(fechaSeleccionada + 'T12:00:00');
    const opts  = { weekday: 'long', day: 'numeric', month: 'long' };
    const str   = fecha.toLocaleDateString('es-MX', opts);
    document.getElementById('confirm-msg').textContent =
      `¡Listo, ${nombre}! Tu mesa para ${personas} persona(s) el ${str} a las ${horaSeleccionada} está confirmada. ¡Te esperamos!`;
    document.getElementById('widget-step2').classList.add('hidden');
    document.getElementById('widget-step3').classList.remove('hidden');

    cargarReservas();
    msgEl.className = 'ot-mensaje hidden';
    document.getElementById('nombre').value = '';

  } catch {
    msgEl.textContent = 'No se pudo conectar con el servidor.';
    msgEl.className = 'ot-mensaje error';
  }
});

/* ── Reiniciar widget ─────────────────────────────────────────────────────── */
document.getElementById('btn-nueva').addEventListener('click', () => {
  personas = 2;
  document.getElementById('personas-display').textContent = '2';
  horaSeleccionada = null;
  fechaSeleccionada = null;
  buildCalendar();
  buildTimeSlots();
  document.getElementById('widget-step3').classList.add('hidden');
  document.getElementById('widget-step1').classList.remove('hidden');
});

/* ── Cargar lista de reservas ─────────────────────────────────────────────── */
async function cargarReservas() {
  const contenedor = document.getElementById('lista-reservas');
  try {
    const res      = await fetch(`${API_URL}/reservas`);
    const reservas = await res.json();

    if (reservas.length === 0) {
      contenedor.innerHTML = '<p class="lista-vacio">No hay reservas registradas.</p>';
      return;
    }

    contenedor.innerHTML = reservas.map(r => {
      const fecha = new Date(r.fecha + 'T12:00:00');
      const opts  = { weekday: 'short', day: 'numeric', month: 'short' };
      const fechaStr = fecha.toLocaleDateString('es-MX', opts);
      return `
        <div class="reserva-card">
          <div class="reserva-info">
            <div class="reserva-nombre">${r.nombre}</div>
            <div class="reserva-detalle">📅 <span>${fechaStr}</span></div>
            <div class="reserva-detalle">⏰ <span>${r.hora}</span> &nbsp;·&nbsp; 👥 <span>${r.personas} persona(s)</span></div>
          </div>
          <button class="reserva-del-btn" onclick="eliminarReserva('${r._id}')" title="Eliminar">✕</button>
        </div>
      `;
    }).join('');
  } catch {
    contenedor.innerHTML = '<p class="lista-vacio">Error al cargar reservas.</p>';
  }
}

/* ── Eliminar reserva ─────────────────────────────────────────────────────── */
async function eliminarReserva(id) {
  if (!confirm('¿Eliminar esta reserva?')) return;
  try {
    await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' });
    cargarReservas();
  } catch {
    alert('Error al eliminar la reserva.');
  }
}

/* ── Init ─────────────────────────────────────────────────────────────────── */
buildCalendar();
buildTimeSlots();
cargarReservas();