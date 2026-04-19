function moveSlide(direction) {
  const container = document.querySelector('.about-imgs');
  const scrollAmount = container.clientWidth; // Detecta el ancho visible
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}