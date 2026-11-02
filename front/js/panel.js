// ---------- Protección de la vista ----------
const token = sessionStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

document.getElementById('nombreAdmin').textContent = sessionStorage.getItem('nombreAdmin') || '';

function salirALogin() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

// Pedido a la API con el token; si la sesión venció, vuelve al login
async function api(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  if (res.status === 401) {
    salirALogin();
    throw new Error('Sesión vencida');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en el servidor');
  return data;
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

// ---------- Listado y filtros ----------
const tbody = document.getElementById('tbodyConsultas');
const contador = document.getElementById('contador');
const filtroEstado = document.getElementById('filtroEstado');
const filtroFecha = document.getElementById('filtroFecha');
const filtroBusqueda = document.getElementById('filtroBusqueda');

async function cargarConsultas() {
  const params = new URLSearchParams();
  if (filtroEstado.value !== '') params.append('leida', filtroEstado.value);
  if (filtroFecha.value) params.append('fecha', filtroFecha.value);
  if (filtroBusqueda.value.trim()) params.append('q', filtroBusqueda.value.trim());

  try {
    const consultas = await api('/api/consultas?' + params.toString());

    contador.textContent = consultas.length + (consultas.length === 1 ? ' consulta' : ' consultas');

    if (consultas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="vacio">No hay consultas para mostrar.</td></tr>';
      return;
    }

    tbody.innerHTML = consultas.map(c => `
      <tr data-id="${c.id}" class="${c.leida ? '' : 'no-leida'}">
        <td>${escaparHTML(c.nombre)}</td>
        <td>${escaparHTML(c.email)}</td>
        <td>${escaparHTML(c.asunto)}</td>
        <td>${formatearFecha(c.fecha)}</td>
        <td>${c.leida
          ? '<span class="badge leida">Leída</span>'
          : '<span class="badge noleida">No leída</span>'}</td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="vacio">${escaparHTML(err.message)}</td></tr>`;
  }
}

// Filtros: se recarga al cambiar; la búsqueda espera un instante mientras se escribe
let temporizador;
filtroEstado.addEventListener('change', cargarConsultas);
filtroFecha.addEventListener('change', cargarConsultas);
filtroBusqueda.addEventListener('input', () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarConsultas, 300);
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  filtroEstado.value = '';
  filtroFecha.value = '';
  filtroBusqueda.value = '';
  cargarConsultas();
});

// ---------- Detalle ----------
const modal = document.getElementById('modal');
const btnToggle = document.getElementById('btnToggleLeida');
let consultaActual = null;

function mostrarDetalle(c) {
  consultaActual = c;
  document.getElementById('detAsunto').textContent = c.asunto;
  document.getElementById('detNombre').textContent = c.nombre;
  document.getElementById('detEmail').textContent = c.email;
  document.getElementById('detTelefono').textContent = c.telefono || 'No informado';
  document.getElementById('detServicio').textContent = c.servicio || 'No especificado';
  document.getElementById('detFecha').textContent = formatearFecha(c.fecha);
  document.getElementById('detEstado').textContent = c.leida ? 'Leída' : 'No leída';
  document.getElementById('detMensaje').textContent = c.mensaje;
  btnToggle.textContent = c.leida ? 'Marcar como no leída' : 'Marcar como leída';
  modal.hidden = false;
}

tbody.addEventListener('click', async (e) => {
  const fila = e.target.closest('tr[data-id]');
  if (!fila) return;
  try {
    const consulta = await api('/api/consultas/' + fila.dataset.id);
    mostrarDetalle(consulta);
  } catch (err) {
    alert(err.message);
  }
});

btnToggle.addEventListener('click', async () => {
  if (!consultaActual) return;
  try {
    const nuevoEstado = !consultaActual.leida;
    await api(`/api/consultas/${consultaActual.id}/leida`, {
      method: 'PATCH',
      body: JSON.stringify({ leida: nuevoEstado })
    });
    consultaActual.leida = nuevoEstado ? 1 : 0;
    mostrarDetalle(consultaActual);
    cargarConsultas();
  } catch (err) {
    alert(err.message);
  }
});

function cerrarModal() {
  modal.hidden = true;
  consultaActual = null;
}
document.getElementById('cerrarModal').addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

// ---------- Cerrar sesión ----------
document.getElementById('btnSalir').addEventListener('click', async () => {
  try {
    await api('/api/logout', { method: 'POST' });
  } catch (err) {
    // si falla igual se cierra la sesión del lado del navegador
  }
  salirALogin();
});

// ---------- Inicio ----------
cargarConsultas();