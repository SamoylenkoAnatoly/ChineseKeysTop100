(function () {
  "use strict";

  var Q = window.QUEST_TASK;
  if (!Q || !Q.keys || !Q.keys.length || !Q.tasks || !Q.tasks.length) return;

  var ZONE_IDS = ["map", "t1", "t2", "t3", "t4"];
  var INITIALS = ["sh", "ch", "zh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];
  var progress = loadProgress();
  var activeAudio = null;
  var currentZone = "map";

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

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function sample(arr, n, isBad) {
    var pool = arr.filter(function (x) { return !isBad || !isBad(x); });
    return shuffle(pool).slice(0, n);
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(Q.storageKey);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.v === 1 && d.done && d.done.length === Q.tasks.length) {
          if (typeof d.finaleShown !== "boolean") d.finaleShown = false;
          return d;
        }
      }
    } catch (e) {}
    return freshProgress();
  }

  function freshProgress() {
    return { v: 1, done: Q.tasks.map(function () { return false; }), finaleShown: false };
  }

  function saveProgress() {
    try { localStorage.setItem(Q.storageKey, JSON.stringify(progress)); } catch (e) {}
  }

  function allDone() {
    return progress.done.every(Boolean);
  }

  function doneCount() {
    return progress.done.filter(Boolean).length;
  }

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

  function speakerIcon() {
    var wrap = document.createElement("span");
    wrap.className = "q-audio-ico";
    wrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke-linejoin="round"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" stroke-linecap="round"/></svg>';
    return wrap;
  }

  function audioBtn(item, label) {
    var b = el("button", "q-audio");
    b.type = "button";
    b.appendChild(speakerIcon());
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
    colors = colors || ["#f4cc85", "#fff3c4", "#ffffff"];
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

  function renderArt(artId) {
    var art = Q.pixelArts[artId];
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("class", "pix-art");
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "пиксельная картина");
    if (!art) return svg;
    for (var r = 0; r < art.rows.length; r++) {
      var row = art.rows[r];
      for (var c = 0; c < row.length && c < 16; c++) {
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
    return s;
  }

  function buildCodeTrack() {
    var track = qs("#code-track");
    if (!track) return;
    track.innerHTML = "";
    var digits = Q.code.split("");
    digits.forEach(function (d, i) {
      var slot = el("span", "digit-slot" + (progress.done[i] ? " lit" : ""), progress.done[i] ? d : "?");
      track.appendChild(slot);
    });
    var label = el("span", "code-track-label", "Печати: " + doneCount() + " из " + digits.length);
    track.appendChild(label);
  }

  function portalCard(opts) {
    var card = el("button", "portal portal-" + opts.zone + (opts.done ? " done" : ""));
    card.type = "button";
    card.style.setProperty("--c", opts.color);
    var av = el("span", "p-avatar");
    if (opts.img) {
      var img = el("img");
      img.src = opts.img;
      img.alt = "";
      img.width = 64;
      img.height = 64;
      img.loading = "lazy";
      av.appendChild(img);
    }
    card.appendChild(av);
    card.appendChild(el("span", "p-name", opts.name));
    card.appendChild(el("span", "p-sub", opts.sub));
    var chip = el("span", "p-chip", opts.chip);
    card.appendChild(chip);
    var motif = el("i", "p-motif");
    motif.setAttribute("aria-hidden", "true");
    card.appendChild(motif);
    card.addEventListener("click", opts.onClick);
    return card;
  }

  function buildMap() {
    var mount = qs("#portals");
    if (!mount) return;
    mount.innerHTML = "";
    Q.tasks.forEach(function (task, i) {
      mount.appendChild(portalCard({
        color: task.color,
        zone: task.zone,
        img: task.character.img,
        name: task.title,
        sub: task.character.name + " · " + task.subtitle,
        chip: progress.done[i] ? "Печать снята ✓" : "Испытание " + (i + 1),
        done: progress.done[i],
        onClick: function () { showZone(task.zone); startTask(i); }
      }));
    });
    buildCodeTrack();
    buildMapFinale();
  }

  function buildMapFinale() {
    var mount = qs("#map-finale");
    if (!mount) return;
    mount.innerHTML = "";
    if (!allDone()) return;
    var panel = el("div", "map-finale-box");
    mount.appendChild(panel);
    if (progress.finaleShown) { renderCodePanel(panel); return; }
    panel.appendChild(el("p", "map-finale-hint", Q.finale.readyIntro));
    var btn = el("button", "q-btn primary", Q.finale.openBtn);
    btn.type = "button";
    panel.appendChild(btn);
    btn.addEventListener("click", function () {
      btn.disabled = true;
      btn.remove();
      var track = qs("#code-track");
      var slots = track ? Array.prototype.slice.call(track.querySelectorAll(".digit-slot")) : [];
      var digits = Q.code.split("");
      var i = 0;
      (function step() {
        if (i >= slots.length) {
          progress.finaleShown = true;
          saveProgress();
          renderCodePanel(panel);
          return;
        }
        slots[i].textContent = digits[i];
        slots[i].className = "digit-slot lit flip";
        sparkBurst(slots[i], ["#f4cc85", "#fff3c4", "#ffffff"]);
        i++;
        setTimeout(step, 420);
      })();
    });
  }

  function renderCodePanel(panel) {
    var codeBlock = el("div", "finale-code");
    codeBlock.appendChild(el("span", "finale-code-label", Q.finale.codeLabel));
    codeBlock.appendChild(el("div", "finale-code-digits", Q.code));
    panel.appendChild(codeBlock);
    var crew = el("div", "finale-crew");
    Q.tasks.forEach(function (task) {
      var m = el("span", "crew-member");
      m.style.setProperty("--c", task.color);
      var img = el("img");
      img.src = task.character.img;
      img.alt = task.character.name;
      m.appendChild(img);
      m.appendChild(el("span", null, task.character.name));
      crew.appendChild(m);
    });
    panel.appendChild(crew);
    panel.appendChild(el("p", "map-finale-note", Q.finale.doneNote));
    setTimeout(function () {
      sparkBurst(codeBlock, ["#f4cc85", "#cbb1fb", "#8fd14f", "#80e5dc", "#ffffff"], 80);
    }, 80);
  }

  function zoneHeadHtml(task, introText) {
    var head = el("div", "zone-head-inner");
    var back = el("button", "back-btn", "← Карта порталов");
    back.type = "button";
    back.addEventListener("click", function () { showZone("map"); });
    head.appendChild(back);
    var row = el("div", "zh-row");
    var av = el("span", "zh-av");
    var img = el("img");
    img.src = task.character.img;
    img.alt = task.character.name;
    img.width = 84;
    img.height = 84;
    av.appendChild(img);
    row.appendChild(av);
    var bubble = el("div", "zh-bubble");
    var plate = el("div", "zh-plate");
    plate.appendChild(el("span", "zh-name", task.character.name));
    plate.appendChild(el("span", "zh-role", task.character.role));
    bubble.appendChild(plate);
    bubble.appendChild(el("h2", null, task.title));
    bubble.appendChild(el("p", "zh-intro", introText));
    row.appendChild(bubble);
    head.appendChild(row);
    return head;
  }

  function buildZoneHeads() {
    Q.tasks.forEach(function (task) {
      var mount = qs("#zone-" + task.zone + " .zone-head");
      if (!mount) return;
      mount.innerHTML = "";
      mount.appendChild(zoneHeadHtml(task, task.intro));
    });
  }

  function buildPrompt(task, key, box) {
    if (task.zone === "t1") {
      var card = el("div", "q-prompt");
      card.appendChild(hzSpan(key.ch, "q-glyph"));
      var py = el("div", "q-py tone-" + key.t, key.py);
      card.appendChild(py);
      card.appendChild(audioBtn(key));
      box.appendChild(card);
    } else if (task.zone === "t2") {
      var frame = el("div", "q-prompt q-prompt-key");
      frame.appendChild(hzSpan(key.ch, "q-glyph"));
      var meta = el("div", "q-meta");
      meta.appendChild(el("div", "q-py tone-" + key.t, key.py));
      meta.appendChild(audioBtn(key));
      frame.appendChild(meta);
      box.appendChild(frame);
    } else if (task.zone === "t3") {
      var card3 = el("div", "q-prompt q-prompt-col");
      var build = el("div", "word-build");
      key.ex.parts.forEach(function (p) {
        if (p.rad) build.appendChild(el("span", "word-slot", "?"));
        else build.appendChild(hzSpan(p.t, "hz word-part"));
      });
      card3.appendChild(build);
      var meta3 = el("div", "q-meta");
      meta3.appendChild(el("div", "q-py tone-" + key.t, key.py));
      meta3.appendChild(el("div", "q-mean", "«" + key.ex.tr + "»"));
      card3.appendChild(meta3);
      box.appendChild(card3);
    }
  }

  function priceLabel() {
    var n = 1 + Math.floor(Math.random() * 9);
    var w = n === 1 ? "медяк" : (n < 5 ? "медяка" : "медяков");
    return n + " " + w;
  }

  function buildOptions(task, key) {
    var opts = [];
    if (task.zone === "t1") {
      Q.keys.forEach(function (k) {
        opts.push({ text: k.mean, price: priceLabel(), correct: k === key });
      });
    } else if (task.zone === "t2") {
      sample(Q.keys, 3, function (k) { return k === key; }).forEach(function (k) { opts.push({ art: k.art }); });
      opts.push({ art: key.art, correct: true });
    } else if (task.zone === "t3") {
      var seen = {};
      seen[key.form] = 1;
      var pool = shuffle(Q.keys.filter(function (k) { return k !== key; }));
      for (var i = 0; i < pool.length && opts.length < 3; i++) {
        if (!seen[pool[i].form]) { seen[pool[i].form] = 1; opts.push({ hz: pool[i].form }); }
      }
      opts.push({ hz: key.form, correct: true });
    } else if (task.zone === "t4") {
      var others = Q.keys.filter(function (k) { return k !== key; });
      var scored = others.map(function (k) { return { k: k, s: pyScore(key, k) }; });
      scored.sort(function (a, b) { return b.s - a.s; });
      var used = {};
      for (var j = 0; j < scored.length && opts.length < 2; j++) {
        used[scored[j].k.ch] = 1;
        opts.push({ hz: scored[j].k.ch });
      }
      sample(scored.slice(2).map(function (x) { return x.k; }), 1).forEach(function (k) {
        if (!used[k.ch]) { used[k.ch] = 1; opts.push({ hz: k.ch }); }
      });
      if (opts.length < 3) {
        sample(others, 1, function (k) { return used[k.ch]; }).forEach(function (k) { opts.push({ hz: k.ch }); });
      }
      opts.push({ hz: key.ch, correct: true });
    }
    return shuffle(opts);
  }

  function revealLine(box, key, task) {
    var line = el("p", "reveal-line");
    if (task.zone === "t1") {
      line.appendChild(hzSpan(key.ch));
      line.appendChild(document.createTextNode(" " + key.py + " — " + key.mean));
    } else if (task.zone === "t2") {
      var ra = el("span", "reveal-art");
      ra.appendChild(renderArt(key.art));
      line.appendChild(ra);
      line.appendChild(hzSpan(key.ch));
      line.appendChild(document.createTextNode(" " + key.py + " — " + key.mean + " · " + key.artTitle));
    } else if (task.zone === "t3") {
      var ex = key.ex;
      var word = el("span", "reveal-word");
      word.appendChild(hzSpan(ex.ch));
      word.appendChild(document.createTextNode(" " + ex.py + " — " + ex.tr));
      line.appendChild(word);
      var parts = el("span", "reveal-parts");
      ex.parts.forEach(function (p, idx) {
        if (idx) parts.appendChild(el("span", "part-plus", "+"));
        parts.appendChild(hzSpan(p.t, "hz part" + (p.rad ? " hit" : "")));
      });
      line.appendChild(parts);
      line.appendChild(el("span", "reveal-note", key.form + " — «" + key.formName + "», облик ключа " + key.ch + " в словах"));
      box.appendChild(line);
      box.appendChild(audioBtn(ex, "Послушать слово"));
      return;
    } else if (task.zone === "t4") {
      line.appendChild(hzSpan(key.ch));
      var extra = " " + key.py + " — " + key.mean;
      if (key.form !== key.ch) extra += " · в словах: " + key.form;
      line.appendChild(document.createTextNode(extra));
    }
    box.appendChild(line);
  }

  function doneCard(task, i, opts) {
    opts = opts || {};
    var card = el("div", "q-done");
    var av = el("img", "q-done-av");
    av.src = task.character.img;
    av.alt = task.character.name;
    card.appendChild(av);
    card.appendChild(el("h3", null, "Испытание пройдено!"));
    var sum;
    if (opts.fresh) sum = opts.mistakes === 0 ? "Ни одной ошибки — безупречно!" : "Ошибок по пути: " + opts.mistakes;
    else sum = "Это испытание уже покорилось тебе.";
    card.appendChild(el("p", "q-done-sum", sum));
    var dWrap = el("div", "q-done-digit");
    dWrap.appendChild(el("span", "q-done-digit-label", "Цифра кода"));
    var tile = el("span", "code-digit big lit", Q.code.charAt(i));
    dWrap.appendChild(tile);
    card.appendChild(dWrap);
    card.appendChild(el("p", "q-done-text", task.doneText));
    if (opts.fresh && allDone()) card.appendChild(el("p", "q-done-text", "Все четыре печати сняты! Возвращайся на карту — тайный код ждёт."));
    var actions = el("div", "q-done-actions");
    var toMap = el("button", "q-btn primary", "К карте порталов →");
    toMap.type = "button";
    toMap.addEventListener("click", function () { showZone("map"); });
    actions.appendChild(toMap);
    if (!opts.fresh) {
      var again = el("button", "q-btn", "Пройти снова");
      again.type = "button";
      again.addEventListener("click", function () { startTask(i, true); });
      actions.appendChild(again);
    }
    card.appendChild(actions);
    setTimeout(function () { sparkBurst(tile, task.spark); }, 60);
    return card;
  }

  function startTask(i, force) {
    var task = Q.tasks[i];
    var mount = qs("#zone-" + task.zone + " .quiz-mount");
    if (!mount) return;
    mount.innerHTML = "";
    if (progress.done[i] && !force) {
      mount.appendChild(doneCard(task, i, {}));
      return;
    }
    var order = shuffle(Q.keys);
    var round = 0, mistakes = 0, locked = false, phase = "single";

    var wrap = el("div", "quiz");
    var status = el("p", "q-status");
    status.setAttribute("role", "status");
    var dots = el("div", "q-dots");
    dots.setAttribute("aria-hidden", "true");
    order.forEach(function () { dots.appendChild(el("span")); });
    var promptBox = el("div", "q-prompt-box");
    var optBox = el("div", "q-options" + (task.zone === "t1" ? " menu-grid" : " hz-grid"));
    var reveal = el("div", "q-reveal");
    var feed = el("p", "q-feed");
    feed.setAttribute("aria-live", "polite");
    wrap.appendChild(status);
    wrap.appendChild(dots);
    wrap.appendChild(promptBox);
    wrap.appendChild(optBox);
    wrap.appendChild(reveal);
    wrap.appendChild(feed);
    mount.appendChild(wrap);

    function paintDots() {
      for (var d = 0; d < dots.children.length; d++) {
        dots.children[d].className = d < round ? "done" : (d === round ? "cur" : "");
      }
    }

    function updateStatus() {
      var step = "";
      if (task.zone === "t4") step = phase === "glyph" ? " · шаг 2: иероглиф" : " · шаг 1: тон";
      status.textContent = task.qLabel + step + " · " + (round + 1) + " из " + order.length + (mistakes ? " · ошибок: " + mistakes : "");
    }

    function buildOptionButtons(key, opts) {
      opts.forEach(function (o) {
        var b = el("button", "q-opt" + (o.art ? " opt-art" : ""));
        b.type = "button";
        if (o.hz) b.appendChild(hzSpan(o.hz));
        else if (o.art) b.appendChild(renderArt(o.art));
        else if (o.price != null) {
          b.appendChild(el("span", "menu-text", o.text));
          b.appendChild(el("span", "menu-dots"));
          b.appendChild(el("span", "menu-price", o.price));
        } else b.appendChild(el("span", "opt-text", o.text));
        b.addEventListener("click", function () { handlePick(key, o, b); });
        optBox.appendChild(b);
      });
    }

    function handlePick(key, o, b) {
      if (locked) return;
      if (o.correct) {
        locked = true;
        b.classList.add("right");
        if (task.zone === "t3") {
          var slot = promptBox.querySelector(".word-slot");
          if (slot) {
            slot.textContent = o.hz;
            slot.className = "word-slot filled";
          }
        }
        if (dots.children[round]) dots.children[round].className = "done";
        feed.textContent = pick(task.ok);
        feed.className = "q-feed ok";
        sparkBurst(b, task.spark);
        revealLine(reveal, key, task);
        setTimeout(next, 1350);
      } else {
        mistakes++;
        b.classList.add("wrong");
        b.disabled = true;
        feed.textContent = pick(task.fail);
        feed.className = "q-feed bad";
        updateStatus();
      }
    }

    function startTonePhase(key) {
      phase = "tone";
      var card = el("div", "q-prompt");
      var mini = el("img", "mini-char");
      mini.src = task.character.img;
      mini.alt = "";
      card.appendChild(mini);
      var py = el("div", "q-py q-py-big py-plain", key.pyBase);
      card.appendChild(py);
      card.appendChild(audioBtn(key));
      promptBox.appendChild(card);
      playAudio(key.audio, key.ch);
      var marks = ["ˉ", "´", "ˇ", "`"];
      marks.forEach(function (m, idx) {
        var tn = idx + 1;
        var b = el("button", "q-opt tone-btn tone-" + tn);
        b.type = "button";
        b.appendChild(el("span", "tone-mark", m));
        b.appendChild(el("span", "tone-num", String(tn)));
        b.addEventListener("click", function () {
          if (locked) return;
          if (tn === key.t) {
            Array.prototype.forEach.call(optBox.children, function (btn) { btn.disabled = true; });
            b.disabled = false;
            b.classList.add("right");
            py.textContent = key.py;
            py.className = "q-py q-py-big tone-" + key.t;
            phase = "glyph";
            updateStatus();
            feed.textContent = "Верный тон!";
            feed.className = "q-feed ok";
            sparkBurst(b, task.spark);
            setTimeout(function () { buildOptionButtons(key, buildOptions(task, key)); }, 700);
          } else {
            mistakes++;
            b.classList.add("wrong");
            b.disabled = true;
            feed.textContent = pick(task.fail);
            feed.className = "q-feed bad";
            updateStatus();
          }
        });
        optBox.appendChild(b);
      });
    }

    function render() {
      var key = order[round];
      locked = false;
      phase = "single";
      updateStatus();
      paintDots();
      promptBox.innerHTML = "";
      optBox.innerHTML = "";
      reveal.innerHTML = "";
      feed.textContent = "";
      feed.className = "q-feed";
      if (task.zone === "t4") {
        startTonePhase(key);
        return;
      }
      buildPrompt(task, key, promptBox);
      buildOptionButtons(key, buildOptions(task, key));
    }

    function next() {
      round++;
      if (round >= order.length) {
        progress.done[i] = true;
        saveProgress();
        syncChrome();
        mount.innerHTML = "";
        mount.appendChild(doneCard(task, i, { fresh: true, mistakes: mistakes }));
      } else {
        render();
      }
    }

    render();
  }

  function showZone(id) {
    currentZone = id;
    ZONE_IDS.forEach(function (z) {
      var sec = qs("#zone-" + z);
      if (sec) sec.hidden = (z !== id);
    });
    document.body.setAttribute("data-zone", id);
    if (id === "map") buildMap();
    syncChrome();
    try { window.scrollTo({ top: 0, behavior: "auto" }); } catch (e) { window.scrollTo(0, 0); }
  }

  function syncChrome() {
    buildMenu();
    updateChapterTrack();
  }

  function menuTab(opts) {
    var tab = el("button", "char-tab" + (opts.active ? " active" : "") + (opts.done ? " done" : ""));
    tab.type = "button";
    tab.setAttribute("aria-selected", opts.active ? "true" : "false");
    var img = el("img");
    img.src = opts.img;
    img.alt = opts.alt || "";
    img.width = 42;
    img.height = 42;
    img.loading = "lazy";
    tab.appendChild(img);
    tab.appendChild(el("span", null, opts.label));
    tab.addEventListener("click", opts.onClick);
    return tab;
  }

  function buildMenu() {
    var mount = qs("#menu-inner");
    if (!mount) return;
    mount.innerHTML = "";
    Q.tasks.forEach(function (task, i) {
      mount.appendChild(menuTab({
        label: task.menuLabel || task.character.name,
        img: task.character.img,
        alt: task.character.name,
        active: currentZone === task.zone,
        done: progress.done[i],
        onClick: function () { showZone(task.zone); startTask(i); }
      }));
    });
  }

  function updateChapterTrack() {
    var track = qs("#chapter-track");
    if (!track) return;
    for (var i = 0; i < track.children.length; i++) {
      var cls = "";
      if (progress.done[i]) cls = "done";
      else if (Q.tasks[i] && Q.tasks[i].zone === currentZone) cls = "current";
      track.children[i].className = cls;
    }
  }

  function resetAll() {
    if (!window.confirm("Начать Задание 1 заново? Прогресс и код сбросятся.")) return;
    progress = freshProgress();
    saveProgress();
    showZone("map");
  }

  function applyHash() {
    var h = (window.location.hash || "").replace("#", "");
    if (!h) { showZone("map"); return; }
    if (h === "map") { showZone("map"); return; }
    for (var i = 0; i < Q.tasks.length; i++) {
      if (Q.tasks[i].zone === h) { showZone(h); startTask(i); return; }
    }
    showZone("map");
  }

  function zoneAccent(host) {
    var v = getComputedStyle(host).getPropertyValue("--accent").trim();
    return v || "#f4cc85";
  }

  function initRoomProps() {
    var props = document.querySelectorAll(".room-prop");
    Array.prototype.forEach.call(props, function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("power-bank")) {
          var cells = btn.querySelectorAll("i");
          Array.prototype.forEach.call(cells, function (c, idx) {
            setTimeout(function () { c.classList.add("on"); }, 220 * idx);
          });
          setTimeout(function () {
            Array.prototype.forEach.call(cells, function (c) { c.classList.remove("on"); });
          }, 220 * cells.length + 1600);
          sparkBurst(btn, ["#80e5dc", "#ffffff", "#35c0d8"], 22);
          return;
        }
        btn.classList.add("active");
        setTimeout(function () { btn.classList.remove("active"); }, 1500);
        sparkBurst(btn, [zoneAccent(btn), "#ffffff", "#f4cc85"], 22);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildZoneHeads();
    initRoomProps();
    var resetBtn = qs("#reset-btn");
    if (resetBtn) resetBtn.addEventListener("click", resetAll);
    if ("speechSynthesis" in window && speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = function () {};
    }
    applyHash();
  });
})();
