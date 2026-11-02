// ---------- Menú móvil ----------
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('abierto');
  });
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

async function cargarServicios() {
  const contenedor = document.getElementById('listaServicios');
  if (!contenedor) return;

  try {
    const res = await fetch('/api/servicios');
    if (!res.ok) throw new Error('Respuesta inválida');
    const servicios = await res.json();

    contenedor.innerHTML = servicios.map(s => {
      const precio = s.precio !== null
        ? '$' + Number(s.precio).toLocaleString('es-AR')
        : 'Consultar';
      return `
        <article class="card">
          <div class="icono"><i class="fa-solid ${escaparHTML(s.icono || 'fa-gear')}"></i></div>
          <h3>${escaparHTML(s.nombre)}</h3>
          <p>${escaparHTML(s.descripcion)}</p>
          <span class="precio">${precio}</span>
          <a href="contacto.html?servicio=${Number(s.id)}" class="btn btn-primario btn-chico">Consultar</a>
        </article>`;
    }).join('');
    activarAnimaciones();
  } catch (err) {
    contenedor.innerHTML = '<p class="mensaje error">No se pudieron cargar los servicios.</p>';
  }
}

async function cargarSelectServicios() {
  const select = document.getElementById('id_servicio');
  if (!select) return;
  try {
    const res = await fetch('/api/servicios');
    const servicios = await res.json();
    servicios.forEach(s => {
      const opcion = document.createElement('option');
      opcion.value = s.id;
      opcion.textContent = s.nombre;
      select.appendChild(opcion);
    });
    // Si se llegó desde el botón "Consultar" de un servicio, queda preseleccionado
    const elegido = new URLSearchParams(window.location.search).get('servicio');
    if (elegido) select.value = elegido;
  } catch (err) {
  }
}

function mostrarError(input, mensaje) {
  const campo = input.closest('.campo');
  campo.classList.toggle('invalido', Boolean(mensaje));
  campo.querySelector('.error-campo').textContent = mensaje;
}

function validarFormulario(form) {
  let valido = true;

  const nombre = form.nombre;
  if (nombre.value.trim().length < 2) {
    mostrarError(nombre, 'Ingresá tu nombre.');
    valido = false;
  } else mostrarError(nombre, '');

  const email = form.email;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    mostrarError(email, 'Ingresá un email válido.');
    valido = false;
  } else mostrarError(email, '');

  const telefono = form.telefono;
  const regexTel = /^[0-9+\-\s()]{8,20}$/;
  if (telefono.value.trim() !== '' && !regexTel.test(telefono.value.trim())) {
    mostrarError(telefono, 'Teléfono inválido (solo números, entre 8 y 20 caracteres).');
    valido = false;
  } else mostrarError(telefono, '');

  const asunto = form.asunto;
  if (asunto.value.trim().length < 3) {
    mostrarError(asunto, 'Ingresá un asunto.');
    valido = false;
  } else mostrarError(asunto, '');

  const mensaje = form.mensaje;
  if (mensaje.value.trim().length < 10) {
    mostrarError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
    valido = false;
  } else mostrarError(mensaje, '');

  return valido;
}

function iniciarFormulario() {
  const form = document.getElementById('formContacto');
  if (!form) return;

  const resultado = document.getElementById('resultado');
  const boton = document.getElementById('btnEnviar');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultado.innerHTML = '';
    if (!validarFormulario(form)) return;

    const datos = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      asunto: form.asunto.value.trim(),
      mensaje: form.mensaje.value.trim(),
      id_servicio: form.id_servicio.value || null
    };

    boton.disabled = true;
    boton.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const respuesta = await res.json();
      if (!res.ok) throw new Error(respuesta.error || 'Error al enviar');

      resultado.innerHTML = '<div class="mensaje ok">¡Gracias! Recibimos tu consulta y te responderemos pronto.</div>';
      form.reset();
    } catch (err) {
      resultado.innerHTML = `<div class="mensaje error">${escaparHTML(err.message)}</div>`;
    } finally {
      boton.disabled = false;
      boton.textContent = 'Enviar consulta';
    }
  });
}

function activarAnimaciones() {
  const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sinAnimacion || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      el.classList.add('visible');
      observador.unobserve(el);
  
      setTimeout(() => {
        el.classList.remove('reveal', 'visible');
        el.style.transitionDelay = '';
      }, 1000);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .formulario, .titulo-seccion').forEach((el) => {
    if (el.dataset.animado) return;
    el.dataset.animado = '1';
    const posicion = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = (posicion % 4) * 100 + 'ms';
    el.classList.add('reveal');
    observador.observe(el);
  });
}

cargarServicios();
cargarSelectServicios();
iniciarFormulario();
activarAnimaciones();