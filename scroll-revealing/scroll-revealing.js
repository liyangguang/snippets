const FADED_IN_CLASS = '_faded-in';  // Used in the css below
const SCROLL_PADDING = 50;
const sections = document.querySelectorAll('section');
const lines = document.querySelectorAll('.line');

// Show the first section without scrolling
setTimeout(() => {
  sections[0].classList.add(FADED_IN_CLASS);
}, 1000);

window.addEventListener('scroll', () => {
  sections.forEach((el) => {
    if (el.getBoundingClientRect().y < window.innerHeight * .6) {
      el.classList.add(FADED_IN_CLASS);
    }
  });

  // Reveal the line as scrolling
  lines.forEach((el) => {
    let height = window.innerHeight * .6 - el.getBoundingClientRect().y;
    if (height > 100) height = 100;
    if (height < 0) height = 0;
    const currentHeight = Number(el.style.height.replace('px', ''));
    if (!isNaN(currentHeight) && currentHeight < height) {
      el.style.height = height + 'px';
    }
  });
});
