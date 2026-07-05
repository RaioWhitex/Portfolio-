/* ===========================================================
   CREDENCIAIS DO EMAILJS
   =========================================================== */
const EMAILJS_PUBLIC_KEY  = "gzZLYUmoQhQJVNkQK";
const EMAILJS_SERVICE_ID  = "service_cw1ku0r";
const EMAILJS_TEMPLATE_ID = "template_xay30yf";
/* =========================================================== */

(function () {
  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Remove as animações SMIL do fundo se o usuário preferir menos movimento */
  if (prefersReducedMotion) {
    document.querySelectorAll("animate").forEach((el) => el.remove());
  }

  /* ---------- Toggle de tema (claro / escuro) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("gate-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  themeToggle.addEventListener("click", function () {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("gate-theme", next);
  });

  /* ---------- Efeito de inclinação 3D no cartão ---------- */
  const card = document.getElementById("gate-card");
  const wrap = document.querySelector(".gate-card-wrap");

  if (card && wrap && !prefersReducedMotion) {
    wrap.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (y * -8).toFixed(2);
      const rotateY = (x * 10).toFixed(2);
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrap.addEventListener("mouseleave", function () {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  /* ---------- Formulário de verificação ---------- */
  const form = document.getElementById("gate-form");
  const nameInput = document.getElementById("visitor-name");
  const emailInput = document.getElementById("visitor-email");
  const statusEl = document.getElementById("gate-status");
  const submitBtn = document.getElementById("gate-submit");

  // Exige algo@algo.algo — corrige o bug que permitia enviar sem "@"
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(message, inputToFocus) {
    statusEl.textContent = message;
    statusEl.classList.add("error");
    if (inputToFocus) inputToFocus.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    statusEl.textContent = "";
    statusEl.classList.remove("error");

    if (!name) {
      showError("Digite seu nome.", nameInput);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      showError("Digite um e-mail válido (ex: nome@dominio.com).", emailInput);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const templateParams = {
      visitor_name: name,
      visitor_email: email,
      visit_time: new Date().toLocaleString("pt-BR"),
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        window.location.href = "portfolio.html";
      })
      .catch(function (err) {
        console.error("Falha ao enviar notificação:", err);
        // Mesmo se a notificação falhar, o acesso ao portfólio não fica bloqueado.
        window.location.href = "portfolio.html";
      });
  });
})();
