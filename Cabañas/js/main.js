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
  '../assets/interior.jpg',
  '../assets/tinaja.jpeg',
  '../assets/cabana1.jpg',
  '../assets/cabanas.png',
  '../assets/cabana2.jpg',
  '../assets/pieza1.jpeg',
  '../assets/piezamatrimonial.jpg',
  '../assets/otono.png'
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
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function cambiarLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + todasLasImagenes.length) % todasLasImagenes.length;
  document.getElementById('lightbox-img').src = todasLasImagenes[lightboxIndex];
}

// ── DOM LISTO ──
document.addEventListener('DOMContentLoaded', function() {

  // Personas
  actualizarPersonas();

  // Patente
  document.getElementById('patente').addEventListener('keyup', function() {
    let raw = this.value.replace(/-/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
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

});

// Mascotas
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


const cabanas = {
  conguillio: {
    tag: '1–4 personas · Pequeña',
    titulo: 'Cabaña Conguillio',
    desc: '💆‍♂️Un lugar con un gran ambiente natural para disfrutar.\nCuenta con tinaja privada y vistas al bosque.\n Perfecta para desconectarse. \n \n♨️ Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n🛏️Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink',
    features: ['🛁 Tinaja privada', '🔥 Calefacción', '🍳 Cocina equipada', '🐾 Pet Friendly'],
    reglamento: '../assets/NORMAS.pdf',
    precio: '$80.000 <span>/ noche</span>',
    imagenes: [
      '../assets/conguillio/cabana_conguillio.jpeg',
      '../assets/conguillio/cocina_conguillio.jpeg',
      '../assets/conguillio/cocina_entera_conguillio.jpeg',
      '../assets/conguillio/mesas_conguillio.jpeg',
      '../assets/conguillio/mesas2_conguillio.jpeg',
      '../assets/conguillio/pieza1_conguillio.jpeg',
      '../assets/conguillio/pieza2_conguillio.jpeg',
      '../assets/conguillio/pieza3_conguillio.jpeg',
      '../assets/conguillio/sala_completa_conguillio.jpeg',
      '../assets/conguillio/salamandra_conguillio.jpeg',
      '../assets/conguillio/salon_conguillio.jpeg',
      '../assets/conguillio/conguillio.mp4',
    ]
  },
  malleco: {
    tag: '4–6 personas · Mediana',
    titulo: 'Cabaña Malleco',
    desc: '🌼Un oasis idílico. El cantero de rosas blancas y el cercado de troncos lo convierten en un rincón romántico.\n \n♨️ Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n🛏️Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink ',
    features: ['🛁 Jacuzzi exterior', '🛏 2 dormitorios', '🍳 Cocina completa', '🌳 Bosque nativo', '🐾 Pet Friendly'],
    reglamento: '../assets/NORMAS.pdf',
    precio: '$80.000 <span>/ noche</span>',
    imagenes: [
      '../assets/malleco/cabana_malleco.jpeg',
      '../assets/malleco/salon_malleco.jpeg',
      '../assets/malleco/salon2_malleco.jpeg',
      '../assets/malleco/lavamanos_malleco.jpeg',
      '../assets/malleco/lavamanos2_malleco.jpeg',
      '../assets/malleco/pieza1_malleco.jpeg',
      '../assets/malleco/pieza2_malleco.jpeg',
      '../assets/malleco/malleco.mp4',
    ]
  },
  icalma: {
    tag: '2 personas · Premium',
    titulo: 'Cabaña Icalma',
    desc: '🌲Moderna, rústica y acogedora. Con su fachada de madera oscura y terraza, un refugio perfecto con estilo. \n \n♨️ Disponibilidad de tinajas SIN COSTO ADICIONAL. \n \n🛏️Incluye sabanas, leña, estacionamiento privado y techado. Recinto completamente cerrado, acceso 100% pavimentado. WiFi satelital Starlink ',
    features: ['🛁 Bañera con vista al lago', '🧖 Sauna privado', '☕ Desayuno incluido', '🌅 Vista panorámica'],
    reglamento: '../assets/NORMAS.pdf',
    precio: '$100.000 <span>/ noche</span>',
    imagenes: [
      '../assets/icalma/cabana_icalma.png',
      '../assets/icalma/salon1_icalma.jpeg',
      '../assets/icalma/salon2_icalma.jpeg',
      '../assets/icalma/ventana_icalma.jpeg',
      '../assets/icalma/cocina_icalma.jpeg',
      '../assets/icalma/pieza_icalma.jpeg',
      '../assets/icalma/baño_icalma.jpeg',
      '../assets/icalma/presentacionIcalma.mp4',
      '../assets/icalma/cabana_icalma.mp4',
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
}

function actualizarCarrusel() {
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
          <span class="modal-carr-dot ${i === carruselIndex ? 'active' : ''}" onclick="irASlide(${i})"></span>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function moverCarrusel(dir) {
  carruselIndex = (carruselIndex + dir + carruselImagenes.length) % carruselImagenes.length;
  actualizarCarrusel();
}

function irASlide(i) {
  carruselIndex = i;
  actualizarCarrusel();
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
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
  const patente = document.getElementById('patente').value.trim();
  const personas = document.getElementById('resumen-texto').textContent;
  const mensaje = document.getElementById('mensaje').value.trim();
  const mascotas = document.getElementById('mascotas-check').checked
    ? `Sí, ${document.getElementById('num-mascotas').textContent}`
    : 'No';

  if (!nombre || !email || !telefono || !checkin || !checkout || !cabana || !patente) {
    alert('⚠️ Por favor completa todos los campos obligatorios.');
    return;
  }

  const filas = [
    { label: 'Nombre', valor: nombre },
    { label: 'Email', valor: email },
    { label: 'Teléfono', valor: telefono },
    { label: 'Cabaña', valor: cabana },
    { label: 'Check-in', valor: checkin },
    { label: 'Check-out', valor: checkout },
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
}

function cerrarReserva() {
  document.getElementById('reserva-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function confirmarReserva() {
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
      ? `Sí, ${document.getElementById('num-mascotas').textContent}`
      : 'No',
    mensaje:  document.getElementById('mensaje').value.trim() || 'Sin mensaje'
  };

  emailjs.send('service_gzfdeb9', 'template_beffc3d', params)
    .then(() => {
      cerrarReserva();
      // Acá puedes mostrar un mensaje bonito en vez del alert
      alert('✅ ¡Solicitud enviada! Nos pondremos en contacto contigo a la brevedad.');
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      alert('❌ Hubo un error al enviar. Intenta de nuevo o contáctanos directamente.');
    });
}