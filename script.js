const donatedItems = [
  {
    name: "Blazer oversize gessato",
    code: "RL-2410",
    date: "24 febbraio 2026",
    status: "In lavorazione",
    phase: "Sanificazione completata, controllo cuciture in corso.",
    rating: 4,
    washing: "Lavaggio a secco eco e sanificazione ad ozono.",
    modifications: "Rinforzo interno su spalle e sostituzione di due bottoni frontali."
  },
  {
    name: "Jeans vintage a vita alta",
    code: "RL-2384",
    date: "19 febbraio 2026",
    status: "Pronto",
    phase: "Rigenerazione conclusa, pronto per esposizione.",
    rating: 5,
    washing: "Lavaggio denim a 30 gradi con detergente neutro.",
    modifications: "Nuovo orlo, zip sostituita e fit regolarizzato in vita.",
    readyDate: "1 marzo 2026"
  },
  {
    name: "Giacca utility beige",
    code: "RL-2361",
    date: "14 febbraio 2026",
    status: "In lavorazione",
    phase: "Restyling con bottoni clip e impunture dedicate.",
    rating: 3,
    washing: "Smacchiatura localizzata e lavaggio professionale delicato.",
    modifications: "Inserimento bottoni clip, nuove impunture e patch interna antiusura."
  },
  {
    name: "Maglia lana blu notte",
    code: "RL-2297",
    date: "2 febbraio 2026",
    status: "Venduto",
    phase: "Venduto online, punti accreditati sulla RE-LOVE Card.",
    rating: 5,
    washing: "Lavaggio lana a mano con ciclo di asciugatura orizzontale.",
    modifications: "Rammendo invisibile collo e sostituzione bordo maniche.",
    readyDate: "18 febbraio 2026",
    soldDate: "4 marzo 2026",
    points: 640
  },
  {
    name: "Trench urban sabbia",
    code: "RL-2250",
    date: "29 gennaio 2026",
    status: "Venduto",
    phase: "Ritirato nel corner Milano Duomo, punti gia accreditati.",
    rating: 4,
    washing: "Lavaggio tecnico anti-pioggia e trattamento igienizzante.",
    modifications: "Nuova cintura, fodera interna ripristinata e bottoni coordinati.",
    readyDate: "15 febbraio 2026",
    soldDate: "27 febbraio 2026",
    points: 640
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

function getStatusClass(status) {
  if (status === "In lavorazione") {
    return "working";
  }

  if (status === "Pronto") {
    return "ready";
  }

  return "sold";
}

function buildHistoryEvents(item) {
  const events = [
    {
      title: `Valutazione iniziale ${item.rating}/5`,
      detail: "Capo accettato per rigenerazione nel flusso RE-LOVE."
    },
    {
      title: "Lavaggio",
      detail: item.washing
    },
    {
      title: "Modifiche apportate",
      detail: item.modifications
    }
  ];

  if (item.readyDate) {
    events.push({
      title: "Stato aggiornato: Pronto",
      detail: `Capo pronto dal ${item.readyDate}.`
    });
  }

  if (item.soldDate && item.points) {
    events.push({
      title: "Stato aggiornato: Venduto",
      detail: `Venduto il ${item.soldDate}. Punti accumulati: +${new Intl.NumberFormat("it-IT").format(item.points)}.`
    });
  }

  return events;
}

function buildStatusItem(item, onClick) {
  const li = document.createElement("li");
  li.className = "status-item";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "status-item-button";

  const top = document.createElement("div");
  top.className = "status-top";

  const name = document.createElement("p");
  name.className = "status-name";
  name.textContent = item.name;

  const status = document.createElement("span");
  status.className = `status-pill ${getStatusClass(item.status)}`;
  status.textContent = item.status;

  const meta = document.createElement("p");
  meta.className = "status-meta";
  meta.textContent = `Codice ${item.code} | Donato il ${item.date}`;

  const phase = document.createElement("p");
  phase.className = "status-phase";
  phase.textContent = item.phase;

  button.addEventListener("click", () => onClick(item));

  const cta = document.createElement("p");
  cta.className = "status-action";
  cta.textContent = "Apri storico del capo";

  top.append(name, status);
  button.append(top, meta, phase);

  if (item.status === "Venduto" && item.points) {
    const points = document.createElement("p");
    points.className = "status-points";
    points.textContent = `Punti accumulati: +${new Intl.NumberFormat("it-IT").format(item.points)}`;
    button.append(points);
  }

  button.append(cta);
  li.append(button);
  return li;
}

function buildEmptyStatusItem(label) {
  const li = document.createElement("li");
  li.className = "status-item empty";
  li.textContent = `Nessun capo ${label}.`;
  return li;
}

function openHistoryModal(modalElements, item) {
  const { modal, title, meta, rating, wash, mods, timeline } = modalElements;
  title.textContent = item.name;
  meta.textContent = `Codice ${item.code} | Donato il ${item.date}`;
  rating.textContent = `${item.rating}/5`;
  wash.textContent = item.washing;
  mods.textContent = item.modifications;

  timeline.innerHTML = "";
  const events = buildHistoryEvents(item);
  events.forEach((event) => {
    const row = document.createElement("li");
    row.className = "history-event";

    const eventTitle = document.createElement("h4");
    eventTitle.textContent = event.title;

    const eventDetail = document.createElement("p");
    eventDetail.textContent = event.detail;

    row.append(eventTitle, eventDetail);
    timeline.appendChild(row);
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeHistoryModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
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
  const privateDonationsWorking = document.getElementById("privateDonationsWorking");
  const privateDonationsReady = document.getElementById("privateDonationsReady");
  const privateDonationsSold = document.getElementById("privateDonationsSold");
  const itemHistoryModal = document.getElementById("itemHistoryModal");
  const closeHistoryBtn = document.getElementById("closeHistoryBtn");
  const historyTitle = document.getElementById("historyTitle");
  const historyMeta = document.getElementById("historyMeta");
  const historyRating = document.getElementById("historyRating");
  const historyWash = document.getElementById("historyWash");
  const historyMods = document.getElementById("historyMods");
  const historyTimeline = document.getElementById("historyTimeline");
  const backdrop = itemHistoryModal?.querySelector("[data-close-history]");

  if (
    !authLogin ||
    !authPrivate ||
    !loginForm ||
    !logoutBtn ||
    !privateEmail ||
    !welcomeTitle ||
    !cardHolder ||
    !pointsValue ||
    !privateDonationsWorking ||
    !privateDonationsReady ||
    !privateDonationsSold ||
    !itemHistoryModal ||
    !closeHistoryBtn ||
    !historyTitle ||
    !historyMeta ||
    !historyRating ||
    !historyWash ||
    !historyMods ||
    !historyTimeline ||
    !backdrop
  ) {
    return;
  }

  const modalElements = {
    modal: itemHistoryModal,
    title: historyTitle,
    meta: historyMeta,
    rating: historyRating,
    wash: historyWash,
    mods: historyMods,
    timeline: historyTimeline
  };

  const statusBuckets = {
    "In lavorazione": privateDonationsWorking,
    Pronto: privateDonationsReady,
    Venduto: privateDonationsSold
  };

  donatedItems.forEach((item) => {
    const targetList = statusBuckets[item.status];
    if (targetList) {
      targetList.appendChild(buildStatusItem(item, (selectedItem) => openHistoryModal(modalElements, selectedItem)));
    }
  });

  if (privateDonationsWorking.children.length === 0) {
    privateDonationsWorking.appendChild(buildEmptyStatusItem("in lavorazione"));
  }
  if (privateDonationsReady.children.length === 0) {
    privateDonationsReady.appendChild(buildEmptyStatusItem("pronto"));
  }
  if (privateDonationsSold.children.length === 0) {
    privateDonationsSold.appendChild(buildEmptyStatusItem("venduto"));
  }

  closeHistoryBtn.addEventListener("click", () => {
    closeHistoryModal(itemHistoryModal);
  });

  backdrop.addEventListener("click", () => {
    closeHistoryModal(itemHistoryModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && itemHistoryModal.classList.contains("open")) {
      closeHistoryModal(itemHistoryModal);
    }
  });

  const emailInput = loginForm.querySelector('input[name="email"]');
  const points = donatedItems.reduce((total, item) => total + (item.points || 0), 0);

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

    privateEmail.textContent = email;
    welcomeTitle.textContent = `Ciao ${name}`;
    cardHolder.textContent = name;
    pointsValue.textContent = new Intl.NumberFormat("it-IT").format(points);

    showAuthPage(authPrivate);
  });

  logoutBtn.addEventListener("click", () => {
    closeHistoryModal(itemHistoryModal);
    showAuthPage(authLogin);
  });
}

initHeroSlider();
initProductCarousels();
initAreaRiservata();
