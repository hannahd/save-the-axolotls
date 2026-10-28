/* =========================================================
   SAVE THE AXOLOTLS: what happens when you press things
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var lang = "en";
  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // The device (or ?calm in the address, for testing) asks for less motion
  function calmByDefault() {
    return reduceMotionQuery.matches || root.classList.contains("reduce-motion");
  }
  // Calm mode is on when the device asks for it, unless the visitor pressed "Play animations" (.motion-ok)
  function calm() {
    return calmByDefault() && !root.classList.contains("motion-ok");
  }
  if (/[?&]calm\b/.test(location.search)) root.classList.add("reduce-motion");

  // Tiny helpers for remembering choices. They never break the page if storage is blocked.
  function remember(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function recall(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  function t(key) {
    var words = window.TEXT[lang] || window.TEXT.en;
    return words[key] !== undefined ? words[key] : (window.TEXT.en[key] || key);
  }

  function announce(message) {
    var box = document.getElementById("announcer");
    box.textContent = "";
    setTimeout(function () { box.textContent = message; }, 50);
  }

  /* ---------- LANGUAGE ---------- */
  function applyLanguage(newLang) {
    lang = window.TEXT[newLang] ? newLang : "en";
    root.lang = lang;
    document.title = t("hero.title") + " | Dragons of the Sea";

    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });

    updatePauseLabel();
    updateFilterText();
    showPart(currentPart);
    buildQuiz();
    remember("axo-lang", lang);

    updateAddress();
  }

  // Keep the address bar matching the page, so copying the link shares what you see:
  // ?lang=en or ?lang=es for the language, and calm=1 when animations are off.
  function updateAddress() {
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      if (calm()) url.searchParams.set("calm", "1");
      else url.searchParams.delete("calm");
      history.replaceState(null, "", url);
    } catch (e) {}
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLanguage(btn.dataset.lang); });
  });

  /* ---------- PAUSE ANIMATIONS ---------- */
  var pauseBtn = document.getElementById("pauseBtn");
  function updatePauseLabel() {
    var off = calm();
    pauseBtn.setAttribute("aria-pressed", off ? "true" : "false");
    pauseBtn.querySelector(".pause-text").textContent = off ? t("ui.play") : t("ui.pause");
  }
  // One button for everything: "Pause animations" switches the page to the calm version,
  // "Play animations" turns motion back on, even when the device's Reduce motion setting started the page calm.
  // Pausing is remembered. Turning motion on for a Reduce-motion device only lasts until this browser tab
  // closes, so the next visitor on a shared tablet (or the next visit) starts calm again.
  pauseBtn.addEventListener("click", function () {
    if (calm()) {
      root.classList.remove("reduce-motion", "paused");
      remember("axo-motion", "on");
      if (reduceMotionQuery.matches) {
        root.classList.add("motion-ok");
        try { sessionStorage.setItem("axo-motion-ok", "1"); } catch (e) {}
      }
    } else {
      root.classList.add("reduce-motion");
      root.classList.remove("motion-ok");
      remember("axo-motion", "off");
      try { sessionStorage.removeItem("axo-motion-ok"); } catch (e) {}
    }
    updatePauseLabel();
    updateAddress();
  });
  // If the device setting changes while the page is open, keep the button and address honest
  if (reduceMotionQuery.addEventListener) {
    reduceMotionQuery.addEventListener("change", function () { updatePauseLabel(); updateAddress(); });
  }

  /* ---------- TACO BUTTON ---------- */
  var tacoLayer = document.getElementById("tacoLayer");
  var MAX_TACOS = 24;      // never more than this many on screen at once
  var TACOS_PER_PRESS = 12;

  function makeTacoSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 120 72");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#taco");
    svg.appendChild(use);
    return svg;
  }

  function tacoShower() {
    announce(t("taco.done"));

    if (calm()) {
      // Calm version: a short row of tacos that fades in and out, no falling
      if (tacoLayer.querySelector(".taco-party")) return;
      var party = document.createElement("div");
      party.className = "taco-party";
      for (var i = 0; i < 3; i++) party.appendChild(makeTacoSvg());
      tacoLayer.appendChild(party);
      setTimeout(function () { party.remove(); }, 2100);
      return;
    }

    var room = MAX_TACOS - tacoLayer.childElementCount;
    var count = Math.min(TACOS_PER_PRESS, room);
    for (var n = 0; n < count; n++) {
      var taco = makeTacoSvg();
      taco.classList.add("falling-taco");
      taco.style.left = (Math.random() * 92) + "vw";
      taco.style.animationDuration = (2.2 + Math.random() * 1.4) + "s";
      taco.style.animationDelay = (Math.random() * 0.8) + "s";
      taco.style.setProperty("--r0", (Math.random() * 60 - 30) + "deg");
      taco.style.setProperty("--r1", (Math.random() * 240 - 120) + "deg");
      taco.addEventListener("animationend", function () { this.remove(); });
      // Backup clean-up in case animationend never fires
      (function (el) { setTimeout(function () { el.remove(); }, 5000); })(taco);
      tacoLayer.appendChild(taco);
    }
  }
  document.getElementById("tacoBtn").addEventListener("click", tacoShower);

  /* ---------- FILTER DEMO ---------- */
  var filterArt = document.getElementById("filterArt");
  var filterStatus = document.getElementById("filterStatus");
  var revealBtn = document.getElementById("revealBtn");
  var filterState = "filter.status0";

  function updateFilterText() {
    filterStatus.textContent = t(filterState);
    var shown = filterArt.classList.contains("revealed");
    revealBtn.textContent = shown ? t("filter.hide") : t("filter.reveal");
    revealBtn.setAttribute("aria-pressed", shown ? "true" : "false");
  }

  // Pick the message that matches what the picture shows
  function pickFilterState() {
    var poured = filterArt.classList.contains("poured");
    var shown = filterArt.classList.contains("revealed");
    if (!poured) filterState = shown ? "filter.status3" : "filter.status0";
    else filterState = shown ? "filter.status2" : "filter.status1";
  }

  document.getElementById("pourBtn").addEventListener("click", function () {
    filterArt.classList.add("poured", "pouring");
    setTimeout(function () { filterArt.classList.remove("pouring"); }, 2000);
    pickFilterState();
    updateFilterText();
  });
  // The hidden dots can be shown any time: in the dirty water before pouring, or in the cup after
  revealBtn.addEventListener("click", function () {
    filterArt.classList.toggle("revealed");
    pickFilterState();
    updateFilterText();
  });
  document.getElementById("filterReset").addEventListener("click", function () {
    filterArt.classList.remove("poured", "pouring", "revealed");
    filterState = "filter.status0";
    updateFilterText();
  });

  /* ---------- FOLLOW THE WATER ---------- */
  var flowPath = document.getElementById("rgFlowPath");
  var drop = document.getElementById("rgDrop");
  var steps = document.querySelectorAll("#flowSteps li");
  var markers = document.querySelectorAll("#rgArt .mk");
  var followBtn = document.getElementById("followBtn");
  var flowTimer = null;
  // At what part of the trip (0 to 1) each step lights up
  var STEP_AT = [0, 0.18, 0.55, 0.8, 0.94];

  function lightStep(stepNumber, all) {
    steps.forEach(function (li) {
      var n = Number(li.dataset.step);
      li.classList.toggle("active", all || n === stepNumber);
    });
    markers.forEach(function (m) {
      var n = Number(m.dataset.step);
      m.classList.toggle("active", all || n === stepNumber);
    });
  }

  function placeDrop(fraction) {
    var length = flowPath.getTotalLength();
    var p = flowPath.getPointAtLength(length * fraction);
    drop.setAttribute("transform", "translate(" + p.x + " " + p.y + ")");
  }

  followBtn.addEventListener("click", function () {
    if (flowTimer) cancelAnimationFrame(flowTimer);
    if (calm()) {
      // Calm version: show the drop at the end and light up every step at once
      placeDrop(1);
      drop.setAttribute("opacity", "1");
      lightStep(0, true);
      return;
    }
    var duration = 6000;
    var start = null;
    drop.setAttribute("opacity", "1");
    function frame(time) {
      if (start === null) start = time;
      var f = Math.min((time - start) / duration, 1);
      placeDrop(f);
      var current = 1;
      STEP_AT.forEach(function (at, i) { if (f >= at) current = i + 1; });
      lightStep(current, false);
      if (f < 1) flowTimer = requestAnimationFrame(frame);
      else flowTimer = null;
    }
    flowTimer = requestAnimationFrame(frame);
  });

  /* ---------- OUR IDEA: TAP A PART ---------- */
  var ideaArt = document.getElementById("ideaArt");
  var partInfo = document.getElementById("partInfo");
  var PART_KEYS = { gutter: ["idea.p1", "idea.d1"], plants: ["idea.p2", "idea.d2"], rocks: ["idea.p3", "idea.d3"], frame: ["idea.p4", "idea.d4"], outlet: ["idea.p5", "idea.d5"] };
  var currentPart = null;

  function showPart(part) {
    currentPart = part;
    document.querySelectorAll(".part-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.part === part ? "true" : "false");
    });
    ideaArt.classList.toggle("has-pick", !!part);
    ideaArt.querySelectorAll(".part, .mk").forEach(function (g) {
      g.classList.toggle("active", g.dataset.part === part);
    });
    partInfo.innerHTML = "";
    if (!part) {
      var hint = document.createElement("p");
      hint.textContent = t("idea.pickOne");
      partInfo.appendChild(hint);
      return;
    }
    var h = document.createElement("h4");
    h.textContent = t(PART_KEYS[part][0]);
    var p = document.createElement("p");
    p.textContent = t(PART_KEYS[part][1]);
    partInfo.appendChild(h);
    partInfo.appendChild(p);
  }
  document.querySelectorAll(".part-btn").forEach(function (b) {
    b.addEventListener("click", function () { showPart(b.dataset.part); });
  });

  /* ---------- QUIZ ---------- */
  var quizList = document.getElementById("quizList");
  var quizAxo = document.getElementById("quizAxo");
  var picks = {}; // which answer was picked for each question (only kept on this page)
  var missed = {}; // questions where a wrong answer was ever picked
  var wasAllRight = false;
  var quizDone = document.getElementById("quizDone");
  var confettiLayer = document.getElementById("confettiLayer");
  var CONFETTI_COLORS = ["#24B8C7", "#FFD65A", "#F6A6C1", "#086B88", "#5DBB63", "#C8507A"];

  function allRight() {
    return window.QUIZ.every(function (item, qi) { return picks[qi] === item.right; });
  }
  // Perfect = every answer right AND no wrong answer was ever picked
  function perfect() {
    return allRight() && Object.keys(missed).length === 0;
  }

  /* CONFETTI: falls across the whole screen. A perfect score mixes tacos into it. */
  function confetti(withTacos) {
    confettiLayer.innerHTML = ""; // start fresh so pressing Celebrate a lot never piles up
    announce(withTacos ? t("quiz.partyTacos") : t("quiz.party"));

    if (calm()) {
      // Calm version: a short row of confetti (and tacos) that fades in and out, nothing falls
      var row = document.createElement("div");
      row.className = "taco-party";
      for (var i = 0; i < 3; i++) {
        var pop = document.createElement("span");
        pop.className = "party-pop";
        pop.textContent = "🎉";
        row.appendChild(pop);
        if (withTacos) row.appendChild(makeTacoSvg());
      }
      confettiLayer.appendChild(row);
      setTimeout(function () { row.remove(); }, 2100);
      return;
    }

    function drop(el, minTime, extraTime) {
      el.style.left = (Math.random() * 98) + "vw";
      el.style.animationDuration = (minTime + Math.random() * extraTime) + "s";
      el.style.animationDelay = (Math.random() * 1.2) + "s";
      el.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      el.style.setProperty("--r0", (Math.random() * 60 - 30) + "deg");
      el.style.setProperty("--r1", (Math.random() * 720 - 360) + "deg");
      el.addEventListener("animationend", function () { el.remove(); });
      setTimeout(function () { el.remove(); }, 7000); // backup clean-up
      confettiLayer.appendChild(el);
    }

    for (var n = 0; n < 80; n++) {
      var piece = document.createElement("div");
      piece.className = "confetti" + (n % 3 === 0 ? " round" : "");
      piece.style.background = CONFETTI_COLORS[n % CONFETTI_COLORS.length];
      drop(piece, 2.6, 1.8);
    }
    if (withTacos) {
      for (var k = 0; k < 14; k++) {
        var taco = makeTacoSvg();
        taco.classList.add("falling-taco", "confetti-taco");
        drop(taco, 2.8, 1.6);
      }
    }
  }

  // Show or hide the congratulations box. Launch confetti only on the answer that finishes the quiz.
  function updateQuizDone(justAnswered) {
    var done = allRight();
    quizDone.hidden = !done;
    if (done && justAnswered && !wasAllRight) confetti(perfect());
    wasAllRight = done;
  }
  document.getElementById("celebrateBtn").addEventListener("click", function () { confetti(perfect()); });

  function bubbleBurst(container) {
    if (calm()) return;
    var burst = document.createElement("div");
    burst.className = "burst";
    burst.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 7; i++) {
      var ns = "http://www.w3.org/2000/svg";
      var s = document.createElementNS(ns, "svg");
      var u = document.createElementNS(ns, "use");
      u.setAttribute("href", "#bubble");
      s.appendChild(u);
      var angle = (Math.PI * 2 * i) / 7;
      s.style.setProperty("--x", Math.round(Math.cos(angle) * 60) + "px");
      s.style.setProperty("--y", Math.round(Math.sin(angle) * 50 - 20) + "px");
      burst.appendChild(s);
    }
    container.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 1000);
  }

  function smile() {
    quizAxo.classList.add("big-smile");
    quizAxo.classList.remove("cheer");
    void quizAxo.getBoundingClientRect(); // restart the little cheer animation
    quizAxo.classList.add("cheer");
    var hero = document.getElementById("heroAxolotl");
    hero.classList.add("big-smile");
    clearTimeout(smile.timer);
    smile.timer = setTimeout(function () {
      quizAxo.classList.remove("big-smile");
      hero.classList.remove("big-smile");
    }, 2500);
  }

  function buildQuiz() {
    quizList.innerHTML = "";
    window.QUIZ.forEach(function (item, qi) {
      var card = document.createElement("div");
      card.className = "card quiz-q";
      var fs = document.createElement("fieldset");
      var legend = document.createElement("legend");
      legend.textContent = (qi + 1) + ". " + t(item.q);
      fs.appendChild(legend);

      var answers = document.createElement("div");
      answers.className = "quiz-answers";
      var feedback = document.createElement("p");
      feedback.className = "quiz-feedback";
      feedback.setAttribute("aria-live", "polite");

      function showResult(picked, celebrate) {
        answers.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("is-right", "is-picked-wrong");
          b.setAttribute("aria-pressed", b.dataset.key === picked ? "true" : "false");
          if (b.dataset.key === picked) b.classList.add(picked === item.right ? "is-right" : "is-picked-wrong");
        });
        var good = picked === item.right;
        feedback.textContent = (good ? t("quiz.correct") : t("quiz.tryAgain")) + " " + t(item.why);
        if (good && celebrate) {
          smile();
          bubbleBurst(card);
          announce(t("quiz.cheer"));
        }
      }

      item.answers.forEach(function (key) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-answer";
        b.dataset.key = key;
        b.setAttribute("aria-pressed", "false");
        b.textContent = t(key);
        b.addEventListener("click", function () {
          picks[qi] = key;
          if (key !== item.right) missed[qi] = true;
          showResult(key, true);
          updateQuizDone(true);
        });
        answers.appendChild(b);
      });

      fs.appendChild(answers);
      fs.appendChild(feedback);
      card.appendChild(fs);
      quizList.appendChild(card);
      if (picks[qi]) showResult(picks[qi], false); // keep answers when the language changes
    });
    updateQuizDone(false);
  }

  /* ---------- START ---------- */
  var savedMotion = recall("axo-motion");
  var urlCalm = /[?&]calm\b/.test(location.search);
  var playedThisTab = false;
  try { playedThisTab = sessionStorage.getItem("axo-motion-ok") === "1"; } catch (e) {}
  // A saved "off" (or the older "paused" setting) starts the page calm
  if (savedMotion === "off" || (savedMotion === null && recall("axo-paused") === "1")) root.classList.add("reduce-motion");
  // ?calm in the address always starts calm. On a Reduce-motion device, keep motion on only if it was turned on in this same tab.
  else if (reduceMotionQuery.matches && playedThisTab && !urlCalm) root.classList.add("motion-ok");
  // A link ending in ?lang=es opens in Spanish (and ?lang=en in English), even if the visitor chose another language before
  var linkLang = (location.search.match(/[?&]lang=(en|es)\b/) || [])[1];
  var savedLang = recall("axo-lang");
  applyLanguage(linkLang || (savedLang === "es" ? "es" : "en"));
})();
