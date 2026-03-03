const donatedItems = [
  {
    name: "Blazer oversize gessato",
    code: "RL-2410",
    date: "24 febbraio 2026",
    status: "In lavorazione",
    phase: "Sanificazione completata, controllo cuciture in corso."
  },
  {
    name: "Jeans vintage a vita alta",
    code: "RL-2384",
    date: "19 febbraio 2026",
    status: "Pronto",
    phase: "Rigenerazione conclusa, pronto per esposizione."
  },
  {
    name: "Giacca utility beige",
    code: "RL-2361",
    date: "14 febbraio 2026",
    status: "In lavorazione",
    phase: "Restyling con bottoni clip e impunture dedicate."
  },
  {
    name: "Maglia lana blu notte",
    code: "RL-2297",
    date: "2 febbraio 2026",
    status: "Pronto",
    phase: "Disponibile su canale online e corner Milano Duomo."
  }
];

function initHeroSlider() {
  const heroShell = document.getElementById("heroShell");
  const heroTrack = document.getElementById("heroTrack");
  const heroPrevBtn = document.getElementById("heroPrevBtn");
  const heroNextBtn = document.getElementById("heroNextBtn");
  const heroDots = document.getElementById("heroDots");
  const heroCounter = document.getElementById("heroCounter");

  if (!heroShell || !heroTrack || !heroPrevBtn || !heroNextBtn || !heroDots || !heroCounter) {
    return;
  }

  const slides = [...heroTrack.querySelectorAll(".hero-slide")];
  if (slides.length === 0) {
    return;
  }

  let currentIndex = 0;
  let autoplay = null;
  let touchStartX = 0;

  function renderDots() {
    const fragment = document.createDocumentFragment();
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.ariaLabel = `Vai alla slide ${index + 1}`;
      dot.addEventListener("click", () => {
        setSlide(index);
        resetAutoplay();
      });
      fragment.appendChild(dot);
    });
    heroDots.appendChild(fragment);
  }

  function setSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    heroTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    heroCounter.textContent = `${currentIndex + 1} / ${slides.length}`;

    [...heroDots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
    });
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      setSlide(currentIndex + 1);
    }, 6500);
  }

  heroPrevBtn.addEventListener("click", () => {
    setSlide(currentIndex - 1);
    resetAutoplay();
  });

  heroNextBtn.addEventListener("click", () => {
    setSlide(currentIndex + 1);
    resetAutoplay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setSlide(currentIndex - 1);
      resetAutoplay();
    }

    if (event.key === "ArrowRight") {
      setSlide(currentIndex + 1);
      resetAutoplay();
    }
  });

  heroShell.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  heroShell.addEventListener(
    "touchend",
    (event) => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 40) {
        return;
      }

      if (delta < 0) {
        setSlide(currentIndex + 1);
      } else {
        setSlide(currentIndex - 1);
      }
      resetAutoplay();
    },
    { passive: true }
  );

  renderDots();
  setSlide(0);
  resetAutoplay();
}

function initProductCarousels() {
  const carousels = [...document.querySelectorAll("[data-product-carousel]")];
  if (carousels.length === 0) {
    return;
  }

  carousels.forEach((carousel) => {
    const id = carousel.id;
    const track = carousel.querySelector(".product-track");
    const prevButton = document.querySelector(`[data-prev="${id}"]`);
    const nextButton = document.querySelector(`[data-next="${id}"]`);

    if (!id || !track || !prevButton || !nextButton) {
      return;
    }

    function step() {
      const firstCard = track.querySelector(".product-card");
      if (!firstCard) {
        return 320;
      }
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "12");
      return firstCard.getBoundingClientRect().width + gap;
    }

    prevButton.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });

    nextButton.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  });
}

function normalizeNameFromEmail(email) {
  const alias = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!alias) {
    return "Cliente";
  }

  return alias
    .split(" ")
    .filter(Boolean)
    .map((piece) => piece[0].toUpperCase() + piece.slice(1))
    .join(" ");
}

function buildStatusItem(item) {
  const li = document.createElement("li");
  li.className = "status-item";

  const top = document.createElement("div");
  top.className = "status-top";

  const name = document.createElement("p");
  name.className = "status-name";
  name.textContent = item.name;

  const status = document.createElement("span");
  status.className = `status-pill ${item.status === "In lavorazione" ? "working" : "ready"}`;
  status.textContent = item.status;

  const meta = document.createElement("p");
  meta.className = "status-meta";
  meta.textContent = `Codice ${item.code} | Donato il ${item.date}`;

  const phase = document.createElement("p");
  phase.className = "status-phase";
  phase.textContent = item.phase;

  top.append(name, status);
  li.append(top, meta, phase);
  return li;
}

function initAreaRiservata() {
  const authLogin = document.getElementById("authLogin");
  const authPrivate = document.getElementById("authPrivate");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const privateEmail = document.getElementById("privateEmail");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const cardHolder = document.getElementById("cardHolder");
  const pointsValue = document.getElementById("pointsValue");
  const privateDonations = document.getElementById("privateDonations");

  if (
    !authLogin ||
    !authPrivate ||
    !loginForm ||
    !logoutBtn ||
    !privateEmail ||
    !welcomeTitle ||
    !cardHolder ||
    !pointsValue ||
    !privateDonations
  ) {
    return;
  }

  const emailInput = loginForm.querySelector('input[name="email"]');

  donatedItems.forEach((item) => {
    privateDonations.appendChild(buildStatusItem(item));
  });

  function showAuthPage(target) {
    authLogin.classList.remove("active");
    authPrivate.classList.remove("active");
    target.classList.add("active");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = (emailInput?.value || "").trim() || "cliente@relove.it";
    const name = normalizeNameFromEmail(email);
    const points = 1280;

    privateEmail.textContent = email;
    welcomeTitle.textContent = `Ciao ${name}`;
    cardHolder.textContent = name;
    pointsValue.textContent = new Intl.NumberFormat("it-IT").format(points);

    showAuthPage(authPrivate);
  });

  logoutBtn.addEventListener("click", () => {
    showAuthPage(authLogin);
  });
}

initHeroSlider();
initProductCarousels();
initAreaRiservata();
