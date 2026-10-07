const CONFIG = {
  left: {
    riveFile: "assets/rive/wizard1.riv",
    idleAnim: "idle",
    castAnim: "cast",
    castAt: 1100,
    colorAt: 1350
  },
  right: {
    riveFile: "assets/rive/wizard2.riv",
    idleAnim: "idle_right",
    castAnim: "cast_right",
    castAt: 2850,
    colorAt: 3100
  }
};

const nameLockup    = document.querySelector("#nameLockup");
const leftStage     = document.querySelector(".wizard-stage--left");
const rightStage    = document.querySelector(".wizard-stage--right");
const purpleBolt    = document.querySelector("#purpleBolt");
const goldBolt      = document.querySelector("#goldBolt");
const purpleImpact  = document.querySelector("#purpleImpact");
const goldImpact    = document.querySelector("#goldImpact");
const grandStrike   = document.querySelector("#grandStrike");
const grandFlash    = document.querySelector("#grandFlash");
const splash        = document.querySelector("#splash");

const wizardInstances = { left: null, right: null };

function loadWizard(config, canvasId, stage, side) {
  if (!window.rive) {
    console.warn("Rive runtime did not load.");
    return;
  }

  const instance = new rive.Rive({
    src: config.riveFile,
    canvas: document.querySelector(canvasId),
    autoplay: false,
    fit: rive.Fit.Contain,
    alignment: rive.Alignment.Center,
    onLoad: () => {
      stage.classList.add("rive-ready");

      // Size the drawing surface to the canvas box — do it a few times
      // because CSS clamp()/aspect-ratio may not have settled yet.
      instance.resizeDrawingSurfaceToCanvas();
      requestAnimationFrame(() => instance.resizeDrawingSurfaceToCanvas());
      setTimeout(() => instance.resizeDrawingSurfaceToCanvas(), 250);

      console.log(`[${side}] animations:`, instance.animationNames);
      console.log(`[${side}] artboard:`, instance.activeArtboard);

      // Play idle — try the configured name, then any name containing "idle",
      // then just the first available animation as a last resort.
      const idleName =
        instance.animationNames.find(n => n === config.idleAnim) ||
        instance.animationNames.find(n => /idle/i.test(n)) ||
        instance.animationNames[0];
      if (idleName) {
        instance.play(idleName);
        console.log(`[${side}] playing idle:`, idleName);
      }

      wizardInstances[side] = instance;
    },
    onLoadError: (e) => console.warn(`[${side}] Rive load error:`, e)
  });

  window.addEventListener("resize", () =>
    instance.resizeDrawingSurfaceToCanvas()
  );
}

function triggerRiveCast(instance, config) {
  if (!instance) return;
  // Prefer the exact name from CONFIG; fall back to any name matching /cast/.
  const castName =
    instance.animationNames.find(n => n === config.castAnim) ||
    instance.animationNames.find(n => /cast/i.test(n));
  if (castName) {
    instance.play(castName);
    console.log("playing cast:", castName);
  } else {
    console.warn("No cast animation found on this wizard.");
  }
}

function fireCast(stage, bolt, impact, direction, side) {
  stage.classList.add("is-casting");
  triggerRiveCast(wizardInstances[side], CONFIG[side]);

  bolt.classList.remove("fire-left", "fire-right");
  impact.classList.remove("fire");
  void bolt.offsetWidth;
  bolt.classList.add(direction === "left" ? "fire-left" : "fire-right");

  setTimeout(() => impact.classList.add("fire"), 280);
  setTimeout(() => stage.classList.remove("is-casting"), 650);
}

window.addEventListener("load", () => {
  loadWizard(CONFIG.left,  "#wizardLeft",  leftStage,  "left");
  loadWizard(CONFIG.right, "#wizardRight", rightStage, "right");

  // LEFT cast
  setTimeout(() => fireCast(leftStage, purpleBolt, purpleImpact, "left", "left"),
             CONFIG.left.castAt);
  setTimeout(() => nameLockup.classList.add("is-purple"),
             CONFIG.left.colorAt);

  // RIGHT cast
  setTimeout(() => fireCast(rightStage, goldBolt, goldImpact, "right", "right"),
             CONFIG.right.castAt);
  setTimeout(() => {
    nameLockup.classList.remove("is-purple");
    nameLockup.classList.add("is-gold");
  }, CONFIG.right.colorAt);

  // Grand strike
  setTimeout(() => {
    grandStrike.classList.remove("fire");
    grandFlash.classList.remove("fire");
    void grandStrike.offsetWidth;
    grandStrike.classList.add("fire");
    grandFlash.classList.add("fire");
  }, 4300);

  // Fade + redirect
  setTimeout(() => splash.classList.add("is-fading"), 5050);
  setTimeout(() => {
  window.location.href = "main.html";  }, 5700);
});