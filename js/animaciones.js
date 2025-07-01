const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.cd-slider-nav li');
let currentSlide = 0;
let totalSlides = dots.length;

function goToSlide(index) {
  slider.style.transform = `translateX(-${index * 100}vw)`;
  dots.forEach(dot => dot.classList.remove('selected'));
  dots[index].classList.add('selected');
  currentSlide = index;
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
  });
});

setInterval(() => {
  let next = (currentSlide + 1) % totalSlides;
  goToSlide(next);
}, 6000);
