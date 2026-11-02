const form = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

if (sessionStorage.getItem('token')) {
  window.location.href = 'panel.html';
}

function mostrarError(texto) {
  mensaje.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'mensaje error';
  div.textContent = texto;
  mensaje.appendChild(div);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.innerHTML = '';

  const usuario = form.usuario.value.trim();
  const password = form.password.value;

  if (!usuario || !password) {
    mostrarError('Completá usuario y contraseña.');
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión');

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('nombreAdmin', data.nombre);
    window.location.href = 'panel.html';
  } catch (err) {
    mostrarError(err.message);
  }
});