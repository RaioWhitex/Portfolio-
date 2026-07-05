document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Gold trace nodes aligned to sections
const trace = document.querySelector('.trace');
const sections = document.querySelectorAll('section');
sections.forEach(sec => {
  const node = document.createElement('div');
  node.className = 'trace-node';
  trace.appendChild(node);
  const position = () => {
    node.style.top = (sec.offsetTop + 40) + 'px';
  };
  position();
  window.addEventListener('resize', position);
});

const nodes = document.querySelectorAll('.trace-node');
const secObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const idx = Array.from(sections).indexOf(entry.target);
    if (entry.isIntersecting && nodes[idx]) {
      nodes.forEach(n => n.classList.remove('active'));
      nodes[idx].classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(sec => secObserver.observe(sec));
