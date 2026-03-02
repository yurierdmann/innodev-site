const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
const header = document.getElementById("siteHeader");
const modal = document.getElementById("globalModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const serviceButtons = document.querySelectorAll(".service-detail-btn");
const testimonialRegion = document.getElementById("testimonialRegion");
const testimonialTrack = document.getElementById("testimonialTrack");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
const form = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const whatsappInput = document.getElementById("whatsapp");
const honeypotInput = document.getElementById("empresa_site");
const WHATSAPP_TARGET = "5551998063381";
const FORM_RATE_LIMIT_KEY = "innodev_form_submissions";
const FORM_MAX_SUBMISSIONS = 3;
const FORM_WINDOW_MS = 10 * 60 * 1000;
const FORM_COOLDOWN_MS = 30 * 1000;
let lastSubmitAt = 0;

const serviceDetails = {
  sistemas: {
    title: "Desenvolvimento de Sistemas Web Sob Medida (Gestão e SaaS)",
    body: "Projetamos e desenvolvemos sistemas web sob medida para gestão de processos, operação e indicadores. Inclui painéis administrativos, multiusuários, permissões, integrações e arquitetura pronta para escalar como produto SaaS."
  },
  sites: {
    title: "Sites Institucionais e Portfólios",
    body: "Criamos websites institucionais com visual premium, copy estratégica e alto desempenho. Estrutura pensada para posicionamento de marca, geração de confiança e captação de oportunidades."
  },
  landing: {
    title: "Landing Pages de Alta Conversão",
    body: "Desenvolvimento de landing pages orientadas a conversão com foco em clareza, velocidade e compatibilidade com ferramentas de mídia, CRM e analytics."
  },
  integracoes: {
    title: "Integrações e Automações (APIs / n8n)",
    body: "Conectamos seus sistemas para automatizar rotinas e reduzir gargalos operacionais. Trabalhamos com webhooks, APIs REST e fluxos automatizados com n8n."
  },
  manutencao: {
    title: "Manutenção e Evolução de Sistemas",
    body: "Atuamos na continuidade do produto digital com melhorias progressivas, correções, atualização de dependências e sustentação técnica de longo prazo."
  },
  performance: {
    title: "Performance, SEO técnico e Analytics",
    body: "Mapeamos e executamos melhorias para velocidade, Core Web Vitals, rastreabilidade e leitura de dados. Inclui estrutura técnica para SEO e eventos de conversão."
  }
};

const testimonialsData = [
  {
    quote: "A InnoDev é uma empresa extremamente responsável, dedicada e ágil na execução das demandas. Ao longo da nossa parceria, sempre demonstrou alto comprometimento com prazos, qualidade e organização, entregando resultados consistentes e muitas vezes superando as expectativas iniciais.\n\nDestaco especialmente sua pontualidade, clareza na comunicação e capacidade de compreender rapidamente os requisitos, propondo soluções eficientes e bem estruturadas.\n\nHoje, é uma das empresas em que mais confio para delegar demandas estratégicas, pela segurança técnica e responsabilidade que transmite em cada projeto.",
    name: "Camila Moreira",
    role: "SquadWeb",
    stars: "★★★★★"
  },
  {
    quote: "A InnoDev tem uma combinação rara: velocidade com qualidade técnica. Cada entrega veio bem estruturada, com excelente comunicação e foco real no resultado do negócio. É um parceiro que passa confiança do início ao fim.",
    name: "Christian Barros",
    role: "Altrog",
    stars: "★★★★★"
  },
  {
    quote: "Trabalhar com a InnoDev trouxe mais organização e previsibilidade para nossos projetos. A equipe entende rápido o contexto, executa com responsabilidade e entrega com padrão alto. Recomendo com tranquilidade.",
    name: "Jonatha Pereira",
    role: "Atuaz",
    stars: "★★★★★"
  }
];

let testimonialIndex = 0;
let lastFocusedElement = null;

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulateFetch(data, min = 600, max = 1200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), randomDelay(min, max));
  });
}

