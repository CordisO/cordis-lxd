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
            hero: {
        src: "assets/images/case-studies/blahlo/hero.png",
        alt: "Blahlo home screen"
      },

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
            { type: "image",
              src: "assets/images/case-studies/blahlo/cvt-diagram.png",
              alt: "The Concentric Vertical Tree diagram",
              caption: "The Concentric Vertical Tree — expression-driven sequencing"
            },
            { type: "image",
              src: "assets/images/case-studies/blahlo/clm.png",
              alt: "The Concentric Learning Model diagram",
              caption: "The Concentric Learning Model — context expanding outward from the self"
            },
          ]
        },
        {
          title: "The Product",
          blocks: [
            { type: "text", value: "Blahlo is not just an app. It is a world." },
            { type: "text", value: "At its center is the <strong>Blah Family</strong> — recurring characters whose relationships, expressions, and everyday situations carry meaning. The learner encounters the same faces, spaces, and rhythms throughout the experience. Over time, these familiar elements become part of the language itself." },
            { type: "text", value: "Before each lesson, short illustrated scenes establish what's happening through action and emotion. A character rubs their stomach, looks uncomfortable, and says: <em>\"Saya lapar.\"</em> The learner begins to understand <em>lapar</em> through the situation before ever being given a translation." },
            { type: "image",
              src: "assets/images/case-studies/blahlo/lesson-screen.png",
              alt: "Bini and Uli on a lesson screen",
              caption: "Bini and Uli — the twins who accompany the learner through the experience"
            },
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
    },

    /* Add cosmos, vocabulingo, etc. here as separate keys following the same shape */
    /* Cosmos */
        cosmos: {
      eyebrow: "Case Study",
      title: "Cosmos",
      subtitle: "A structured astrology learning app that teaches the system, not the horoscope.",
      meta: ["Instructional Design", "Product Design", "Learning Experience Design", "2025"],
      hook: "How do you teach a system, rather than a collection of facts?",

      hero: {
        src: "assets/images/case-studies/cosmos/hero.png",
        alt: "Cosmos home screen"
      },

      sections: [
        {
          title: "The Problem",
          blocks: [
            { type: "text", value: "Learning astrology as a beginner runs into three structural walls." },
            { type: "text", value: "<strong>Extreme simplification or extreme jargon</strong> — popular apps reduce the entire discipline to daily sun-sign horoscopes, while technical tools dump advanced chart calculations on learners without defining the fundamentals." },
            { type: "text", value: "<strong>Isolated facts without systemic context</strong> — astrology is planets, signs, houses, and aspects working together. Existing resources present these as separate reference definitions instead of showing how they combine into a coherent reading." },
            { type: "text", value: "<strong>No structured progression</strong> — beginners piecemeal their education across scattered sources, with no sequence that moves from zero knowledge to ethical, practical chart reading." },
            { type: "callout", value: "\"Astrology isn't a collection of meanings. It's a language — and languages are learned as systems.\"" }
          ]
        },
        {
          title: "The Thinking",
          blocks: [
            { type: "text", value: "Two learner types arrive with different starting points but the same underlying need." },
            { type: "text", value: "<strong>The Curious Beginner</strong> — no prior knowledge, intellectually curious, but quickly bounced off shallow horoscope content. They need a reliable starting point and explanations that build understanding, not definitions." },
            { type: "text", value: "<strong>The Developing Practitioner</strong> — some vocabulary and concept familiarity, but now facing the real question: <em>how does it all fit together?</em> As charts, houses, and aspects multiply, existing knowledge becomes hard to organize." },
            { type: "text", value: "<strong>The shared problem:</strong> both learners need to move beyond <em>knowing astrology terms</em> toward <em>understanding how the system works.</em> That distinction became the foundation for the learning experience." },
            { type: "duo", items: [
              {
                title: "The Hermetic Spiral Model",
                sub: "A curriculum that revisits instead of accumulates",
                body: "Rather than treating learning as a linear march through isolated topics, the Spiral Model brings learners back to foundational concepts at increasing levels of complexity. Each stage builds on established knowledge, and new concepts are only introduced once the learner has the foundations to use them.<br><br><strong>Level 1 — Recognition:</strong> understand individual concepts<br><strong>Level 2 — Connection:</strong> understand how concepts relate<br><strong>Level 3 — Synthesis:</strong> combine previously learned concepts<br><strong>Level 4 — Interpretation:</strong> use relationships to make meaning"
              },
              {
                title: "The Ascension",
                sub: "How the model becomes a curriculum",
                body: "The Hermetic Spiral Model translates into a structured curriculum organized as <strong>Orders → Chapters → Lessons.</strong> Orders span broad areas of knowledge. Chapters group related lessons. Lessons are 300+ micro-units, each focused on a single concept.<br><br>Progression is linear and locked — every new concept appears only after its prerequisites have been taught."
              }
            ]},
            { type: "text", value: "<strong>The Four Movements</strong> — every micro-lesson follows the same 4-step sequence. The system works as a whole, so it's best seen together:" },
            { type: "grid", items: [
              { src: "assets/images/case-studies/cosmos/movement-1.png", alt: "Movement I — The Revelation", caption: "I. The Revelation — paced audio + animated storytelling" },
              { src: "assets/images/case-studies/cosmos/movement-2.png", alt: "Movement II — The Recognition", caption: "II. The Recognition — 4 retrieval exercises, 80% to proceed" },
              { src: "assets/images/case-studies/cosmos/movement-3.png", alt: "Movement III — The Integration", caption: "III. The Integration — guided practice on a neutral chart" },
              { src: "assets/images/case-studies/cosmos/movement-4.png", alt: "Movement IV — The Production", caption: "IV. The Production — independent expression, saved to Journal" }
            ]}
          ]
        },
        {
          title: "The Product",
          blocks: [
            { type: "text", value: "<strong>A Sanctuary of Light.</strong> Cosmos is designed to feel like stepping into a calm night sky — deep, atmospheric, and clear. Every color earns its role." },
            { type: "palette", items: [
              { hex: "#9846FF", name: "Cosmic Violet" },
              { hex: "#4A008B", name: "Cosmic Ink" },
              { hex: "#CB6CE6", name: "Starchild Magenta" },
              { hex: "#DEA639", name: "Starlight Gold" }
            ]},
            { type: "text", value: "<strong>Principle of Restraint:</strong> gold is never decorative. It's reserved for moments of discovery and correct answers, so illumination feels earned." },
            { type: "image",
              src: "assets/images/case-studies/cosmos/cosmo.png",
              alt: "Cosmo, the guide character",
              caption: "Cosmo — an otherworldly companion, not a mascot"
            },
            { type: "text", value: "Cosmo isn't a gamification gimmick. He's a minimal silhouette with a single golden eye who narrates the Revelation, offers hints in the Integration, and remains a calm focal point throughout. He communicates guidance through movement and light rather than rigid text alerts." }
          ]
        },
        {
          title: "Reflection",
          blocks: [
            { type: "text", value: "Cosmos challenged me to treat astrology as a subject that requires structured learning design, not content delivery. The two frameworks I developed — the Hermetic Spiral Model and The Ascension — were the actual design work; the interface was the evidence." },
            { type: "text", value: "Working within visual asset constraints taught me something about scope: what I could produce wasn't the whole vision, and that's fine. The frameworks are portable. They'd apply to any subject where the goal is teaching a system rather than a set of facts." },
            { type: "text", value: "If I were to continue, the next step would be prototyping a full lesson end to end and testing how learners respond to the Movement progression — particularly whether the 80% threshold encourages or discourages beginners. The system is sound in theory; the next stage is watching it work." }
          ]
        }
      ],

      links: {
        notion: "https://magnificent-gauge-790.notion.site/Cosmos-Astrology-Learning-App-3edbad679d9a80ed9a76f5323d7db91d?pvs=74",
        figma:  "https://www.figma.com/proto/Ty9cNI5kUkR0LNFOM6Z1gO/Cosmos?node-id=0-1&t=rpVCOEqjISqFsDon-1"
      }
    },
    /* Decodyssey */
    decodyssey: {
    eyebrow: "Case Study",
    title: "Decodyssey",
    subtitle: "A neurodivergent-first critical thinking app that reframes reasoning as a survival skill, not an academic exercise.",
    meta: ["Product Design", "Instructional Architecture", "PWA Engineering", "2025"],
    hook: "Critical thinking isn't abstract logic. It's survival in a world designed to manipulate you.",

    sections: [
      {
        title: "The Problem",
        blocks: [
          { type: "text", value: "Critical thinking instruction in digital media is built on Western academic paradigms — formal fallacies, debate structure, hypothetical puzzles. These assume reasoning is an intellectual luxury, not a daily survival tool." },
          { type: "text", value: "But most people don't face clean logical problems. They face manipulative ads, fake urgency, predatory contracts, and language engineered to override their judgment. The gap isn't intelligence — it's context." },
          { type: "callout", value: "\"Reasoning should be trained against the situations it's actually used in — not the ones that look good on a syllabus.\"" }
        ]
      },
      {
        title: "The Instructional Approach",
        blocks: [
          { type: "duo", items: [
            {
              title: "Survival Reasoning",
              sub: "Reframing critical thinking for real-world pressure",
              body: "Instead of teaching formal logic through abstract puzzles, Decodyssey embeds reasoning directly into high-stakes scenarios — deceptive mechanics like fake urgency, false authority, and manipulated social proof. Learners practice recognizing manipulation under the same psychological pressure it actually occurs in."
            },
            {
              title: "The 5-Part Scenario Loop",
              sub: "How each module is structured",
              body: "Every lesson moves through a fixed sequence engineered to simulate real pressure without overwhelming the learner: <strong>Context Setup → Manipulative Trap → Decision Point → Constrained Choice → Explanatory Feedback.</strong> The loop is deliberately short — 2 to 3 minutes per module."
            }
          ]},
            { type: "image",
              src: "assets/images/case-studies/decodyssey/scenario-loop.png",
              alt: "The 5-part Decodyssey scenario loop",
              caption: "Context → Trap → Decision → Choice → Feedback"
            }
        ]
      },
      {
        title: "The Product",
        blocks: [
          { type: "text", value: "<strong>Offline-first. Zero-backend. Private by default.</strong>" },
          { type: "text", value: "Decodyssey is a Progressive Web App (PWA) built so users can access full lessons without internet connectivity, data costs, or an account. Everything runs locally: modules are delivered as JSON, progress is tracked in localStorage, and Service Workers handle caching. No cloud, no microservices, no user data leaving the device." },
          { type: "text", value: "The design is intentionally minimal. Bite-sized modules, focused scenarios, and local relevance — the content mirrors the everyday digital interactions users actually face, not hypothetical academic ones." },
          { type: "image",
            src: "assets/images/case-studies/decodyssey/lesson-screen.png",
            alt: "Decodyssey lesson screen",
            caption: "A scenario module in progress"
          }
        ]
      },
      {
        title: "The Subtext Problem",
        blocks: [
          { type: "text", value: "<em>What the testing revealed</em>" },
          { type: "text", value: "The pilot ran with 7 participants using pre- and post-test instruments. The baseline scores came back near-perfect — too perfect. Something was off." },
          { type: "text", value: "The root cause wasn't learner ability. It was the interface itself. Each answer choice had descriptive subtext underneath it that was unintentionally telegraphing the \"correct\" critical-thinking answer. Users were scoring high not because they analyzed the scenario, but because they were picking up on subtle linguistic cues in the UI." },
          { type: "text", value: "<strong>The fix:</strong> strip the choice subtext entirely. Force learners to evaluate options based strictly on scenario context, not visual or linguistic hints." },
          { type: "text", value: "After the redesign, baseline scores dropped to realistic levels — which was the actual proof the intervention was working." }
        ]
      },
      {
        title: "Reflection",
        blocks: [
          { type: "text", value: "Decodyssey taught me that some of the most important design problems are invisible until testing exposes them. The Subtext Problem wasn't something I could have caught by reviewing my own work — the interface <em>looked</em> correct. It only became visible when real users interacted with it and the data didn't make sense." },
          { type: "text", value: "That's the case for testing early and testing honestly, even with a small sample. Seven people were enough to surface a flaw that would have undermined the entire product's credibility." },
          { type: "text", value: "If I were to keep going, the next step would be expanding the scenario library beyond deception mechanics into broader reasoning contexts — negotiation, resource decisions, information verification — while keeping the 2-to-3-minute constraint intact. The constraint is the design." }
        ]
      }
    ],

    links: {
      notion: "https://magnificent-gauge-790.notion.site/Decodyssey-Microlearning-App-Case-Study-3f4bad679d9a80a1889ee2937cefbe42?source=copy_link",
      figma:  "https://decodyssey.netlify.app/"
    }
    }
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
    if (block.type === "image") {
      return `<figure class="cs-figure">
        <img src="${block.src}" alt="${block.alt}" loading="lazy">
        ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}
      </figure>`;
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
        ${data.hero ? `<figure class="cs-figure cs-hero-figure">
          <img src="${data.hero.src}" alt="${data.hero.alt}" loading="lazy">
        </figure>` : ""}
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
