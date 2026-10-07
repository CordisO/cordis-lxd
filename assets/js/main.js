const socialToggle = document.getElementById('social-toggle');
const socialRow    = document.getElementById('social-row');

if (socialToggle && socialRow) {
  socialToggle.addEventListener('click', () => {
    socialToggle.classList.toggle('open');
    socialRow.classList.toggle('open');
  });
}

const phrases = [
  "Learning Experience Design",
  "EdTech Product Design",
  "Instructional Storytelling"
];

const typingEl = document.getElementById('typing-text');

if (typingEl) {
  let pIndex = 0, cIndex = 0, deleting = false;

  function tick(){
    const current = phrases[pIndex];
    if (!deleting){
      cIndex++;
      if (cIndex > current.length){ deleting = true; setTimeout(tick, 1200); return; }
    } else {
      cIndex--;
      if (cIndex < 0){ deleting = false; pIndex = (pIndex + 1) % phrases.length; cIndex = 0; }
    }
    typingEl.innerHTML = current.slice(0, cIndex) + '<span class="cursor">&nbsp;</span>';
    setTimeout(tick, deleting ? 35 : 60);
  }
  tick();
}

const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (e.target.closest('.site-nav')) return;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

/* ============================================================
   NAV — scroll spy (active link follows the section in view)
   ============================================================ */
(function () {
  const navLinks = Array.from(document.querySelectorAll(".site-nav .nav-link"));
  if (!navLinks.length) return;

  // Build { link, section } pairs from href="#id"
  const targets = navLinks
    .map(link => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return null;
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  // Home has href="#" (or "#home") — treat it as "scroll to top"
  const homeLink = navLinks.find(l => {
    const href = l.getAttribute("href");
    return href === "#" || href === "#home";
  });

  function setActive(link) {
    navLinks.forEach(l => l.classList.toggle("active", l === link));
  }

  // Track the section closest to the top of the viewport
  let ticking = false;

  function updateActive() {
    ticking = false;

    // If we're at the very top, Home is active
    if (window.scrollY < 80 && homeLink) {
      setActive(homeLink);
      return;
    }

    // If we're at the very bottom, the last section is active
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    if (atBottom) {
      setActive(targets[targets.length - 1].link);
      return;
    }

    // Otherwise: pick the section whose top is closest to (but above) a probe line
    const probe = window.scrollY + window.innerHeight * 0.35;
    let current = null;

    for (const t of targets) {
      const top = t.section.offsetTop;
      if (top <= probe) current = t;
    }

    if (current) setActive(current.link);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActive);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // When a nav link is clicked, immediately mark it active
  // (the scroll handler will confirm it once the smooth-scroll finishes)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (link === homeLink) {
        setActive(homeLink);
      } else {
        setActive(link);
      }
    });
  });

  // Set initial state on load
  updateActive();
})();



// Local Audio Playlist Configuration
const playlist = [
  {
    title: "S'Rothe-Zäuerli",
    artist: "Öser Sentimentäl / Alexandre Desplat",
    src: "assets/audio/s-rothe-zauerli.mp3",
    cover: "assets/images/s-rothe-zauerli.jpg"
  },
  {
    title: "Mr. Moustafa",
    artist: "Alexandre Desplat",
    src: "assets/audio/mr-moustafa.mp3",
    cover: "assets/images/mr-moustafa.jpg"
  },
  {
    title: "The New Lobby Boy",
    artist: "Alexandre Desplat",
    src: "assets/audio/new-lobby-boy.mp3",
    cover: "assets/images/new-lobby-boy.jpg"
  },
  {
    title: "Night Train To Nebelsbad",
    artist: "Alexandre Desplat",
    src: "assets/audio/night-train-to-nebelsbad.mp3",
    cover: "assets/images/night-train-to-nebelsbad.jpg"
  }
];

let currentTrackIndex = 0;
const audioPlayer = new Audio();