function showSkeleton(container) {
  if (!(container instanceof HTMLElement)) return;
  const skeleton = container.querySelector("[data-skeleton]");
  const content = container.querySelector("[data-content]");
  if (!(skeleton instanceof HTMLElement) || !(content instanceof HTMLElement)) return;

  content.hidden = true;
  content.classList.remove("is-visible");
  skeleton.hidden = false;
  skeleton.classList.remove("is-exit");
  container.setAttribute("aria-busy", "true");
}

function hideSkeleton(container) {
  if (!(container instanceof HTMLElement)) return;
  const skeleton = container.querySelector("[data-skeleton]");
  const content = container.querySelector("[data-content]");
  if (!(skeleton instanceof HTMLElement) || !(content instanceof HTMLElement)) return;

  skeleton.classList.add("is-exit");
  setTimeout(() => {
    skeleton.hidden = true;
    content.hidden = false;
    requestAnimationFrame(() => content.classList.add("is-visible"));
    container.setAttribute("aria-busy", "false");
  }, 180);
}

function renderTestimonials(data) {
  if (!(testimonialTrack instanceof HTMLElement)) return;

  testimonialTrack.innerHTML = data
    .map(
      (item, index) => `
      <article class="testimonial${index === 0 ? " is-active" : ""}">
        <p>"${item.quote}"</p>
        <h3>${item.name}</h3>
        <span>${item.role}</span>
        <small>${item.stars}</small>
      </article>
      `
    )
    .join("");
}

function toggleMenu(forceClose = false) {
  if (!menuToggle || !nav) return;
  const shouldOpen = forceClose ? false : !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", shouldOpen);
  menuToggle.classList.toggle("is-open", shouldOpen);
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  menuToggle.setAttribute("aria-label", shouldOpen ? "Fechar menu" : "Abrir menu");
}

function openModalShell(title) {
  if (!modal || !modalTitle || !modalBody) return;
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose?.focus();
}

function fillModalContent(content) {
  if (!(modalBody instanceof HTMLElement)) return;
  modalBody.setAttribute("aria-busy", "false");
  modalBody.innerHTML = `<p>${content}</p>`;
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function startTestimonialCarousel() {
  if (!(testimonialTrack instanceof HTMLElement)) return;
  const items = testimonialTrack.querySelectorAll(".testimonial");
  if (!items.length) return;

  function renderTestimonial(index) {
    testimonialIndex = (index + items.length) % items.length;
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === testimonialIndex);
    });
  }

  prevTestimonial?.addEventListener("click", () => renderTestimonial(testimonialIndex - 1));
  nextTestimonial?.addEventListener("click", () => renderTestimonial(testimonialIndex + 1));

  renderTestimonial(0);
}

async function loadTestimonials() {
  if (!(testimonialRegion instanceof HTMLElement) || !(testimonialTrack instanceof HTMLElement)) return;
  if (testimonialTrack.children.length > 0) return;

  showSkeleton(testimonialRegion);
  const data = await simulateFetch(testimonialsData, 600, 1200);
  renderTestimonials(data);
  hideSkeleton(testimonialRegion);
  startTestimonialCarousel();
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => toggleMenu());
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 980) toggleMenu(true);
  });
});

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 14);
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.service;
    const detail = key ? serviceDetails[key] : null;
    if (!detail) return;
    openModalShell(detail.title);
    fillModalContent(detail.body);
  });
});

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.hasAttribute("data-close-modal")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
  const digits = value.replace(/\D/g, "");
  return /^(?:[1-9]{2})(?:9\d{8}|\d{8})$/.test(digits);
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function buildWhatsAppMessage({ nome, email, whatsapp, servico, mensagem }) {
  return [
    "Olá, InnoDev! Gostaria de solicitar um orçamento.",
    "",
    `Nome: ${nome}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Serviço de interesse: ${servico}`,
    "Mensagem:",
    mensagem
  ].join("\n");
}

if (whatsappInput instanceof HTMLInputElement) {
  whatsappInput.addEventListener("input", () => {
    whatsappInput.value = formatPhone(whatsappInput.value);
  });
}

