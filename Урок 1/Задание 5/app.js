window.KEYGAME_APP = (function () {
  'use strict';

  var D = window.KEYGAME_DATA;
  var E = window.KEYGAME_ENGINE;

  var STORAGE_KEY = 'lesson1-task5-campaign';

  var state = null;
  var selectedHeroId = null;
  var campaign = {
    completedStages: [],
    heroId: null,
    stats: { correct: 0, wrong: 0, assembled: 0, learned: {}, mistakes: {} }
  };
  var storageOk = true;
  var seedParam = null;
  try {
    var sp = new URLSearchParams(window.location.search).get('seed');
    if (sp && /^\d+$/.test(sp)) {
      seedParam = parseInt(sp, 10);
    }
  } catch (err) { }
  var rng = E.createRng((seedParam !== null ? seedParam : Date.now()) & 0xffffffff);
  var busy = false;
  var pendingQuestion = null;
  var currentQuestion = null;
  var drag = null;
  var selectedCardUid = null;
  var selectedComponents = [];
  var selectedAttackerUid = null;
  var powerTargeting = false;
  var timerId = null;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var el = {};

  function cacheDom() {
    var ids = [
      'screen-select', 'screen-map', 'screen-game', 'heroGrid', 'startMatch', 'soundToggle',
      'turnLabel', 'timer', 'endTurnBtn', 'battlefield', 'enemyBoard', 'playerBoard',
      'enemyPortrait', 'enemyName', 'enemyPowerName', 'enemyHp', 'enemyShield',
      'enemyMana', 'enemyDeck', 'enemyHand', 'playerPortrait', 'playerName',
      'playerHp', 'playerShield', 'playerMana', 'playerDeck', 'powerBtn',
      'powerCost', 'powerName', 'hand', 'questionModal', 'questionKind',
      'questionHanzi', 'questionTitle', 'questionOptions', 'questionFeedback',
      'feedbackLine', 'wordHanzi', 'wordPinyin', 'wordRu', 'wordNote',
      'pronounceBtn', 'feedbackClose', 'questionCancel', 'questionActions', 'endModal', 'endTitle',
      'endReason', 'endStats', 'endWords', 'rematchBtn', 'mapBtn', 'changeHeroBtn',
      'mapPath', 'mapProgress', 'resetProgressBtn', 'changeHeroFromMap',
      'finishCode', 'mapFinishCode',
      'toast', 'dragLayer', 'arrowLayer', 'dropZoneNone', 'rules', 'rulesLink', 'rulesClose'
    ];
    for (var i = 0; i < ids.length; i += 1) {
      el[ids[i]] = document.getElementById(ids[i]);
    }
  }

  function g(id) {
    return el[id];
  }

  function loadCampaign() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          if (Array.isArray(saved.completedStages)) {
            saved.completedStages.forEach(function (id) {
              if (D.STAGES.some(function (s) { return s.id === id; }) &&
                campaign.completedStages.indexOf(id) === -1) {
                campaign.completedStages.push(id);
              }
            });
          }
          if (saved.heroId && D.PLAYERS.some(function (h) { return h.id === saved.heroId; })) {
            campaign.heroId = saved.heroId;
          }
          if (saved.stats) {
            campaign.stats.correct = saved.stats.correct || 0;
            campaign.stats.wrong = saved.stats.wrong || 0;
            campaign.stats.assembled = saved.stats.assembled || saved.stats.fusions || 0;
            campaign.stats.learned = saved.stats.learned || {};
            campaign.stats.mistakes = saved.stats.mistakes || {};
          }
        }
      }
    } catch (err) {
      storageOk = false;
    }
  }

  function saveCampaign() {
    if (!storageOk) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    } catch (err) {
      storageOk = false;
    }
  }

  function resetCampaign() {
    campaign.completedStages = [];
    campaign.heroId = selectedHeroId;
    campaign.stats = { correct: 0, wrong: 0, assembled: 0, learned: {}, mistakes: {} };
    saveCampaign();
    renderMap();
    toast('Прогресс похода сброшен');
  }

  var toastTimer = null;

  function toast(message) {
    var node = g('toast');
    node.textContent = message;
    node.hidden = false;
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      node.hidden = true;
    }, 2600);
  }

  var sound = { enabled: true, ctx: null, failed: false };

  function audioCtx() {
    if (!sound.enabled || sound.failed) {
      return null;
    }
    if (!sound.ctx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        return null;
      }
      try {
        sound.ctx = new Ctx();
      } catch (err) {
        sound.failed = true;
        sound.ctx = null;
        return null;
      }
    }
    try {
      if (sound.ctx.state === 'suspended') {
        sound.ctx.resume();
      }
    } catch (err) { }
    return sound.ctx;
  }

  function tone(freq, dur, type, gain, delay) {
    if (!sound.enabled || sound.failed) {
      return;
    }
    try {
      var ctx = audioCtx();
      if (!ctx) {
        return;
      }
      var t0 = ctx.currentTime + (delay || 0);
      var osc = ctx.createOscillator();
      var gn = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      gn.gain.setValueAtTime(0.0001, t0);
      gn.gain.exponentialRampToValueAtTime(gain || 0.05, t0 + 0.012);
      gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gn);
      gn.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch (err) {
      sound.failed = true;
    }
  }

  var sfx = {
    click: function () { tone(520, 0.05, 'square', 0.035); },
    select: function () { tone(620, 0.06, 'triangle', 0.05); tone(780, 0.07, 'triangle', 0.045, 0.05); },
    deselect: function () { tone(420, 0.06, 'triangle', 0.04); },
    questionOpen: function () { tone(523, 0.07, 'sine', 0.05); tone(659, 0.09, 'sine', 0.04, 0.06); },
    play: function () { tone(392, 0.1); tone(523, 0.14, 'square', 0.05, 0.09); },
    wrong: function () { tone(146, 0.22, 'sawtooth', 0.06); tone(110, 0.26, 'sawtooth', 0.05, 0.12); },
    attack: function () { tone(220, 0.08, 'sawtooth', 0.06); tone(130, 0.12, 'sawtooth', 0.05, 0.06); },
    damage: function () { tone(98, 0.14, 'square', 0.06); tone(74, 0.1, 'square', 0.045, 0.1); },
    death: function () { tone(200, 0.3, 'triangle', 0.05); tone(90, 0.4, 'triangle', 0.05, 0.12); },
    heal: function () { tone(523, 0.1, 'triangle', 0.05); tone(659, 0.12, 'triangle', 0.05, 0.09); },
    buff: function () { tone(440, 0.08, 'triangle', 0.05); tone(587, 0.1, 'triangle', 0.05, 0.07); },
    shield: function () { tone(330, 0.12, 'sine', 0.06); tone(440, 0.12, 'sine', 0.05, 0.1); },
    summon: function () { tone(160, 0.12, 'square', 0.05); tone(240, 0.1, 'square', 0.04, 0.08); },
    spell: function () { tone(660, 0.08, 'triangle', 0.05); tone(880, 0.08, 'triangle', 0.04, 0.06); tone(1100, 0.1, 'triangle', 0.04, 0.12); },
    assembly: function () { tone(392, 0.09, 'triangle', 0.05); tone(523, 0.09, 'triangle', 0.05, 0.08); tone(659, 0.09, 'triangle', 0.05, 0.16); tone(880, 0.12, 'triangle', 0.05, 0.24); tone(1174, 0.16, 'triangle', 0.045, 0.34); },
    turn: function () { tone(392, 0.09, 'triangle', 0.05); },
    win: function () { tone(523, 0.14); tone(659, 0.14, 'square', 0.05, 0.13); tone(784, 0.16, 'square', 0.05, 0.26); tone(1046, 0.28, 'triangle', 0.05, 0.4); },
    lose: function () { tone(330, 0.16, 'sawtooth', 0.05); tone(262, 0.18, 'sawtooth', 0.05, 0.15); tone(196, 0.3, 'sawtooth', 0.05, 0.32); tone(147, 0.35, 'sawtooth', 0.045, 0.45); }
  };

  var speech = { synth: window.speechSynthesis || null, voice: null, ready: false };

  function pickVoice() {
    if (!speech.synth) {
      return;
    }
    var voices = speech.synth.getVoices() || [];
    for (var i = 0; i < voices.length; i += 1) {
      if (voices[i].lang && voices[i].lang.toLowerCase().indexOf('zh') === 0) {
        speech.voice = voices[i];
        speech.ready = true;
        return;
      }
    }
    speech.ready = false;
  }

  if (speech.synth) {
    pickVoice();
    if (typeof speech.synth.addEventListener === 'function') {
      speech.synth.addEventListener('voiceschanged', pickVoice);
    }
  }

  function speak(text) {
    if (!speech.synth) {
      toast('Произношение недоступно: браузер не поддерживает синтез речи');
      return;
    }
    if (!speech.ready) {
      pickVoice();
    }
    if (!speech.ready) {
      toast('Китайский голос не найден в системе');
      return;
    }
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.voice = speech.voice;
      u.lang = speech.voice.lang;
      u.rate = 0.85;
      speech.synth.cancel();
      speech.synth.speak(u);
    } catch (err) {
      toast('Не удалось произнести слово');
    }
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, reducedMotion ? 0 : ms);
    });
  }

  function fmtTime(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function findMinionByUid(uid) {
    var sides = [state.player, state.ai];
    for (var s = 0; s < sides.length; s += 1) {
      for (var i = 0; i < sides[s].board.length; i += 1) {
        if (sides[s].board[i] && sides[s].board[i].uid === uid) {
          return sides[s].board[i];
        }
      }
    }
    return null;
  }

  function getCardByUid(uid) {
    var found = null;
    state.player.hand.forEach(function (c) {
      if (c.uid === uid) {
        found = c;
      }
    });
    return found;
  }

  function minionEl(uid) {
    return document.querySelector('.minion[data-uid="' + uid + '"]');
  }

  function heroRowEl(which) {
    return document.querySelector('.hero-row[data-hero="' + which + '"]');
  }

  var spellTargetAnchors = new WeakMap();

  function targetElOf(target) {
    if (!target) {
      return null;
    }
    if (target.isMinion) {
      var node = minionEl(target.uid);
      var anchor = spellTargetAnchors.get(target);
      if (!node && anchor) {
        var board = g(anchor.side === 'player' ? 'playerBoard' : 'enemyBoard');
        node = board.children[anchor.slot] || null;
      }
      return node;
    }
    if (target === state.player) {
      return heroRowEl('player');
    }
    if (target === state.ai) {
      return heroRowEl('ai');
    }
    return null;
  }

  function centerOf(node) {
    var r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function spawnFx(node, cls, ttl) {
    if (!node) {
      return;
    }
    node.classList.add(cls);
    setTimeout(function () {
      node.classList.remove(cls);
    }, ttl || 700);
  }

  function shakeBattlefield() {
    if (reducedMotion) {
      return;
    }
    spawnFx(g('battlefield'), 'anim-shake', 380);
  }

  function rippleAt(target, kind) {
    if (reducedMotion || !target) {
      return;
    }
    var node = targetElOf(target);
    if (!node) {
      return;
    }
    var rect = node.getBoundingClientRect();
    var span = document.createElement('span');
    span.className = 'hit-ripple hit-ripple--' + (kind || 'dmg');
    span.style.left = (rect.left + rect.width / 2 - 30) + 'px';
    span.style.top = (rect.top + rect.height / 2 - 30) + 'px';
    document.body.appendChild(span);
    setTimeout(function () {
      if (span.parentNode) {
        span.parentNode.removeChild(span);
      }
    }, 650);
  }

  function floatNumber(target, amount, kind) {
    var node = targetElOf(target);
    if (!node) {
      return;
    }
    var rect = node.getBoundingClientRect();
    var span = document.createElement('span');
    span.className = 'float-num float-num--' + kind;
    span.textContent = String(amount);
    span.style.left = (rect.left + rect.width / 2 - 12 + (Math.random() * 16 - 8)) + 'px';
    span.style.top = (rect.top + rect.height * 0.3) + 'px';
    document.body.appendChild(span);
    setTimeout(function () {
      if (span.parentNode) {
        span.parentNode.removeChild(span);
      }
    }, 950);
  }

  function clearArrow() {
    var layer = g('arrowLayer');
    while (layer.firstChild) {
      layer.removeChild(layer.firstChild);
    }
  }

  function drawArrow(from, to) {
    clearArrow();
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    var nx = -dy / len;
    var ny = dx / len;
    var bend = 26;
    var d = 'M ' + from.x + ' ' + from.y +
      ' Q ' + (from.x + dx / 2 + nx * bend) + ' ' + (from.y + dy / 2 + ny * bend) +
      ' ' + to.x + ' ' + to.y;
    path.setAttribute('d', d);
    g('arrowLayer').appendChild(path);
  }

  function renderHeroSelect() {
    var grid = g('heroGrid');
    grid.innerHTML = '';
    D.PLAYERS.forEach(function (hero) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'hero-card';
      card.dataset.heroId = hero.id;
      card.setAttribute('aria-pressed', 'false');
      card.innerHTML =
        '<img class="portrait" src="' + hero.portrait + '" alt="Портрет героя ' + hero.name + '">' +
        '<h3>' + hero.name + '</h3>' +
        '<p class="hero-title">' + hero.title + '</p>' +
        '<p class="hero-power"><b>' + hero.power.name + '</b> (' + hero.power.mana + ' маны): ' + hero.power.desc + '</p>';
      card.addEventListener('click', function () {
        sfx.click();
        selectedHeroId = hero.id;
        campaign.heroId = hero.id;
        saveCampaign();
        Array.prototype.forEach.call(grid.children, function (c) {
          c.classList.toggle('is-selected', c === card);
          c.setAttribute('aria-pressed', c === card ? 'true' : 'false');
        });
        g('startMatch').disabled = false;
      });
      if (campaign.heroId === hero.id) {
        selectedHeroId = hero.id;
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');
        g('startMatch').disabled = false;
      }
      grid.appendChild(card);
    });
  }

  function renderMap() {
    var path = g('mapPath');
    path.innerHTML = '';
    var firstOpen = null;
    D.STAGES.forEach(function (stage) {
      if (firstOpen === null && campaign.completedStages.indexOf(stage.id) === -1) {
        firstOpen = stage.id;
      }
    });
    var allDone = firstOpen === null;
    g('mapFinishCode').hidden = !allDone;
    D.STAGES.forEach(function (stage) {
      var done = campaign.completedStages.indexOf(stage.id) !== -1;
      var open = !done && stage.id === firstOpen;
      var node = document.createElement('button');
      node.type = 'button';
      node.className = 'map-node' + (done ? ' is-done' : '') + (open ? ' is-open' : '') + (!done && !open ? ' is-locked' : '');
      node.dataset.stage = stage.id;
      node.disabled = !open;
      var stateLabel = done ? 'Пройден' : (open ? 'Открыт — в бой!' : 'Закрыт');
      node.innerHTML =
        '<span class="map-node-num">' + stage.index + '</span>' +
        '<img class="map-node-portrait" src="' + stage.portrait + '" alt="Портрет стража ' + stage.name + '">' +
        '<span class="map-node-name">' + stage.name + '</span>' +
        '<span class="map-node-title">' + stage.title + '</span>' +
        '<span class="map-node-hp">' + stage.hp + ' HP</span>' +
        '<span class="map-node-power">' + stage.powerName + '</span>' +
        '<q class="map-node-quote">' + stage.quote + '</q>' +
        '<span class="map-node-state">' + stateLabel + '</span>';
      if (open) {
        node.addEventListener('click', function () {
          sfx.click();
          startStage(stage.id);
        });
      }
      path.appendChild(node);
    });
    var hero = selectedHeroId ? D.PLAYERS.filter(function (h) { return h.id === selectedHeroId; })[0] : null;
    var total = campaign.stats.correct + campaign.stats.wrong;
    var accuracy = total > 0 ? Math.round(campaign.stats.correct / total * 100) : 0;
    var lines = [
      'Пройдено этапов: ' + campaign.completedStages.length + ' из ' + D.STAGES.length +
      (hero ? ' · герой: ' + hero.name : ''),
      'Собрано знаков за поход: ' + campaign.stats.assembled + ' · точность ответов: ' + accuracy + '%'
    ];
    if (allDone) {
      lines.unshift('Поход пройден! Все стражи повержены. Можно начать заново — сбросьте прогресс.');
    }
    if (!storageOk) {
      lines.push('Хранилище браузера недоступно: прогресс не сохранится между визитами.');
    }
    g('mapProgress').innerHTML = '';
    lines.forEach(function (text) {
      var p = document.createElement('p');
      p.textContent = text;
      g('mapProgress').appendChild(p);
    });
  }

  function render() {
    if (!state) {
      return;
    }
    renderHeroes();
    renderBoard(g('enemyBoard'), state.ai, 'ai');
    renderBoard(g('playerBoard'), state.player, 'player');
    renderHand();
    renderBar();
  }

  function renderMana(el, mana, max) {
    el.textContent = '';
    el.title = 'мана ' + mana + '/' + max;
    el.setAttribute('aria-label', 'мана ' + mana + '/' + max);
    for (var i = 0; i < max; i += 1) {
      var crystal = document.createElement('span');
      crystal.className = i < mana ? 'crystal crystal--full' : 'crystal';
      el.appendChild(crystal);
    }
  }

  function renderHeroes() {
    var p = state.player;
    var a = state.ai;
    g('playerPortrait').src = p.heroPortrait;
    g('playerPortrait').alt = 'Портрет вашего героя ' + p.heroName;
    g('playerName').textContent = p.heroName;
    g('playerHp').textContent = String(p.hp);
    g('playerShield').hidden = p.shield <= 0;
    g('playerShield').textContent = 'щит ' + p.shield;
    renderMana(g('playerMana'), p.mana, p.maxMana);
    g('playerDeck').textContent = 'колода ' + p.deck.length;
    g('powerCost').textContent = p.power.mana;
    g('powerName').textContent = p.power.name;
    g('powerBtn').title = p.power.name + ': ' + p.power.desc;
    g('powerBtn').disabled = busy || state.over || state.turn !== 'player' || !E.canUsePower(state) || powerTargeting;

    g('enemyPortrait').src = a.heroPortrait;
    g('enemyPortrait').alt = 'Портрет стража ' + a.heroName;
    g('enemyName').textContent = a.heroName + ' · ' + a.heroTitle;
    g('enemyPowerName').textContent = 'сила: ' + a.power.name;
    g('enemyHp').textContent = String(a.hp);
    g('enemyShield').hidden = a.shield <= 0;
    g('enemyShield').textContent = 'щит ' + a.shield;
    renderMana(g('enemyMana'), a.mana, a.maxMana);
    g('enemyDeck').textContent = 'колода ' + a.deck.length;
    g('enemyHand').textContent = 'рука ' + a.hand.length;
  }

  function renderBoard(container, side, which) {
    container.innerHTML = '';
    var filled = [];
    for (var f = 0; f < side.board.length; f += 1) {
      if (side.board[f]) {
        filled.push(f);
      }
    }
    var center = (filled.length - 1) / 2;
    for (var i = 0; i < side.board.length; i += 1) {
      var m = side.board[i];
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.drop = 'slot-' + i;
      cell.setAttribute('aria-label', 'Ячейка ' + (i + 1) + (m ? ', занята бойцом' : ', свободна'));
      if (m) {
        var pos = filled.indexOf(i);
        var rot = (pos - center) * 5;
        var lift = Math.abs(pos - center);
        var y = Math.round(lift * lift * 6 / Math.max(1, center * center || 1));
        cell.style.setProperty('--arc-rot', rot + 'deg');
        cell.style.setProperty('--arc-y', y + 'px');
        cell.appendChild(renderMinion(m, which));
      }
      container.appendChild(cell);
    }
  }

  function cardEmblem(type) {
    var drawings = {
      minion: '<path fill="#cbd4d0" d="M17 2h6v17h-6zM13 6h4v9h-4zM23 6h4v9h-4z"/><path fill="#f4cc85" d="M11 20h18v4H11zM18 24h4v9h-4zM15 33h10v4H15z"/><path fill="#577681" d="M17 4h3v15h-3z"/>',
      key: '<path fill="#80e5dc" d="M6 8h14v6H6zM20 10h8v4h-8zM28 10h6v6h-6v-2h-2v-2h2z"/><path fill="#f0c980" d="M24 16h4v4h4v4h-4v4h4v4h-4v-4h-4v-4h-4v4h-4v-4h-4v-4h4v4h4v-4h4z" transform="translate(2 -4) scale(.9)"/><path fill="#2e8f86" d="M6 14h3v4H6zM11 14h3v4h-3z"/>',
      part: '<path fill="#a584c6" d="M20 3h8v6h-6v6h6v6h-6v6h6v6h-8v6h-4V3z" transform="translate(-2 0)"/><path fill="#d2b8ee" d="M14 10h6v20h-6z"/><path fill="#6c4d94" d="M26 10h6v4h-6zM26 18h6v4h-6zM26 26h6v4h-6z"/>',
      damage: '<path fill="#e17b52" d="M17 2h6v9h6v7h5v14h-5v5H11v-5H6V21h5v-8h6z"/><path fill="#ffda88" d="M18 17h6v8h4v8H13v-8h5z"/>',
      heal: '<path fill="#adcecd" d="M14 3h12v5H14zM16 8h8v8h5v4h4v14H7V20h4v-4h5z"/><path fill="#6ea381" d="M11 23h18v9H11z"/><path fill="#eff0ca" d="M18 21h4v13h-4zM14 25h12v4H14z"/>',
      buff: '<path fill="#a584c6" d="M17 2h6v6h6v6h6v12h-6v6h-6v6h-6v-6h-6v-6H5V14h6V8h6z"/><path fill="#f3dfb1" d="M18 10h4v5h5v4h-5v11h-4V19h-5v-4h5z"/>',
      draw: '<path fill="#5b829a" d="M3 9h14v3h6V9h14v26H23v3h-6v-3H3z"/><path fill="#f0deb9" d="M6 5h11v3h3v25h-3v-3H6zM23 8V5h11v25H23v3h-3V8z"/><path fill="#9d7c67" d="M9 11h6v3H9zM9 18h6v3H9zM25 11h6v3h-6zM25 18h6v3h-6z"/>',
      assembled: '<path fill="#f4cc85" d="M17 2h6v6h6v6h6v12h-6v6h-6v6h-6v-6h-6v-6H5V14h6V8h6z"/><path fill="#ffda88" d="M17 10h6v6h6v12h-6v6h-6v-6h-6V16h6z"/><path fill="#80e5dc" d="M20 18h10v2H20zM20 24h10v2H20z"/>'
    };
    var span = document.createElement('span');
    span.className = 'card-emblem';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 40 40" shape-rendering="crispEdges" focusable="false">' + (drawings[type] || drawings.minion) + '</svg>';
    return span;
  }

  function abilityStatus(m) {
    if (m.ability === 'barrier') {
      return m.barrierActive ? 'Щит цел' : 'Щит снят';
    }
    if (m.ability === 'rush') {
      return m.justPlayed ? 'Натиск' : 'Натиск: готов';
    }
    return m.ability === 'medic' ? 'Лекарь: +2' : '';
  }

  function renderMinion(m, which) {
    var node = document.createElement('div');
    node.className = 'minion';
    var card = m.card;
    if (card) {
      if (card.assembled) {
        node.classList.add('minion--assembled');
      } else if (card.isComponent) {
        node.classList.add(card.role === 'key' ? 'minion--key' : 'minion--part');
      }
    }
    node.dataset.uid = m.uid;
    node.dataset.side = which;
    node.dataset.drop = 'minion-' + which + '-' + m.uid;
    var canAct = which === 'player' && state.turn === 'player' && !busy && E.canAttack(state, m);
    if (m.ability) {
      node.dataset.ability = m.ability;
      node.classList.toggle('minion--barrier', !!m.barrierActive);
      var badge = document.createElement('span');
      badge.className = 'minion-ability';
      badge.textContent = abilityStatus(m);
      badge.title = D.ABILITIES[m.ability].text;
      node.appendChild(badge);
    }
    if (canAct) {
      node.classList.add('minion--ready');
    } else if (which === 'player' && !m.ready) {
      node.classList.add('minion--sleeping');
    }
    if (selectedAttackerUid === m.uid) {
      node.classList.add('is-selected');
    }
    var hanzi = document.createElement('span');
    hanzi.className = 'minion-hanzi';
    hanzi.lang = 'zh';
    hanzi.textContent = card ? card.hanzi : '';
    hanzi.dataset.length = String(Array.from(hanzi.textContent).length);
    var name = document.createElement('span');
    name.className = 'minion-name';
    var nameText = card ? card.name : '';
    if (card && card.assembled) {
      nameText = card.hanzi + ' · ' + card.ru;
    }
    name.textContent = nameText;
    var stats = document.createElement('span');
    stats.className = 'minion-stats';
    var atk = document.createElement('span');
    atk.className = 'stat-atk';
    atk.textContent = String(m.atk);
    atk.title = 'Атака';
    var hp = document.createElement('span');
    hp.className = 'stat-hp';
    hp.textContent = String(m.hp);
    hp.title = 'Здоровье';
    stats.appendChild(atk);
    stats.appendChild(hp);
    node.appendChild(hanzi);
    node.appendChild(name);
    node.appendChild(stats);
    node.setAttribute('role', 'button');
    node.tabIndex = 0;
    node.setAttribute('aria-label', (which === 'player' ? 'Ваш боец' : 'Боец стража') + ' ' +
      (card ? card.hanzi + ' ' + card.pinyin + ' (' + card.ru + ')' : '') +
      ': атака ' + m.atk + ', здоровье ' + m.hp + (m.ability ? ', ' + abilityStatus(m) + '. ' + D.ABILITIES[m.ability].text : '') + (canAct ? ', может атаковать' : ''));
    node.title = card && card.assembled
      ? 'Собранный знак из ' + card.assembledFrom
      : (m.ability ? abilityStatus(m) + '. ' + D.ABILITIES[m.ability].text : 'Обычный боец');
    return node;
  }

  function selectedComponentCards() {
    return selectedComponents
      .map(function (uid) { return getCardByUid(uid); })
      .filter(function (c) { return !!c; });
  }

  function selectionIds() {
    return selectedComponentCards().map(function (c) { return c.componentId; });
  }

  function renderHand() {
    var hand = g('hand');
    hand.innerHTML = '';
    var cards = state.player.hand;
    var n = cards.length;
    var overlap = n > 5 ? -Math.min(36, (n - 5) * 11) : 0;
    var selCards = selectedComponentCards();
    cards.forEach(function (card, idx) {
      var node = document.createElement('button');
      node.type = 'button';
      var visualType = card.isComponent
        ? card.role
        : (card.kind === 'spell' ? card.effect.id : (card.assembled ? 'assembled' : 'minion'));
      var typeLabels = { key: 'Ключ', part: 'Часть', assembled: 'Знак', damage: 'Урон', heal: 'Лечение', buff: 'Усиление', draw: 'Добор', minion: 'Боец' };
      node.className = 'card card--' + visualType + (card.kind === 'spell' ? ' card--spell' : '') + (card.assembled ? ' card--assembled' : '');
      node.dataset.uid = card.uid;
      node.dataset.type = visualType;
      node.dataset.drop = 'fuseto-' + card.uid;
      node.style.setProperty('--i', String(idx));
      node.style.setProperty('--n', String(n));
      if (overlap) {
        node.style.setProperty('--overlap', overlap + 'px');
      }
      var fanRot = (idx - (n - 1) / 2) * Math.min(5, 34 / Math.max(1, n));
      var fanY = Math.round(Math.abs(idx - (n - 1) / 2) * 4);
      node.style.setProperty('--fan-rot', fanRot.toFixed(1) + 'deg');
      node.style.setProperty('--fan-y', fanY + 'px');
      var surface = document.createElement('span');
      surface.className = 'card-surface';
      surface.setAttribute('aria-hidden', 'true');
      node.appendChild(surface);
      var playable = state.turn === 'player' && !busy && !state.over && E.canPlayCard(state, card);
      var isSelectedComp = selectedComponents.indexOf(card.uid) !== -1;
      var mergeTarget = false;
      if (!isSelectedComp && card.isComponent && selCards.length) {
        var probe = selectionIds().concat([card.componentId]);
        mergeTarget = E.partialRecipeMatches(probe);
      } else if (!selCards.length && card.isComponent) {
        mergeTarget = true;
      }
      if (!playable && !mergeTarget && !isSelectedComp) {
        node.classList.add(card.locked ? 'is-locked' : 'is-unplayable');
      }
      if (card.locked) {
        node.classList.add('card--locked-badge');
      }
      if (selectedCardUid === card.uid) {
        node.classList.add('is-selected');
      }
      if (isSelectedComp) {
        node.classList.add('is-key-selected');
      }
      if (mergeTarget && !isSelectedComp) {
        node.classList.add('merge-target');
      }
      var top = document.createElement('span');
      top.className = 'card-top';
      var cost = document.createElement('span');
      cost.className = 'card-cost';
      cost.textContent = String(card.cost);
      var kindLabel = document.createElement('span');
      kindLabel.className = 'card-kind-label';
      kindLabel.textContent = typeLabels[visualType] + ' · ' + card.pinyin;
      top.appendChild(cost);
      top.appendChild(kindLabel);
      var hanzi = document.createElement('span');
      hanzi.className = 'card-hanzi';
      hanzi.lang = 'zh';
      hanzi.textContent = card.hanzi;
      hanzi.dataset.length = String(Array.from(card.hanzi).length);
      var name = document.createElement('span');
      name.className = 'card-name';
      name.textContent = card.ru;
      node.appendChild(top);
      node.appendChild(cardEmblem(visualType));
      var seal = document.createElement('span');
      seal.className = 'card-type-seal';
      seal.textContent = typeLabels[visualType];
      node.appendChild(seal);
      node.appendChild(hanzi);
      node.appendChild(name);
      if (card.isComponent || card.assembled) {
        var ability = document.createElement('span');
        ability.className = 'card-ability';
        if (card.assembled) {
          ability.textContent = 'Собран: ' + card.assembledFrom + ' · ' + card.minionAtk + '/' + card.minionHp +
            (card.ability ? ' · ' + D.ABILITIES[card.ability].name : '');
          ability.title = 'Готовый знак, собранный из ' + card.assembledFrom + '.';
        } else {
          ability.textContent = 'Сборка: сочетается с ' + (card.role === 'key' ? 'частями и ключами' : 'ключами и частями');
          ability.title = card.text;
        }
        node.appendChild(ability);
      }
      if (card.kind === 'spell') {
        var text = document.createElement('span');
        text.className = 'card-text';
        text.textContent = card.text;
        node.appendChild(text);
      }
      var bottom = document.createElement('span');
      bottom.className = 'card-stats';
      if (isFighterCard(card)) {
        var atk = document.createElement('span');
        atk.className = 'stat-atk';
        atk.textContent = String(card.minionAtk);
        atk.title = 'Атака';
        var hp = document.createElement('span');
        hp.className = 'stat-hp';
        hp.textContent = String(card.minionHp);
        hp.title = 'Здоровье';
        bottom.appendChild(atk);
        bottom.appendChild(hp);
      } else {
        var hint = document.createElement('span');
        hint.className = 'card-hint';
        hint.textContent = { 'enemy-any': 'Цель: враг', 'own-minion': 'Цель: ваш боец', 'own-hero': 'Цель: ваш герой', none: 'Без цели · в зону' }[card.effect.target];
        bottom.appendChild(hint);
      }
      node.appendChild(bottom);
      var kindWord = card.isComponent ? (card.role === 'key' ? 'Ключ' : 'Часть') : (card.assembled ? 'Собранный знак' : (card.kind === 'spell' ? 'Заклинание' : 'Боец'));
      var mechanics = card.isComponent
        ? 'компонент сборки иероглифов, бойцом ' + card.minionAtk + '/' + card.minionHp
        : (card.assembled
          ? 'собран из ' + card.assembledFrom + ': ' + card.minionAtk + '/' + card.minionHp + (card.ability ? ' · ' + D.ABILITIES[card.ability].name : '')
          : card.text);
      node.setAttribute('aria-label', kindWord + ' ' + card.hanzi + ' (' + card.pinyin + ' — ' + card.ru + '), стоимость ' + card.cost +
        (card.locked ? ', ждёт следующего хода' : '') + '. ' + mechanics);
      node.title = card.hanzi + ' · ' + mechanics;
      hand.appendChild(node);
    });
  }

  function isFighterCard(card) {
    return card.kind === 'minion' || card.isComponent;
  }

  function renderBar() {
    g('endTurnBtn').disabled = busy || state.over || state.turn !== 'player' || !!pendingQuestion;
    var label = g('turnLabel');
    if (state.over) {
      label.textContent = 'Бой завершён';
      label.classList.remove('turn-label--ai');
    } else if (state.turn === 'player') {
      label.textContent = 'Ваш ход';
      label.classList.remove('turn-label--ai');
    } else {
      label.textContent = 'Ход стража';
      label.classList.add('turn-label--ai');
    }
    updateTimer();
  }

  function updateTimer() {
    if (!state) {
      return;
    }
    var left = state.deadline - Date.now();
    g('timer').textContent = fmtTime(left);
    g('timer').classList.toggle('timer--low', left < 60000);
    if (left <= 0 && !state.over) {
      finishByTime();
    }
  }

  function finishByTime() {
    if (pendingQuestion) {
      discardQuestion();
      toast('Время вышло: вопрос отменён, карта не разыграна');
    }
    var events = [];
    E.checkTime(state, Date.now(), events);
    render();
    runEvents(events).then(function () {
      if (state.over) {
        showEnd();
      }
    }).catch(recoverFromError);
  }

  function startTimer() {
    stopTimer();
    updateTimer();
    timerId = setInterval(updateTimer, 400);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function showScreen(name) {
    g('screen-select').hidden = name !== 'select';
    g('screen-map').hidden = name !== 'map';
    g('screen-game').hidden = name !== 'game';
    if (name !== 'game') {
      document.getElementById('app').classList.remove('is-playing');
      delete g('battlefield').dataset.territory;
    } else {
      document.getElementById('app').classList.add('is-playing');
    }
  }

  function goMap() {
    stopTimer();
    state = null;
    busy = false;
    pendingQuestion = null;
    currentQuestion = null;
    selectedCardUid = null;
    selectedComponents = [];
    selectedAttackerUid = null;
    powerTargeting = false;
    g('endModal').hidden = true;
    g('questionModal').hidden = true;
    showScreen('map');
    renderMap();
  }

  function startMatch() {
    if (!selectedHeroId) {
      return;
    }
    goMap();
    toast('Выберите стража на карте пути');
  }

  function startStage(stageId) {
    state = E.createStageMatch(selectedHeroId, stageId, rng, Date.now());
    g('battlefield').dataset.territory = stageId;
    busy = false;
    pendingQuestion = null;
    currentQuestion = null;
    selectedCardUid = null;
    selectedComponents = [];
    selectedAttackerUid = null;
    powerTargeting = false;
    g('endModal').hidden = true;
    g('questionModal').hidden = true;
    showScreen('game');
    render();
    startTimer();
    sfx.turn();
    toast('Этап ' + state.stage.index + ': ' + state.stage.name + '. Собирайте ключи и части в иероглифы!');
  }

  function endPlayerTurn() {
    if (busy || state.over || state.turn !== 'player' || pendingQuestion) {
      return;
    }
    sfx.click();
    clearSelection();
    var events = [];
    E.endTurn(state, events);
    busy = true;
    render();
    runEvents(events).then(aiTurn).catch(recoverFromError);
  }

  function aiTurn() {
    if (state.over) {
      busy = false;
      render();
      showEnd();
      return;
    }
    sleep(650).then(function () {
      var events = [];
      E.AI.takeTurn(state, events);
      return runEvents(events);
    }).then(function () {
      if (state.over) {
        busy = false;
        render();
        showEnd();
        return null;
      }
      var events2 = [];
      E.endTurn(state, events2);
      return runEvents(events2);
    }).then(function () {
      busy = false;
      if (!state.over) {
        sfx.turn();
        toast('Ваш ход');
      }
      render();
      if (state.over) {
        showEnd();
      }
    }).catch(recoverFromError);
  }

  function runEvents(events) {
    var chain = Promise.resolve();
    events.forEach(function (ev) {
      chain = chain.then(function () {
        return Promise.resolve().then(function () {
          return handleEvent(ev);
        }).catch(function (err) {
          if (window.console && window.console.error) {
            window.console.error('Игра: событие не удалось', ev && ev.type, err);
          }
        });
      });
    });
    return chain;
  }

  function recoverFromError(err) {
    if (window.console && window.console.error) {
      window.console.error('Игра: внутренняя ошибка', err);
    }
    busy = false;
    drag = null;
    pendingQuestion = null;
    currentQuestion = null;
    g('questionModal').hidden = true;
    if (!state) {
      render();
      return;
    }
    if (state.over) {
      render();
      showEnd();
      return;
    }
    if (state.turn === 'player') {
      render();
      toast('Небольшая заминка — ход продолжается');
      return;
    }
    var events = [];
    E.endTurn(state, events);
    busy = false;
    render();
    toast('Ход стража прерван — снова ваш ход');
  }

  var FX_COLORS = { damage: '#ffac69', heal: '#9fddb0', buff: '#d2a7f2', draw: '#a7d9ed' };

  function animateSpell(ev) {
    if (ev.target && ev.target.isMinion && ev.targetSlot >= 0 && ev.targetSlot !== null) {
      spellTargetAnchors.set(ev.target, { side: ev.targetSide, slot: ev.targetSlot });
    }
    var source = heroRowEl(ev.side);
    var target = targetElOf(ev.target) || source;
    if (!source || !target) {
      return Promise.resolve();
    }
    spawnFx(source, 'anim-cast', 620);
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    var from = centerOf(source);
    var to = centerOf(target);
    var width = document.documentElement.clientWidth;
    var height = window.innerHeight;
    from.x = Math.max(25, Math.min(width - 25, from.x));
    from.y = Math.max(25, Math.min(height - 25, from.y));
    var effect = ev.card.effect.id;
    var fxColor = FX_COLORS[effect] || '#ffda88';
    var layer = document.createElement('div');
    layer.className = 'spell-fx spell-fx--' + effect;
    layer.dataset.caster = ev.side;
    layer.dataset.targetSide = ev.targetSide || ev.side;
    layer.setAttribute('aria-hidden', 'true');
    var projectile = document.createElement('div');
    projectile.className = 'spell-projectile';
    projectile.style.setProperty('--fx', fxColor);
    projectile.appendChild(cardEmblem(effect));
    var label = document.createElement('span');
    label.className = 'spell-cast-label';
    label.textContent = (ev.side === 'ai' ? 'Страж: ' : 'Вы: ') + ev.card.hanzi + ' · ' + ev.card.name;
    label.style.left = Math.max(8, Math.min(width - Math.min(250, width - 16) - 8, from.x - 125)) + 'px';
    label.style.top = Math.max(8, from.y - 80) + 'px';
    var impact = document.createElement('div');
    impact.className = 'spell-impact';
    impact.style.setProperty('--fx', fxColor);
    impact.style.left = to.x + 'px';
    impact.style.top = to.y + 'px';
    impact.hidden = true;
    for (var n = 0; n < 8; n += 1) {
      var spark = document.createElement('span');
      spark.style.setProperty('--spark-angle', n * 45 + 'deg');
      impact.appendChild(spark);
    }
    layer.appendChild(projectile);
    layer.appendChild(label);
    layer.appendChild(impact);
    document.body.appendChild(layer);
    var reduce = reducedMotion || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    projectile.style.left = (reduce ? to.x : from.x) + 'px';
    projectile.style.top = (reduce ? to.y : from.y) + 'px';
    var flight = null;
    if (!reduce) {
      try {
        flight = projectile.animate([
          { transform: 'translate(-50%, -50%) scale(.7)', opacity: .6 },
          { transform: 'translate(calc(-50% + ' + (to.x - from.x) * .5 + 'px), calc(-50% + ' + ((to.y - from.y) * .5 - 26) + 'px)) scale(1.15)', opacity: 1, offset: .5 },
          { transform: 'translate(calc(-50% + ' + (to.x - from.x) + 'px), calc(-50% + ' + (to.y - from.y) + 'px)) scale(.9)', opacity: 1 }
        ], { duration: 480, easing: 'ease-in-out', fill: 'forwards' });
      } catch (animErr) {
        flight = null;
      }
    }
    var match = state;
    return new Promise(function (resolve) {
      setTimeout(resolve, reduce ? 0 : 480);
    }).then(function () {
      if (state !== match) {
        return;
      }
      projectile.hidden = true;
      impact.hidden = false;
      target.classList.add('spell-target-hit');
      target.style.setProperty('--spell-color', fxColor);
      if (effect === 'damage') {
        shakeBattlefield();
        rippleAt(ev.target, 'dmg');
      }
      return new Promise(function (resolve) {
        setTimeout(resolve, reduce ? 240 : 320);
      });
    }).finally(function () {
      if (flight) {
        flight.cancel();
      }
      target.classList.remove('spell-target-hit');
      target.style.removeProperty('--spell-color');
      layer.remove();
    });
  }

  function animateSummon(ev) {
    render();
    var board = ev.side === 'ai' ? g('enemyBoard') : g('playerBoard');
    var cell = board && board.children[ev.slot];
    var sNode = minionEl(ev.minion.uid);
    var reduce = reducedMotion;
    var base = ev.side === 'ai'
      ? (function () {
        spawnFx(heroRowEl('ai'), 'anim-cast', 620);
        var fly = document.createElement('div');
        fly.className = 'summon-ghost';
        fly.textContent = ev.minion.card ? ev.minion.card.hanzi : '';
        document.body.appendChild(fly);
        var from = centerOf(heroRowEl('ai'));
        var to = cell ? centerOf(cell) : from;
        fly.style.left = from.x + 'px';
        fly.style.top = from.y + 'px';
        var flight = null;
        if (!reduce && typeof fly.animate === 'function') {
          try {
            flight = fly.animate([
              { transform: 'translate(-50%, -50%) scale(.5)', opacity: .4 },
              { transform: 'translate(calc(-50% + ' + (to.x - from.x) * .5 + 'px), calc(-50% + ' + ((to.y - from.y) * .5 - 30) + 'px)) scale(1.2)', opacity: 1, offset: .5 },
              { transform: 'translate(calc(-50% + ' + (to.x - from.x) + 'px), calc(-50% + ' + (to.y - from.y) + 'px)) scale(1)', opacity: 1 }
            ], { duration: 420, easing: 'ease-in-out', fill: 'forwards' });
          } catch (animErr) {
            flight = null;
          }
        }
        return sleep(reduce ? 0 : 420).then(function () {
          if (flight) {
            flight.cancel();
          }
          fly.remove();
        });
      })()
      : Promise.resolve();
    return base.then(function () {
      if (cell) {
        spawnFx(cell, 'anim-cell-in', 480);
      }
      if (sNode) {
        sNode.classList.add('anim-spawn');
      }
      sfx.summon();
      return sleep(340);
    });
  }

  function handleEvent(ev) {
    switch (ev.type) {
      case 'summon':
        return animateSummon(ev);
      case 'assembly':
        render();
        sfx.assembly();
        var aNode = g('hand').querySelector('.card[data-uid="' + ev.card.uid + '"]');
        if (aNode) {
          spawnFx(aNode, 'anim-assembled', 900);
        }
        toast('Собран знак ' + ev.card.hanzi + ' (' + ev.card.pinyin + ' — ' + ev.card.ru + ') из ' + ev.card.assembledFrom);
        return sleep(520);
      case 'spell':
        sfx.spell();
        return animateSpell(ev);
      case 'power':
        spawnFx(heroRowEl(ev.side), 'anim-cast', 620);
        sfx.spell();
        return sleep(280);
      case 'attack-start':
        var aNode2 = targetElOf(ev.attacker);
        var tNode = targetElOf(ev.target);
        if (aNode2 && tNode) {
          var ac = centerOf(aNode2);
          var tc = centerOf(tNode);
          aNode2.style.setProperty('--lx', (tc.x - ac.x) * 0.7 + 'px');
          aNode2.style.setProperty('--ly', (tc.y - ac.y) * 0.7 + 'px');
          aNode2.classList.add('anim-lunge');
        }
        sfx.attack();
        return sleep(360);
      case 'attack-end':
        render();
        return sleep(120);
      case 'damage':
        var dNode = targetElOf(ev.target);
        if (dNode) {
          dNode.classList.remove('anim-lunge');
          dNode.classList.add('anim-hit');
        }
        rippleAt(ev.target, 'dmg');
        if (ev.target && ev.target.isHero) {
          shakeBattlefield();
        }
        floatNumber(ev.target, ev.amount, 'dmg');
        sfx.damage();
        return sleep(260);
      case 'heal':
        if (ev.source === 'medic') {
          toast('Лекарь: герою +' + ev.amount + ' HP');
        }
        rippleAt(ev.target, 'heal');
        floatNumber(ev.target, ev.amount, 'heal');
        var hNode = targetElOf(ev.target);
        if (hNode) {
          hNode.classList.add('anim-healed');
        }
        sfx.heal();
        return sleep(260);
      case 'buff':
        rippleAt(ev.target, 'buff');
        floatNumber(ev.target, '+' + ev.amount + '/+' + ev.amount, 'buff');
        var bNode = targetElOf(ev.target);
        if (bNode) {
          bNode.classList.add('anim-buffed');
        }
        sfx.buff();
        return sleep(260);
      case 'shield':
        rippleAt(ev.target, 'shield');
        floatNumber(ev.target, ev.amount, 'shield');
        sfx.shield();
        return sleep(220);
      case 'barrier-break':
        var barrierNode = targetElOf(ev.target);
        if (barrierNode) {
          barrierNode.classList.add('anim-barrier-break');
          barrierNode.classList.remove('minion--barrier');
          var abilityBadge = barrierNode.querySelector('.minion-ability');
          if (abilityBadge) {
            abilityBadge.textContent = 'Щит снят';
          }
        }
        rippleAt(ev.target, 'shield');
        floatNumber(ev.target, 'Щит!', 'shield');
        sfx.shield();
        return sleep(300);
      case 'shield-absorb':
        floatNumber(ev.target, ev.amount, 'shield');
        return sleep(140);
      case 'death':
        var deadNode = minionEl(ev.minion.uid);
        if (deadNode) {
          deadNode.classList.add('anim-death');
        }
        sfx.death();
        return sleep(460).then(function () {
          render();
        });
      case 'card-locked':
        render();
        return sleep(120);
      case 'burn':
        toast('Рука переполнена: карта ' + ev.card.hanzi + ' сгорела');
        return sleep(200);
      case 'over':
        return sleep(200);
      default:
        return Promise.resolve();
    }
  }

  function clearHighlights() {
    Array.prototype.forEach.call(document.querySelectorAll('.drop-ok, .is-target-ok, .is-spell-target'), function (n) {
      n.classList.remove('drop-ok', 'is-target-ok', 'is-spell-target');
    });
    g('dropZoneNone').hidden = true;
    clearArrow();
  }

  function highlightOwnMinions(cls) {
    Array.prototype.forEach.call(g('playerBoard').querySelectorAll('.minion'), function (n) {
      n.classList.add(cls);
    });
  }

  function highlightEnemyMinions(cls) {
    Array.prototype.forEach.call(g('enemyBoard').querySelectorAll('.minion'), function (n) {
      n.classList.add(cls);
    });
  }

  function highlightCompatibleComponents(selCards) {
    var selIds = selCards.map(function (c) { return c.componentId; });
    state.player.hand.forEach(function (other) {
      if (!other.isComponent || selectedComponents.indexOf(other.uid) !== -1) {
        return;
      }
      if (E.partialRecipeMatches(selIds.concat([other.componentId]))) {
        var node = g('hand').querySelector('.card[data-uid="' + other.uid + '"]');
        if (node) {
          node.classList.add('drop-ok');
        }
      }
    });
  }

  function highlightForCard(card) {
    clearHighlights();
    if (card.isComponent) {
      if (E.canPlayCard(state, card)) {
        Array.prototype.forEach.call(g('playerBoard').children, function (cell, i) {
          if (!state.player.board[i]) {
            cell.classList.add('drop-ok');
          }
        });
      }
      highlightCompatibleComponents([card]);
      return;
    }
    if (card.kind === 'minion') {
      Array.prototype.forEach.call(g('playerBoard').children, function (cell, i) {
        if (!state.player.board[i]) {
          cell.classList.add('drop-ok');
        }
      });
    } else if (card.effect) {
      var t = card.effect.target;
      if (t === 'none') {
        var zone = g('dropZoneNone');
        zone.hidden = false;
        zone.classList.add('drop-ok');
      } else if (t === 'own-hero') {
        heroRowEl('player').classList.add('is-spell-target');
      } else if (t === 'enemy-any') {
        heroRowEl('ai').classList.add('is-spell-target');
        highlightEnemyMinions('is-spell-target');
      } else if (t === 'own-minion') {
        highlightOwnMinions('is-spell-target');
      }
    }
  }

  function highlightForAttack() {
    clearHighlights();
    var attacker = findMinionByUid(selectedAttackerUid);
    if (!attacker) {
      return;
    }
    E.validAttackTargets(state, attacker).forEach(function (target) {
      var node = targetElOf(target);
      if (node) {
        node.classList.add('is-target-ok');
      }
    });
  }

  function highlightForPower() {
    clearHighlights();
    var spec = D.POWERS[state.player.power.id];
    if (spec.target === 'enemy-any') {
      heroRowEl('ai').classList.add('is-spell-target');
      highlightEnemyMinions('is-spell-target');
    } else if (spec.target === 'own-minion') {
      highlightOwnMinions('is-spell-target');
    }
    toast('Выберите цель для силы героя');
  }

  function clearSelection() {
    selectedCardUid = null;
    selectedComponents = [];
    selectedAttackerUid = null;
    powerTargeting = false;
    clearHighlights();
    render();
  }

  function dropZoneAt(x, y, dragInfo) {
    var ghost = dragInfo && dragInfo.ghost;
    var prev = null;
    if (ghost) {
      prev = ghost.style.display;
      ghost.style.display = 'none';
    }
    var node = document.elementFromPoint(x, y);
    if (ghost && prev !== null) {
      ghost.style.display = prev;
    }
    if (!node) {
      return null;
    }
    var zone = node.closest('[data-drop]');
    return zone ? zone.dataset.drop : null;
  }

  function beginCardDrag(card, cardNode, x, y) {
    var ghost = cardNode.cloneNode(true);
    ghost.classList.add('ghost');
    ghost.classList.remove('is-selected');
    ghost.classList.remove('is-key-selected');
    var rect = cardNode.getBoundingClientRect();
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.left = (x - rect.width / 2) + 'px';
    ghost.style.top = (y - rect.height / 2) + 'px';
    g('dragLayer').appendChild(ghost);
    drag = { mode: 'card', card: card, ghost: ghost };
    highlightForCard(card);
  }

  function beginAttackDrag(minion, minionNode, x, y) {
    selectedAttackerUid = minion.uid;
    drag = { mode: 'attack', minion: minion, from: centerOf(minionNode) };
    highlightForAttack();
    drawArrow(drag.from, { x: x, y: y });
  }

  function onPointerMove(e) {
    if (!drag) {
      return;
    }
    if (drag.mode === 'card') {
      drag.ghost.style.left = (e.clientX - drag.ghost.offsetWidth / 2) + 'px';
      drag.ghost.style.top = (e.clientY - drag.ghost.offsetHeight / 2) + 'px';
    } else if (drag.mode === 'attack') {
      drawArrow(drag.from, { x: e.clientX, y: e.clientY });
    }
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!drag) {
      return;
    }
    var current = drag;
    drag = null;
    clearArrow();
    var drop = dropZoneAt(e.clientX, e.clientY, current);
    if (current.mode === 'card') {
      if (current.ghost.parentNode) {
        current.ghost.parentNode.removeChild(current.ghost);
      }
      handleCardDrop(current.card, drop);
    } else if (current.mode === 'attack') {
      handleAttackDrop(current.minion, drop);
    }
    clearHighlights();
    if (state && !state.over && state.turn === 'player' && !pendingQuestion) {
      render();
    }
  }

  function onPointerCancel() {
    if (!drag) {
      return;
    }
    if (drag.mode === 'card' && drag.ghost && drag.ghost.parentNode) {
      drag.ghost.parentNode.removeChild(drag.ghost);
    }
    drag = null;
    clearHighlights();
    render();
  }

  function resolveTarget(drop) {
    if (!drop) {
      return null;
    }
    if (drop === 'enemy-hero') {
      return state.ai;
    }
    if (drop === 'own-hero') {
      return state.player;
    }
    var m = /^minion-(ai|player)-(.+)$/.exec(drop);
    if (m) {
      return findMinionByUid(m[2]);
    }
    return null;
  }

  function tryAssemblyDrop(dragCard, drop) {
    var m = /^fuseto-(.+)$/.exec(drop || '');
    if (!m || !dragCard || !dragCard.isComponent) {
      return false;
    }
    var target = getCardByUid(m[1]);
    if (!target || !target.isComponent || target === dragCard) {
      return false;
    }
    var pair = [dragCard, target].filter(function (c, i, arr) {
      return arr.indexOf(c) === i;
    });
    var ids = pair.map(function (c) { return c.componentId; });
    var full = E.recipesMatching(ids);
    if (full.length) {
      selectedComponents = [];
      clearHighlights();
      openAssembleQuestion(full[0], pair, pair[pair.length - 1]);
      return true;
    }
    if (E.partialRecipeMatches(ids)) {
      selectedComponents = pair.map(function (c) { return c.uid; });
      render();
      highlightForCard(dragCard);
      toast('Нужен ещё один компонент — выберите подсвеченный');
      return true;
    }
    toast('Эти компоненты не сочетаются');
    return false;
  }

  function handleCardDrop(card, drop) {
    if (!drop || !card || state.over || state.turn !== 'player' || busy || pendingQuestion) {
      return;
    }
    if (card.isComponent && tryAssemblyDrop(card, drop)) {
      return;
    }
    if (isFighterCard(card)) {
      var m = /^slot-(\d)$/.exec(drop);
      if (!m) {
        return;
      }
      var slot = parseInt(m[1], 10);
      if (!E.isValidDrop(state, card, slot)) {
        toast('Эта ячейка занята или карта сейчас недоступна');
        return;
      }
      openQuestion(card, { slot: slot });
    } else {
      if (card.effect.target === 'none' && drop !== 'none-zone') {
        return;
      }
      var target = resolveTarget(drop);
      if (!E.isValidSpellDrop(state, card, target)) {
        toast('Это заклинание нельзя применить к этой цели');
        return;
      }
      openQuestion(card, { target: target });
    }
  }

  function handleAttackDrop(attacker, drop) {
    if (!drop || state.over || state.turn !== 'player' || busy || pendingQuestion) {
      return;
    }
    if (drop === 'enemy-hero') {
      performAttack(attacker, state.ai);
      return;
    }
    var target = resolveTarget(drop);
    if (target && target.isMinion && target !== attacker) {
      performAttack(attacker, target);
    }
  }

  function performAttack(attacker, target) {
    if (!E.canAttack(state, attacker) || E.validAttackTargets(state, attacker).indexOf(target) === -1) {
      toast('Этот боец сейчас не может атаковать');
      return;
    }
    busy = true;
    selectedAttackerUid = null;
    render();
    var events = [];
    E.attack(state, attacker, target, events);
    runEvents(events).catch(recoverFromError).then(function () {
      busy = false;
      render();
      if (state.over) {
        showEnd();
      }
    });
  }

  function questionKindText(q) {
    if (q.subject === 'assemble') {
      return 'сборка ' + (q.partsDisplay || '') + ' · перевод';
    }
    if (q.subject === 'radical') {
      return q.mode === 'radical-ru' ? 'вопрос о значении ключа' : 'вопрос о чтении ключа';
    }
    if (q.subject === 'part') {
      return q.mode === 'part-ru' ? 'вопрос о значении части' : 'вопрос о чтении части';
    }
    return q.mode === 'ru' ? 'вопрос о значении' : 'вопрос о чтении';
  }

  function questionTitleText(q) {
    if (q.subject === 'assemble') {
      return 'Какой перевод у этого знака?';
    }
    if (q.subject === 'radical') {
      return q.mode === 'radical-ru' ? 'Что означает этот ключ?' : 'Как читается этот ключ?';
    }
    if (q.subject === 'part') {
      return q.mode === 'part-ru' ? 'Что означает эта часть?' : 'Как читается эта часть?';
    }
    return q.mode === 'ru' ? 'Что означает этот знак?' : 'Как читается этот знак (пиньинь)?';
  }

  function openQuestion(card, placement) {
    if (pendingQuestion || state.over) {
      return;
    }
    currentQuestion = E.makeQuestion(card, rng);
    pendingQuestion = { mode: 'play', card: card, placement: placement, answered: false, correct: false };
    sfx.questionOpen();
    renderQuestionModal();
  }

  function openAssembleQuestion(recipe, cards, lastCard) {
    if (pendingQuestion || state.over) {
      return;
    }
    currentQuestion = E.makeAssembleQuestion(recipe, rng);
    pendingQuestion = { mode: 'assemble', card: lastCard, components: cards.slice(), recipe: recipe, answered: false, correct: false };
    sfx.questionOpen();
    renderQuestionModal();
  }

  function renderQuestionModal() {
    var q = currentQuestion;
    g('questionKind').textContent = questionKindText(q);
    g('questionHanzi').textContent = q.hanzi;
    g('questionTitle').textContent = questionTitleText(q);
    var box = g('questionOptions');
    box.innerHTML = '';
    box.classList.remove('glyph-options');
    q.options.forEach(function (opt, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.dataset.index = String(idx);
      btn.addEventListener('click', function () {
        answerQuestion(idx);
      });
      box.appendChild(btn);
    });
    g('questionFeedback').hidden = true;
    g('questionActions').hidden = false;
    g('questionModal').hidden = false;
    var firstBtn = box.querySelector('button');
    if (firstBtn) {
      firstBtn.focus();
    }
  }

  function answerQuestion(idx) {
    if (!pendingQuestion || !currentQuestion || pendingQuestion.answered) {
      return;
    }
    pendingQuestion.answered = true;
    var card = pendingQuestion.card;
    var chosen = currentQuestion.options[idx];
    var correct = chosen === currentQuestion.correct;
    pendingQuestion.correct = correct;
    E.resolveAnswer(state, card, correct, []);
    Array.prototype.forEach.call(g('questionOptions').children, function (btn) {
      btn.disabled = true;
      var value = currentQuestion.options[parseInt(btn.dataset.index, 10)];
      if (value === currentQuestion.correct) {
        btn.classList.add('is-correct');
      } else if (value === chosen && !correct) {
        btn.classList.add('is-wrong');
      }
    });
    g('questionActions').hidden = true;
    g('questionFeedback').hidden = false;
    var line = g('feedbackLine');
    if (pendingQuestion.mode === 'assemble') {
      line.textContent = correct
        ? 'Верно! ' + currentQuestion.hanzi + ' (' + currentQuestion.pinyin + ') — «' + currentQuestion.correct + '». Знак собран и ждёт в руке.'
        : 'Ошибка: ' + currentQuestion.hanzi + ' — «' + currentQuestion.correct + '». Компонент под замком до следующего хода.';
    } else {
      line.textContent = correct ? 'Верно! Карта разыграна.' : 'Ошибка. Карта вернётся в руку и ждёт следующего хода.';
    }
    line.className = 'feedback-line ' + (correct ? 'feedback-line--good' : 'feedback-line--bad');
    g('wordHanzi').textContent = currentQuestion.hanzi;
    g('wordPinyin').textContent = currentQuestion.pinyin;
    g('wordRu').textContent = currentQuestion.ru;
    var note = currentQuestion.note || '';
    if (currentQuestion.subject === 'assemble' && currentQuestion.partsDisplay) {
      note = currentQuestion.partsDisplay + ' = ' + currentQuestion.hanzi + '. Ключ ' + currentQuestion.radicalGlyph + ' — ' + currentQuestion.radicalRu + '. ' + note;
    }
    g('wordNote').textContent = note;
    if (correct) {
      sfx.play();
    } else {
      sfx.wrong();
    }
    g('feedbackClose').focus();
  }

  function discardQuestion() {
    pendingQuestion = null;
    currentQuestion = null;
    g('questionModal').hidden = true;
    render();
  }

  function finishQuestion() {
    if (!pendingQuestion) {
      return;
    }
    var pending = pendingQuestion;
    pendingQuestion = null;
    currentQuestion = null;
    g('questionModal').hidden = true;
    if (!pending.answered) {
      discardQuestion();
      return;
    }
    if (!pending.correct || state.over || state.turn !== 'player') {
      render();
      if (!pending.correct) {
        toast('Карта ' + pending.card.hanzi + ' ждёт следующего хода');
      }
      return;
    }
    if (pending.mode === 'assemble') {
      var evs = [];
      var ar = E.assemble(state, pending.components, evs);
      if (!ar.ok) {
        toast('Сборка больше невозможна');
        render();
        return;
      }
      busy = true;
      runEvents(evs).catch(recoverFromError).finally(function () {
        busy = false;
        render();
      });
      return;
    }
    var events = [];
    var res = E.playCard(state, pending.card, pending.placement, events);
    if (!res.ok) {
      toast('Карта больше не может быть разыграна');
      render();
      return;
    }
    busy = true;
    renderHeroes();
    renderBar();
    var match = state;
    runEvents(events).catch(recoverFromError).finally(function () {
      if (state !== match) {
        return;
      }
      busy = false;
      render();
      if (state.over) {
        showEnd();
      }
    });
  }

  function usePowerFlow(target) {
    var events = [];
    var res = E.usePower(state, target, events);
    powerTargeting = false;
    if (!res.ok) {
      toast(res.reason === 'target' ? 'Недопустимая цель для силы героя' : 'Сила героя сейчас недоступна');
      render();
      return;
    }
    busy = true;
    render();
    runEvents(events).catch(recoverFromError).then(function () {
      busy = false;
      render();
      if (state.over) {
        showEnd();
      }
    });
  }

  function entryById(id) {
    var w = E.wordById(id);
    if (w) {
      return w;
    }
    var r = E.radicalById(id);
    if (r) {
      return { hanzi: r.glyph, pinyin: r.pinyin, ru: r.ru };
    }
    var p = E.partById(id);
    if (p) {
      return { hanzi: p.hanzi, pinyin: p.pinyin, ru: p.ru };
    }
    return { hanzi: '?', pinyin: '', ru: '' };
  }

  function recordCampaignProgress() {
    if (state.result !== 'player') {
      return;
    }
    var stageId = state.stageId;
    if (campaign.completedStages.indexOf(stageId) === -1) {
      campaign.completedStages.push(stageId);
    }
    campaign.stats.correct += state.stats.correct;
    campaign.stats.wrong += state.stats.wrong;
    campaign.stats.assembled += state.stats.assembled;
    var k;
    for (k in state.stats.learned) {
      campaign.stats.learned[k] = (campaign.stats.learned[k] || 0) + state.stats.learned[k];
    }
    for (k in state.stats.mistakes) {
      campaign.stats.mistakes[k] = (campaign.stats.mistakes[k] || 0) + state.stats.mistakes[k];
    }
    saveCampaign();
  }

  function showEnd() {
    closeRules();
    stopTimer();
    recordCampaignProgress();
    var finalWin = state.result === 'player' &&
      D.STAGES.every(function (s) {
        return campaign.completedStages.indexOf(s.id) !== -1;
      });
    var titles = { player: 'Победа на этапе!', ai: 'Поражение', draw: 'Ничья' };
    g('endTitle').textContent = finalWin ? 'Поход пройден!' : (titles[state.result] || 'Бой завершён');
    g('finishCode').hidden = !finalWin;
    var stageLabel = 'Этап ' + state.stage.index + ': ' + state.stage.name + ', ' + state.stage.title + '.';
    g('endReason').textContent = finalWin
      ? stageLabel + ' Все три стража повержены — ключи покорились!'
      : (state.resultReason === 'time'
        ? stageLabel + ' Время вышло: победил герой с большим запасом здоровья.'
        : stageLabel + ' Здоровье одного из героев исчерпано.');
    var total = state.stats.correct + state.stats.wrong;
    var accuracy = total > 0 ? Math.round(state.stats.correct / total * 100) : 0;
    var duration = Math.min(Date.now() - state.startedAt, D.MATCH_MS);
    var statsBox = g('endStats');
    statsBox.innerHTML = '';
    var rows = [
      { label: 'Длительность', value: fmtTime(duration) },
      { label: 'Верных ответов', value: state.stats.correct },
      { label: 'Ошибок', value: state.stats.wrong },
      { label: 'Точность', value: accuracy + '%' },
      { label: 'Собрано знаков', value: state.stats.assembled }
    ];
    if (finalWin) {
      rows.push({ label: 'Собрано за поход', value: campaign.stats.assembled });
    }
    rows.forEach(function (item) {
      var box = document.createElement('div');
      box.className = 'end-stat';
      var b = document.createElement('b');
      b.textContent = String(item.value);
      var label = document.createElement('span');
      label.textContent = item.label;
      box.appendChild(b);
      box.appendChild(label);
      statsBox.appendChild(box);
    });
    var wordsBox = g('endWords');
    wordsBox.innerHTML = '';
    var learnedIds = Object.keys(state.stats.learned);
    var mistakeIds = Object.keys(state.stats.mistakes);
    if (learnedIds.length) {
      var h1 = document.createElement('h3');
      h1.textContent = 'Разобраны в бою';
      var ul1 = document.createElement('ul');
      learnedIds.forEach(function (id) {
        var w = entryById(id);
        var li = document.createElement('li');
        li.textContent = '';
        var zh = document.createElement('span');
        zh.className = 'zh';
        zh.lang = 'zh';
        zh.textContent = w.hanzi;
        li.appendChild(zh);
        li.appendChild(document.createTextNode(' ' + w.pinyin + ' — ' + w.ru + ' (верно: ' + state.stats.learned[id] + ')'));
        ul1.appendChild(li);
      });
      wordsBox.appendChild(h1);
      wordsBox.appendChild(ul1);
    }
    if (mistakeIds.length) {
      var h2 = document.createElement('h3');
      h2.textContent = 'Ошибки — повторите';
      var ul2 = document.createElement('ul');
      mistakeIds.forEach(function (id) {
        var w = entryById(id);
        var li = document.createElement('li');
        li.textContent = '';
        var zh = document.createElement('span');
        zh.className = 'zh';
        zh.lang = 'zh';
        zh.textContent = w.hanzi;
        li.appendChild(zh);
        li.appendChild(document.createTextNode(' ' + w.pinyin + ' — ' + w.ru + ' (ошибок: ' + state.stats.mistakes[id] + ')'));
        ul2.appendChild(li);
      });
      wordsBox.appendChild(h2);
      wordsBox.appendChild(ul2);
    }
    if (!learnedIds.length && !mistakeIds.length) {
      var p = document.createElement('p');
      p.textContent = 'Ни одной карты не разыграно.';
      wordsBox.appendChild(p);
    }
    g('rematchBtn').textContent = state.result === 'player' ? 'Сыграть ещё раз' : 'Повторить этап';
    g('endModal').hidden = false;
    g('rematchBtn').focus();
    if (state.result === 'player') {
      sfx.win();
    } else if (state.result === 'ai') {
      sfx.lose();
    }
  }

  function guardActive() {
    return !busy && state && !state.over && state.turn === 'player' && !pendingQuestion && !drag;
  }

  function onHandPointerDown(e) {
    if (!guardActive()) {
      return;
    }
    var cardNode = e.target.closest('.card');
    if (!cardNode) {
      return;
    }
    var card = getCardByUid(cardNode.dataset.uid);
    if (!card) {
      return;
    }
    if (card.isComponent) {
      if (card.locked) {
        toast('Компонент под замком до следующего хода');
        return;
      }
      e.preventDefault();
      beginCardDrag(card, cardNode, e.clientX, e.clientY);
      return;
    }
    if (!E.canPlayCard(state, card)) {
      toast(card.locked ? 'Карта ждёт следующего хода' : 'Не хватает маны: нужно ' + card.cost);
      return;
    }
    e.preventDefault();
    beginCardDrag(card, cardNode, e.clientX, e.clientY);
  }

  function onBoardPointerDown(e) {
    if (!guardActive() || powerTargeting || selectedCardUid) {
      return;
    }
    var minionNode = e.target.closest('.minion');
    if (!minionNode || minionNode.dataset.side !== 'player') {
      return;
    }
    var minion = findMinionByUid(minionNode.dataset.uid);
    if (!minion || !E.canAttack(state, minion)) {
      return;
    }
    e.preventDefault();
    beginAttackDrag(minion, minionNode, e.clientX, e.clientY);
  }

  function onHandClick(e) {
    if (!guardActive()) {
      return;
    }
    var cardNode = e.target.closest('.card');
    if (!cardNode) {
      return;
    }
    var card = getCardByUid(cardNode.dataset.uid);
    if (!card) {
      return;
    }
    if (card.isComponent) {
      if (card.locked) {
        toast('Компонент под замком до следующего хода');
        return;
      }
      var selIdx = selectedComponents.indexOf(card.uid);
      if (selIdx !== -1) {
        sfx.deselect();
        selectedComponents.splice(selIdx, 1);
        selectedCardUid = null;
        render();
        var rest = selectedComponentCards();
        if (rest.length) {
          highlightForCard(rest[rest.length - 1]);
        }
        return;
      }
      var selCards = selectedComponentCards();
      var probe = selectionIds().concat([card.componentId]);
      if (selCards.length && !E.partialRecipeMatches(probe)) {
        toast('Этот компонент не сочетается с выборкой — начните заново (Esc)');
        return;
      }
      var full = E.recipesMatching(probe);
      if (full.length) {
        var cards = selCards.concat([card]);
        selectedComponents = [];
        selectedCardUid = null;
        clearHighlights();
        openAssembleQuestion(full[0], cards, card);
        return;
      }
      selectedComponents.push(card.uid);
      selectedCardUid = null;
      selectedAttackerUid = null;
      powerTargeting = false;
      sfx.select();
      render();
      highlightForCard(card);
      toast(selCards.length
        ? 'Добавлено: ' + card.hanzi + '. Продолжайте сборку'
        : 'Компонент ' + card.hanzi + ' выбран — укажите подсвеченную пару');
      return;
    }
    if (selectedComponents.length) {
      toast('Сначала завершите или отмените сборку (Esc)');
      return;
    }
    if (!E.canPlayCard(state, card)) {
      toast(card.locked ? 'Карта ждёт следующего хода' : 'Не хватает маны: нужно ' + card.cost);
      return;
    }
    if (selectedCardUid === card.uid) {
      clearSelection();
      return;
    }
    selectedCardUid = card.uid;
    selectedAttackerUid = null;
    powerTargeting = false;
    render();
    highlightForCard(card);
    toast(card.kind === 'spell' ? 'Выберите цель заклинания' : 'Выберите свободную ячейку своей половины');
  }

  function trySpellOn(dropValue) {
    var cardSel = getCardByUid(selectedCardUid);
    if (!cardSel || cardSel.kind !== 'spell') {
      return false;
    }
    var target = resolveTarget(dropValue);
    if (E.isValidSpellDrop(state, cardSel, target)) {
      handleCardDrop(cardSel, dropValue);
      clearSelection();
      return true;
    }
    return false;
  }

  function onPlayerBoardClick(e) {
    if (!guardActive()) {
      return;
    }
    if (selectedComponents.length) {
      var lastComp = selectedComponentCards().pop();
      var compCell = e.target.closest('.cell');
      if (lastComp && compCell && /^slot-\d$/.test(compCell.dataset.drop) && E.canPlayCard(state, lastComp)) {
        selectedComponents = [];
        handleCardDrop(lastComp, compCell.dataset.drop);
        clearSelection();
        return;
      }
    }
    if (selectedCardUid) {
      var minionNode = e.target.closest('.minion');
      if (minionNode && trySpellOn(minionNode.dataset.drop)) {
        return;
      }
      var cell = e.target.closest('.cell');
      if (cell) {
        var cardSel = getCardByUid(selectedCardUid);
        if (cardSel && isFighterCard(cardSel) && /^slot-\d$/.test(cell.dataset.drop)) {
          handleCardDrop(cardSel, cell.dataset.drop);
        }
        clearSelection();
      }
      return;
    }
    if (powerTargeting) {
      var pn = e.target.closest('.minion');
      if (pn) {
        var pt = resolveTarget(pn.dataset.drop);
        if (E.powerTargetValid(state, pt)) {
          usePowerFlow(pt);
          return;
        }
      }
      toast('Сила героя отменена');
      powerTargeting = false;
      clearHighlights();
      render();
      return;
    }
    var own = e.target.closest('.minion');
    if (own) {
      var minion = findMinionByUid(own.dataset.uid);
      if (minion && E.canAttack(state, minion)) {
        selectedAttackerUid = minion.uid;
        render();
        highlightForAttack();
        toast('Выберите цель атаки: бойца или стража');
      }
    }
  }

  function onEnemySideClick(e) {
    if (!guardActive()) {
      return;
    }
    var dropValue = null;
    var minionNode = e.target.closest('.minion');
    var heroRow = e.target.closest('.hero-row[data-hero="ai"]');
    if (minionNode && g('enemyBoard').contains(minionNode)) {
      dropValue = minionNode.dataset.drop;
    } else if (heroRow) {
      dropValue = 'enemy-hero';
    } else {
      return;
    }
    if (powerTargeting) {
      var pt = resolveTarget(dropValue);
      if (E.powerTargetValid(state, pt)) {
        usePowerFlow(pt);
      } else {
        toast('Сила героя не действует на эту цель');
      }
      return;
    }
    if (selectedCardUid && trySpellOn(dropValue)) {
      return;
    }
    if (selectedAttackerUid) {
      var attacker = findMinionByUid(selectedAttackerUid);
      if (attacker) {
        handleAttackDrop(attacker, dropValue);
      }
      clearSelection();
    }
  }

  function onPlayerHeroRowClick(e) {
    if (!guardActive()) {
      return;
    }
    if (!e.target.closest('.hero-row[data-hero="player"]')) {
      return;
    }
    if (selectedCardUid && trySpellOn('own-hero')) {
      return;
    }
  }

  var rulesReturnFocus = null;

  function closeRules() {
    if (g('rules').open) {
      g('rules').close();
    }
  }

  function bindEvents() {
    g('rulesLink').addEventListener('click', function () {
      rulesReturnFocus = document.activeElement;
      g('rules').showModal();
      g('rulesClose').focus();
    });
    g('rulesClose').addEventListener('click', closeRules);
    g('rules').addEventListener('close', function () {
      if (rulesReturnFocus && rulesReturnFocus.isConnected) {
        rulesReturnFocus.focus();
      }
      rulesReturnFocus = null;
    });
    g('startMatch').addEventListener('click', function () {
      sfx.click();
      startMatch();
    });
    g('soundToggle').addEventListener('click', function () {
      sound.enabled = !sound.enabled;
      var btn = g('soundToggle');
      btn.textContent = 'Звук: ' + (sound.enabled ? 'вкл' : 'выкл');
      btn.setAttribute('aria-pressed', sound.enabled ? 'true' : 'false');
      if (sound.enabled) {
        audioCtx();
        sfx.turn();
      }
    });
    g('endTurnBtn').addEventListener('click', endPlayerTurn);
    g('rematchBtn').addEventListener('click', function () {
      if (state && state.stageId) {
        startStage(state.stageId);
      }
    });
    g('mapBtn').addEventListener('click', goMap);
    g('changeHeroBtn').addEventListener('click', function () {
      g('endModal').hidden = true;
      stopTimer();
      state = null;
      showScreen('select');
      renderHeroSelect();
    });
    g('changeHeroFromMap').addEventListener('click', function () {
      selectedHeroId = null;
      campaign.heroId = null;
      saveCampaign();
      state = null;
      showScreen('select');
      renderHeroSelect();
      g('startMatch').disabled = true;
    });
    g('resetProgressBtn').addEventListener('click', function () {
      if (window.confirm('Сбросить прогресс похода? Этапы и статистика начнутся заново.')) {
        resetCampaign();
      }
    });
    g('questionCancel').addEventListener('click', discardQuestion);
    g('feedbackClose').addEventListener('click', finishQuestion);
    g('pronounceBtn').addEventListener('click', function () {
      if (!currentQuestion) {
        return;
      }
      speak(currentQuestion.speakText || currentQuestion.hanzi);
    });

    g('hand').addEventListener('pointerdown', onHandPointerDown);
    g('hand').addEventListener('click', onHandClick);
    g('dropZoneNone').addEventListener('click', function () {
      if (!guardActive() || !selectedCardUid) {
        return;
      }
      var cardSel = getCardByUid(selectedCardUid);
      if (cardSel && cardSel.kind === 'spell' && cardSel.effect.target === 'none') {
        handleCardDrop(cardSel, 'none-zone');
        clearSelection();
      }
    });
    g('playerBoard').addEventListener('pointerdown', onBoardPointerDown);
    g('playerBoard').addEventListener('click', onPlayerBoardClick);
    g('enemyBoard').addEventListener('click', onEnemySideClick);
    heroRowEl('ai').addEventListener('click', onEnemySideClick);
    heroRowEl('player').addEventListener('click', onPlayerHeroRowClick);

    g('powerBtn').addEventListener('click', function () {
      if (!guardActive() || !E.canUsePower(state)) {
        return;
      }
      var spec = D.POWERS[state.player.power.id];
      if (spec.target === 'none') {
        usePowerFlow(null);
        return;
      }
      powerTargeting = true;
      selectedCardUid = null;
      selectedAttackerUid = null;
      render();
      highlightForPower();
    });

    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);

    document.addEventListener('keydown', function (e) {
      if (g('rules').open) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeRules();
        }
        return;
      }
      if (e.key === 'Escape') {
        if (pendingQuestion) {
          if (!pendingQuestion.answered) {
            discardQuestion();
          }
          return;
        }
        if (drag) {
          onPointerCancel();
          return;
        }
        if (powerTargeting || selectedCardUid || selectedAttackerUid || selectedComponents.length) {
          clearSelection();
        }
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && state && !state.over) {
        updateTimer();
      }
    });
  }

  function init() {
    cacheDom();
    loadCampaign();
    renderHeroSelect();
    renderMap();
    bindEvents();
    window.addEventListener('error', function (e) {
      toast('Ошибка скрипта: ' + (e && e.message ? e.message : 'неизвестная'));
    });
    window.addEventListener('unhandledrejection', function (e) {
      toast('Сбой в фоне: ' + (e && e.reason && e.reason.message ? e.reason.message : 'игра продолжается'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.KEYGAME_DEBUG = function () {
    return {
      busy: busy,
      drag: !!drag,
      pending: !!pendingQuestion,
      pendingAnswered: !!(pendingQuestion && pendingQuestion.answered),
      turn: state && state.turn,
      over: !!(state && state.over),
      turnNumber: state && state.turnNumber,
      hand: state && state.player.hand.length,
      mana: state && (state.player.mana + '/' + state.player.maxMana),
      selCard: !!selectedCardUid,
      selComponents: selectedComponents.length,
      assembled: state && state.stats.assembled,
      handClasses: state ? state.player.hand.map(function (c) {
        return c.hanzi + (c.locked ? 'L' : '') + (c.isComponent ? (c.role === 'key' ? 'K' : 'P') : '') + (c.assembled ? 'A' : '');
      }) : []
    };
  };

  return {};
}());
