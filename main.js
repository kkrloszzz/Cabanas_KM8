// ── CARRUSEL ABOUT ──
function moveSlide(direction) {
  const container = document.querySelector('.about-imgs');
  const scrollAmount = container.clientWidth;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

// ── PERSONAS ──
const personasCounts = { adultos: 1, ninos: 1, infantes: 0 };
const PERSONAS_MAX = 6;

function cambiarPersonas(tipo, delta) {
  const total = personasCounts.adultos + personasCounts.ninos;
  if (delta > 0 && total >= PERSONAS_MAX && tipo !== 'infantes') {
    document.getElementById('max-warn').style.display = 'block';
    return;
  }
  if (tipo === 'adultos' && personasCounts.adultos + delta < 1) return;
  if (personasCounts[tipo] + delta < 0) return;
  document.getElementById('max-warn').style.display = 'none';
  personasCounts[tipo] = Math.max(0, personasCounts[tipo] + delta);
  if (tipo === 'adultos') personasCounts.adultos = Math.max(1, personasCounts.adultos);
  actualizarPersonas();
}

function actualizarPersonas() {
  ['adultos', 'ninos', 'infantes'].forEach(t => {
    document.getElementById('num-' + t).textContent = personasCounts[t];
  });
  document.getElementById('btn-a-menos').disabled = personasCounts.adultos <= 1;
  document.getElementById('btn-n-menos').disabled = personasCounts.ninos <= 0;
  document.getElementById('btn-i-menos').disabled = personasCounts.infantes <= 0;
  const total = personasCounts.adultos + personasCounts.ninos;
  ['btn-a-mas', 'btn-n-mas', 'btn-i-mas'].forEach(id => {
    document.getElementById(id).disabled = total >= PERSONAS_MAX;
  });

  const partes = [personasCounts.adultos === 1 ? '1 adulto' : personasCounts.adultos + ' adultos'];
  if (personasCounts.ninos > 0) partes.push(personasCounts.ninos + (personasCounts.ninos === 1 ? ' niño' : ' niños'));
  if (personasCounts.infantes > 0) partes.push(personasCounts.infantes + (personasCounts.infantes === 1 ? ' infante' : ' infantes'));
  document.getElementById('resumen-texto').textContent = partes.join(' · ');
  document.getElementById('personas-hidden').value = partes.join(', ');
}

// ── GALERÍA ──
const todasLasImagenes = [
  'assets/interior.jpg',
  'assets/tinaja.jpeg',
  'assets/cabana1.jpg',
  'assets/cabanas.png',
  'assets/pieza1.jpeg',
  'assets/piezamatrimonial.jpg',
  'assets/otono.png'
];
let paginaGaleria = 0;
const porPagina = 4;
let lightboxIndex = 0;

function moverGaleria(dir) {
  const totalPaginas = Math.ceil(todasLasImagenes.length / porPagina);
  paginaGaleria = (paginaGaleria + dir + totalPaginas) % totalPaginas;
  const galeria = document.getElementById('galeria');
  const posts = galeria.querySelectorAll('.social-post img');
  posts.forEach((img, i) => {
    const idx = paginaGaleria * porPagina + i;
    if (todasLasImagenes[idx]) {
      img.src = todasLasImagenes[idx];
      img.parentElement.style.display = '';
      img.parentElement.setAttribute('onclick', `abrirLightbox(${idx})`);
    } else {
      img.parentElement.style.display = 'none';
    }
  });
}

function abrirLightbox(idx) {
  lightboxIndex = idx;
  document.getElementById('lightbox-img').src = todasLasImagenes[idx];
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
  abrirModalHistorial('lightbox');
}

function cerrarLightbox() {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  modalActivo = null;
  history.back();
}

function cambiarLightbox(dir) {
  const img = document.getElementById('lightbox-img');
  const salida = dir > 0 ? '-100%' : '100%';
  const entrada = dir > 0 ? '100%' : '-100%';

  img.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
  img.style.transform = `translateX(${salida})`;
  img.style.opacity = '0';

  setTimeout(() => {
    lightboxIndex = (lightboxIndex + dir + todasLasImagenes.length) % todasLasImagenes.length;
    img.src = todasLasImagenes[lightboxIndex];
    img.style.transition = 'none';
    img.style.transform = `translateX(${entrada})`;
    img.style.opacity = '0';
    img.offsetHeight;
    img.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    img.style.transform = 'translateX(0)';
    img.style.opacity = '1';
  }, 250);
}

// ── SWIPE EN LIGHTBOX ──
(function() {
  let startX = 0;
  document.addEventListener('DOMContentLoaded', function() {
    const lb = document.getElementById('lightbox');
    lb.addEventListener('touchstart', function(e) {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });
    lb.addEventListener('touchend', function(e) {
      const diff = startX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        cambiarLightbox(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  });
})();

// ── DOM LISTO ──
document.addEventListener('DOMContentLoaded', function() {

  actualizarPersonas();

  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('checkin').min = hoy;
  document.getElementById('checkout').min = hoy;

  document.getElementById('checkin').addEventListener('change', function () {
    const checkout = document.getElementById('checkout');
    checkout.min = this.value;
    if (checkout.value && checkout.value <= this.value) {
      checkout.value = '';
    }
  });

  // Patente
  document.getElementById('patente').addEventListener('keyup', function() {
    let raw = this.value.replace(/-/g, '').toUpperCase();
    let letras = raw.replace(/[^A-Z]/g, '').slice(0, 4);
    let numeros = raw.replace(/[^0-9]/g, '').slice(0, 2);
    raw = letras + numeros;
    if (raw.length > 6) raw = raw.slice(0, 6);

    let formatted = raw;
    if (raw.length > 4) {
      formatted = raw.slice(0, 2) + '-' + raw.slice(2, 4) + '-' + raw.slice(4);
    } else if (raw.length > 2) {
      formatted = raw.slice(0, 2) + '-' + raw.slice(2);
    }
    this.value = formatted;
  });

  // Slider hero
  const heroSlides = document.querySelectorAll('.hero-slide');
  let heroIndex = 0;
  if (heroSlides.length > 0) {
    setInterval(function() {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 3000);
  }

  // Swipe en modal
  const modalMedia = document.getElementById('modal-media');
  let touchStartX = 0;
  modalMedia.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  modalMedia.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      moverCarrusel(diff > 0 ? 1 : -1);
    }
  }, { passive: true });

  history.replaceState({ modal: null }, '');

  if (window.innerWidth <= 768) {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = todasLasImagenes.map((src, i) => `
      <div class="social-post" onclick="abrirLightbox(${i})">
        <img src="${src}" alt="foto ${i+1}">
      </div>
    `).join('');
  }
});

// ── HISTORY API ──
let modalActivo = null;

function abrirModalHistorial(id) {
  modalActivo = id;
  history.pushState({ modal: id }, '');
}

window.addEventListener('popstate', function() {
  if (modalActivo === 'modal-overlay')          _cerrarModalSinHistorial();
  else if (modalActivo === 'reserva-overlay')   _cerrarReservaSinHistorial();
  else if (modalActivo === 'politicas-overlay') _cerrarPoliticasSinHistorial();
  else if (modalActivo === 'reserva-exito')     _cerrarExitoSinHistorial();
  else if (modalActivo === 'lightbox') {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
    modalActivo = null;
  }
});

// ── CABAÑAS ──
const cabanas = {
  conguillio: {
    tag: '4–6 personas · Grande',
    titulo: 'Cabaña Conguillio',
    desc: '• Un lugar con un gran ambiente natural para disfrutar.\nCuenta con tinaja privada y vistas al bosque.\n Perfecta para desconectarse. \n \n• Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n• Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink',
    features: ['Tinaja privada', 'Calefacción', 'Cocina equipada', 'Sala de estar amplia', 'Pet Friendly'],
    reglamento: 'assets/NORMAS.pdf',
    precio: '$100.000 <span>/ noche</span>',
    imagenes: [
      'assets/conguillio/cabana_conguillio.jpeg',
      'assets/conguillio/cocina_conguillio.jpeg',
      'assets/conguillio/cocina_entera_conguillio.jpeg',
      'assets/conguillio/mesas_conguillio.jpeg',
      'assets/conguillio/mesas2_conguillio.jpeg',
      'assets/conguillio/pieza1_conguillio.jpeg',
      'assets/conguillio/pieza2_conguillio.jpeg',
      'assets/conguillio/pieza3_conguillio.jpeg',
      'assets/conguillio/sala_completa_conguillio.jpeg',
      'assets/conguillio/salamandra_conguillio.jpeg',
      'assets/conguillio/salon_conguillio.jpeg',
      'assets/conguillio/conguillio.mp4',
    ]
  },
  malleco: {
    tag: '1–4 personas · Media',
    titulo: 'Cabaña Malleco',
    desc: '• Un oasis idílico. El cantero de rosas blancas y el cercado de troncos lo convierten en un rincón romántico.\n \n• Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n• Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink ',
    features: ['Tinaja exterior', '2 dormitorios', 'Cocina completa', 'Área Verde completa', 'Pet Friendly'],
    reglamento: 'assets/NORMAS.pdf',
    precio: '$80.000 <span>/ noche</span>',
    imagenes: [
      'assets/malleco/cabana_malleco.jpeg',
      'assets/malleco/salon_malleco.jpeg',
      'assets/malleco/salon2_malleco.jpeg',
      'assets/malleco/lavamanos_malleco.jpeg',
      'assets/malleco/lavamanos2_malleco.jpeg',
      'assets/malleco/pieza1_malleco.jpeg',
      'assets/malleco/pieza2_malleco.jpeg',
      'assets/malleco/malleco.mp4',
    ]
  },
  icalma: {
    tag: '1–4 personas · Media',
    titulo: 'Cabaña Icalma',
    desc: '• Moderna, rústica y acogedora. Con su fachada de madera oscura y terraza, un refugio perfecto con estilo. \n \n• Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n• Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink ',
    features: ['Tinaja Privada', 'Calefacción', 'Baño con Ducha', 'Habitacion Matrimonial', 'Habitacion 2 camas', 'Pet Friendly'],
    reglamento: 'assets/NORMAS.pdf',
    precio: '$80.000 <span>/ noche</span>',
    imagenes: [
      'assets/icalma/cabana_icalma.png',
      'assets/icalma/salon1_icalma.jpeg',
      'assets/icalma/salon2_icalma.jpeg',
      'assets/icalma/ventana_icalma.jpeg',
      'assets/icalma/cocina_icalma.jpeg',
      'assets/icalma/pieza_icalma.jpeg',
      'assets/icalma/baño_icalma.jpeg',
      'assets/icalma/presentacionIcalma.mp4',
      'assets/icalma/cabana_icalma.mp4',
    ]
  }
};

let carruselIndex = 0;
let carruselImagenes = [];

function abrirModal(id) {
  const c = cabanas[id];
  if (!c) return;

  carruselImagenes = c.imagenes;
  carruselIndex = 0;

  document.getElementById('modal-tag').textContent = c.tag;
  document.getElementById('modal-titulo').textContent = c.titulo;
  document.getElementById('modal-desc').innerHTML = c.desc.replace(/\n/g, '<br>');
  document.getElementById('modal-reglamento').href = c.reglamento || '#';
  document.getElementById('modal-reglamento').style.display = c.reglamento ? 'inline-flex' : 'none';
  document.getElementById('modal-price').innerHTML = c.precio;
  document.getElementById('modal-features').innerHTML = c.features
    .map(f => `<span class="modal-feature">${f}</span>`).join('');

  actualizarCarrusel();
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  abrirModalHistorial('modal-overlay');
}

function actualizarCarrusel(dir) {
  const media = document.getElementById('modal-media');
  const total = carruselImagenes.length;
  const src = carruselImagenes[carruselIndex];
  const esVideo = src.match(/\.(mp4|webm|mov)$/i);

  const mediaHTML = esVideo
    ? `<video src="${src}" autoplay muted loop playsinline></video>`
    : `<img src="${src}" alt="foto cabaña">`;

  media.innerHTML = `
    ${mediaHTML}
    ${total > 1 ? `
      <button class="modal-carr-btn modal-carr-prev" onclick="moverCarrusel(-1)">&#8592;</button>
      <button class="modal-carr-btn modal-carr-next" onclick="moverCarrusel(1)">&#8594;</button>
      <div class="modal-carr-dots">
        ${carruselImagenes.map((_, i) => `
          <span class="modal-carr-dot ${i === carruselIndex ? 'active' : ''}" onclick="irASlide(${i}, 1)"></span>
        `).join('')}
      </div>
    ` : ''}
  `;

  if (dir !== undefined) {
    const el = media.querySelector('img, video');
    if (el) {
      const entrada = dir > 0 ? '100%' : '-100%';
      el.style.transition = 'none';
      el.style.transform = `translateX(${entrada})`;
      el.style.opacity = '0';
      el.offsetHeight;
      el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
  }
}

function moverCarrusel(dir) {
  const media = document.getElementById('modal-media');
  const el = media.querySelector('img, video');

  if (el) {
    const salida = dir > 0 ? '-100%' : '100%';
    el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    el.style.transform = `translateX(${salida})`;
    el.style.opacity = '0';
    setTimeout(() => {
      carruselIndex = (carruselIndex + dir + carruselImagenes.length) % carruselImagenes.length;
      actualizarCarrusel(dir);
    }, 250);
  } else {
    carruselIndex = (carruselIndex + dir + carruselImagenes.length) % carruselImagenes.length;
    actualizarCarrusel(dir);
  }
}

function irASlide(i, dir) {
  const d = dir !== undefined ? dir : (i > carruselIndex ? 1 : -1);
  const media = document.getElementById('modal-media');
  const el = media.querySelector('img, video');

  if (el) {
    const salida = d > 0 ? '-100%' : '100%';
    el.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    el.style.transform = `translateX(${salida})`;
    el.style.opacity = '0';
    setTimeout(() => {
      carruselIndex = i;
      actualizarCarrusel(d);
    }, 250);
  } else {
    carruselIndex = i;
    actualizarCarrusel(d);
  }
}

function _cerrarModalSinHistorial() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
  modalActivo = null;
}

function _cerrarReservaSinHistorial() {
  document.getElementById('reserva-overlay').classList.remove('active');
  document.body.style.overflow = '';
  modalActivo = null;
}

function _cerrarPoliticasSinHistorial() {
  document.getElementById('politicas-overlay').classList.remove('active');
  document.body.style.overflow = '';
  modalActivo = null;
  const btn = document.getElementById('btn-enviar');
  btn.disabled = false;
  setTimeout(() => { btn.disabled = true; }, 5000);
}

function _cerrarExitoSinHistorial() {
  document.getElementById('reserva-exito').classList.remove('active');
  document.body.style.overflow = '';
  modalActivo = null;
}

function cerrarModal() {
  if (!document.getElementById('modal-overlay').classList.contains('active')) return;
  _cerrarModalSinHistorial();
  history.back();
}

function cerrarReserva() {
  if (!document.getElementById('reserva-overlay').classList.contains('active')) return;
  _cerrarReservaSinHistorial();
  history.back();
}

function cerrarPoliticas() {
  if (!document.getElementById('politicas-overlay').classList.contains('active')) return;
  _cerrarPoliticasSinHistorial();
  history.back();
}

function cerrarExito() {
  if (!document.getElementById('reserva-exito').classList.contains('active')) return;
  _cerrarExitoSinHistorial();
  history.back();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarModal();
  if (e.key === 'ArrowLeft') moverCarrusel(-1);
  if (e.key === 'ArrowRight') moverCarrusel(1);
});

function enviarReserva() {
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const cabana = document.getElementById('cabana-select').value;
  let patente = document.getElementById('patente').value.trim();
  const personas = document.getElementById('resumen-texto').textContent;
  const mensaje = document.getElementById('mensaje').value.trim();
  const mascotas = document.getElementById('mascotas-check').checked
    ? `${document.getElementById('num-mascotas').textContent}`
    : 'No';

  if (!nombre || !email || !telefono || !checkin || !checkout || !cabana) {
    const err = document.getElementById('form-error');
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (nombre.length < 3) {
    const err = document.getElementById('form-error');
    err.textContent = 'La cantidad mínima de caracteres del Nombre es de 3.';
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (patente.length < 8) {
    const err = document.getElementById('form-error');
    err.textContent = 'La patente debe tener al menos 6 caracteres.';
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (!patente) patente = 'No indicada';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const err = document.getElementById('form-error');
    err.textContent = 'Por favor ingresa un correo electrónico válido.';
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const telefonoRegex = /^\+?[0-9]{11,12}$/;
  if (!telefonoRegex.test(telefono.replace(/\s/g, ''))) {
    const err = document.getElementById('form-error');
    err.textContent = 'Ingresa un teléfono válido, ej: +56912344567';
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  document.getElementById('form-error').style.display = 'none';

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  };

  const filas = [
    { label: 'Nombre', valor: nombre },
    { label: 'Email', valor: email },
    { label: 'Teléfono', valor: telefono },
    { label: 'Cabaña', valor: cabana },
    { label: 'Check-in', valor: formatearFecha(checkin) },
    { label: 'Check-out', valor: formatearFecha(checkout) },
    { label: 'Patente', valor: patente },
    { label: 'Personas', valor: personas },
    { label: 'Mascotas', valor: mascotas },
    ...(mensaje ? [{ label: 'Mensaje', valor: mensaje }] : [])
  ];

  document.getElementById('reserva-body').innerHTML = filas
    .map(f => `
      <div class="reserva-fila">
        <span class="reserva-fila-label">${f.label}</span>
        <span class="reserva-fila-valor">${f.valor}</span>
      </div>
    `).join('');

  document.getElementById('reserva-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  abrirModalHistorial('reserva-overlay');
}

function confirmarReserva() {
  const btn = document.getElementById('btn-confirmar');
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const params = {
    nombre:   document.getElementById('nombre').value.trim(),
    email:    document.getElementById('email').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    cabana:   document.getElementById('cabana-select').value,
    checkin:  document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
    patente:  document.getElementById('patente').value.trim() || 'No indicada',
    personas: document.getElementById('resumen-texto').textContent,
    mascotas: document.getElementById('mascotas-check').checked
      ? `${document.getElementById('num-mascotas').textContent}`
      : 'No',
    mensaje:  document.getElementById('mensaje').value.trim() || 'Sin mensaje'
  };

  emailjs.send('service_aqa7mtr', 'template_j2t9bg4', params)
    .then(() => {
      _cerrarReservaSinHistorial(); 
      document.getElementById('reserva-exito').classList.add('active');
      document.body.style.overflow = 'hidden';
      abrirModalHistorial('reserva-exito');
      btn.textContent = 'Enviado ✓';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Confirmar y Enviar';
      }, 6000);
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      alert('❌ Hubo un error al enviar. Intenta de nuevo o contáctanos directamente.');
      btn.disabled = false;
      btn.textContent = 'Confirmar y Enviar';
    });
}

// ── MASCOTAS ──
let numMascotas = 1;

function toggleMascotas() {
  const checked = document.getElementById('mascotas-check').checked;
  const counter = document.getElementById('mascotas-counter');
  const label = document.getElementById('mascotas-label');
  counter.classList.toggle('visible', checked);
  label.textContent = checked ? 'Sí' : 'No';
}

function cambiarMascotas(delta) {
  numMascotas = Math.max(1, Math.min(6, numMascotas + delta));
  document.getElementById('num-mascotas').textContent = numMascotas;
  document.getElementById('btn-m-menos').disabled = numMascotas <= 1;
  document.getElementById('btn-m-mas').disabled = numMascotas >= 6;
}

function abrirPoliticas() {
  document.getElementById('politicas-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  abrirModalHistorial('politicas-overlay');
}

const actsTrack = document.getElementById('acts-track');
const actsFill  = document.getElementById('acts-fill');

actsTrack.addEventListener('scroll', () => {
  const max = actsTrack.scrollWidth - actsTrack.clientWidth;
  const pct = max > 0 ? (actsTrack.scrollLeft / max) * 80 + 20 : 20;
  actsFill.style.width = Math.min(100, pct) + '%';
});

let actsStartX, actsStartScroll, actsDragging = false;
actsTrack.addEventListener('mousedown', e => {
  actsDragging = true; actsStartX = e.pageX; actsStartScroll = actsTrack.scrollLeft;
});
window.addEventListener('mousemove', e => {
  if (!actsDragging) return;
  actsTrack.scrollLeft = actsStartScroll - (e.pageX - actsStartX);
});
window.addEventListener('mouseup', () => { actsDragging = false; });

// ── NAVBAR SCROLL MÓVIL ──
(function () {
  const navbar = document.getElementById('navbar');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const hamburger = document.getElementById('nav-hamburger');
  let menuOpen = false;

  window.addEventListener('scroll', function () {
    if (window.innerWidth <= 900) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    
        mobileMenu.style.top = navbar.offsetHeight + 'px';
      } else {
        navbar.classList.remove('scrolled');
        cerrarMenu();
      }
    }
  });

  window.toggleMenu = function () {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.style.top = navbar.offsetHeight + 'px';
  };

  window.cerrarMenu = function () {
    menuOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  };

  document.addEventListener('click', function (e) {
    if (menuOpen && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      cerrarMenu();
    }
  });
})();

// ── STRIP MARQUEE ──
(function () {
  const track = document.getElementById('strip-track');
  if (!track) return;

  
  const original = track.innerHTML;
  track.innerHTML = original + original;

  let position = 0;
  const speed = 0.5; 
  let halfWidth;
  requestAnimationFrame(() => {
    halfWidth = track.scrollWidth / 2;
  });
  let paused = false;

  track.parentElement.addEventListener('mouseenter', () => paused = true);
  track.parentElement.addEventListener('mouseleave', () => paused = false);

  function animate() {
    if (!paused) {
      position -= speed;
      if (Math.abs(position) >= halfWidth) {
        position = 0; 
      }
      track.style.transform = `translateX(${position}px)`;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();