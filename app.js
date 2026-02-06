/* Hannah — 23 & Me (Birthday Edition)
   Static GitHub Pages friendly app.
*/
(() => {
  const screens = [
    { id: "screen-welcome",  label: "Welcome" },
    { id: "screen-sequencing", label: "Sequencing" },
    { id: "screen-traits",   label: "Traits" },
    { id: "screen-final",    label: "Final" },
    { id: "screen-map",      label: "Map" },
    { id: "screen-moon",     label: "Moon" },
  ];

  const STORAGE_KEY = "hannah23_progress_v1";

  const state = {
    step: 0,
    sequencingDone: false,
    usaConfirmed: false,
    koreaConfirmed: false,
  };

  // --- Utilities
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.assign(state, parsed);
      state.step = clamp(state.step ?? 0, 0, screens.length-1);
    } catch (_) {}
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function toast(msg) {
    const el = $("#mapToast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => el.classList.remove("show"), 1600);
  }

  // --- Navigation
  function setStep(step) {
    state.step = clamp(step, 0, screens.length-1);
    save();

    $$(".screen").forEach(s => s.classList.remove("is-active"));
    const screenId = screens[state.step].id;
    const active = document.getElementById(screenId);
    if (active) active.classList.add("is-active");

    // progress UI
    const pct = (state.step / (screens.length-1)) * 100;
    $("#progressBar").style.width = `${pct}%`;
    $("#stepLabel").textContent = screens[state.step].label;

    // when arriving on map, ensure map is mounted
    if (screenId === "screen-map") {
      ensureMap();
      syncMapChecks();
      syncMoonButton();
    }

    // when arriving on moon, ensure share link
    if (screenId === "screen-moon") {
      $("#shareBtn").addEventListener("click", (e) => {
        e.preventDefault();
        const url = window.location.href.split("#")[0];
        const text = "Hannah — 23 & Me Birthday Edition 🌙 (Unlocked: Us — 100%)";
        if (navigator.share) {
          navigator.share({ title: "Hannah — 23 & Me", text, url }).catch(()=>{});
        } else {
          navigator.clipboard?.writeText(url);
          alert("Link copied (or attempted) — send it to someone you like 🙂\n" + url);
        }
      }, { once:true });
    }
  }

  function next() { setStep(state.step + 1); }
  function back() { setStep(state.step - 1); }
  function jumpTo(id) {
    const idx = screens.findIndex(s => s.id === id);
    if (idx >= 0) setStep(idx);
  }

  // --- Sequencing UI
  const scanItems = [
    { label: "Birthday sparkle", tag: "high" },
    { label: "Laugh radius", tag: "elite" },
    { label: "Kindness gene", tag: "dominant" },
    { label: "Adventure tendency", tag: "present" },
    { label: "Icon factor", tag: "off the charts" },
  ];

  function mountScanList() {
    const mount = $("#scanList");
    if (!mount) return;
    mount.innerHTML = scanItems.map((x, i) => `
      <div class="scanItem" data-scan="${i}">
        <strong>${x.label}</strong>
        <span class="scanPill wait">waiting</span>
      </div>
    `).join("");
  }

  function mountBits() {
    const bits = $("#seqBits");
    if (!bits) return;
    const total = 50;
    bits.innerHTML = Array.from({length: total}).map(() => `<div class="bit"></div>`).join("");
  }

  function runSequencing() {
    const bar = $("#seqBar");
    const status = $("#seqStatus");
    const bitEls = $$("#seqBits .bit");
    const scanEls = $$("#scanList .scanItem");

    let p = 0;
    state.sequencingDone = false;
    save();
    status.textContent = "Sequencing…";

    const timer = setInterval(() => {
      p += Math.random() * 8 + 2;
      p = Math.min(100, p);
      bar.style.width = `${p}%`;

      // turn on bits
      const onCount = Math.floor((p/100) * bitEls.length);
      bitEls.forEach((b, idx) => b.classList.toggle("on", idx < onCount));

      // mark scan items as ok progressively
      const scanDone = Math.floor((p/100) * scanEls.length);
      scanEls.forEach((row, idx) => {
        const pill = row.querySelector(".scanPill");
        if (idx < scanDone) {
          pill.classList.remove("wait");
          pill.classList.add("ok");
          pill.textContent = "confirmed";
        }
      });

      status.textContent = p >= 100 ? "Complete ✓" : `Processing… ${Math.floor(p)}%`;

      if (p >= 100) {
        clearInterval(timer);
        state.sequencingDone = true;
        save();
        setTimeout(() => {
          toast?.("Sequencing complete!");
          next();
        }, 650);
      }
    }, 120);
  }

  // --- Traits
  const photos = ["IMG_0892.jpeg", "IMG_7340.jpeg", "IMG_7612.jpeg", "IMG_7726.jpeg", "IMG_7729.jpeg"];
  const pickPhoto = (i) => `./assets/photos/${photos[i % photos.length]}`;

  const traits = [
    {
      name: "Warmth",
      pct: "99.9%",
      desc: "The kind of presence that makes a room feel safer.",
      method: `Detected via: spontaneous encouragement, thoughtful check-ins, and the ability to make people feel seen.`,
    },
    {
      name: "Humor",
      pct: "98.7%",
      desc: "Laughter arrives early… and stays late.",
      method: `Detected via: perfectly timed comments, contagious giggles, and comedy that never punches down.`,
    },
    {
      name: "Glow",
      pct: "97.2%",
      desc: "Radiance that appears even in low light conditions.",
      method: `Detected via: high-frequency smiling + the "wait—say that again" effect.`,
    },
    {
      name: "Curiosity",
      pct: "96.4%",
      desc: "Always learning, always noticing the interesting detail.",
      method: `Detected via: adventurous questions, new ideas, and the “tell me more” reflex.`,
    },
    {
      name: "Loyalty",
      pct: "99.1%",
      desc: "Shows up. Follows through. Remembers the little stuff.",
      method: `Detected via: consistent care across seasons (and the legendary birthday-remembering subroutine).`,
    },
    {
      name: "Icon Energy",
      pct: "100.0%",
      desc: "A rare trait: effortlessly unforgettable.",
      method: `Detected via: confidence + kindness combo, high style variance, and the "main-character timing" allele.`,
    },
  ];

  function mountTraits() {
    const grid = $("#traitsGrid");
    if (!grid) return;
    grid.innerHTML = traits.map((t, idx) => `
      <article class="trait" data-trait="${idx}" tabindex="0" role="button" aria-label="Trait: ${t.name}">
        <div class="trait__img">
          <img src="${pickPhoto(idx)}" alt="Photo for trait ${t.name}">
        </div>
        <div class="trait__body">
          <div class="trait__top">
            <div class="trait__name">${t.name}</div>
            <div class="trait__pct">${t.pct}</div>
          </div>
          <p class="trait__desc">${t.desc}</p>
          <div class="trait__method"><strong>Methodology:</strong> ${t.method}</div>
        </div>
      </article>
    `).join("");

    // toggle
    $$(".trait").forEach(card => {
      const toggle = () => card.classList.toggle("is-open");
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); toggle();
        }
      });
    });
  }

  // --- Map
  let mapLoaded = false;

  async function ensureMap() {
    if (mapLoaded) return;
    const mount = $("#mapMount");
    if (!mount) return;

    try {
      const res = await fetch("./assets/world.svg");
      const svgText = await res.text();
      mount.innerHTML = svgText;

      const svg = mount.querySelector("svg");
      if (!svg) return;

      // Make SVG responsive
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // USA is represented by many paths with class "United States"
      const usa = $$(".United\\ States", svg);
      // Korea is a single path with id "KR"
      const kor = svg.querySelector("#KR");

      // Add clickable styling and dim others slightly for focus
      const allPaths = $$("path", svg);
      allPaths.forEach(p => p.classList.add("country--dim"));

      usa.forEach(p => {
        p.classList.remove("country--dim");
        p.classList.add("country--clickable", "country--usa");
        p.addEventListener("click", () => {
          state.usaConfirmed = true;
          save();
          syncMapChecks();
          syncMoonButton();
          markConfirmed();
          toast("USA confirmed ✅");
        });
      });

      if (kor) {
        kor.classList.remove("country--dim");
        kor.classList.add("country--clickable", "country--korea");
        kor.addEventListener("click", () => {
          state.koreaConfirmed = true;
          save();
          syncMapChecks();
          syncMoonButton();
          markConfirmed();
          toast("Korea confirmed ✅");
        });
      }

      function markConfirmed() {
        // if confirmed, flip styling to confirmed
        if (state.usaConfirmed) {
          usa.forEach(p => {
            p.classList.add("country--confirmed");
            p.classList.remove("country--usa");
          });
        }
        if (state.koreaConfirmed && kor) {
          kor.classList.add("country--confirmed");
          kor.classList.remove("country--korea");
        }
      }

      // restore prior state
      markConfirmed();

      mapLoaded = true;
    } catch (err) {
      mount.innerHTML = "<div style='color:rgba(234,240,255,.85);padding:12px'>Map failed to load. (Check assets/world.svg)</div>";
    }
  }

  function syncMapChecks() {
    const usa = $("#checkUSA");
    const kor = $("#checkKOR");
    if (usa) {
      usa.classList.toggle("is-done", !!state.usaConfirmed);
      usa.querySelector("strong").textContent = state.usaConfirmed ? "confirmed" : "not yet";
    }
    if (kor) {
      kor.classList.toggle("is-done", !!state.koreaConfirmed);
      kor.querySelector("strong").textContent = state.koreaConfirmed ? "confirmed" : "not yet";
    }
  }

  function syncMoonButton() {
    const btn = $("#toMoonBtn");
    if (!btn) return;
    const ok = !!state.usaConfirmed && !!state.koreaConfirmed;
    btn.disabled = !ok;
    btn.textContent = ok ? "Go to the moon 🌙" : "Unlock requires USA + Korea";
  }

  // --- Wire up global buttons
  function wireNavButtons() {
    $$("[data-next]").forEach(b => b.addEventListener("click", next));
    $$("[data-back]").forEach(b => b.addEventListener("click", back));
    $$("[data-jump]").forEach(b => {
      b.addEventListener("click", () => jumpTo(b.getAttribute("data-jump")));
    });

    $("#resetBtn").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      Object.assign(state, { step:0, sequencingDone:false, usaConfirmed:false, koreaConfirmed:false });
      setStep(0);
    });

    $("#beginSeqBtn").addEventListener("click", runSequencing);
    $("#skipSeqBtn").addEventListener("click", () => {
      state.sequencingDone = true;
      save();
      next();
    });

    $("#toMoonBtn").addEventListener("click", () => {
      if (state.usaConfirmed && state.koreaConfirmed) {
        jumpTo("screen-moon");
      }
    });
  }

  // --- Init
  function init() {
    load();
    mountScanList();
    mountBits();
    mountTraits();
    wireNavButtons();
    setStep(state.step);

    // deep link via hash
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      if (id.startsWith("screen-")) jumpTo(id);
    }

    // keep hash in sync (nice for sharing)
    const origSetStep = setStep;
    // wrap setStep to update hash
    setStep = (step) => {
      origSetStep(step);
      const id = screens[state.step].id;
      history.replaceState(null, "", "#" + id);
    };
    setStep(state.step);
  }

  // Start after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