// DOM Elements
const playlistCard = document.getElementById('playlistCard');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const trackTitle   = document.getElementById('trackTitle');
const trackArtist  = document.getElementById('trackArtist');
const trackCover   = document.getElementById('trackCover'); // Image element
const playIcon     = document.getElementById('playIcon');
const pauseIcon    = document.getElementById('pauseIcon');

function loadTrack(index) {
  const track = playlist[index];
  if (!track) return;

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  if (trackCover) {
    trackCover.src = track.cover;
    trackCover.alt = `${track.title} Cover`;
  }
  audioPlayer.src = track.src;
}

function playTrack() {
  audioPlayer.play().then(() => {
    playlistCard.classList.add('is-playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  }).catch(err => console.error("Playback failed:", err));
}

function pauseTrack() {
  audioPlayer.pause();
  playlistCard.classList.remove('is-playing');
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
}

// Toggle Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

// Previous Track
prevBtn.addEventListener('click', () => {
  const wasPlaying = !audioPlayer.paused;
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  if (wasPlaying) playTrack();
});

// Next Track
nextBtn.addEventListener('click', () => {
  const wasPlaying = !audioPlayer.paused;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  if (wasPlaying) playTrack();
});

// Auto-play next track when current one ends
audioPlayer.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Initialize first track on page load
loadTrack(currentTrackIndex);


/* ============================================================
   CONTACT — wizard + bolt cast on email click
   ============================================================ */
(function () {
  const canvas = document.getElementById("contactWizard");
  const stage  = document.getElementById("contactWizardStage");
  const bolt   = document.getElementById("contactBolt");
  const btn    = document.getElementById("emailBtn");
  if (!canvas || !stage || !bolt || !btn || !window.rive) return;

  let riveReady = false;

  const instance = new rive.Rive({
    src: "assets/rive/wizard2.riv",
    canvas: canvas,
    autoplay: false,
    fit: rive.Fit.Contain,
    alignment: rive.Alignment.Center,
    onLoad: () => {
      instance.resizeDrawingSurfaceToCanvas();
      requestAnimationFrame(() => instance.resizeDrawingSurfaceToCanvas());
      setTimeout(() => instance.resizeDrawingSurfaceToCanvas(), 250);

      const idleName =
        instance.animationNames.find(n => n === "idle_right") ||
        instance.animationNames.find(n => /idle/i.test(n)) ||
        instance.animationNames[0];
      if (idleName) instance.play(idleName);

      riveReady = true;
    },
    onLoadError: (e) => console.warn("[contactWizard] Rive load error:", e)
  });

  window.addEventListener("resize", () =>
    instance.resizeDrawingSurfaceToCanvas()
  );

  /* ---------- Cast sequence ---------- */
  let casting = false;

    function cast() {
    if (casting) return;
    casting = true;

    // ----- Wizard cast -----
    if (riveReady) {
      const castName =
        instance.animationNames.find(n => n === "cast_right") ||
        instance.animationNames.find(n => /cast/i.test(n));
      if (castName) instance.play(castName);
    }

    stage.classList.add("is-casting");
    setTimeout(() => stage.classList.remove("is-casting"), 500);

    // ----- Bolt -----
    bolt.classList.remove("fire");
    void bolt.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bolt.classList.add("fire");
      });
    });

    // ----- Button flash -----
    setTimeout(() => {
      btn.classList.remove("is-hit");
      void btn.offsetWidth;
      btn.classList.add("is-hit");
    }, 400);

    // ----- PRIMARY ACTION: copy email to clipboard -----
    const email = "cordisobiefule@gmail.com";
    const label = btn.querySelector(".contact-email-label");

    navigator.clipboard.writeText(email)
      .then(() => {
        if (label) {
          const original = label.textContent;
          const arrow = btn.querySelector("svg");
          label.textContent = "Copied!";
          if (arrow) arrow.style.display = "none";
          setTimeout(() => {
            label.textContent = original;
            if (arrow) arrow.style.display = "";
          }, 1800);
        }
      })
      .catch(err => {
        console.warn("[contact] clipboard failed:", err);
        // Fallback: at least select the label so they can Ctrl+C
        if (label) {
          const range = document.createRange();
          range.selectNodeContents(label);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });

    // ----- Reset wizard to idle -----
    setTimeout(() => {
      casting = false;
      if (riveReady) {
        const idleName =
          instance.animationNames.find(n => n === "idle_right") ||
          instance.animationNames.find(n => /idle/i.test(n)) ||
          instance.animationNames[0];
        if (idleName) instance.play(idleName);
      }
    }, 900);
  }

  btn.addEventListener("click", cast);
})();


