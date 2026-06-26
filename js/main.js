// ============================================================
// OneCreaation — Main Site Logic
// UI interactions, navigation, modal, form, and webhook handler
// ============================================================

// ---------- Touch device detector ----------
window.addEventListener(
  "touchstart",
  function onFirstTouch() {
    document.body.classList.add("touch-device");
    window.removeEventListener("touchstart", onFirstTouch, false);
  },
  false,
);

// ---------- Custom cursor ----------
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) cursor.style.left = mx + "px";
  if (cursor) cursor.style.top = my + "px";
});

(function animRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  if (ring) {
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
  }
  requestAnimationFrame(animRing);
})();

// Hover expansions for custom cursor
document.addEventListener("mouseover", (e) => {
  if (
    e.target.closest(
      "a, button, .form-option, .modal-close, input, select",
    )
  ) {
    document.body.classList.add("cursor-hover");
  } else {
    document.body.classList.remove("cursor-hover");
  }
});

// ---------- Scroll progress ----------
const scrollLine = document.getElementById("scrollLine");
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  const pct =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  if (scrollLine) scrollLine.style.width = pct + "%";
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
});

// ---------- Mobile drawer menu ----------
const menuToggle = document.getElementById("menuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const drawerLinks = document.querySelectorAll(".drawer-link");

if (menuToggle && mobileDrawer) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileDrawer.classList.toggle("open");
    menuToggle.classList.toggle("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}

drawerLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (menuToggle) menuToggle.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// ---------- Service card hover coordinates tracking ----------
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// ============================================================
// BOOKING MODAL + FORM + WEBHOOK SUBMISSION (Secured)
// ============================================================

const bookingModal = document.getElementById("bookingModal");
const openBookingBtns = document.querySelectorAll(
  ".open-booking-btn, #navCta, #drawerCta",
);
const modalClose = document.getElementById("modalClose");
const nextStepBtn = document.getElementById("nextStepBtn");
const submitFormBtn = document.getElementById("submitFormBtn");
const successCloseBtn = document.getElementById("successCloseBtn");

const modalFormState = document.getElementById("modalFormState");
const modalSuccessState = document.getElementById("modalSuccessState");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const stepDots = document.querySelectorAll(".modal-step-dot");
const formOptions = document.querySelectorAll(".form-option");
const leadForm = document.getElementById("leadForm");
let chosenFocus = "";

// --- Security: Track real user interactions ---
let formInteracted = false;
let fieldsInteractedSet = new Set();

document.querySelectorAll("#leadForm .form-input").forEach((input) => {
  input.addEventListener("focus", () => {
    formInteracted = true;
    fieldsInteractedSet.add(input.id);
  });
});

function openModal() {
  if (bookingModal) bookingModal.classList.add("open");
  resetForm();
}

function closeModal() {
  if (bookingModal) bookingModal.classList.remove("open");
}

openBookingBtns.forEach((btn) =>
  btn.addEventListener("click", openModal),
);
if (modalClose) modalClose.addEventListener("click", closeModal);
if (successCloseBtn)
  successCloseBtn.addEventListener("click", closeModal);

if (bookingModal) {
  bookingModal.addEventListener("click", (e) => {
    if (e.target === bookingModal) closeModal();
  });
}

function resetForm() {
  if (leadForm) leadForm.reset();
  chosenFocus = "";
  formInteracted = false;
  fieldsInteractedSet.clear();
  formOptions.forEach((opt) => opt.classList.remove("selected"));
  if (step1) step1.style.display = "block";
  if (step2) step2.style.display = "none";
  if (modalFormState) modalFormState.style.display = "block";
  if (modalSuccessState) modalSuccessState.style.display = "none";
  stepDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === 0);
  });
}

if (nextStepBtn) {
  nextStepBtn.addEventListener("click", () => {
    const name = document.getElementById("formName");
    const email = document.getElementById("formEmail");
    const website = document.getElementById("formWebsite");
    const phone = document.getElementById("formPhone");
    if (name && email && website && phone) {
      if (
        name.reportValidity() &&
        email.reportValidity() &&
        website.reportValidity() &&
        phone.reportValidity()
      ) {
        if (step1) step1.style.display = "none";
        if (step2) step2.style.display = "block";
        if (stepDots[1]) stepDots[1].classList.add("active");
      }
    }
  });
}

formOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    formOptions.forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    chosenFocus = opt.getAttribute("data-value");
  });
});

// ============================================================
// SECURITY LAYER
// ============================================================

// --- Rate limiting via sessionStorage ---
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

function isRateLimited() {
  const lastSubmit = sessionStorage.getItem("oc_last_submit");
  if (!lastSubmit) return false;
  return Date.now() - parseInt(lastSubmit, 10) < RATE_LIMIT_MS;
}

function recordSubmission() {
  sessionStorage.setItem("oc_last_submit", Date.now().toString());
}

// --- Basic email format validation ---
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Honeypot check ---
function isHoneypotFilled() {
  const honeypot = document.getElementById("formCompanyAddress");
  return honeypot && honeypot.value.length > 0;
}

// ============================================================
// WEBHOOK SUBMISSION
// ============================================================

// Configure your n8n Webhook URL here
const N8N_WEBHOOK_URL = "";

if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // --- Validation checks ---
    if (!chosenFocus) {
      alert("Please select your primary channel focus.");
      return;
    }

    // Honeypot check (silent rejection)
    if (isHoneypotFilled()) {
      // Silently show success to fool bots
      if (modalFormState) modalFormState.style.display = "none";
      if (modalSuccessState) modalSuccessState.style.display = "block";
      return;
    }

    // Rate limiting
    if (isRateLimited()) {
      alert("You recently submitted a request. Please wait a moment before trying again.");
      return;
    }

    // Interaction verification (must have focused at least name + email)
    if (!formInteracted || fieldsInteractedSet.size < 2) {
      alert("Please fill out the form fields before submitting.");
      return;
    }

    const nameVal = document.getElementById("formName")?.value || "";
    const emailVal = document.getElementById("formEmail")?.value || "";
    const websiteVal = document.getElementById("formWebsite")?.value || "";
    const phoneVal = document.getElementById("formPhone")?.value || "";

    // Basic payload validation
    if (nameVal.trim().length < 2) {
      alert("Please enter a valid name.");
      return;
    }
    if (!isValidEmail(emailVal)) {
      alert("Please enter a valid email address.");
      return;
    }

    // --- Prepare and send ---
    const submitBtn = document.getElementById("submitFormBtn");
    const originalText = submitBtn ? submitBtn.innerText : "Confirm & Book Call";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }

    const payload = {
      name: nameVal,
      email: emailVal,
      website: websiteVal,
      phone: phoneVal,
      focus: chosenFocus,
      submittedAt: new Date().toISOString(),
    };

    if (!N8N_WEBHOOK_URL) {
      // Fallback / Demonstration mode if webhook is not set yet
      console.warn(
        "n8n Webhook URL is not configured. Simulating successful form submission.",
      );
      setTimeout(() => {
        if (modalFormState) modalFormState.style.display = "none";
        if (modalSuccessState) modalSuccessState.style.display = "block";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
        recordSubmission();
      }, 1000);
      return;
    }

    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit to webhook");
        }
        if (modalFormState) modalFormState.style.display = "none";
        if (modalSuccessState) modalSuccessState.style.display = "block";
        recordSubmission();
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert(
          "There was an issue submitting your request. Please try again.",
        );
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      });
  });
}

// ============================================================
// REVEAL ON SCROLL (IntersectionObserver)
// ============================================================

const reveals = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-zoom",
);
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((el) => obs.observe(el));