function setFieldError(field, message = "") {
  const wrapper = field.closest(".field");
  const errorElement = wrapper?.querySelector(".error");
  if (errorElement) errorElement.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function getRecentSubmissions() {
  try {
    const raw = localStorage.getItem(FORM_RATE_LIMIT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    return parsed.filter((timestamp) => now - timestamp <= FORM_WINDOW_MS);
  } catch {
    return [];
  }
}

function saveRecentSubmissions(list) {
  try {
    localStorage.setItem(FORM_RATE_LIMIT_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage errors in restricted environments.
  }
}

function getSubmissionGuard() {
  const now = Date.now();
  const cooldownRemaining = FORM_COOLDOWN_MS - (now - lastSubmitAt);
  if (cooldownRemaining > 0) {
    const seconds = Math.ceil(cooldownRemaining / 1000);
    return {
      allowed: false,
      message: `Aguarde ${seconds}s antes de enviar novamente.`
    };
  }

  const recent = getRecentSubmissions();
  if (recent.length >= FORM_MAX_SUBMISSIONS) {
    return {
      allowed: false,
      message: "Muitas tentativas em pouco tempo. Tente novamente em alguns minutos."
    };
  }

  return { allowed: true, recent };
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!formFeedback) return;

  let hasError = false;
  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const whatsapp = document.getElementById("whatsapp");
  const servico = document.getElementById("servico");
  const mensagem = document.getElementById("mensagem");
  const submitButton = form.querySelector("button[type='submit']");

  if (!(nome instanceof HTMLInputElement) || !(email instanceof HTMLInputElement) || !(whatsapp instanceof HTMLInputElement) || !(servico instanceof HTMLSelectElement) || !(mensagem instanceof HTMLTextAreaElement)) {
    return;
  }

  if (honeypotInput instanceof HTMLInputElement && honeypotInput.value.trim()) {
    formFeedback.textContent = "Solicitação enviada com sucesso. Retornaremos em breve.";
    formFeedback.className = "form-feedback success";
    form.reset();
    return;
  }

  const guard = getSubmissionGuard();
  if (!guard.allowed) {
    formFeedback.textContent = guard.message;
    formFeedback.className = "form-feedback error";
    return;
  }

  setFieldError(nome, nome.value.trim() ? "" : "Informe seu nome.");
  setFieldError(email, validateEmail(email.value.trim()) ? "" : "Informe um email válido.");
  setFieldError(whatsapp, validatePhone(whatsapp.value.trim()) ? "" : "Informe um WhatsApp com DDD.");
  setFieldError(servico, servico.value.trim() ? "" : "Selecione um serviço.");
  setFieldError(mensagem, mensagem.value.trim().length >= 10 ? "" : "Descreva sua demanda com pelo menos 10 caracteres.");

  [nome, email, whatsapp, servico, mensagem].forEach((field) => {
    if (field.getAttribute("aria-invalid") === "true") hasError = true;
  });

  if (hasError) {
    formFeedback.textContent = "Revise os campos destacados antes de enviar.";
    formFeedback.className = "form-feedback error";
    return;
  }

  const whatsappMessage = buildWhatsAppMessage({
    nome: nome.value.trim(),
    email: email.value.trim(),
    whatsapp: whatsapp.value.trim(),
    servico: servico.value.trim(),
    mensagem: mensagem.value.trim()
  });
  const whatsappUrl = `https://wa.me/${WHATSAPP_TARGET}?text=${encodeURIComponent(whatsappMessage)}`;

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-disabled", "true");
  }

  window.open(whatsappUrl, "_blank", "noopener");
  lastSubmitAt = Date.now();
  const updated = [...guard.recent, lastSubmitAt];
  saveRecentSubmissions(updated);

  formFeedback.textContent = "Tudo certo! Abrimos seu WhatsApp com a mensagem pronta para envio.";
  formFeedback.className = "form-feedback success";
  form.reset();

  setTimeout(() => {
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-disabled");
    }
  }, 1500);
});

loadTestimonials();
