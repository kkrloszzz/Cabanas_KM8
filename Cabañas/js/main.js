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
  const total = personasCounts.adultos + personasCounts.ninos + personasCounts.infantes;
  if (delta > 0 && total >= PERSONAS_MAX) {
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
  const total = personasCounts.adultos + personasCounts.ninos + personasCounts.infantes;
  ['btn-a-mas', 'btn-n-mas', 'btn-i-mas'].forEach(id => {
    document.getElementById(id).disabled = total >= PERSONAS_MAX;
  });
  const edades = document.getElementById('edades-ninos');
  const cont = document.getElementById('selectores-edad');
  if (personasCounts.ninos > 0) {
    edades.style.display = 'block';
    while (cont.querySelectorAll('select').length < personasCounts.ninos) {
      const sel = document.createElement('select');
      sel.style.cssText = 'font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid #ddd;background:#f8f8f8;cursor:pointer;';
      for (let a = 2; a <= 12; a++) {
        const o = document.createElement('option');
        o.value = a; o.textContent = a + ' años'; sel.appendChild(o);
      }
      cont.appendChild(sel);
    }
    while (cont.querySelectorAll('select').length > personasCounts.ninos) cont.removeChild(cont.lastChild);
  } else {
    edades.style.display = 'none';
    cont.innerHTML = '';
  }
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