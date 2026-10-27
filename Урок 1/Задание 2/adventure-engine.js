(function () {
  "use strict";

  var T = window.ADV_TASK;
  if (!T || !T.chars || !T.chars.length || !T.stages || !T.stages.length) return;

  var INITIALS = ["sh", "ch", "zh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];
  var ALL_PARTS = [];
  T.chars.forEach(function (c) {
    c.parts.forEach(function (p) { if (ALL_PARTS.indexOf(p) < 0) ALL_PARTS.push(p); });
  });
  var ROMANS = ["I", "II", "III", "IV"];

  var progress = loadProgress();
  var activeAudio = null;
  var viewport = null;
  var currentScreen = "";
  var dlg = {};
  var typing = { timer: null, full: "", active: false };

  /* ================= утилиты ================= */

  function qs(sel, root) { return (root || document).querySelector(sel); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function hzSpan(ch, cls) {
    var s = el("span", cls || "hz");
    s.textContent = ch;
    s.setAttribute("lang", "zh-CN");
    return s;
  }

  function keyById(id) {
    for (var i = 0; i < T.keys.length; i++) if (T.keys[i].id === id) return T.keys[i];
    return T.keys[0];
  }

  function charsOfKey(id) {
    return T.chars.filter(function (c) { return c.key === id; });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fmt(tpl, c) {
    return tpl.replace("{py}", c ? c.py : "").replace("{tr}", c ? c.tr : "");
  }

  function shakeEl(node) {
    node.classList.remove("shake");
    void node.offsetWidth;
    node.classList.add("shake");
  }

  /* ================= прогресс ================= */

  function loadProgress() {
    try {
      var raw = localStorage.getItem(T.storageKey);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.v === 1 && d.done && d.done.length === T.stages.length) {
          if (typeof d.finaleShown !== "boolean") d.finaleShown = false;
          return d;
        }
      }
    } catch (e) {}
    return freshProgress();
  }

  function freshProgress() {
    return { v: 1, done: T.stages.map(function () { return false; }), finaleShown: false };
  }

  function saveProgress() {
    try { localStorage.setItem(T.storageKey, JSON.stringify(progress)); } catch (e) {}
  }

  function allDone() { return progress.done.every(Boolean); }

  function anyProgress() {
    return progress.done.some(Boolean) || progress.finaleShown;
  }

  function unlocked(i) { return i === 0 || !!progress.done[i - 1]; }

  /* ================= аудио и эффекты ================= */

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function showVoiceTip() {
    var tip = qs("#voice-tip");
    if (tip) tip.hidden = false;
  }

  function speakZh(text) {
    if (!("speechSynthesis" in window)) { showVoiceTip(); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.85;
    var voices = speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
      if (/^zh[-_]CN/i.test(voices[i].lang)) { u.voice = voices[i]; break; }
    }
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  function playAudio(src, fallbackText) {
    try {
      if (!activeAudio) activeAudio = new Audio();
      activeAudio.pause();
      activeAudio.src = src;
      activeAudio.currentTime = 0;
      var p = activeAudio.play();
      if (p && p.catch) {
        p.catch(function (err) {
          var name = (err && err.name) || "";
          if (name === "AbortError" || name === "NotAllowedError") return;
          speakZh(fallbackText);
        });
      }
      return;
    } catch (e) {}
    speakZh(fallbackText);
  }

  function audioBtn(item, label) {
    var b = el("button", "q-audio");
    b.type = "button";
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke-linejoin="round"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" stroke-linecap="round"/></svg>';
    b.appendChild(el("span", null, label || ("Послушать " + item.py)));
    b.addEventListener("click", function () {
      playAudio(item.audio, item.ch);
      b.classList.add("speaking");
      setTimeout(function () { b.classList.remove("speaking"); }, 900);
    });
    return b;
  }

  function sparkBurst(host, colors, count) {
    if (!host || reducedMotion()) return;
    colors = colors || ["#fbbf24", "#fde68a", "#ffffff"];
    count = count || 44;
    var rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var canvas = document.createElement("canvas");
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "40";
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var parts = [];
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = 1.5 + Math.random() * 4;
      parts.push({
        x: rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.3,
        y: rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.3,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 2,
        size: 2 + Math.random() * 4,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09;
        p.vx *= 0.985;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(tick);
      else if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    })();
  }

  function renderArt(artId, cls) {
    var art = T.pixelArts[artId];
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    var size = art && art.rows ? art.rows.length : 16;
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("class", cls || "pix-art");
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "пиксельная картина");
    if (!art) return svg;
    for (var r = 0; r < art.rows.length; r++) {
      var row = art.rows[r];
      for (var c = 0; c < row.length && c < size; c++) {
        var code = row.charAt(c);
        if (code === "." || !art.palette[code]) continue;
        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", c);
        rect.setAttribute("y", r);
        rect.setAttribute("width", 1);
        rect.setAttribute("height", 1);
        rect.setAttribute("fill", art.palette[code]);
        svg.appendChild(rect);
      }
    }
    return svg;
  }

  /* ================= drag-контроллер ================= */

  function createDragController() {
    var selected = null;

    function clearSelection() {
      if (selected) selected.tile.classList.remove("selected");
      selected = null;
    }

    function attach(tile, payload, onDrop) {
      tile.addEventListener("click", function () {
        if (tile.dataset.dragged === "1") { tile.dataset.dragged = ""; return; }
        if (selected && selected.tile === tile) { clearSelection(); return; }
        clearSelection();
        selected = { tile: tile, payload: payload };
        tile.classList.add("selected");
      });
      tile.addEventListener("pointerdown", function (e) {
        if (e.button && e.button !== 0) return;
        var startX = e.clientX, startY = e.clientY;
        var dragging = false, ghost = null;
        function move(ev) {
          if (!dragging && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 8) {
            dragging = true;
            clearSelection();
            ghost = tile.cloneNode(true);
            ghost.classList.add("drag-ghost");
            ghost.style.width = tile.offsetWidth + "px";
            document.body.appendChild(ghost);
            tile.classList.add("drag-src");
          }
          if (dragging && ghost) {
            ev.preventDefault();
            ghost.style.left = (ev.clientX - ghost.offsetWidth / 2) + "px";
            ghost.style.top = (ev.clientY - ghost.offsetHeight / 2) + "px";
          }
        }
        function up(ev) {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          if (dragging) {
            tile.dataset.dragged = "1";
            setTimeout(function () { tile.dataset.dragged = ""; }, 80);
            tile.classList.remove("drag-src");
            if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
            var hit = document.elementFromPoint(ev.clientX, ev.clientY);
            var zone = hit ? hit.closest(".drop-zone") : null;
            if (zone) onDrop(payload, zone, tile);
          }
        }
        document.addEventListener("pointermove", move, { passive: false });
        document.addEventListener("pointerup", up);
      });
    }

    function zoneClick(zone, onDrop) {
      zone.addEventListener("click", function () {
        if (!selected) return;
        var s = selected;
        clearSelection();
        onDrop(s.payload, zone, s.tile);
      });
    }

    return { attach: attach, zoneClick: zoneClick, clearSelection: clearSelection };
  }

  /* ================= HUD ================= */

  function hudObjective(text) {
    var o = qs("#hud-objective");
    if (o) o.textContent = text;
  }

  function buildHud() {
    var track = qs("#hud-track");
    if (!track) return;
    track.innerHTML = "";
    T.stages.forEach(function (stage, i) {
      var b = el("button", "hud-node");
      b.type = "button";
      b.title = stage.title;
      b.appendChild(el("span", "hud-node-num", ROMANS[i]));
      b.addEventListener("click", function () {
        if (!unlocked(i)) { shakeEl(b); dlgFlash(T.hero, T.route.lockedMsg, "bad"); return; }
        goStage(i);
      });
      track.appendChild(b);
    });
  }

  function syncHud() {
    var track = qs("#hud-track");
    if (track) {
      for (var i = 0; i < track.children.length; i++) {
        var cls = "hud-node ";
        cls += progress.done[i] ? "done" : (unlocked(i) ? "open" : "locked");
        if (T.stages[i] && T.stages[i].zone === currentScreen) cls += " current";
        track.children[i].className = cls;
      }
    }
    var seals = qs("#hud-seals");
    if (seals) {
      seals.innerHTML = "";
      T.code.split("").forEach(function (d, i) {
        seals.appendChild(el("span", "seal" + (progress.done[i] ? " lit" : ""), progress.done[i] ? d : "•"));
      });
    }
  }

  /* ================= диалоговое окно ================= */

  function stopTyping() {
    if (typing.timer) { clearTimeout(typing.timer); typing.timer = null; }
    typing.active = false;
  }

  function typeInto(node, text) {
    stopTyping();
    typing.full = text;
    typing.active = true;
    node.textContent = "";
    if (reducedMotion()) { node.textContent = text; typing.active = false; return; }
    var i = 0;
    (function step() {
      i += 2;
      node.textContent = text.slice(0, i);
      if (i < text.length) typing.timer = setTimeout(step, 14);
      else { typing.active = false; typing.timer = null; }
    })();
  }

  function dlgSetHost(host) {
    if (dlg.face && host && host.img) dlg.face.src = host.img;
    if (dlg.name && host && host.name) dlg.name.textContent = host.name;
  }

  function dlgSay(host, text) {
    dlgSetHost(host);
    if (dlg.box) dlg.box.classList.remove("ok", "bad");
    typeInto(dlg.text, text);
  }

  function dlgFlash(host, text, kind) {
    dlgSetHost(host);
    stopTyping();
    if (dlg.box) dlg.box.classList.remove("ok", "bad");
    if (kind && dlg.box) dlg.box.classList.add(kind);
    if (dlg.text) dlg.text.textContent = text;
  }

  /* ================= экранный менеджер ================= */

  function showScreen(name, builder) {
    currentScreen = name;
    if (!viewport) return;
    viewport.innerHTML = "";
    var scr = el("div", "screen screen-" + name);
    builder(scr);
    viewport.appendChild(scr);
    syncHud();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function goStage(i) {
    var stage = T.stages[i];
    if (!stage) return;
    showScreen(stage.zone, function (scr) { BUILDERS[stage.zone](scr, stage, i); });
    dlgSay(stage.character, stage.intro);
  }

  function showDone(scr, stage, si, mistakes) {
    var modal = el("div", "done-modal");
    var panel = el("div", "done-panel");
    var av = el("img", "done-av");
    av.src = stage.character.img;
    av.alt = stage.character.name;
    panel.appendChild(av);
    panel.appendChild(el("h3", "done-title", "Этап пройден!"));
    panel.appendChild(el("p", "done-sum", mistakes === 0 ? "Ни одной ошибки — безупречно!" : "Ошибок по пути: " + mistakes));
    var dwrap = el("div", "done-digit");
    dwrap.appendChild(el("span", "done-digit-label", "Печать " + ["I","II","III","IV"][si] + " · цифра кода"));
    var tile = el("span", "code-digit lit", T.code.charAt(si));
    dwrap.appendChild(tile);
    panel.appendChild(dwrap);
    panel.appendChild(el("p", "done-text", stage.doneText));
    var actions = el("div", "done-actions");
    var toRoute = el("button", "q-btn primary", "К маршруту →");
    toRoute.type = "button";
    toRoute.addEventListener("click", buildRoute);
    actions.appendChild(toRoute);
    var again = el("button", "q-btn", "Пройти снова");
    again.type = "button";
    again.addEventListener("click", function () { goStage(si); });
    actions.appendChild(again);
    panel.appendChild(actions);
    modal.appendChild(panel);
    scr.appendChild(modal);
    dlgSay(stage.character, stage.doneText);
    var seals = qs("#hud-seals");
    var seal = seals && seals.children[si] ? seals.children[si] : null;
    if (seal) sparkBurst(seal, ["#fbbf24", "#fde68a", "#ffffff"], 22);
    setTimeout(function () { sparkBurst(tile, stage.spark); }, 60);
    setTimeout(function () { sparkBurst(tile, ["#fbbf24", "#ffffff"], 34); }, 300);
  }

  function finishStage(si) {
    progress.done[si] = true;
    saveProgress();
    syncHud();
  }

  /* ================= экран: заставка ================= */

  function buildTitle() {
    showScreen("title", function (scr) {
      var root = el("div", "title-screen");
      var embers = el("div", "title-embers");
      for (var i = 0; i < 6; i++) embers.appendChild(el("i"));
      root.appendChild(embers);
      var logo = el("h1", "title-logo", T.title.name);
      root.appendChild(logo);
      root.appendChild(el("p", "title-tagline", T.title.tagline));
      var heroImg = el("img", "title-hero");
      heroImg.src = T.hero.img;
      heroImg.alt = T.hero.name;
      root.appendChild(heroImg);
      var btn = el("button", "title-btn", anyProgress() ? T.title.cont : T.title.start);
      btn.type = "button";
      btn.addEventListener("click", buildRoute);
      root.appendChild(btn);
      scr.appendChild(root);
    });
    hudObjective(T.hud.objectiveDefault);
    dlgSay(T.hero, T.title.heroNote);
  }

  /* ================= экран: маршрут ================= */

  function buildRoute() {
    showScreen("route", function (scr) {
      var root = el("div", "route");
      root.appendChild(el("h2", "route-title", T.route.title));
      root.appendChild(el("p", "route-hint", T.route.hint));
      var path = el("div", "route-path");
      T.stages.forEach(function (stage, i) {
        var node = el("button", "route-node " + (progress.done[i] ? "done" : (unlocked(i) ? "open" : "locked")));
        node.type = "button";
        node.appendChild(el("span", "node-num", ROMANS[i]));
        var face = el("span", "node-face");
        var img = el("img");
        img.src = stage.character.img;
        img.alt = stage.character.name;
        face.appendChild(img);
        node.appendChild(face);
        node.appendChild(el("span", "node-name", stage.title));
        node.appendChild(el("span", "node-sub", stage.subtitle));
        node.appendChild(el("span", "node-chip", progress.done[i] ? T.route.done : (unlocked(i) ? T.route.open : T.route.locked)));
        node.addEventListener("click", function () {
          if (!unlocked(i)) { shakeEl(node); dlgFlash(T.hero, T.route.lockedMsg, "bad"); return; }
          goStage(i);
        });
        path.appendChild(node);
      });
      if (allDone()) {
        var v = el("button", "route-node vault open");
        v.type = "button";
        v.appendChild(el("span", "node-num", "✦"));
        var vface = el("span", "node-face vault-face");
        vface.textContent = "✦";
        v.appendChild(vface);
        v.appendChild(el("span", "node-name", T.route.vault));
        v.appendChild(el("span", "node-sub", "Все четыре печати собраны"));
        v.appendChild(el("span", "node-chip", "Открыть"));
        v.addEventListener("click", buildVault);
        path.appendChild(v);
      }
      root.appendChild(path);
      scr.appendChild(root);
    });
    hudObjective(T.hud.objectiveDefault);
  }

  /* ================= этап 1: верстак лагеря ================= */

  function buildSt1(scr, stage, si) {
    var order = shuffle(T.chars);
    var round = 0, mistakes = 0, locked = false;
    var wrongByCh = {};
    var rewardCard = null;

    var root = el("div", "st1");
    var sketch = el("div", "sketch");
    var progress = el("div", "st1-progress");
    var progressLabel = el("span", "st1-progress-label", "Сборка: 0/" + order.length);
    var progressBar = el("span", "st1-progress-bar");
    var progressSegs = [];
    order.forEach(function () {
      var seg = el("i");
      progressBar.appendChild(seg);
      progressSegs.push(seg);
    });
    progress.appendChild(progressLabel);
    progress.appendChild(progressBar);
    var bench = el("div", "bench");
    var board = el("div", "bench-board");
    var tray = el("div", "bench-tray");
    bench.appendChild(board);
    bench.appendChild(tray);
    var phase2 = el("div", "phase2");
    phase2.hidden = true;
    root.appendChild(sketch);
    root.appendChild(progress);
    root.appendChild(bench);
    root.appendChild(phase2);
    scr.appendChild(root);

    function clearReward() {
      if (rewardCard && rewardCard.parentNode) rewardCard.parentNode.removeChild(rewardCard);
      rewardCard = null;
    }

    function renderChar() {
      clearReward();
      var c = order[round];
      var k = keyById(c.key);
      hudObjective(fmt(T.hud.obj1, c));
      sketch.innerHTML = "";
      sketch.appendChild(el("div", "sketch-tag", "Эскиз знака " + (round + 1) + " из " + order.length));
      var meta = el("div", "sketch-meta");
      meta.appendChild(el("span", "q-py tone-" + c.t, c.py));
      meta.appendChild(el("span", "sketch-tr", "«" + c.tr + "»"));
      sketch.appendChild(meta);
      sketch.appendChild(audioBtn(c));
      playAudio(c.audio, c.ch);

      board.innerHTML = "";
      tray.innerHTML = "";
      var slots = [];
      var filledCount = 0;
      c.parts.forEach(function (p, idx) {
        var s = el("span", "bench-slot drop-zone");
        s.dataset.idx = String(idx);
        board.appendChild(s);
        slots.push({ el: s, filled: false });
      });

      function wrongPlace(target) {
        if (locked) return;
        mistakes++;
        if (target) shakeEl(target);
        dlgFlash(stage.character, pick(stage.fail), "bad");
      }

      function fill(idx, p, btn) {
        if (locked || slots[idx].filled) return;
        slots[idx].filled = true;
        filledCount++;
        if (btn) {
          btn.classList.add("taken");
          btn.disabled = true;
        }
        var slot = slots[idx].el;
        slot.textContent = p;
        slot.className = "bench-slot drop-zone filled";
        slot.setAttribute("lang", "zh-CN");
        sparkBurst(slot, stage.spark, 12);
        if (filledCount >= c.parts.length) {
          locked = true;
          dlgFlash(stage.character, pick(stage.ok) + " " + c.ch + " «" + c.tr + "» собран!", "ok");
          sparkBurst(board, stage.spark, 26);
          showReward(c, k);
          progressSegs[round].classList.add("done");
          progressLabel.textContent = "Сборка: " + (round + 1) + "/" + order.length;
          setTimeout(function () {
            locked = false;
            round++;
            if (round >= order.length) toPhase2();
            else renderChar();
          }, 1400);
        }
      }

      function placeByTap(p, btn) {
        if (locked) return;
        for (var i = 0; i < slots.length; i++) {
          if (!slots[i].filled && c.parts[i] === p) {
            fill(i, p, btn);
            return;
          }
        }
        if (btn) {
          btn.classList.add("wrong");
          setTimeout(function () { btn.classList.remove("wrong"); }, 500);
        }
        wrongPlace(board);
      }

      function placeByDrop(p, slotEl, btn) {
        if (locked) return;
        var idx = parseInt(slotEl.dataset.idx, 10);
        if (isNaN(idx) || !slots[idx]) return;
        if (!slots[idx].filled && c.parts[idx] === p) fill(idx, p, btn);
        else wrongPlace(slotEl);
      }

      function attachPartDrag(b, p) {
        b.addEventListener("pointerdown", function (e) {
          if (b.disabled || locked) return;
          if (e.button && e.button !== 0) return;
          var startX = e.clientX, startY = e.clientY;
          var dragging = false, ghost = null;
          function move(ev) {
            if (!dragging && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 8) {
              dragging = true;
              ghost = b.cloneNode(true);
              ghost.classList.add("drag-ghost");
              ghost.style.width = b.offsetWidth + "px";
              document.body.appendChild(ghost);
              b.classList.add("drag-src");
            }
            if (dragging && ghost) {
              ev.preventDefault();
              ghost.style.left = (ev.clientX - ghost.offsetWidth / 2) + "px";
              ghost.style.top = (ev.clientY - ghost.offsetHeight / 2) + "px";
            }
          }
          function up(ev) {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);
            if (dragging) {
              b.dataset.dragged = "1";
              setTimeout(function () { b.dataset.dragged = ""; }, 80);
              b.classList.remove("drag-src");
              if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
              var hit = document.elementFromPoint(ev.clientX, ev.clientY);
              var slot = hit ? hit.closest(".bench-slot") : null;
              if (slot) placeByDrop(p, slot, b);
            }
          }
          document.addEventListener("pointermove", move, { passive: false });
          document.addEventListener("pointerup", up);
        });
      }

      var need = 6 - c.parts.length;
      var pool = shuffle(ALL_PARTS.filter(function (p) { return c.parts.indexOf(p) < 0; }));
      var trayParts = c.parts.concat(pool.slice(0, need));

      shuffle(trayParts).forEach(function (p) {
        var b = el("button", "bench-part drop-source");
        b.type = "button";
        b.appendChild(hzSpan(p));
        b.style.setProperty("--r", (Math.random() * 10 - 5).toFixed(1) + "deg");
        b.style.setProperty("--y", (Math.random() * 10 - 5).toFixed(1) + "px");
        b.addEventListener("click", function () {
          if (b.dataset.dragged === "1") { b.dataset.dragged = ""; return; }
          placeByTap(p, b);
        });
        attachPartDrag(b, p);
        tray.appendChild(b);
      });
    }

    function showReward(c, k) {
      var card = el("div", "char-reward");
      card.style.setProperty("--c", k.color);
      card.appendChild(hzSpan(c.ch, "char-reward-hz"));
      var meta = el("div", "char-reward-meta");
      meta.appendChild(el("span", "q-py tone-" + c.t, c.py));
      meta.appendChild(el("span", "sketch-tr", "«" + c.tr + "»"));
      card.appendChild(meta);
      bench.appendChild(card);
      rewardCard = card;
      playAudio(c.audio, c.ch);
      setTimeout(function () { sparkBurst(card, [k.color, "#ffd54f", "#ffffff"], 30); }, 120);
    }

    function toPhase2() {
      clearReward();
      hudObjective(T.hud.obj1b);
      bench.hidden = true;
      sketch.hidden = true;
      phase2.hidden = false;
      dlgSay(stage.character, "Сумка собрана — за дело! Перетащи каждый знак в нишу своего ключа (или тапни знак, потом нишу). Радикал подскажет путь.");

      var drag = createDragController();
      var row = el("div", "chest-row");
      var chests = {};
      T.keys.forEach(function (k) {
        var ch = el("div", "chest drop-zone");
        ch.style.setProperty("--c", k.color);
        ch.dataset.key = k.id;
        var head = el("div", "chest-head");
        var rad = el("span", "chest-rad");
        rad.setAttribute("lang", "zh-CN");
        rad.textContent = k.ch;
        var info = el("span", "chest-info");
        info.appendChild(el("b", null, k.mean));
        info.appendChild(el("small", null, k.src + " — " + k.name));
        var count = el("span", "chest-count", "0/" + charsOfKey(k.id).length);
        head.appendChild(rad);
        head.appendChild(info);
        head.appendChild(count);
        var slots = el("div", "chest-slots");
        ch.appendChild(head);
        ch.appendChild(slots);
        row.appendChild(ch);
        chests[k.id] = { el: ch, slots: slots, count: count };
        drag.zoneClick(ch, function (payload, zone, tile) { attempt(payload, zone, tile); });
      });
      var label = el("div", "bag-label", "Знаки в сумке: " + order.length);
      var strip = el("div", "bag-strip");
      phase2.appendChild(row);
      phase2.appendChild(label);
      phase2.appendChild(strip);

      shuffle(order).forEach(function (c) {
        var tile = el("button", "bag-tile drop-source");
        tile.type = "button";
        tile.setAttribute("lang", "zh-CN");
        tile.textContent = c.ch;
        tile.title = c.py + " — " + c.tr;
        strip.appendChild(tile);
        drag.attach(tile, c, function (payload, zone, tileEl) { attempt(payload, zone, tileEl); });
      });

      var placedCount = 0;

      function attempt(payload, zone, tile) {
        var kid = zone.dataset.key;
        var entry = chests[kid];
        if (!entry) return;
        if (payload.key === kid) {
          tile.remove();
          placedCount++;
          wrongByCh[payload.ch] = 0;
          chests[payload.key].el.classList.remove("hint");
          var chip = el("span", "chest-chip");
          chip.appendChild(hzSpan(payload.ch));
          entry.slots.appendChild(chip);
          var done = entry.slots.children.length;
          entry.count.textContent = done + "/" + charsOfKey(kid).length;
          if (done >= charsOfKey(kid).length) entry.el.classList.add("full");
          hudObjective(T.hud.obj1b + " · " + placedCount + "/" + order.length);
          dlgFlash(stage.character, pick(stage.ok) + " " + payload.ch + " — ниша «" + keyById(kid).mean + "»!", "ok");
          sparkBurst(entry.slots, stage.spark, 18);
          if (!strip.children.length) {
            finishStage(si);
            showDone(scr, stage, si, mistakes);
          }
        } else {
          mistakes++;
          wrongByCh[payload.ch] = (wrongByCh[payload.ch] || 0) + 1;
          if (wrongByCh[payload.ch] >= 2 && chests[payload.key]) {
            chests[payload.key].el.classList.add("hint");
            dlgFlash(T.hero, stage.shelfHint, "ok");
          } else {
            dlgFlash(stage.character, pick(stage.fail) + " " + payload.ch + " живёт не с ключом " + keyById(kid).ch + ".", "bad");
          }
          shakeEl(zone);
        }
      }
    }

    renderChar();
  }

  /* ================= этап 2: пещера эха ================= */

  function splitPy(p) {
    for (var i = 0; i < INITIALS.length; i++) {
      if (p.indexOf(INITIALS[i]) === 0) return { ini: INITIALS[i], fin: p.slice(INITIALS[i].length) };
    }
    return { ini: "", fin: p };
  }

  function pyScore(a, b) {
    var sa = splitPy(a.pyBase), sb = splitPy(b.pyBase);
    var s = 0;
    if (sa.ini === sb.ini) s += 2;
    if (sa.fin === sb.fin) s += 2;
    if (a.t === b.t) s += 1;
    if (a.key === b.key) s += 2;
    return s;
  }

  function buildSt2(scr, stage, si) {
    var order = shuffle(T.chars);
    var round = 0, mistakes = 0, locked = false, failsHere = 0;

    var root = el("div", "st2");
    var head = el("div", "cave-head");
    var mouth = el("div", "cave-mouth");
    mouth.appendChild(el("span", "ripple r1"));
    mouth.appendChild(el("span", "ripple r2"));
    mouth.appendChild(el("span", "ripple r3"));
    var py = el("div", "cave-py");
    mouth.appendChild(py);
    head.appendChild(mouth);
    var audioHost = el("div", "cave-audio");
    head.appendChild(audioHost);
    var hint = el("p", "echo-hint");
    hint.hidden = true;
    var arc = el("div", "stone-arc");
    var reveal = el("div", "st2-reveal");
    root.appendChild(head);
    root.appendChild(hint);
    root.appendChild(arc);
    root.appendChild(reveal);
    scr.appendChild(root);

    function render() {
      var c = order[round];
      locked = false;
      failsHere = 0;
      hudObjective(fmt(T.hud.obj2, c));
      py.textContent = c.py;
      py.className = "cave-py tone-" + c.t;
      audioHost.innerHTML = "";
      audioHost.appendChild(audioBtn(c));
      arc.innerHTML = "";
      reveal.innerHTML = "";
      hint.hidden = true;
      mouth.classList.remove("hit");
      playAudio(c.audio, c.ch);

      var others = T.chars.filter(function (x) { return x !== c; });
      var scored = others.map(function (k) { return { k: k, s: pyScore(c, k) }; });
      scored.sort(function (a, b) { return b.s - a.s; });
      var distractors = scored.slice(0, 3).map(function (x) { return x.k; });
      var rest = shuffle(scored.slice(3).map(function (x) { return x.k; }));
      while (distractors.length < 5 && rest.length) distractors.push(rest.pop());
      var opts = shuffle(distractors.concat([c]));

      opts.forEach(function (o) {
        var b = el("button", "echo-stone");
        b.type = "button";
        b.appendChild(hzSpan(o.ch));
        b.addEventListener("click", function () { handle(c, o, b); });
        arc.appendChild(b);
      });
    }

    function handle(c, o, b) {
      if (locked) return;
      if (o === c) {
        locked = true;
        b.classList.add("right");
        mouth.classList.add("hit");
        var k = keyById(c.key);
        var line = el("p", "reveal-line");
        line.appendChild(hzSpan(c.ch));
        line.appendChild(el("span", "reveal-txt", c.py + " — " + c.tr));
        var kc = el("span", "key-chip");
        kc.style.setProperty("--c", k.color);
        kc.appendChild(hzSpan(k.ch));
        kc.appendChild(el("small", null, k.mean));
        line.appendChild(kc);
        reveal.appendChild(line);
        dlgFlash(stage.character, pick(stage.ok), "ok");
        sparkBurst(b, stage.spark);
        setTimeout(next, 1100);
      } else {
        mistakes++;
        failsHere++;
        b.classList.add("crack");
        b.disabled = true;
        dlgFlash(stage.character, pick(stage.fail), "bad");
        if (failsHere >= 2) {
          var k2 = keyById(c.key);
          hint.textContent = T.battle.keysHint + " " + k2.ch + " («" + k2.mean + "»)";
          hint.hidden = false;
        }
      }
    }

    function next() {
      round++;
      if (round >= order.length) {
        finishStage(si);
        showDone(scr, stage, si, mistakes);
      } else {
        render();
      }
    }

    render();
  }

  /* ================= этап 3: галерея образов ================= */

  function buildSt3(scr, stage, si) {
    var order = shuffle(T.chars);
    var matched = 0, mistakes = 0;

    hudObjective(T.hud.obj3);

    var root = el("div", "st3");
    var wall = el("div", "gallery-wall");
    var desk = el("div", "curator-desk");
    var label = el("div", "bag-label", "Знаки на столе смотрителя: " + order.length);
    var tray = el("div", "tray-strip");
    desk.appendChild(label);
    desk.appendChild(tray);
    root.appendChild(wall);
    root.appendChild(desk);
    scr.appendChild(root);

    var drag = createDragController();

    order.forEach(function (c) {
      var f = el("div", "frame drop-zone");
      f.dataset.ch = c.ch;
      f.title = c.artTitle;
      var art = el("div", "frame-art");
      art.appendChild(renderArt(c.art));
      f.appendChild(art);
      var plaque = el("span", "frame-plaque");
      f.appendChild(plaque);
      wall.appendChild(f);
      drag.zoneClick(f, function (payload, zone, tile) { attempt(payload, zone, tile); });
    });

    shuffle(order).forEach(function (c) {
      var tile = el("button", "bag-tile drop-source");
      tile.type = "button";
      tile.setAttribute("lang", "zh-CN");
      tile.textContent = c.ch;
      tile.title = c.py + " — " + c.tr;
      tray.appendChild(tile);
      drag.attach(tile, c, function (payload, zone, tileEl) { attempt(payload, zone, tileEl); });
    });

    function attempt(c, zone, tile) {
      if (c.ch === zone.dataset.ch) {
        tile.remove();
        zone.classList.add("matched");
        var plaque = zone.querySelector(".frame-plaque");
        if (plaque) {
          plaque.appendChild(hzSpan(c.ch));
          plaque.appendChild(el("small", "tone-" + c.t, c.artTitle));
        }
        matched++;
        label.textContent = "Знаки на столе смотрителя: " + (order.length - matched);
        hudObjective(T.hud.obj3 + " · " + matched + "/" + order.length);
        dlgFlash(stage.character, pick(stage.ok) + " " + c.ch + " — «" + c.artTitle + "»", "ok");
        sparkBurst(zone, stage.spark, 18);
        if (matched >= order.length) {
          finishStage(si);
          showDone(scr, stage, si, mistakes);
        }
      } else {
        mistakes++;
        shakeEl(zone);
        dlgFlash(stage.character, pick(stage.fail), "bad");
      }
    }
  }

  /* ================= этап 4: арена логова ================= */

  function buildSt4(scr, stage, si) {
    var monsters = T.monsters;
    var monIdx = 0, round = 0;
    var heroHp = T.battle.heroHp, monHp = T.battle.monsterHp;
    var mistakes = 0, mistakesChar = 0, strokeTotal = 0;
    var writer = null, quizVersion = 0, hinting = false, locked = false;
    var charOrder = shuffle(charsOfKey(monsters[0].key));

    var root = el("div", "st4");
    var arena = el("div", "arena");

    var hero = el("div", "fighter hero-side");
    var heroFace = el("div", "fighter-face");
    var heroImg = el("img");
    heroImg.src = T.hero.img;
    heroImg.alt = T.hero.name;
    heroFace.appendChild(heroImg);
    hero.appendChild(heroFace);
    hero.appendChild(el("span", "fighter-name", T.hero.name));
    var heroHpRow = el("div", "hp-row");
    hero.appendChild(heroHpRow);

    var duel = el("div", "duel-center");
    var circle = el("div", "rune-circle");
    circle.appendChild(el("span", "ring a"));
    circle.appendChild(el("span", "ring b"));
    var writerMount = el("div", "writer-mount");
    circle.appendChild(writerMount);
    duel.appendChild(circle);

    var mon = el("div", "fighter mon-side");
    var monHead = el("div", "mon-head");
    var monName = el("span", "mon-name");
    var monHpRow = el("div", "mon-hp");
    monHead.appendChild(monName);
    monHead.appendChild(monHpRow);
    var monArt = el("div", "mon-art");
    mon.appendChild(monHead);
    mon.appendChild(monArt);
    var monTaunt = el("p", "mon-taunt");
    mon.appendChild(monTaunt);

    arena.appendChild(hero);
    arena.appendChild(duel);
    arena.appendChild(mon);

    var bar = el("div", "quest-bar");
    var qInfo = el("div", "quest-info");
    var qStatus = el("p", "writer-status");
    var qBtns = el("div", "writer-btns");
    bar.appendChild(qInfo);
    bar.appendChild(qStatus);
    bar.appendChild(qBtns);

    root.appendChild(arena);
    root.appendChild(bar);
    scr.appendChild(root);

    function paintHearts() {
      heroHpRow.innerHTML = "";
      for (var i = 0; i < T.battle.heroHp; i++) {
        heroHpRow.appendChild(el("i", "heart" + (i < heroHp ? "" : " lost")));
      }
    }

    function paintMonHp() {
      monHpRow.innerHTML = "";
      for (var i = 0; i < T.battle.monsterHp; i++) {
        monHpRow.appendChild(el("i", "pip" + (i < monHp ? "" : " lost")));
      }
    }

    function mstroke() {
      return monsters[Math.min(monIdx, monsters.length - 1)].stroke;
    }

    function renderMonster() {
      var m = monsters[monIdx];
      monArt.innerHTML = "";
      monArt.appendChild(renderArt(m.art));
      monArt.style.setProperty("--mc", m.stroke);
      monName.textContent = m.name;
      monTaunt.textContent = "«" + m.taunt + "»";
      monHp = T.battle.monsterHp;
      paintMonHp();
      mon.classList.remove("defeated");
    }

    function armQuiz() {
      var version = ++quizVersion;
      var c = charOrder[round];
      hinting = false;
      writer.quiz({
        onCorrectStroke: function (data) {
          if (version !== quizVersion) return;
          qStatus.textContent = strokeTotal
            ? "Черта " + (data.strokeNum + 1) + " из " + strokeTotal + " — точно!"
            : "Точно!";
          sparkBurst(writerMount, [mstroke(), "#ffffff"], 10);
        },
        onMistake: function (data) {
          if (version !== quizVersion) return;
          mistakes++;
          mistakesChar++;
          qStatus.textContent = "Черта №" + (data.strokeNum + 1) + " дрогнула — ещё раз!";
          if (mistakesChar % 3 === 0) counterAttack();
        },
        onComplete: function () {
          if (version !== quizVersion || locked) return;
          locked = true;
          hit();
        }
      });
    }

    function hit() {
      monArt.classList.remove("hit");
      void monArt.offsetWidth;
      monArt.classList.add("hit");
      monHp--;
      paintMonHp();
      sparkBurst(monArt, [mstroke(), "#ffd54f", "#ffffff"], 34);
      dlgFlash(stage.character, pick(stage.ok) + " " + T.battle.hitFeed, "ok");
      qStatus.textContent = strokeTotal
        ? "Знак " + charOrder[round].ch + " написан целиком!"
        : "Знак написан целиком!";
      setTimeout(function () {
        locked = false;
        round++;
        if (monHp <= 0) defeatMonster();
        else startRound();
      }, 900);
    }

    function counterAttack() {
      heroHp--;
      paintHearts();
      heroFace.classList.remove("hit");
      void heroFace.offsetWidth;
      heroFace.classList.add("hit");
      dlgFlash(stage.character, T.battle.missFeed, "bad");
      if (heroHp <= 0) showDefeat();
    }

    function defeatMonster() {
      var m = monsters[monIdx];
      mon.classList.add("defeated");
      sparkBurst(monArt, [m.stroke, "#ffd54f", "#ffffff"], 60);
      dlgFlash(stage.character, T.battle.monsterDefeated + " " + m.name + " повержен!", "ok");
      monIdx++;
      round = 0;
      mistakesChar = 0;
      if (monIdx >= monsters.length) {
        setTimeout(function () {
          finishStage(si);
          showDone(scr, stage, si, mistakes);
        }, 1100);
        return;
      }
      setTimeout(function () {
        charOrder = shuffle(charsOfKey(monsters[monIdx].key));
        renderMonster();
        dlgFlash(stage.character, T.battle.introTaunt
          .replace("{n}", String(monIdx + 1))
          .replace("{name}", monsters[monIdx].name), "ok");
        startRound();
      }, 1300);
    }

    function showDefeat() {
      quizVersion++;
      if (writer) { try { writer.cancelQuiz(); } catch (e) {} }
      var overlay = el("div", "defeat-panel");
      overlay.appendChild(el("h3", "defeat-title", "Кот на лапах, но выдохся…"));
      overlay.appendChild(el("p", "defeat-text", T.battle.defeatText));
      var btn = el("button", "q-btn primary", T.battle.defeatBtn);
      btn.type = "button";
      overlay.appendChild(btn);
      root.appendChild(overlay);
      btn.addEventListener("click", function () {
        overlay.remove();
        heroHp = T.battle.heroHp;
        monHp = T.battle.monsterHp;
        round = 0;
        mistakesChar = 0;
        paintHearts();
        renderMonster();
        charOrder = shuffle(charsOfKey(monsters[monIdx].key));
        startRound();
      });
    }

    function createWriter() {
      var c = charOrder[round];
      var m = monsters[monIdx];
      writerMount.innerHTML = "";
      writer = HanziWriter.create(writerMount, c.ch, {
        width: 200,
        height: 200,
        padding: 8,
        showOutline: true,
        strokeColor: m.ink || m.stroke,
        outlineColor: "#c9bda2",
        drawingColor: "#43315f",
        highlightColor: "#e8a13c",
        highlightCompleteColor: "#c98a10",
        strokeAnimationSpeed: 1.2,
        onLoadCharDataError: function () {
          qStatus.textContent = T.battle.noWriter;
        }
      });
      HanziWriter.loadCharacterData(c.ch).then(function (data) {
        strokeTotal = data && data.strokes ? data.strokes.length : 0;
      }).catch(function () {});
    }

    function finishHint(c) {
      if (!hinting) return;
      hinting = false;
      qStatus.textContent = "Теперь попробуй сам — " + c.ch + "!";
      createWriter();
      setTimeout(armQuiz, 350);
    }

    function startRound() {
      var c = charOrder[round];
      hudObjective(fmt(T.hud.obj4, c));
      qInfo.innerHTML = "";
      var k = keyById(c.key);
      var info = el("div", "quest-info-row");
      info.appendChild(el("span", "q-py tone-" + c.t, c.py));
      info.appendChild(el("span", "sketch-tr", "«" + c.tr + "»"));
      var keyChip = el("span", "key-chip");
      keyChip.style.setProperty("--c", k.color);
      keyChip.appendChild(hzSpan(k.ch));
      keyChip.appendChild(el("small", null, k.mean));
      info.appendChild(keyChip);
      qInfo.appendChild(info);
      qInfo.appendChild(audioBtn(c));

      qStatus.textContent = "Обведи знак " + c.ch + " по чертам";
      strokeTotal = 0;
      qBtns.innerHTML = "";
      var hintBtn = el("button", "q-btn", T.battle.hintBtn);
      hintBtn.type = "button";
      qBtns.appendChild(hintBtn);

      if (!window.HanziWriter) {
        writerMount.innerHTML = "";
        writerMount.appendChild(el("p", "writer-error", T.battle.noWriter));
        var retry = el("button", "q-btn primary", T.battle.retryBtn);
        retry.type = "button";
        retry.addEventListener("click", function () { startRound(); });
        qBtns.appendChild(retry);
        return;
      }

      createWriter();
      armQuiz();

      hintBtn.addEventListener("click", function () {
        if (hinting || !writer) return;
        hinting = true;
        quizVersion++;
        try { writer.cancelQuiz(); } catch (e) {}
        qStatus.textContent = "Смотри, как пишется " + c.ch + "…";
        writer.animateCharacter(c.ch, {
          onComplete: function () { finishHint(c); }
        });
        setTimeout(function () { finishHint(c); }, 7000);
      });
    }

    paintHearts();
    renderMonster();
    dlgFlash(stage.character, T.battle.introTaunt
      .replace("{n}", "1")
      .replace("{name}", monsters[0].name), "ok");
    startRound();
  }

  /* ================= экран: хранилище ================= */

  function buildVault() {
    showScreen("vault", function (scr) {
      var root = el("div", "vault");
      var stageBox = el("div", "vault-stage");
      var chest = el("div", "chest3d");
      chest.appendChild(el("span", "chest-glow"));
      chest.appendChild(el("div", "chest-body"));
      chest.appendChild(el("div", "chest-lid"));
      var seals = el("div", "chest-seals");
      chest.appendChild(seals);
      stageBox.appendChild(chest);
      root.appendChild(stageBox);
      var codeBox = el("div", "vault-code");
      root.appendChild(codeBox);
      scr.appendChild(root);

      hudObjective("Хранилище: тайный код экспедиции");
      dlgSay(T.hero, T.vault.enterNote);

      function renderOpenChest() {
        chest.classList.add("open");
        codeBox.innerHTML = "";
        codeBox.appendChild(el("div", "finale-code-label", T.finale.codeLabel));
        var digits = el("div", "code-digits", T.code);
        codeBox.appendChild(digits);
        var crew = el("div", "vault-crew");
        T.stages.forEach(function (st) {
          var m = el("span", "crew-member");
          m.style.setProperty("--c", st.color);
          var img = el("img");
          img.src = st.character.img;
          img.alt = st.character.name;
          m.appendChild(img);
          m.appendChild(el("span", null, st.character.name));
          crew.appendChild(m);
        });
        codeBox.appendChild(crew);
        codeBox.appendChild(el("p", "vault-note", T.vault.openDone));
        dlgSay(T.hero, T.vault.openDone);
        setTimeout(function () {
          sparkBurst(digits, ["#fbbf24", "#a78bfa", "#67e8f9", "#ffffff"], 80);
        }, 80);
      }

      if (progress.finaleShown) { renderOpenChest(); return; }

      var btn = el("button", "q-btn primary vault-btn", T.vault.openBtn);
      btn.type = "button";
      stageBox.appendChild(btn);
      for (var i = 0; i < 4; i++) seals.appendChild(el("span", "seal-orb"));

      btn.addEventListener("click", function () {
        btn.remove();
        var orbs = Array.prototype.slice.call(seals.children);
        var idx = 0;
        (function step() {
          if (idx >= orbs.length) {
            chest.classList.add("open");
            progress.finaleShown = true;
            saveProgress();
            syncHud();
            setTimeout(renderOpenChest, 650);
            return;
          }
          orbs[idx].classList.add("break");
          sparkBurst(orbs[idx], ["#fbbf24", "#fde68a", "#ffffff"], 18);
          idx++;
          setTimeout(step, 380);
        })();
      });
    });
  }

  /* ================= реестр и запуск ================= */

  var BUILDERS = { s1: buildSt1, s2: buildSt2, s3: buildSt3, s4: buildSt4 };

  function resetAll() {
    if (!window.confirm("Начать Задание 2 заново? Прогресс и код сбросятся.")) return;
    progress = freshProgress();
    saveProgress();
    syncHud();
    buildTitle();
  }

  document.addEventListener("DOMContentLoaded", function () {
    viewport = qs("#viewport");
    dlg.box = qs("#dlg");
    dlg.face = qs("#dlg-face-img");
    dlg.name = qs("#dlg-name");
    dlg.text = qs("#dlg-text");
    if (dlg.box) {
      dlg.box.addEventListener("click", function () {
        if (typing.active) {
          stopTyping();
          if (dlg.text) dlg.text.textContent = typing.full;
        }
      });
    }
    buildHud();
    var resetBtn = qs("#reset-btn");
    if (resetBtn) resetBtn.addEventListener("click", resetAll);
    if ("speechSynthesis" in window && speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = function () {};
    }
    buildTitle();
  });
})();
