(function () {
  "use strict";

  const T = window.CASE_TASK;
  const $ = (sel, root) => (root || document).querySelector(sel);

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const FOX_CHAPTER = {
    id: "fin",
    title: "Очная ставка",
    witness: "detective",
    ok: ["Верно, помощник. Так держать!", "Именно! Ключ к делу.", "Отлично. Инстинкт сыщика не подводит.", "Так! Дело сдвинулось."],
    fail: ["Мимо, помощник. Проверь ещё раз.", "Не тот след. Смотри внимательнее.", "Хм… ключи не врут, а ты поторопился."],
    words: ["sui"]
  };

  const LESSON_IDS = Array.from(new Set(T.chapters.concat(T.finaleChapter).flatMap(ch => ch.words)));

  let state = loadState();
  let cur = null;
  let litDigits = 0;
  let finaleErrors = 0;

  function dossierWords(chapter) {
    return Array.from(chapter.text.matchAll(/【([a-z]+)】/g), m => m[1]);
  }

  function wordFamily(id) {
    const word = T.words[id];
    const radical = word.parts.find(part => part.rad);
    return word.key.find(ch => {
      const key = T.keys.find(item => item.ch === ch);
      return radical && (radical.t === ch || radical.t === key.form);
    }) || word.key[0];
  }

  function freshDossier(chapter) {
    const ids = dossierWords(chapter);
    return { order: shuffle(LESSON_IDS), placed: ids.map(() => null), checked: false, errors: 0, done: false };
  }

  function freshState() {
    return { v: 4, solved: {}, interviews: {}, dossiers: {}, tokens: 3, finale: { cross: [false, false, false, false], note: false, accused: null, done: false }, caseDone: false };
  }

  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(T.storageKey));
      const next = freshState();
      if (!s || ![1, 2, 3, 4].includes(s.v)) return next;
      LESSON_IDS.forEach(id => {
        if (s.solved && Object.prototype.hasOwnProperty.call(s.solved, id) && Number.isInteger(s.solved[id]) && s.solved[id] >= 0) next.solved[id] = s.solved[id];
      });
      if (Number.isInteger(s.tokens) && s.tokens >= 0) next.tokens = s.tokens;
      if (s.v === 1) return next;
      T.chapters.concat(T.finaleChapter).forEach(ch => {
        const ids = dossierWords(ch);
        const d = s.dossiers && s.dossiers[ch.id];
        if (new Set(ids).size !== ids.length || !d || !Array.isArray(d.order) || !Array.isArray(d.placed) || d.placed.length !== ids.length) return;
        let order;
        let placed;
        if (s.v === 2) {
          const validOld = n => Number.isInteger(n) && n >= 0 && n < ids.length;
          if (d.order.length !== ids.length || !d.order.every(validOld) || new Set(d.order).size !== ids.length || !d.placed.every(n => n === null || validOld(n))) return;
          placed = d.placed.map(n => n === null ? null : ids[n]);
          order = shuffle(LESSON_IDS);
        } else {
          if (d.order.length !== LESSON_IDS.length || !d.order.every(id => LESSON_IDS.includes(id)) || new Set(d.order).size !== LESSON_IDS.length || !d.placed.every(id => id === null || LESSON_IDS.includes(id))) return;
          order = d.order.slice();
          placed = d.placed.slice();
        }
        const used = placed.filter(id => id !== null);
        if (new Set(used).size !== used.length) return;
        const correct = placed.every((id, i) => id !== null && id === ids[i]);
        next.dossiers[ch.id] = { order: order, placed: placed, checked: d.checked === true && used.length === ids.length, errors: Number.isInteger(d.errors) && d.errors >= 0 ? d.errors : 0, done: d.done === true && correct };
      });
      let priorDone = true;
      T.chapters.concat(T.finaleChapter).forEach(ch => {
        const d = next.dossiers[ch.id];
        if (d) d.done = d.done && priorDone;
        priorDone = Boolean(d && d.done);
      });
      if (priorDone && s.finale) {
        if (Array.isArray(s.finale.cross) && s.finale.cross.length === T.crossExam.length) next.finale.cross = s.finale.cross.map(x => x === true);
        next.finale.note = next.finale.cross.every(Boolean) && s.finale.note === true;
        next.finale.accused = next.finale.note && s.finale.accused === T.culprit ? T.culprit : null;
        next.finale.done = next.finale.accused !== null;
        next.caseDone = next.finale.done;
      }
      if (s.v === 4 && s.interviews && typeof s.interviews === "object") {
        T.chapters.concat(T.finaleChapter).forEach(ch => {
          Array.from(new Set(dossierWords(ch))).forEach(id => {
            const key = ch.id + ":" + id;
            const draft = validateInterview(s.interviews[key], T.words[id]);
            if (draft) next.interviews[key] = draft;
          });
        });
      }
      return next;
    } catch (e) {
      return freshState();
    }
  }

  function dossierState(chapter) {
    if (!state.dossiers[chapter.id]) state.dossiers[chapter.id] = freshDossier(chapter);
    return state.dossiers[chapter.id];
  }

  function save() {
    try { localStorage.setItem(T.storageKey, JSON.stringify(state)); } catch (e) {}
  }

  function witnessOf(chapter) {
    if (chapter.witness === "detective") return T.detective;
    return T.suspects.find(s => s.id === chapter.witness);
  }

  function isSolved(id) {
    return Object.prototype.hasOwnProperty.call(state.solved, id);
  }

  function chapterDone(chapter) {
    return Boolean(state.dossiers[chapter.id] && state.dossiers[chapter.id].done);
  }

  function allChaptersDone() {
    return T.chapters.every(chapterDone);
  }

  function chapterStars(chapter) {
    if (!chapterDone(chapter)) return 0;
    const sum = dossierState(chapter).errors;
    return sum === 0 ? 3 : sum <= 3 ? 2 : 1;
  }

  function starRow(n) {
    return n === 3 ? "★ ★ ★" : n === 2 ? "★ ★ ☆" : n === 1 ? "★ ☆ ☆" : "☆ ☆ ☆";
  }

  const audioPool = {};
  let voiceTimer = 0;

  function showVoiceTip() {
    const tip = $("#voice-tip");
    tip.hidden = false;
    clearTimeout(voiceTimer);
    voiceTimer = setTimeout(() => { tip.hidden = true; }, 4000);
  }

  function playWord(word, btn) {
    if (!word) return;
    if (!audioPool[word.audio]) audioPool[word.audio] = new Audio(word.audio);
    const a = audioPool[word.audio];
    try { a.currentTime = 0; } catch (e) {}
    a.volume = 0.95;
    const p = a.play();
    if (p && p.then) {
      p.then(() => flashBtn(btn)).catch(() => speakFallback(word, btn));
    } else {
      flashBtn(btn);
    }
  }

  function flashBtn(btn) {
    if (!btn) return;
    btn.classList.add("speaking");
    setTimeout(() => btn.classList.remove("speaking"), 1100);
  }

  function speakFallback(word, btn) {
    if (!("speechSynthesis" in window)) { showVoiceTip(); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word.ch);
      u.lang = "zh-CN";
      u.pitch = 1;
      u.rate = 0.72;
      u.volume = 1;
      u.onstart = () => flashBtn(btn);
      u.onerror = () => showVoiceTip();
      speechSynthesis.speak(u);
    } catch (e) {
      showVoiceTip();
    }
  }

  function setHash(id) {
    if (location.hash === "#" + id) { route(); return; }
    location.hash = id;
  }

  function showZone(id, zoneName) {
    if (cancelDrag) cancelDrag();
    document.querySelectorAll(".zone").forEach(z => { z.hidden = true; });
    const zone = document.getElementById(id);
    if (zone) zone.hidden = false;
    document.body.dataset.zone = zoneName;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function route() {
    const h = location.hash.replace("#", "") || "desk";
    if (h === "desk") { renderDesk(); return; }
    if (h === "finale") { openFinale(); return; }
    const ch = T.chapters.find(c => c.id === h);
    if (ch) { renderDossier(ch); return; }
    renderDesk();
  }

  function renderTop() {
    const track = $("#code-track");
    track.textContent = "";
    track.appendChild(el("span", "code-track-label", T.codeLabel));
    T.code.split("").forEach((d, i) => {
      const lit = i < litDigits;
      const slot = el("span", "digit-slot" + (lit ? " lit" : ""), lit ? d : "·");
      track.appendChild(slot);
    });
  }

  function revealDigit(i) {
    litDigits = Math.max(litDigits, i + 1);
    renderTop();
    const slots = document.querySelectorAll("#code-track .digit-slot");
    if (slots[i]) slots[i].classList.add("flip");
  }

  function buildMenu() {
    const inner = $("#menu-inner");
    inner.textContent = "";

    const desk = el("button", "char-tab" + (location.hash === "#desk" || !location.hash ? " active" : ""));
    desk.type = "button";
    const img = el("img"); img.src = T.detective.img; img.alt = "";
    desk.appendChild(img);
    desk.appendChild(el("span", null, "Стол"));
    desk.addEventListener("click", () => setHash("desk"));
    inner.appendChild(desk);

    T.chapters.forEach(ch => {
      const w = witnessOf(ch);
      const done = chapterDone(ch);
      const locked = !unlocked(ch);
      const tab = el("button", "char-tab" + (location.hash === "#" + ch.id ? " active" : "") + (done ? " done" : ""));
      tab.type = "button";
      if (locked) tab.disabled = true;
      const im = el("img"); im.src = w.img; im.alt = "";
      tab.appendChild(im);
      tab.appendChild(el("span", null, ch.menuLabel));
      if (locked) tab.title = "Сначала закрой предыдущую главу";
      tab.addEventListener("click", () => setHash(ch.id));
      inner.appendChild(tab);
    });

    const fin = el("button", "char-tab" + (location.hash === "#finale" ? " active" : "") + (state.caseDone ? " done" : ""));
    fin.type = "button";
    if (!allChaptersDone()) fin.disabled = true;
    const fim = el("img"); fim.src = T.detective.img; fim.alt = "";
    fin.appendChild(fim);
    fin.appendChild(el("span", null, "Финал"));
    if (!allChaptersDone()) fin.title = "Откроется, когда все главы будут раскрыты";
    fin.addEventListener("click", () => setHash("finale"));
    inner.appendChild(fin);
  }

  function unlocked(chapter) {
    const i = T.chapters.indexOf(chapter);
    return i === 0 || chapterDone(T.chapters[i - 1]);
  }

  function hostRow(w, big) {
    const col = el("div", "zh-av");
    const img = el("img"); img.src = w.img; img.alt = w.name + " — " + w.role;
    if (big) img.className = "host-avatar";
    col.appendChild(img);
    const plate = el("span", "host-plate");
    plate.appendChild(el("span", "host-name", w.name));
    plate.appendChild(el("span", "host-role", w.role));
    col.appendChild(plate);
    return col;
  }

  function renderDesk() {
    showZone("zone-desk", "desk");
    buildMenu();
    buildTopCode();

    const intro = $("#desk-intro");
    intro.textContent = "";
    intro.appendChild(hostRow(T.detective, true));
    const bubble = el("div", "bubble");
    bubble.appendChild(el("div", "bubble-label", "Инспектор Ху · Сыскная канцелярия"));
    bubble.appendChild(el("h2", null, T.deskIntroTitle));
    const p = el("p");
    p.textContent = T.deskIntro + " ";
    const total = T.chapters.length + 1;
    const done = T.chapters.concat(T.finaleChapter).filter(chapterDone).length;
    const b = el("b", null, "Проверено досье: " + done + " из " + total + ". Допросов пройдено: " + Object.keys(state.solved).length + " из 28 (необязательно).");
    p.appendChild(b);
    bubble.appendChild(p);
    intro.appendChild(bubble);

    const cards = $("#chapter-cards");
    cards.textContent = "";
    T.chapters.forEach((ch, i) => {
      const w = witnessOf(ch);
      const done = chapterDone(ch);
      const locked = !unlocked(ch);
      const card = el("button", "chapter-card");
      card.type = "button";
      card.style.setProperty("--cc", ch.color);
      card.disabled = locked;

      const av = el("img", "cc-av"); av.src = w.img; av.alt = "";
      card.appendChild(av);
      card.appendChild(el("span", "cc-name", "Глава " + (i + 1) + " · " + ch.title));
      card.appendChild(el("span", "cc-sub", "Свидетель: " + w.name + " — " + w.role + "."));
      const placed = dossierState(ch).placed.filter(n => n !== null).length;
      card.appendChild(el("span", "cc-progress", done ? "Досье проверено" : "Заполнено " + placed + " из " + dossierWords(ch).length + " позиций"));
      if (done) {
        card.appendChild(el("span", "cc-seal", "Раскрыто"));
        card.appendChild(el("span", "cc-stars", starRow(chapterStars(ch))));
      } else {
        card.appendChild(el("span", "cc-stars", "\u00a0"));
      }
      if (locked) card.appendChild(el("span", "cc-lock", "Закрой предыдущую главу"));
      card.addEventListener("click", () => setHash(ch.id));
      cards.appendChild(card);
    });

    const fin = $("#desk-finale");
    fin.textContent = "";
    if (allChaptersDone() && !state.caseDone) {
      const panel = el("div", "finale-ready");
      panel.appendChild(el("p", null, T.finaleReady));
      const btn = el("button", "q-btn primary", T.finaleBtn);
      btn.type = "button";
      btn.addEventListener("click", () => setHash("finale"));
      panel.appendChild(btn);
      fin.appendChild(panel);
    } else if (state.caseDone) {
      const panel = el("div", "finale-ready");
      panel.appendChild(el("p", null, "Дело закрыто! Виновный найден, сундук вернулся в чайный дом. Код дела: " + T.code + ". " + T.doneNote));
      const btn = el("button", "q-btn", "Открыть финал ещё раз");
      btn.type = "button";
      btn.addEventListener("click", () => setHash("finale"));
      panel.appendChild(btn);
      fin.appendChild(panel);
    } else {
      const panel = el("div", "finale-ready");
      panel.appendChild(el("p", null, "Очная ставка откроется после успешной проверки четырёх глав. Сейчас проверено глав: " + T.chapters.filter(chapterDone).length + " из 4. Допросы проходить необязательно."));
      fin.appendChild(panel);
    }

    const grid = $("#suspect-grid");
    grid.textContent = "";
    T.suspects.forEach(s => {
      const card = el("div", "suspect-card" + (state.caseDone && s.id === T.culprit ? " guilty" : ""));
      card.appendChild(el("span", "pin"));
      const img = el("img"); img.src = s.img; img.alt = s.name + " — " + s.role;
      card.appendChild(img);
      card.appendChild(el("div", "s-name", s.name));
      card.appendChild(el("div", "s-role", s.role));
      card.appendChild(el("div", "s-line", "«" + s.line + "»"));
      card.appendChild(el("span", "s-status", s.status));
      grid.appendChild(card);
    });
  }

  function buildTopCode() {
    litDigits = state.caseDone ? T.code.length : T.chapters.filter(chapterDone).length;
    renderTop();
  }

  function buildZoneHead(headEl) {
    headEl.textContent = "";
    const back = el("button", "back-btn", "← К столу детектива");
    back.type = "button";
    back.addEventListener("click", () => setHash("desk"));
    headEl.appendChild(back);
  }

  let cancelDrag = null;

  function photoSvg(photo) {
    if (photo.art) return photo.art;
    const rows = Array.isArray(photo.pixels) ? photo.pixels : [];
    if (!rows.length) return "";
    const palette = photo.palette || {};
    const size = 8;
    const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
    let svg = `<svg viewBox="0 0 ${width * size} ${rows.length * size}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">`;
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        let run = 1;
        while (x + run < row.length && row[x + run] === row[x]) run++;
        svg += `<rect x="${x * size}" y="${y * size}" width="${run * size}" height="${size}" fill="${palette[row[x]] || "#241b26"}"/>`;
        x += run;
      }
    });
    return svg + "</svg>";
  }

  function buildDossierText(container, chapter, intro) {
    const ids = dossierWords(chapter);
    const d = dossierState(chapter);
    let selected = null;
    let suppressClickUntil = 0;
    const editor = el("div", "dossier-editor");
    const live = el("p", "assembly-status");
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    container.classList.add("folder");
    container.appendChild(editor);

    function tokenGlyph(n) {
      return T.words[n].ch;
    }

    function announce(text) {
      live.textContent = text;
    }

    function changed(message, focusIndex) {
      d.checked = false;
      selected = null;
      save();
      draw();
      announce(message);
      const target = focusIndex === undefined ? $(".bank-return", editor) : editor.querySelectorAll(".assembly-slot")[focusIndex];
      if (target) target.focus({ preventScroll: true });
    }

    function place(token, index) {
      if (d.done || !d.order.includes(token)) return;
      const source = d.placed.indexOf(token);
      if (source === index) return;
      const previous = d.placed[index];
      if (source >= 0) d.placed[source] = previous;
      d.placed[index] = token;
      changed("Знак " + tokenGlyph(token) + " помещён в пропуск " + (index + 1) + ".", index);
    }

    function returnToken(token) {
      const index = d.placed.indexOf(token);
      if (index < 0 || d.done) return;
      d.placed[index] = null;
      changed("Знак " + tokenGlyph(token) + " возвращён в набор.");
    }

    function choose(token) {
      selected = selected === token ? null : token;
      editor.querySelectorAll("[data-token]").forEach(n => {
        const active = n.dataset.token === selected;
        n.classList.toggle("selected", active);
        n.setAttribute("aria-pressed", String(active));
      });
      const back = $(".bank-return", editor);
      if (back) back.disabled = selected === null || !d.placed.includes(selected);
      editor.querySelectorAll(".assembly-slot:not(.occupied)").forEach((slot, i) => {
        const index = Number(slot.dataset.dropIndex);
        slot.setAttribute("aria-label", "Пропуск " + (index + 1) + (selected === null ? ", открыть допрос" : ", вставить выбранный знак"));
      });
      $(".bank-selection", editor).textContent = selected === null ? "Знак не выбран" : "Выбран: " + tokenGlyph(selected);
      announce(selected === null ? "Выбор снят. Нажатие на ? откроет допрос." : "Выбран знак " + tokenGlyph(selected) + ". Нажмите на пропуск или перетащите знак.");
    }

    function bindTransfer(node, token) {
      node.dataset.token = String(token);
      node.setAttribute("aria-pressed", String(selected === token));
      node.addEventListener("dragstart", event => event.preventDefault());
      node.addEventListener("pointerdown", start => {
        if (d.done || start.button !== 0 || !start.isPrimary) return;
        if (start.pointerType === "touch" && !start.target.closest(".drag-grip")) return;
        if (cancelDrag) cancelDrag();
        let ghost = null;
        let hover = null;
        let x = start.clientX;
        let y = start.clientY;
        let frame = 0;
        const previousSelection = selected;
        const clearHover = () => {
          if (hover) hover.classList.remove("drop-target");
          hover = null;
        };
        const locate = () => {
          clearHover();
          const hit = document.elementFromPoint(x, y);
          const candidate = hit && hit.closest("[data-drop-index], .glyph-bank");
          if (candidate && editor.contains(candidate)) {
            hover = candidate;
            hover.classList.add("drop-target");
          }
        };
        const scroll = () => {
          if (!ghost) return;
          const edge = 70;
          if (y < edge) window.scrollBy(0, -10);
          else if (y > window.innerHeight - edge) window.scrollBy(0, 10);
          locate();
          frame = requestAnimationFrame(scroll);
        };
        const cleanup = () => {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          document.removeEventListener("pointercancel", cancel);
          clearHover();
          cancelAnimationFrame(frame);
          if (ghost) ghost.remove();
          node.classList.remove("dragging");
          if (node.hasPointerCapture(start.pointerId)) node.releasePointerCapture(start.pointerId);
          cancelDrag = null;
        };
        const move = event => {
          if (event.pointerId !== start.pointerId) return;
          x = event.clientX;
          y = event.clientY;
          if (!ghost && Math.hypot(x - start.clientX, y - start.clientY) > 7) {
            ghost = el("div", "drag-ghost hz", tokenGlyph(token));
            ghost.setAttribute("aria-hidden", "true");
            document.body.appendChild(ghost);
            node.classList.add("dragging");
            frame = requestAnimationFrame(scroll);
          }
          if (ghost) {
            event.preventDefault();
            ghost.style.left = x + "px";
            ghost.style.top = y + "px";
            locate();
          }
        };
        const up = event => {
          if (event.pointerId !== start.pointerId) return;
          if (!ghost) { cleanup(); return; }
          x = event.clientX;
          y = event.clientY;
          locate();
          const target = hover;
          suppressClickUntil = Date.now() + 450;
          cleanup();
          if (target && target.hasAttribute("data-drop-index")) place(token, Number(target.dataset.dropIndex));
          else if (target) returnToken(token);
          else {
            selected = previousSelection;
            announce("Перенос отменён. Расстановка не изменена.");
          }
        };
        const cancel = () => {
          if (ghost) suppressClickUntil = Date.now() + 450;
          cleanup();
        };
        node.setPointerCapture(start.pointerId);
        document.addEventListener("pointermove", move, { passive: false });
        document.addEventListener("pointerup", up);
        document.addEventListener("pointercancel", cancel);
        cancelDrag = cancel;
      });
    }

    function draw() {
      editor.textContent = "";
      const sheet = el("div", "protocol-sheet");
      sheet.appendChild(el("span", "protocol-label", "Сыскная канцелярия · Протокол №47"));
      const instructions = el("p", "assembly-help", d.done ? "Досье проверено. Все знаки на своих местах." : "Перетащите знак или выберите его и нажмите на пропуск. Нажмите ? без выбранного знака, чтобы открыть допрос.");
      sheet.appendChild(instructions);
      const toBank = el("button", "folder-jump", "К набору ↓");
      toBank.type = "button";
      toBank.addEventListener("click", () => {
        const bank = $(".glyph-bank", editor);
        bank.scrollIntoView({ block: "start", behavior: "auto" });
        bank.focus({ preventScroll: true });
      });
      sheet.appendChild(toBank);
      const witness = witnessOf(chapter);
      const figure = el("figure", "protocol-witness");
      const photo = el("img", "witness-photo");
      photo.src = witness.img;
      photo.alt = witness.name;
      figure.appendChild(photo);
      const caption = el("figcaption", "protocol-witness-caption");
      caption.appendChild(el("b", null, witness.name));
      caption.appendChild(el("span", null, witness.role));
      if (intro) caption.appendChild(el("p", "witness-quote", "«" + intro + "»"));
      figure.appendChild(caption);
      sheet.appendChild(figure);
      const text = el("div", "dossier-text");
      let position = 0;
      chapter.text.split(/【([a-z]+)】/g).forEach((piece, i) => {
        if (i % 2 === 0) {
          text.appendChild(document.createTextNode(piece));
          return;
        }
        const index = position++;
        const token = d.placed[index];
        const value = token === null ? "?" : tokenGlyph(token);
        const result = d.done || d.checked ? (token !== null && token === ids[index] ? " correct" : " incorrect") : "";
        const wrap = el("span", "slot-group");
        const slot = el("button", "slot assembly-slot" + (token !== null ? " occupied" : "") + result);
        slot.type = "button";
        slot.dataset.dropIndex = String(index);
        slot.disabled = d.done;
        slot.setAttribute("aria-label", "Пропуск " + (index + 1) + (token === null ? ", пусто" : ", знак " + value) + (result === " correct" ? ", верно" : result === " incorrect" ? ", неверно" : ""));
        const grip = el("span", "drag-grip hz", value);
        slot.appendChild(grip);
        if (token !== null && !d.done) bindTransfer(slot, token);
        slot.addEventListener("click", event => {
          if (event.detail !== 0 && Date.now() < suppressClickUntil) return;
          if (selected !== null && selected !== token) place(selected, index);
          else if (token !== null) choose(token);
          else openRoom(chapter, piece);
        });
        if (token === null) slot.setAttribute("aria-label", "Пропуск " + (index + 1) + ", открыть допрос");
        wrap.appendChild(slot);
        const number = el("span", "slot-number", String(index + 1).padStart(2, "0"));
        number.setAttribute("aria-hidden", "true");
        wrap.appendChild(number);
        text.appendChild(wrap);
      });
      sheet.appendChild(text);
      const photos = Array.isArray(chapter.photos) ? chapter.photos : [];
      if (photos.length) {
        const strip = el("div", "dossier-photos");
        strip.setAttribute("role", "group");
        strip.setAttribute("aria-label", "Фотографии по делу");
        const tilts = ["-5deg", "3deg", "-2deg"];
        photos.forEach((photo, i) => {
          const figure = el("figure", "dossier-photo");
          figure.style.setProperty("--tilt", tilts[i % tilts.length]);
          const frame = el("div", "photo-frame");
          frame.setAttribute("role", "img");
          frame.setAttribute("aria-label", photo.label || photo.caption || "Снимок по делу");
          frame.innerHTML = photoSvg(photo);
          figure.appendChild(frame);
          if (photo.caption) figure.appendChild(el("figcaption", "photo-caption", photo.caption));
          strip.appendChild(figure);
        });
        sheet.appendChild(strip);
      }
      editor.appendChild(sheet);
      {
        const bank = el("div", "glyph-bank");
        bank.tabIndex = -1;
        bank.setAttribute("role", "group");
        bank.setAttribute("aria-label", "Набор иероглифов. Сюда можно вернуть знак.");
        bank.appendChild(el("span", "bank-label", "Иероглифы дела"));
        bank.appendChild(el("span", "bank-subtitle", "Общий набор · " + LESSON_IDS.length + " знаков"));
        bank.appendChild(el("span", "bank-remaining", "В кассе: " + (LESSON_IDS.length - d.placed.filter(id => id !== null).length)));
        bank.appendChild(el("span", "bank-selection", d.done ? "Просмотр закрытого дела" : "Знак не выбран"));
        const toSheet = el("button", "folder-jump", "К пропускам ↑");
        toSheet.type = "button";
        toSheet.addEventListener("click", () => {
          const target = $(".assembly-slot:not(.occupied)", editor) || $(".assembly-slot", editor);
          sheet.scrollIntoView({ block: "start", behavior: "auto" });
          if (target) target.focus({ preventScroll: true });
        });
        bank.appendChild(toSheet);
        const legend = el("div", "bank-legend");
        legend.setAttribute("role", "group");
        legend.setAttribute("aria-label", "Цвета семейств ключей");
        const tiles = el("div", "bank-tiles");
        T.keys.forEach(key => {
          const label = el("span", "bank-legend-key hz", key.ch);
          label.dataset.key = key.ch;
          label.setAttribute("aria-label", "Ключ " + key.ch);
          legend.appendChild(label);
          d.order.filter(token => wordFamily(token) === key.ch && !d.placed.includes(token)).forEach(token => {
            const tile = el("button", "glyph-tile");
            tile.type = "button";
            tile.disabled = d.done;
            tile.dataset.key = key.ch;
            tile.setAttribute("aria-label", "Знак " + tokenGlyph(token) + ", ключ " + key.ch);
            tile.appendChild(el("span", "drag-grip hz", tokenGlyph(token)));
            const badge = el("span", "tile-key-badge hz", key.ch);
            badge.setAttribute("aria-hidden", "true");
            tile.appendChild(badge);
            bindTransfer(tile, token);
            tile.addEventListener("click", event => {
              if (event.detail === 0 || Date.now() >= suppressClickUntil) choose(token);
            });
            tiles.appendChild(tile);
          });
        });
        bank.appendChild(legend);
        bank.appendChild(tiles);
        const back = el("button", "bank-return", "Вернуть в набор");
        back.type = "button";
        back.disabled = selected === null || !d.placed.includes(selected);
        back.addEventListener("click", () => { if (selected !== null) returnToken(selected); });
        if (!d.done) bank.appendChild(back);
        editor.appendChild(bank);
      }
      const actions = el("div", "folder-actions");
      const count = d.placed.filter(n => n !== null).length;
      actions.appendChild(el("p", "assembly-count", "Заполнено " + count + " из " + ids.length + " · Допросов пройдено: " + Array.from(new Set(ids)).filter(isSolved).length + " (необязательно)"));
      if (!d.done && count < ids.length) actions.appendChild(el("p", "check-prompt", "Заполните все пропуски — появится проверка. Использовать все знаки из кассы не нужно."));
      editor.appendChild(actions);
      actions.appendChild(live);
      if (d.done) {
        const idx = T.chapters.indexOf(chapter);
        if (idx >= 0) {
          const seal = el("div", "folder-seal");
          seal.appendChild(el("span", "seal-digit", T.code[idx]));
          seal.appendChild(el("span", "seal-caption", "Досье проверено · " + starRow(chapterStars(chapter))));
          actions.appendChild(seal);
          const last = idx === T.chapters.length - 1;
          const nextBtn = el("button", "q-btn primary finale-continue next-chapter", last ? "Очная ставка →" : "Глава " + (idx + 2) + " · " + T.chapters[idx + 1].title + " →");
          nextBtn.type = "button";
          nextBtn.addEventListener("click", () => setHash(last ? "finale" : T.chapters[idx + 1].id));
          actions.appendChild(nextBtn);
        } else {
          const next = el("button", "q-btn primary finale-continue", "К перекрёстному допросу →");
          next.type = "button";
          next.addEventListener("click", openFinale);
          actions.appendChild(next);
        }
      }
      if (!d.done && count === ids.length) {
        const check = el("button", "q-btn primary dossier-check", "Проверить");
        check.type = "button";
        check.addEventListener("click", () => {
          const wrong = d.placed.filter((id, i) => id !== ids[i]).length;
          d.checked = true;
          d.errors += wrong;
          if (!wrong) d.done = true;
          save();
          selected = null;
          draw();
          announce(wrong ? "Есть ошибки. Красным отмечены неверные позиции, зелёным — верные. Исправьте расстановку и проверьте снова." : "Все знаки расставлены верно. Досье закрыто!");
          if (!wrong) {
            buildMenu();
            buildTopCode();
            const stamp = $(".dossier-stamp", container);
            if (stamp) { stamp.textContent = "Раскрыто"; stamp.classList.remove("open"); }
            const idx = T.chapters.indexOf(chapter);
            if (idx >= 0) revealDigit(idx);
            const nextBtn = $(".next-chapter", container);
            if (nextBtn) nextBtn.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        });
        actions.insertBefore(check, live);
      }
    }

    draw();
    if (d.checked && !d.done) announce("Есть ошибки в расстановке. Исправьте красные позиции и проверьте снова.");
    save();
  }

  function renderDossier(chapter) {
    const idx = T.chapters.indexOf(chapter);
    if (idx > 0 && !chapterDone(T.chapters[idx - 1])) { renderDesk(); return; }
    showZone("zone-" + chapter.id, chapter.id);
    buildMenu();
    buildTopCode();

    buildZoneHead($("#head-" + chapter.id));

    const paper = $("#dossier-" + chapter.id);
    paper.textContent = "";

    const head = el("div", "dossier-head");
    head.appendChild(el("span", "dossier-case-no", "Досье · Глава " + (idx + 1) + " из " + (T.chapters.length + 1) + " · " + chapter.title));
    head.appendChild(el("span", "dossier-stamp" + (chapterDone(chapter) ? "" : " open"), chapterDone(chapter) ? "Раскрыто" : "В работе"));
    paper.appendChild(head);

    buildDossierText(paper, chapter, chapter.intro);


  }

  function freshInterview(word) {
    return { step: 0, order: shuffle(word.options), questions: [], activeQuestion: null, key: null, version: null, rejected: [], wrongKeys: [], wrongParts: [], part: null, hint: false, compare: false, explained: false, mistakes: 0 };
  }

  function validateInterview(raw, word) {
    if (!raw || !Number.isInteger(raw.step) || raw.step < 0 || raw.step > 3) return null;
    if (!Array.isArray(raw.order) || raw.order.length !== word.options.length || new Set(raw.order).size !== word.options.length || !raw.order.every(id => word.options.includes(id))) return null;
    const d = freshInterview(word);
    d.order = raw.order.slice();
    d.key = word.key.includes(raw.key) ? raw.key : null;
    if (raw.step > 0 && !d.key) return null;
    d.version = word.options.includes(raw.version) ? raw.version : null;
    if (raw.step > 1 && T.words[d.version] !== word) return null;
    d.questions = Array.isArray(raw.questions) ? Array.from(new Set(raw.questions.filter(i => i === 0 || i === 1))) : [];
    d.activeQuestion = d.questions.includes(raw.activeQuestion) ? raw.activeQuestion : null;
    d.rejected = Array.isArray(raw.rejected) ? Array.from(new Set(raw.rejected.filter(id => word.options.includes(id) && T.words[id] !== word))) : [];
    d.wrongKeys = Array.isArray(raw.wrongKeys) ? Array.from(new Set(raw.wrongKeys.filter(ch => T.keys.some(k => k.ch === ch) && !word.key.includes(ch)))) : [];
    d.wrongParts = Array.isArray(raw.wrongParts) ? Array.from(new Set(raw.wrongParts.filter(i => Number.isInteger(i) && word.parts[i] && !(word.interview.answers[d.key] || []).includes(i)))) : [];
    d.part = Number.isInteger(raw.part) && (word.interview.answers[d.key] || []).includes(raw.part) ? raw.part : null;
    d.explained = raw.explained === true;
    if (raw.step === 3 && d.part === null && !d.explained) return null;
    if (d.part !== null && raw.step < 3) d.part = null;
    d.hint = raw.hint === true;
    d.compare = raw.compare === true;
    d.mistakes = Number.isInteger(raw.mistakes) && raw.mistakes >= 0 ? raw.mistakes : 0;
    d.step = raw.step;
    return d;
  }

  function openRoom(chapter, wordId) {
    showZone("zone-room", "room");
    buildMenu();
    const word = T.words[wordId];
    const draftId = chapter.id + ":" + wordId;
    let draft = state.interviews[draftId];
    if (!draft) {
      draft = freshInterview(word);
      if (isSolved(wordId)) {
        draft.key = word.key[0];
        draft.version = wordId;
        draft.part = word.interview.answers[draft.key][0];
        draft.step = 3;
      }
      state.interviews[draftId] = draft;
    }
    cur = { chapter: chapter, witness: witnessOf(chapter), wordId: wordId, word: word, draftId: draftId, draft: draft };
    renderRoom();
    if (draft.step === 3) playWord(word, $(".interview-audio"));
  }

  function roomBackTarget() {
    return cur.chapter.id === "fin" ? "finale" : cur.chapter.id;
  }

  function roomButton(parent, label, cls, action) {
    const button = el("button", cls || "study-button", label);
    button.type = "button";
    button.addEventListener("click", action);
    parent.appendChild(button);
    return button;
  }

  function refreshRoom(message, ok, focusId) {
    save();
    renderRoom();
    const feed = $("#interview-feedback");
    if (message) {
      feed.textContent = (ok ? "Верно. " : "Попробуем иначе. ") + message;
      feed.className = "study-feedback " + (ok ? "success" : "retry");
    }
    const target = focusId ? document.getElementById(focusId) : $("#interview-stage-title");
    if (target) target.focus({ preventScroll: true });
  }

  function finishInterview(explained) {
    const d = cur.draft;
    d.explained = explained;
    d.step = 3;
    if (!isSolved(cur.wordId)) state.solved[cur.wordId] = d.mistakes;
    refreshRoom();
    playWord(cur.word, $(".interview-audio"));
  }

  function renderRoom() {
    const mount = $("#room-mount");
    const word = cur.word;
    const d = cur.draft;
    mount.textContent = "";
    const top = el("div", "study-top");
    roomButton(top, "← В досье", "back-btn", () => setHash(roomBackTarget()));
    top.appendChild(el("span", "study-context", cur.chapter.title + " · Пропуск " + (dossierWords(cur.chapter).indexOf(cur.wordId) + 1)));
    mount.appendChild(top);
    const steps = el("ol", "study-steps");
    ["Расспросить", "Опознать", "Обосновать", "Показание"].forEach((label, i) => {
      const item = el("li", i === d.step ? "current" : i < d.step ? "complete" : "", (i < d.step ? "✓ " : (i + 1) + ". ") + label);
      if (i === d.step) item.setAttribute("aria-current", "step");
      steps.appendChild(item);
    });
    mount.appendChild(steps);
    const layout = el("div", "study-layout");
    const witness = el("aside", "study-witness");
    const portrait = el("img"); portrait.src = cur.witness.img; portrait.alt = cur.witness.name;
    witness.appendChild(portrait);
    witness.appendChild(el("h2", "study-witness-name", cur.witness.name));
    witness.appendChild(el("p", "study-role", cur.witness.role));
    const response = d.activeQuestion === null ? (d.step === 0 ? T.interview.greeting : word.wordHint) : word.interview.questions[d.activeQuestion];
    witness.appendChild(el("p", "study-speech", response));
    T.interview.questions.forEach((question, i) => {
      const button = roomButton(witness, question, "study-question" + (d.activeQuestion === i ? " active" : ""), () => {
        if (!d.questions.includes(i)) d.questions.push(i);
        d.activeQuestion = i;
        refreshRoom(null, true, "interview-question-" + i);
      });
      button.id = "interview-question-" + i;
      button.setAttribute("aria-pressed", String(d.activeQuestion === i));
    });
    if (d.questions.length) {
      const history = el("details", "study-history");
      history.appendChild(el("summary", null, "Ответы свидетеля (" + d.questions.length + ")"));
      d.questions.forEach(i => {
        history.appendChild(el("b", null, T.interview.questions[i]));
        history.appendChild(el("p", null, word.interview.questions[i]));
      });
      witness.appendChild(history);
    }
    witness.appendChild(el("p", "study-safe", "Помощь бесплатна. Ошибки здесь не влияют на звёзды досье."));
    layout.appendChild(witness);
    const work = el("section", "study-work");
    const title = el("h2", "study-title", ["Определите категорию", "Предъявите версию", "Докажите по составу", "Показание записано"][d.step]);
    title.id = "interview-stage-title"; title.tabIndex = -1;
    work.setAttribute("aria-labelledby", title.id);
    work.appendChild(el("span", "study-eyebrow", "Рабочий стол сыщика · Дело №47"));
    work.appendChild(title);
    if (d.step === 0) {
      work.appendChild(el("p", "study-lead", "Расспросите свидетеля или сразу выберите ключ. Ключ — ориентир в устройстве знака, а не всегда буквальный перевод слова."));
      const board = el("div", "study-keys");
      T.keys.forEach(k => {
        const rejected = d.wrongKeys.includes(k.ch);
        const button = roomButton(board, "", "study-key" + (d.key === k.ch ? " accepted" : rejected ? " rejected" : ""), () => {
          if (word.key.includes(k.ch)) {
            d.key = k.ch;
            refreshRoom("Категория «" + k.mean + "» подходит. Теперь можно перейти к опознанию.", true);
          } else {
            d.mistakes++;
            if (!d.wrongKeys.includes(k.ch)) d.wrongKeys.push(k.ch);
            refreshRoom("Ключ " + k.ch + " означает «" + k.mean + "». Сопоставьте его с показанием: " + word.keyHint, false);
          }
        });
        button.disabled = rejected;
        button.setAttribute("aria-pressed", String(d.key === k.ch));
        button.setAttribute("aria-label", "Ключ " + k.ch + (k.form !== k.ch ? " / " + k.form : "") + " — " + k.mean);
        button.dataset.key = k.ch;
        button.appendChild(el("span", "study-key-glyph hz", k.ch));
        button.appendChild(el("span", "study-key-form hz", k.form !== k.ch ? k.form : "—"));
      });
      work.appendChild(board);
      if (d.key) roomButton(work, "К опознанию →", "q-btn primary study-next", () => { d.step = 1; d.activeQuestion = 1; if (!d.questions.includes(1)) d.questions.push(1); refreshRoom(); });
    } else if (d.step === 1) {
      work.appendChild(el("p", "study-lead", word.wordHint));
      const lineup = el("div", "study-lineup");
      d.order.forEach(id => {
        const option = T.words[id];
        const button = roomButton(lineup, "", "study-version" + (d.version === id ? " selected" : "") + (d.rejected.includes(id) ? " rejected" : ""), () => {
          d.version = id;
          refreshRoom(null, true, "interview-version-" + id);
        });
        button.id = "interview-version-" + id;
        button.disabled = d.rejected.includes(id);
        button.setAttribute("aria-pressed", String(d.version === id));
        if (option.key && option.key.length) button.dataset.key = option.key[0];
        button.appendChild(el("span", "hz", option.ch));
        button.appendChild(el("small", null, d.rejected.includes(id) ? "Версия отклонена" : "Выбрать версию"));
      });
      work.appendChild(lineup);
      const confirm = roomButton(work, "Предъявить версию", "q-btn primary study-confirm", () => {
        if (!d.version || d.rejected.includes(d.version)) return;
        if (d.version === cur.wordId) {
          d.step = 2;
          refreshRoom("Знак опознан. Теперь найдите в нём выбранный ключ.", true);
        } else {
          const option = T.words[d.version];
          d.mistakes++;
          d.rejected.push(d.version);
          d.version = null;
          refreshRoom(option.ch + " означает «" + option.mean + "». Состав: " + option.parts.map(p => p.t).join(" + ") + ". Сверьте значение с репликой свидетеля.", false);
        }
      });
      confirm.disabled = d.version === null || d.rejected.includes(d.version);
      const helpers = el("div", "study-helpers");
      const hint = roomButton(helpers, "Попросить уточнение", "study-button", () => { d.hint = true; refreshRoom(null, true, "interview-hint"); });
      hint.id = "interview-hint";
      const compare = roomButton(helpers, "Сравнить варианты", "study-button", () => { d.compare = true; refreshRoom(null, true, "interview-compare"); });
      compare.id = "interview-compare";
      work.appendChild(helpers);
      if (d.hint) work.appendChild(el("p", "study-explanation", word.extraHint));
      if (d.compare) work.appendChild(el("p", "study-explanation", word.interview.comparison));
    } else if (d.step === 2) {
      const k = T.keys.find(x => x.ch === d.key);
      work.appendChild(el("p", "study-lead", "Какая часть соответствует ключу " + k.ch + " («" + k.mean + "»)? Выберите её в схеме состава."));
      work.appendChild(el("div", "study-hero hz", word.ch));
      const parts = el("div", "study-parts " + word.interview.layout);
      word.parts.forEach((part, i) => {
        const button = roomButton(parts, part.t, "study-part hz" + (d.wrongParts.includes(i) ? " rejected" : ""), () => {
          if (word.interview.answers[d.key].includes(i)) {
            d.part = i;
            finishInterview(false);
          } else {
            d.mistakes++;
            if (!d.wrongParts.includes(i)) d.wrongParts.push(i);
            refreshRoom("Это другая часть: " + part.t + (part.sub ? " — " + part.sub : "") + ". Она не совпадает с выбранным ключом " + k.ch + " / " + k.form + ".", false);
          }
        });
        button.disabled = d.wrongParts.includes(i);
        button.setAttribute("aria-label", "Часть " + (i + 1) + ": " + part.t);
      });
      work.appendChild(parts);
      work.appendChild(el("p", "study-caption", "Учебная схема частей, не порядок написания черт."));
      roomButton(work, "Показать разбор", "study-button study-reveal-help", () => { finishInterview(true); });
    } else {
      work.appendChild(el("div", "study-record-stamp", "Показание записано"));
      work.appendChild(el("div", "study-hero hz", word.ch));
      work.appendChild(el("p", "study-pinyin tone-" + word.t, word.py));
      work.appendChild(el("p", "study-meaning", word.mean));
      roomButton(work, "Послушать «" + word.py + "»", "audio-btn interview-audio", event => playWord(word, event.currentTarget));
      const parts = el("div", "study-parts record-parts " + word.interview.layout);
      word.parts.forEach((part, i) => {
        const chip = el("span", "study-part hz" + ((word.interview.answers[d.key] || []).includes(i) ? " accepted" : ""), part.t);
        if (part.sub) chip.appendChild(el("small", null, part.sub));
        parts.appendChild(chip);
      });
      work.appendChild(parts);
      work.appendChild(el("p", "study-explanation", word.note));
      work.appendChild(el("p", "study-caption", d.explained ? "Разбор изучен с помощью. Это не снижает звёзды." : "Ключ найден и обоснован. Это показание можно использовать при сборке протокола."));
      roomButton(work, "Вернуться к протоколу", "q-btn primary study-return", () => setHash(roomBackTarget()));
      roomButton(work, "Разобрать ещё раз", "study-button study-restart", () => {
        cur.draft = freshInterview(word);
        state.interviews[cur.draftId] = cur.draft;
        refreshRoom();
      });
    }
    const feedback = el("p", "study-feedback");
    feedback.id = "interview-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    work.appendChild(feedback);
    layout.appendChild(work);
    const notebook = el("details", "study-notebook");
    notebook.open = !window.matchMedia("(max-width: 900px)").matches;
    notebook.appendChild(el("summary", null, "Блокнот сыщика"));
    const chosenKey = T.keys.find(k => k.ch === d.key);
    [
      ["Категория", chosenKey ? chosenKey.ch + " / " + chosenKey.form + " · " + chosenKey.mean : "Пока не установлена"],
      ["Знак", d.step >= 2 ? word.ch : "Версия ещё не подтверждена"],
      ["Обоснование", d.step === 3 ? (d.explained ? "Изучен разбор" : "Ключ найден в составе") : "Предстоит проверить"]
    ].forEach(([label, value]) => {
      const entry = el("div", "notebook-entry");
      entry.appendChild(el("span", null, label));
      entry.appendChild(el("strong", null, value));
      notebook.appendChild(entry);
    });
    notebook.appendChild(el("p", "study-caption", "Допрос не заполняет досье автоматически. Вернитесь и расставьте знаки самостоятельно."));
    layout.appendChild(notebook);
    mount.appendChild(layout);
    save();
  }

  function openFinale() {
    if (!allChaptersDone()) { renderDesk(); return; }
    showZone("zone-finale", "finale");
    buildMenu();
    buildTopCode();

    const head = $("#head-fin");
    const mount = $("#finale-mount");
    mount.textContent = "";
    const finIntro = "Финальный акт, помощник. Досье почти собрано: последнее слово, перекрёстный допрос, записка с подделкой — и обвинение.";
    buildZoneHead(head);

    if (state.caseDone) { renderVerdict(mount); return; }

    if (!chapterDone(T.finaleChapter)) {
      const step = el("div", "fin-step");
      step.appendChild(el("h3", "fin-title", "Шаг 1 · Последнее слово"));
      const lead = el("p", "fin-lead", "Собери финальный рапорт из набора и нажми «Проверить». Допрос инспектора доступен как необязательная помощь.");
      step.appendChild(lead);
      const paper = el("div", "dossier");
      const dhead = el("div", "dossier-head");
      dhead.appendChild(el("span", "dossier-case-no", "Досье · Финал · Очная ставка"));
      dhead.appendChild(el("span", "dossier-stamp open", "В работе"));
      paper.appendChild(dhead);
      buildDossierText(paper, T.finaleChapter, finIntro);
      step.appendChild(paper);
      mount.appendChild(step);
      return;
    }

    if (!state.finale.cross.every(Boolean)) {
      const step = el("div", "fin-step");
      step.appendChild(el("h3", "fin-title", "Шаг 2 · Перекрёстный допрос"));
      step.appendChild(el("p", "fin-lead", "Четверо повторяют свои показания. Вставь пропущенный глагол: выбери верный знак на месте прочерка."));
      T.crossExam.forEach((q, qi) => {
        const w = T.words[q.answer];
        const card = el("div", "cross-card");
        const s = T.suspects.find(x => x.id === q.who);
        const img = el("img"); img.src = s.img; img.alt = s.name;
        card.appendChild(img);
        const side = el("div");
        const say = el("div", "cross-say");
        const bits = q.say.split("___");
        say.appendChild(document.createTextNode(s.name + ": «" + (bits[0] || "")));
        const blank = el("span", "blank", state.finale.cross[qi] ? w.ch : "?");
        blank.setAttribute("aria-label", "Пропуск в показаниях");
        say.appendChild(blank);
        say.appendChild(document.createTextNode((bits[1] || "") + "»"));
        side.appendChild(say);
        if (state.finale.cross[qi]) {
          const meta = el("div", "cross-say");
          const py = el("span", null, w.py + " — " + w.mean);
          py.classList.add("tone-" + w.t);
          meta.appendChild(py);
          const ab = el("button", "audio-btn", "♪ прослушать");
          ab.type = "button";
          ab.style.minHeight = "28px";
          ab.addEventListener("click", () => playWord(w, ab));
          meta.appendChild(ab);
          side.appendChild(meta);
        } else {
          const opts = el("div", "cross-opts");
          shuffle(q.options).forEach(oid => {
            const o = T.words[oid];
            const b = el("button", "chip-opt hz", o.ch);
            b.type = "button";
            b.addEventListener("click", () => {
              if (oid === q.answer) {
                state.finale.cross[qi] = true;
                save();
                openFinale();
              } else {
                finaleErrors++;
                b.classList.add("wrong");
                b.disabled = true;
                feedFinale(step, "Мимо! «" + o.ch + " " + o.py + "» здесь не подходит.");
              }
            });
            opts.appendChild(b);
          });
          side.appendChild(opts);
        }
        card.appendChild(side);
        step.appendChild(card);
      });
      mount.appendChild(step);
      return;
    }

    if (!state.finale.note) {
      const step = el("div", "fin-step");
      step.appendChild(el("h3", "fin-title", "Шаг 3 · Записка с подделкой"));
      const note = el("div", "note-card");
      note.appendChild(el("div", "note-text", T.note.header + ": " + T.note.text));
      note.appendChild(el("p", "fin-lead", T.note.question));
      const grid = el("div", "sig-grid");
      T.note.signatures.forEach(sig => {
        const s = T.suspects.find(x => x.id === sig.who);
        const tile = el("button", "sig-tile hz");
        tile.type = "button";
        sig.parts.forEach(p => {
          const sp = el("span", "s-part", p.t);
          tile.appendChild(sp);
        });
        tile.appendChild(el("small", null, s.name));
        tile.addEventListener("click", () => {
          if (sig.forged) {
            tile.classList.add("right");
            sig.parts.forEach((p, i) => { if (!p.ok) tile.children[i].classList.add("bad-key"); });
            state.finale.note = true;
            save();
            const rev = el("p", "note-reveal", T.note.reveal);
            step.appendChild(rev);
            rev.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(openFinale, 3000);
          } else {
            finaleErrors++;
            tile.classList.add("wrong");
            tile.disabled = true;
            feedFinale(step, "Эта подпись честная. Ищи ключ, который тут ни к селу ни к городу.");
          }
        });
        grid.appendChild(tile);
      });
      note.appendChild(grid);
      step.appendChild(note);
      mount.appendChild(step);
      return;
    }

    if (!state.finale.accused) {
      const step = el("div", "fin-step");
      step.appendChild(el("h3", "fin-title", "Шаг 4 · Обвинение"));
      step.appendChild(el("p", "fin-lead", "Улики в руках: заячьи следы у моста, креветочный запах, записка с ключом воды в подписи 快 — а заяц клялся, что к воде не подходил. Назови виновного!"));
      const grid = el("div", "accuse-grid");
      T.suspects.forEach(s => {
        const card = el("button", "accuse-card");
        card.type = "button";
        const img = el("img"); img.src = s.img; img.alt = "";
        card.appendChild(img);
        card.appendChild(el("div", "s-name", s.name));
        card.appendChild(el("div", "s-role", s.role));
        card.addEventListener("click", () => {
          if (s.id === T.culprit) {
            card.classList.add("right-pick");
            state.finale.accused = T.culprit;
            state.finale.done = true;
            state.caseDone = true;
            save();
            litDigits = T.code.length;
            renderTop();
            document.querySelectorAll("#code-track .digit-slot").forEach(sl => sl.classList.add("flip"));
            setTimeout(openFinale, 500);
          } else {
            finaleErrors++;
            card.classList.add("wrong-pick");
            setTimeout(() => card.classList.remove("wrong-pick"), 500);
            feedFinale(step, T.accuseWrong);
          }
        });
        grid.appendChild(card);
      });
      step.appendChild(grid);
      mount.appendChild(step);
      return;
    }

    renderVerdict(mount);
  }

  function feedFinale(step, text) {
    let feed = step.querySelector(".feed");
    if (!feed) { feed = el("p", "feed bad"); step.appendChild(feed); }
    feed.textContent = text;
    feed.className = "feed bad";
  }

  function renderVerdict(mount) {
    const guilty = T.suspects.find(s => s.id === T.culprit);
    const step = el("div", "fin-step");

    const panel = el("div", "verdict-panel");
    panel.appendChild(el("h3", null, "Дело закрыто!"));
    panel.appendChild(el("p", "v-text", T.accuseRight));

    const row = el("div", "verdict-guilty");
    const img = el("img"); img.src = guilty.img; img.alt = guilty.name;
    row.appendChild(img);
    const who = el("div", "v-who");
    who.appendChild(el("b", null, guilty.name + " — виновен!"));
    who.appendChild(el("span", null, guilty.role + ". Признание: «Я всё сделал сам: оставил записку с 错, мешок спрятал под мостом, а подпись… подпись просто спешил написать!»"));
    row.appendChild(who);
    panel.appendChild(row);

    const code = el("div", "finale-code");
    code.appendChild(el("span", "finale-code-label", T.codeLabel + " · запомни его"));
    const digits = el("div", "finale-code-digits");
    T.code.split("").forEach(d => digits.appendChild(el("span", null, d)));
    code.appendChild(digits);
    panel.appendChild(code);

    panel.appendChild(el("p", "v-text", "Ошибок на очной ставке: " + finaleErrors + ". Звёзды глав: " + T.chapters.map(c => starRow(chapterStars(c))).join(" · ") + ". " + T.doneNote));

    const crew = el("div", "finale-crew");
    [T.detective].concat(T.suspects).forEach(s => {
      const span = el("span");
      const im = el("img"); im.src = s.img; im.alt = s.name;
      span.appendChild(im);
      span.appendChild(el("span", null, s.name));
      crew.appendChild(span);
    });
    panel.appendChild(crew);

    const actions = el("div", "rv-actions");
    const back = el("button", "q-btn", "Вернуться к столу детектива");
    back.type = "button";
    back.addEventListener("click", () => setHash("desk"));
    actions.appendChild(back);
    panel.appendChild(actions);

    step.appendChild(panel);
    mount.textContent = "";
    mount.appendChild(step);
    buildMenu();
  }

  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Начать дело заново? Весь прогресс досье, улики и печати будут потеряны.")) return;
    try { localStorage.removeItem(T.storageKey); } catch (e) {}
    state = freshState();
    cur = null;
    finaleErrors = 0;
    litDigits = 0;
    if (location.hash) location.hash = "desk";
    renderDesk();
  });

  window.addEventListener("hashchange", route);
  route();
  save();
})();