/* ============================================================
   CASE STUDY MODAL
   ============================================================ */
(function () {
  const overlay = document.getElementById("caseStudyModal");
  const body    = document.getElementById("csBody");
  const footer  = document.getElementById("csFooter");
  const backdrop= document.getElementById("csBackdrop");
  const closeBtn= document.getElementById("csClose");
  if (!overlay || !body || !footer) return;

  /* ---------- Case study content ---------- */
  const CASE_STUDIES = {
    blahlo: {
      eyebrow: "Case Study",
      title: "Blahlo",
      subtitle: "A neurodivergent-first language learning app built around context, construction, and the learner's own world.",
      meta: ["Instructional Design", "Product Design", "Learning Experience Design"],
      hook: "Most apps teach you to recognize language. Blahlo teaches you to build it.",

      sections: [
        {
          title: "The Problem",
          blocks: [
            { type: "text", value: "Most language apps teach recognition, not production." },
            { type: "text", value: "A learner can match <em>saya mau makan</em> to \"I want to eat\" without ever constructing the sentence themselves. And they can see <em>사과 = apple</em> on a flashcard forty times without ever learning the word." },
            { type: "text", value: "The gap isn't knowledge — it's the ability to <em>use</em> language in context." },
            { type: "callout", value: "\"A word is not a translation. A word is a memory. A feeling. A relationship. A moment.\"" }
          ]
        },
        {
          title: "The Thinking",
          blocks: [
            { type: "text", value: "Two connected systems: one determines <em>what</em> language is taught, the other determines <em>how</em> it gains meaning." },
            { type: "duo", items: [
              {
                title: "The Concentric Vertical Tree (CVT)",
                sub: "How language is sequenced",
                body: "Instead of starting with a vocabulary list, CVT starts from the target expression and works backwards. If the learner should eventually say <em>saya mau makan</em>, the design asks: what pieces must exist for that to be possible? Those pieces become the lesson — not because they belong to a category like \"food,\" but because they enable something the learner wants to express."
              },
              {
                title: "The Concentric Learning Model (CLM)",
                sub: "How language gains meaning",
                body: "Language is learned the way a child learns their first language: expanding outward from the self. <strong>The Self → Family &amp; Home → Community → Society.</strong> Each ring is a <em>context</em>, not a unit. New language attaches to familiar experience instead of abstract vocabulary lists."
              }
            ]},
            { type: "visual", label: "[ CVT diagram — saya mau makan breakdown ]" },
            { type: "visual", label: "[ CLM diagram — concentric rings ]" }
          ]
        },
        {
          title: "The Product",
          blocks: [
            { type: "text", value: "Blahlo is not just an app. It is a world." },
            { type: "text", value: "At its center is the <strong>Blah Family</strong> — recurring characters whose relationships, expressions, and everyday situations carry meaning. The learner encounters the same faces, spaces, and rhythms throughout the experience. Over time, these familiar elements become part of the language itself." },
            { type: "text", value: "Before each lesson, short illustrated scenes establish what's happening through action and emotion. A character rubs their stomach, looks uncomfortable, and says: <em>\"Saya lapar.\"</em> The learner begins to understand <em>lapar</em> through the situation before ever being given a translation." },
            { type: "visual", label: "[ Figma screenshots — Blah Family, animated scene, lesson UI ]" },
            { type: "text", value: "<strong>Visual identity:</strong> Cozy playground — warm, calm, tactile, but never overwhelming." },
            { type: "palette", items: [
              { hex: "#9956DE", name: "Purple" },
              { hex: "#75D06A", name: "Green" },
              { hex: "#FF9A76", name: "Coral" }
            ]}
          ]
        },
        {
          title: "Reflection",
          blocks: [
            { type: "text", value: "Blahlo started as a question I couldn't answer: why do so many language apps produce learners who can <em>recognize</em> a language but not <em>use</em> it? The answer, I think, is that most products are optimized around what's measurable — streaks, accuracy, completion — rather than what actually matters: whether the learner can construct something meaningful on their own." },
            { type: "text", value: "Building this taught me that instructional design and product design aren't separate disciplines. The model determines the interface. If the model is wrong, no amount of visual polish fixes it." },
            { type: "text", value: "If I were to keep going, the next step would be real usability testing with neurodivergent learners — the framework is sound in theory, but theory alone isn't evidence." }
          ]
        }
      ],

      links: {
        notion: "https://app.notion.com/p/Blahlo-Pedagogical-and-Product-Design-Case-Study-3e6bad679d9a806f93e7df175d20fc37?source=copy_link",
        figma:  "https://www.figma.com/proto/OPcw89neN6KZgKPm9xVw16/Blahlo?node-id=0-1&t=J9d7lMufHr4IqYTq-1"
      }
    }

    /* Add cosmos, vocabulingo, etc. here as separate keys following the same shape */
  };

  /* ---------- Renderers ---------- */
  function renderBlock(block) {
    if (block.type === "text") {
      return `<p class="cs-text">${block.value}</p>`;
    }
    if (block.type === "callout") {
      return `<blockquote class="cs-callout">${block.value}</blockquote>`;
    }
    if (block.type === "visual") {
      return `<div class="cs-visual">${block.label}</div>`;
    }
    if (block.type === "palette") {
      const swatches = block.items.map(s =>
        `<span class="cs-swatch">
          <span class="cs-swatch-dot" style="background:${s.hex}"></span>
          ${s.name} <span style="opacity:.5">${s.hex}</span>
        </span>`
      ).join("");
      return `<div class="cs-palette">${swatches}</div>`;
    }
    if (block.type === "duo") {
      const items = block.items.map(item =>
        `<div class="cs-mini">
          <h4>${item.title}</h4>
          <p class="cs-mini-sub">${item.sub}</p>
          <p>${item.body}</p>
        </div>`
      ).join("");
      return `<div class="cs-duo">${items}</div>`;
    }
    return "";
  }

  function renderSection(section) {
    const body = section.blocks.map(renderBlock).join("");
    return `<section class="cs-section">
      <h3 class="cs-section-title">${section.title}</h3>
      ${body}
    </section>`;
  }

  function renderCase(data) {
    const metaHtml = data.meta.map(m => `<span>${m}</span>`).join("");

    const hero = `
      <div class="cs-hero">
        <p class="cs-eyebrow">${data.eyebrow}</p>
        <h2 class="cs-title" id="csTitle">${data.title}</h2>
        <p class="cs-subtitle">${data.subtitle}</p>
        <div class="cs-meta">${metaHtml}</div>
        <p class="cs-hook">${data.hook}</p>
      </div>
    `;

    const sections = data.sections.map(renderSection).join("");
    body.innerHTML = hero + sections;

    footer.innerHTML = `
      <a class="cs-cta cs-cta--primary" href="${data.links.notion}" target="_blank" rel="noopener">
        <svg class="icon" viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1 1"/><path d="M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7l1-1"/></svg>
        Read Full Documentation
      </a>
      <a class="cs-cta cs-cta--secondary" href="${data.links.figma}" target="_blank" rel="noopener">
        <svg class="icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/></svg>
        View Figma Prototype
      </a>
    `;
  }

  /* ---------- Open / close ---------- */
  let lastFocused = null;

  function openModal(key) {
    const data = CASE_STUDIES[key];
    if (!data) return;
    lastFocused = document.activeElement;
    renderCase(data);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* ---------- Event wiring ---------- */
  document.querySelectorAll("[data-open-project]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.openProject));
  });

  closeBtn && closeBtn.addEventListener("click", closeModal);
  backdrop && backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
})();