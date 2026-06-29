const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
const header = document.getElementById("siteHeader");
const modal = document.getElementById("globalModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const serviceButtons = document.querySelectorAll(".service-detail-btn");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialDots = document.getElementById("testimonialDots");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
const cursorGlow = document.getElementById("cursorGlow");
const navLinks = document.querySelectorAll(".nav a[data-nav]");

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
    quote:
      "A InnoDev é uma empresa extremamente responsável, dedicada e ágil na execução das demandas. Ao longo da nossa parceria, sempre demonstrou alto comprometimento com prazos, qualidade e organização, entregando resultados consistentes e muitas vezes superando as expectativas iniciais.\n\nDestaco especialmente sua pontualidade, clareza na comunicação e capacidade de compreender rapidamente os requisitos, propondo soluções eficientes e bem estruturadas.\n\nHoje, é uma das empresas em que mais confio para delegar demandas estratégicas, pela segurança técnica e responsabilidade que transmite em cada projeto.",
    name: "Camila Moreira",
    role: "SquadWeb",
    stars: "★★★★★"
  },
  {
    quote:
      "A InnoDev tem uma combinação rara: velocidade com qualidade técnica. Cada entrega veio bem estruturada, com excelente comunicação e foco real no resultado do negócio. É um parceiro que passa confiança do início ao fim.",
    name: "Christian Barros",
    role: "Altrog",
    stars: "★★★★★"
  },
  {
    quote:
      "Trabalhar com a InnoDev trouxe mais organização e previsibilidade para nossos projetos. A equipe entende rápido o contexto, executa com responsabilidade e entrega com padrão alto. Recomendo com tranquilidade.",
    name: "Jonatha Pereira",
    role: "Atuaz",
    stars: "★★★★★"
  }
];

let testimonialIndex = 0;
let lastFocusedElement = null;

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
  modalBody.innerHTML = "";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose?.focus();
}

function fillModalContent(content) {
  if (!(modalBody instanceof HTMLElement)) return;
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

function renderTestimonials(data) {
  if (!(testimonialTrack instanceof HTMLElement)) return;

  testimonialTrack.innerHTML = data
    .map(
      (item, index) => `
        <article class="testimonial${index === 0 ? " is-active" : ""}" data-index="${index}">
          <div class="testimonial-quote-mark" aria-hidden="true">"</div>
          <blockquote>${item.quote}</blockquote>
          <footer>
            <cite>${item.name}</cite>
            <span>${item.role}</span>
            <small class="testimonial-stars" aria-label="5 de 5 estrelas">${item.stars}</small>
          </footer>
        </article>
      `
    )
    .join("");

  if (testimonialDots instanceof HTMLElement) {
    testimonialDots.innerHTML = data
      .map(
        (_, index) =>
          `<button class="testimonial-dot${index === 0 ? " is-active" : ""}" data-dot="${index}" aria-label="Ir para depoimento ${index + 1}"></button>`
      )
      .join("");

    testimonialDots.querySelectorAll(".testimonial-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.getAttribute("data-dot"));
        if (!Number.isNaN(index)) setTestimonial(index);
      });
    });
  }
}

function setTestimonial(index) {
  if (!(testimonialTrack instanceof HTMLElement)) return;
  const items = testimonialTrack.querySelectorAll(".testimonial");
  if (!items.length) return;

  testimonialIndex = (index + items.length) % items.length;

  items.forEach((item, i) => {
    item.classList.toggle("is-active", i === testimonialIndex);
  });

  testimonialDots?.querySelectorAll(".testimonial-dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === testimonialIndex);
  });
}

function initTestimonialCarousel() {
  renderTestimonials(testimonialsData);
  prevTestimonial?.addEventListener("click", () => setTestimonial(testimonialIndex - 1));
  nextTestimonial?.addEventListener("click", () => setTestimonial(testimonialIndex + 1));
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("data-nav") === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initCursorGlow() {
  if (!cursorGlow) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(hover: none)").matches;
  const isNarrow = window.innerWidth < 980;
  if (reduceMotion || isCoarse || isNarrow) return;

  document.body.classList.add("has-cursor-glow");

  window.addEventListener(
    "mousemove",
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
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
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

initTestimonialCarousel();
initScrollSpy();
initCursorGlow();
