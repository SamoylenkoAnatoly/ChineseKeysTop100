window.KEYGAME_ENGINE = (function () {
  'use strict';

  var D = window.KEYGAME_DATA;
  var BOARD = D.BOARD_SIZE;

  function shuffle(list, rng) {
    var arr = list.slice();
    var current = arr.length;
    while (current > 1) {
      current -= 1;
      var idx = Math.floor(rng() * (current + 1));
      var tmp = arr[current];
      arr[current] = arr[idx];
      arr[idx] = tmp;
    }
    return arr;
  }

  function createRng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
  }

  function isFighter(card) {
    return !!card && (card.kind === 'minion' || card.kind === 'component');
  }

  function wordById(id) {
    for (var i = 0; i < D.WORDS.length; i += 1) {
      if (D.WORDS[i].id === id) {
        return D.WORDS[i];
      }
    }
    return null;
  }

  function radicalById(id) {
    for (var i = 0; i < D.RADICALS.length; i += 1) {
      if (D.RADICALS[i].id === id) {
        return D.RADICALS[i];
      }
    }
    return null;
  }

  function partById(id) {
    for (var i = 0; i < D.PARTS.length; i += 1) {
      if (D.PARTS[i].id === id) {
        return D.PARTS[i];
      }
    }
    return null;
  }

  function componentById(id) {
    return radicalById(id) || partById(id);
  }

  function isKeyId(id) {
    return !!radicalById(id);
  }

  function componentGlyph(id) {
    var c = componentById(id);
    return c ? (c.glyph || c.hanzi) : id;
  }

  function componentDisplay(id) {
    return componentGlyph(id);
  }

  function recipeByWord(wordId) {
    for (var i = 0; i < D.RECIPES.length; i += 1) {
      if (D.RECIPES[i].wordId === wordId) {
        return D.RECIPES[i];
      }
    }
    return null;
  }

  function sortedKey(ids) {
    return ids.slice().sort().join('|');
  }

  function recipesMatching(compIds) {
    var key = sortedKey(compIds);
    return D.RECIPES.filter(function (r) {
      return sortedKey(r.components) === key;
    });
  }

  function containsAll(superset, subset) {
    var pool = superset.slice();
    for (var i = 0; i < subset.length; i += 1) {
      var idx = pool.indexOf(subset[i]);
      if (idx === -1) {
        return false;
      }
      pool.splice(idx, 1);
    }
    return true;
  }

  function partialRecipeMatches(compIds) {
    if (!compIds.length) {
      return true;
    }
    return D.RECIPES.some(function (r) {
      return containsAll(r.components, compIds);
    });
  }

  function recipeDisplay(recipe) {
    if (recipe.display && recipe.display.length) {
      return recipe.display.join(' + ');
    }
    return recipe.components.map(componentDisplay).join(' + ');
  }

  function createCard(word, action, rng) {
    var card = {
      uid: 'c' + Math.floor(rng() * 1e9).toString(36) + Math.floor(rng() * 1e9).toString(36),
      wordId: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      ru: word.ru,
      note: word.note,
      cost: action.cost,
      kind: action.kind,
      name: action.name,
      text: action.text || '',
      minionAtk: isFighter({ kind: action.kind }) ? action.atk : 0,
      minionHp: isFighter({ kind: action.kind }) ? action.hp : 0,
      effect: action.effect || null,
      ability: action.ability || null
    };
    if (action.kind === 'minion') {
      card.radicalId = word.radical || null;
    }
    return card;
  }

  function createComponentCard(component, role, rng) {
    var base = role === 'key' ? D.KEY_CARD : D.PART_CARD;
    return {
      uid: 'c' + Math.floor(rng() * 1e9).toString(36) + Math.floor(rng() * 1e9).toString(36),
      wordId: component.id,
      componentId: component.id,
      hanzi: component.glyph || component.hanzi,
      pinyin: component.pinyin,
      ru: component.ru,
      note: component.note,
      cost: base.cost,
      kind: 'component',
      isComponent: true,
      role: role,
      name: (role === 'key' ? 'Ключ: ' : 'Часть: ') + component.ru,
      text: role === 'key'
        ? 'Компонент сборки: сочетается с иероглифными частями. Можно сыграть бойцом 1/1.'
        : 'Компонент сборки: сочетается с ключами. Можно сыграть бойцом 1/2.',
      minionAtk: base.atk,
      minionHp: base.hp,
      effect: null,
      ability: null,
      radicalId: role === 'key' ? component.id : null
    };
  }

  function createAssembledCard(word, recipe, rng) {
    var ability = D.ASSEMBLY.abilities[word.radical] || null;
    return {
      uid: 'c' + Math.floor(rng() * 1e9).toString(36) + Math.floor(rng() * 1e9).toString(36),
      wordId: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      ru: word.ru,
      note: word.note,
      cost: D.ASSEMBLY.cost,
      kind: 'minion',
      name: word.ru,
      text: ability ? D.ABILITIES[ability].text : 'Собранный знак: сильный боец.',
      minionAtk: D.ASSEMBLY.atk,
      minionHp: D.ASSEMBLY.hp,
      effect: null,
      ability: ability,
      radicalId: word.radical,
      assembled: true,
      assembledFrom: recipeDisplay(recipe)
    };
  }

  function pickSpell(rng) {
    return D.SPELLS[Math.floor(rng() * D.SPELLS.length)];
  }

  function createAiDeck(stage, rng) {
    var total = stage.deck.words + stage.deck.spells;
    var words = shuffle(D.WORDS, rng).slice(0, total);
    var fighters = [];
    var weights = [5, 5, 4, 3, 3, 3, 3, 3];
    D.MINION_TEMPLATES.forEach(function (template, index) {
      for (var n = 0; n < weights[index]; n += 1) {
        fighters.push(template);
      }
    });
    fighters = shuffle(fighters, rng);
    var deck = [];
    for (var w = 0; w < stage.deck.words; w += 1) {
      var action = fighters.pop();
      if (stage.bonusAtk || stage.bonusHp) {
        action = {
          kind: action.kind, cost: action.cost, atk: action.atk + stage.bonusAtk,
          hp: action.hp + stage.bonusHp, name: action.name, text: action.text, ability: action.ability
        };
      }
      deck.push(createCard(words[w], action, rng));
    }
    for (var s = stage.deck.words; s < total; s += 1) {
      deck.push(createCard(words[s], pickSpell(rng), rng));
    }
    return shuffle(deck, rng);
  }

  function createPlayerDeck(stage, rng) {
    var words = shuffle(D.WORDS, rng).slice(0, stage.deck.words);
    var needKeys = [];
    var needParts = [];
    words.forEach(function (w) {
      var recipe = recipeByWord(w.id);
      if (!recipe) {
        return;
      }
      recipe.components.forEach(function (id) {
        if (isKeyId(id)) {
          needKeys.push(id);
        } else {
          needParts.push(id);
        }
      });
    });
    var keyIds = shuffle(needKeys, rng).slice(0, stage.deck.keys);
    var partIds = shuffle(needParts, rng).slice(0, stage.deck.parts);
    while (keyIds.length < stage.deck.keys) {
      keyIds.push(D.RADICALS[Math.floor(rng() * D.RADICALS.length)].id);
    }
    while (partIds.length < stage.deck.parts) {
      partIds.push(D.PARTS[Math.floor(rng() * D.PARTS.length)].id);
    }
    var deck = [];
    keyIds.forEach(function (id) {
      deck.push(createComponentCard(radicalById(id), 'key', rng));
    });
    partIds.forEach(function (id) {
      deck.push(createComponentCard(partById(id), 'part', rng));
    });
    for (var s = 0; s < stage.deck.spells; s += 1) {
      var word = D.WORDS[Math.floor(rng() * D.WORDS.length)];
      deck.push(createCard(word, pickSpell(rng), rng));
    }
    return shuffle(deck, rng);
  }

  function createStageDeck(stage, forAi, rng) {
    return forAi ? createAiDeck(stage, rng) : createPlayerDeck(stage, rng);
  }

  function findHero(heroId) {
    for (var i = 0; i < D.PLAYERS.length; i += 1) {
      if (D.PLAYERS[i].id === heroId) {
        return D.PLAYERS[i];
      }
    }
    return null;
  }

  function findStage(stageId) {
    for (var i = 0; i < D.STAGES.length; i += 1) {
      if (D.STAGES[i].id === stageId) {
        return D.STAGES[i];
      }
    }
    return null;
  }

  function newSideHero(heroId) {
    var hero = findHero(heroId);
    if (!hero) {
      throw new Error('engine: unknown hero ' + heroId);
    }
    return {
      isHero: true,
      side: 'player',
      heroId: hero.id,
      heroName: hero.name,
      heroTitle: hero.title,
      heroPortrait: hero.portrait,
      power: hero.power,
      hp: D.HERO_MAX_HP,
      hpMax: D.HERO_MAX_HP,
      shield: 0,
      mana: 0,
      maxMana: 0,
      deck: [],
      hand: [],
      board: new Array(BOARD).fill(null),
      fatigue: 0,
      powerUsed: false
    };
  }

  function newSideEnemy(stage) {
    return {
      isHero: true,
      side: 'ai',
      heroId: stage.id,
      heroName: stage.name,
      heroTitle: stage.title,
      heroPortrait: stage.portrait,
      power: { id: stage.powerId, name: stage.powerName, mana: 2, desc: stage.powerDesc },
      hp: stage.hp,
      hpMax: stage.hp,
      shield: 0,
      mana: 0,
      maxMana: 0,
      deck: [],
      hand: [],
      board: new Array(BOARD).fill(null),
      fatigue: 0,
      powerUsed: false
    };
  }

  function sideLabel(state, side) {
    return side === state.player ? 'player' : 'ai';
  }

  function drawCard(side, events) {
    if (side.deck.length === 0) {
      side.fatigue += 1;
      dealDamage(side, side.fatigue, events);
      return null;
    }
    var card = side.deck.pop();
    if (side.hand.length >= D.HAND_LIMIT) {
      if (events) {
        events.push({ type: 'burn', side: side.heroId, card: card });
      }
      return null;
    }
    side.hand.push(card);
    return card;
  }

  function startTurn(state, who, events) {
    var side = who === 'player' ? state.player : state.ai;
    state.turn = who;
    state.turnNumber += 1;
    side.maxMana = Math.min(D.MAX_MANA, side.maxMana + 1);
    side.mana = side.maxMana;
    side.powerUsed = false;
    side.shield = 0;
    for (var i = 0; i < side.board.length; i += 1) {
      var m = side.board[i];
      if (m) {
        m.ready = true;
        m.attacked = false;
        m.justPlayed = false;
      }
    }
    for (var h = 0; h < side.hand.length; h += 1) {
      side.hand[h].locked = false;
    }
    drawCard(side, events);
  }

  function createStageMatch(playerHeroId, stageId, rng, now) {
    var random = rng || Math.random;
    var stage = findStage(stageId);
    if (!stage) {
      throw new Error('engine: unknown stage ' + stageId);
    }
    var player = newSideHero(playerHeroId);
    var ai = newSideEnemy(stage);
    player.deck = createPlayerDeck(stage, random);
    ai.deck = createAiDeck(stage, random);
    for (var i = 0; i < D.START_HAND_SIZE; i += 1) {
      drawCard(player, null);
      drawCard(ai, null);
    }
    var state = {
      turn: 'player',
      turnNumber: 0,
      stage: stage,
      stageId: stage.id,
      player: player,
      ai: ai,
      over: false,
      result: null,
      resultReason: null,
      startedAt: now,
      deadline: now + D.MATCH_MS,
      stats: { correct: 0, wrong: 0, assembled: 0, learned: {}, mistakes: {} },
      log: []
    };
    startTurn(state, 'player', null);
    return state;
  }

  function dealDamage(target, amount, events) {
    if (!target || amount <= 0) {
      return 0;
    }
    if (target.isMinion && target.barrierActive) {
      target.barrierActive = false;
      target.abilitySpent = true;
      if (events) {
        events.push({ type: 'barrier-break', target: target, amount: amount });
      }
      return 0;
    }
    var actual = amount;
    if (target.shield > 0) {
      var absorbed = Math.min(target.shield, amount);
      target.shield -= absorbed;
      actual = amount - absorbed;
      if (events) {
        events.push({ type: 'shield-absorb', target: target, amount: absorbed });
      }
    }
    if (actual <= 0) {
      return 0;
    }
    target.hp -= actual;
    if (events) {
      events.push({ type: 'damage', target: target, amount: actual });
    }
    return actual;
  }

  function cleanupBoard(state, side, events) {
    for (var i = 0; i < side.board.length; i += 1) {
      var m = side.board[i];
      if (m && m.hp <= 0) {
        side.board[i] = null;
        if (events) {
          events.push({ type: 'death', side: sideLabel(state, side), slot: i, minion: m });
        }
      }
    }
  }

  function checkOver(state, events) {
    if (state.over) {
      return true;
    }
    var playerDead = state.player.hp <= 0;
    var aiDead = state.ai.hp <= 0;
    if (playerDead || aiDead) {
      state.over = true;
      if (playerDead && aiDead) {
        state.result = 'draw';
      } else if (aiDead) {
        state.result = 'player';
      } else {
        state.result = 'ai';
      }
      state.resultReason = 'hp';
      if (events) {
        events.push({ type: 'over', result: state.result, reason: 'hp' });
      }
      return true;
    }
    return false;
  }

  function checkTime(state, now, events) {
    if (!state.over && now >= state.deadline) {
      state.over = true;
      if (state.player.hp > state.ai.hp) {
        state.result = 'player';
      } else if (state.ai.hp > state.player.hp) {
        state.result = 'ai';
      } else {
        state.result = 'draw';
      }
      state.resultReason = 'time';
      if (events) {
        events.push({ type: 'over', result: state.result, reason: 'time' });
      }
      return true;
    }
    return false;
  }

  function mySide(state) {
    return state.turn === 'player' ? state.player : state.ai;
  }

  function foeSide(state) {
    return state.turn === 'player' ? state.ai : state.player;
  }

  function isOnBoard(side, target) {
    if (!target || !target.isMinion) {
      return false;
    }
    for (var i = 0; i < side.board.length; i += 1) {
      if (side.board[i] === target) {
        return true;
      }
    }
    return false;
  }

  function canPlayCard(state, card) {
    if (state.over) {
      return false;
    }
    var side = mySide(state);
    if (card.locked || card.cost > side.mana) {
      return false;
    }
    return side.hand.indexOf(card) !== -1;
  }

  function isValidDrop(state, card, slot) {
    if (!canPlayCard(state, card) || !isFighter(card)) {
      return false;
    }
    if (slot < 0 || slot >= BOARD) {
      return false;
    }
    return !mySide(state).board[slot];
  }

  function spellTargetValid(state, card, target) {
    var eff = card.effect;
    if (!eff) {
      return false;
    }
    var side = mySide(state);
    var foe = foeSide(state);
    if (eff.target === 'none') {
      return target === null;
    }
    if (eff.target === 'own-hero') {
      return target === side;
    }
    if (eff.target === 'enemy-any') {
      return target === foe || isOnBoard(foe, target);
    }
    if (eff.target === 'own-minion') {
      return isOnBoard(side, target);
    }
    return false;
  }

  function isValidSpellDrop(state, card, target) {
    return canPlayCard(state, card) && card.kind === 'spell' && spellTargetValid(state, card, target);
  }

  function summonMinion(side, card, slot) {
    var minion = {
      isMinion: true,
      uid: card.uid,
      card: card,
      atk: card.minionAtk,
      hp: card.minionHp,
      maxHp: card.minionHp,
      ready: card.ability === 'rush',
      attacked: false,
      justPlayed: true,
      ability: card.ability || null,
      barrierActive: card.ability === 'barrier',
      abilitySpent: false
    };
    side.board[slot] = minion;
    return minion;
  }

  function applyEffect(state, side, eff, target, events) {
    var foe = side === state.player ? state.ai : state.player;
    if (eff.id === 'damage') {
      dealDamage(target, eff.amount, events);
    } else if (eff.id === 'heal') {
      if (target === side) {
        target.hp = Math.min(target.hpMax, target.hp + eff.amount);
      } else if (target && target.isMinion) {
        target.hp = Math.min(target.maxHp, target.hp + eff.amount);
      }
      if (events) {
        events.push({ type: 'heal', target: target, amount: eff.amount });
      }
    } else if (eff.id === 'draw') {
      drawCard(side, events);
    } else if (eff.id === 'buff') {
      if (target && target.isMinion) {
        target.atk += eff.amount;
        target.hp += eff.amount;
        target.maxHp += eff.amount;
        if (events) {
          events.push({ type: 'buff', target: target, amount: eff.amount });
        }
      }
    }
    cleanupBoard(state, foe, events);
    checkOver(state, events);
  }

  function playCard(state, card, placement, events) {
    if (state.over) {
      return { ok: false, reason: 'over' };
    }
    if (!canPlayCard(state, card)) {
      return { ok: false, reason: card.locked ? 'locked' : 'mana' };
    }
    var side = mySide(state);
    if (isFighter(card)) {
      var slot = placement && typeof placement.slot === 'number' ? placement.slot : -1;
      if (!isValidDrop(state, card, slot)) {
        return { ok: false, reason: 'slot' };
      }
      side.mana -= card.cost;
      side.hand.splice(side.hand.indexOf(card), 1);
      var minion = summonMinion(side, card, slot);
      if (events) {
        events.push({ type: 'summon', side: sideLabel(state, side), slot: slot, minion: minion });
      }
      if (card.ability === 'medic') {
        var restored = Math.min(2, side.hpMax - side.hp);
        side.hp += restored;
        minion.abilitySpent = true;
        if (events) {
          events.push({ type: 'heal', target: side, amount: restored, source: 'medic' });
        }
      }
      return { ok: true, minion: minion };
    }
    var target = placement ? placement.target : null;
    if (!isValidSpellDrop(state, card, target)) {
      return { ok: false, reason: 'target' };
    }
    side.mana -= card.cost;
    side.hand.splice(side.hand.indexOf(card), 1);
    if (events) {
      var targetSide = target === state.player || isOnBoard(state.player, target) ? state.player : state.ai;
      events.push({
        type: 'spell',
        side: sideLabel(state, side),
        card: card,
        target: target,
        targetSide: target ? sideLabel(state, targetSide) : null,
        targetSlot: target && target.isMinion ? targetSide.board.indexOf(target) : null
      });
    }
    applyEffect(state, side, card.effect, target, events);
    return { ok: true };
  }

  function canAssemble(state, cards) {
    if (!state || state.over || state.turn !== 'player') {
      return false;
    }
    if (!cards || cards.length < 2) {
      return false;
    }
    var hand = state.player.hand;
    var seen = [];
    for (var i = 0; i < cards.length; i += 1) {
      var card = cards[i];
      if (!card || !card.isComponent || card.locked) {
        return false;
      }
      if (hand.indexOf(card) === -1) {
        return false;
      }
      seen.push(card.componentId);
    }
    return recipesMatching(seen).length === 1;
  }

  function assemble(state, cards, events) {
    if (!canAssemble(state, cards)) {
      return { ok: false, reason: 'no' };
    }
    var ids = cards.map(function (c) { return c.componentId; });
    var recipe = recipesMatching(ids)[0];
    var word = wordById(recipe.wordId);
    if (!word) {
      return { ok: false, reason: 'no' };
    }
    var hand = state.player.hand;
    cards.forEach(function (c) {
      hand.splice(hand.indexOf(c), 1);
    });
    var card = createAssembledCard(word, recipe, Math.random);
    hand.push(card);
    state.stats.assembled += 1;
    drawCard(state.player, events);
    if (events) {
      events.push({ type: 'assembly', card: card, components: cards.slice(), recipe: recipe, word: word });
    }
    return { ok: true, card: card, recipe: recipe, word: word };
  }

  function canAttack(state, minion) {
    if (state.over) {
      return false;
    }
    if (!isOnBoard(mySide(state), minion)) {
      return false;
    }
    return minion.ready && !minion.attacked && minion.atk > 0 && validAttackTargets(state, minion).length > 0;
  }

  function validAttackTargets(state, attacker) {
    var foe = foeSide(state);
    var rushOnly = attacker && attacker.ability === 'rush' && attacker.justPlayed;
    var list = rushOnly ? [] : [foe];
    for (var i = 0; i < foe.board.length; i += 1) {
      if (foe.board[i]) {
        list.push(foe.board[i]);
      }
    }
    return list;
  }

  function attack(state, attacker, target, events) {
    if (state.over) {
      return { ok: false, reason: 'over' };
    }
    if (!canAttack(state, attacker)) {
      return { ok: false, reason: 'not-ready' };
    }
    if (validAttackTargets(state, attacker).indexOf(target) === -1) {
      return { ok: false, reason: 'target' };
    }
    var side = mySide(state);
    var foe = foeSide(state);
    attacker.attacked = true;
    if (events) {
      events.push({ type: 'attack-start', attacker: attacker, target: target });
    }
    dealDamage(target, attacker.atk, events);
    if (target !== foe) {
      dealDamage(attacker, target.atk, events);
    }
    cleanupBoard(state, side, events);
    cleanupBoard(state, foe, events);
    checkOver(state, events);
    if (events) {
      events.push({ type: 'attack-end', attacker: attacker, target: target });
    }
    return { ok: true };
  }

  function canUsePower(state) {
    if (state.over) {
      return false;
    }
    var side = mySide(state);
    return !side.powerUsed && side.mana >= side.power.mana;
  }

  function powerTargetValid(state, target) {
    var spec = D.POWERS[mySide(state).power.id];
    var side = mySide(state);
    var foe = foeSide(state);
    if (spec.target === 'none') {
      return target === null;
    }
    if (spec.target === 'enemy-any') {
      return target === foe || isOnBoard(foe, target);
    }
    if (spec.target === 'own-minion') {
      return isOnBoard(side, target);
    }
    return false;
  }

  function usePower(state, target, events) {
    if (!canUsePower(state)) {
      return { ok: false, reason: 'power' };
    }
    if (!powerTargetValid(state, target)) {
      return { ok: false, reason: 'target' };
    }
    var side = mySide(state);
    var foe = foeSide(state);
    side.mana -= side.power.mana;
    side.powerUsed = true;
    if (events) {
      events.push({ type: 'power', side: sideLabel(state, side), powerId: side.power.id, target: target });
    }
    if (side.power.id === 'heal') {
      side.hp = Math.min(side.hpMax, side.hp + 3);
      if (events) {
        events.push({ type: 'heal', target: side, amount: 3, source: 'power' });
      }
    } else if (side.power.id === 'bolt') {
      dealDamage(target, 2, events);
      cleanupBoard(state, foe, events);
      checkOver(state, events);
    } else if (side.power.id === 'buff') {
      target.atk += 1;
      target.hp += 1;
      target.maxHp += 1;
      if (events) {
        events.push({ type: 'buff', target: target, amount: 1, source: 'power' });
      }
    } else if (side.power.id === 'shield') {
      side.shield = 3;
      if (events) {
        events.push({ type: 'shield', target: side, amount: 3, source: 'power' });
      }
    } else if (side.power.id === 'draw') {
      drawCard(side, events);
    }
    return { ok: true };
  }

  function endTurn(state, events) {
    if (state.over) {
      return null;
    }
    var next = state.turn === 'player' ? 'ai' : 'player';
    startTurn(state, next, events);
    return next;
  }

  function resolveAnswer(state, card, correct, events) {
    if (correct) {
      state.stats.correct += 1;
      state.stats.learned[card.wordId] = (state.stats.learned[card.wordId] || 0) + 1;
    } else {
      state.stats.wrong += 1;
      state.stats.mistakes[card.wordId] = (state.stats.mistakes[card.wordId] || 0) + 1;
      card.locked = true;
      if (events) {
        events.push({ type: 'card-locked', card: card });
      }
    }
    return correct;
  }

  function buildOptions(correctValue, pool, field, rng, count) {
    var random = rng || Math.random;
    var shuffled = shuffle(pool, random);
    var used = Object.create(null);
    used[correctValue] = true;
    var distractors = [];
    for (var p = 0; p < shuffled.length && distractors.length < count; p += 1) {
      var val = shuffled[p][field];
      if (val && !used[val]) {
        used[val] = true;
        distractors.push(val);
      }
    }
    if (distractors.length < count) {
      throw new Error('engine: not enough distractors');
    }
    return shuffle(distractors.concat([correctValue]), random);
  }

  function makeQuestion(card, rng) {
    var random = rng || Math.random;
    if (card.isComponent) {
      if (card.role === 'key') {
        var radical = radicalById(card.componentId);
        if (!radical) {
          throw new Error('engine: unknown radical for card');
        }
        var rField = random() < 0.5 ? 'ru' : 'pinyin';
        return {
          mode: 'radical-' + rField,
          subject: 'radical',
          hanzi: radical.glyph,
          field: rField,
          correct: radical[rField],
          options: buildOptions(radical[rField], D.RADICALS, rField, random, 3),
          note: radical.note,
          pinyin: radical.pinyin,
          ru: radical.ru,
          speakText: radical.full
        };
      }
      var part = partById(card.componentId);
      if (!part) {
        throw new Error('engine: unknown part for card');
      }
      var pField = random() < 0.5 ? 'ru' : 'pinyin';
      return {
        mode: 'part-' + pField,
        subject: 'part',
        hanzi: part.hanzi,
        field: pField,
        correct: part[pField],
        options: buildOptions(part[pField], D.PARTS, pField, random, 3),
        note: part.note,
        pinyin: part.pinyin,
        ru: part.ru,
        speakText: part.hanzi
      };
    }
    var word = wordById(card.wordId);
    if (!word) {
      throw new Error('engine: unknown word for card');
    }
    var field = random() < 0.5 ? 'ru' : 'pinyin';
    return {
      mode: field,
      subject: 'word',
      hanzi: word.hanzi,
      field: field,
      correct: word[field],
      options: buildOptions(word[field], D.WORDS, field, random, 3),
      note: word.note,
      pinyin: word.pinyin,
      ru: word.ru,
      radical: word.radical
    };
  }

  function makeAssembleQuestion(recipe, rng) {
    var random = rng || Math.random;
    var word = wordById(recipe.wordId);
    if (!word) {
      throw new Error('engine: unknown word for assemble question');
    }
    return {
      mode: 'assemble',
      subject: 'assemble',
      hanzi: word.hanzi,
      partsDisplay: recipeDisplay(recipe),
      field: 'ru',
      correct: word.ru,
      options: buildOptions(word.ru, D.WORDS, 'ru', random, 3),
      note: word.note,
      pinyin: word.pinyin,
      ru: word.ru,
      radicalRu: (radicalById(word.radical) || {}).ru || '',
      radicalPinyin: (radicalById(word.radical) || {}).pinyin || '',
      radicalGlyph: (radicalById(word.radical) || {}).glyph || ''
    };
  }

  function firstFreeSlot(side) {
    for (var i = 0; i < side.board.length; i += 1) {
      if (!side.board[i]) {
        return i;
      }
    }
    return -1;
  }

  function pickDamageTarget(state, amount) {
    var foe = state.player;
    if (foe.hp <= amount) {
      return foe;
    }
    var best = null;
    var bestAtk = 0;
    for (var i = 0; i < foe.board.length; i += 1) {
      var m = foe.board[i];
      if (m && !m.barrierActive && m.hp <= amount && m.atk > bestAtk) {
        best = m;
        bestAtk = m.atk;
      }
    }
    return best || foe;
  }

  function chooseTrade(state, attacker) {
    var foe = state.player;
    var best = null;
    var bestScore = -1;
    for (var i = 0; i < foe.board.length; i += 1) {
      var m = foe.board[i];
      if (!m) {
        continue;
      }
      if ((attacker.barrierActive || attacker.hp > m.atk) && !m.barrierActive && attacker.atk >= m.hp) {
        var score = m.atk * 2 + m.hp;
        if (score > bestScore) {
          bestScore = score;
          best = m;
        }
      }
    }
    return best;
  }

  var AI = {
    takeTurn: function (state, events) {
      if (state.over || state.turn !== 'ai') {
        return;
      }
      var side = state.ai;
      var i;
      var guard = 0;
      var played = true;
      while (played && !state.over && guard < 30) {
        guard += 1;
        played = false;
        var bestCard = null;
        var bestScore = 0.5;
        var bestPlacement = null;
        for (i = 0; i < side.hand.length; i += 1) {
          var card = side.hand[i];
          if (card.cost > side.mana || card.locked) {
            continue;
          }
          if (isFighter(card)) {
            var slot = firstFreeSlot(side);
            if (slot === -1) {
              continue;
            }
            var score = card.minionAtk + card.minionHp + 1;
            if (card.ability === 'barrier') {
              score += 1.5;
            } else if (card.ability === 'medic') {
              score += Math.min(2, side.hpMax - side.hp);
            } else if (card.ability === 'rush' && state.player.board.some(function (m) { return !!m; })) {
              score += 1;
            }
            if (score > bestScore) {
              bestScore = score;
              bestCard = card;
              bestPlacement = { slot: slot };
            }
          } else if (card.effect) {
            var eff = card.effect;
            var escore = 0;
            var etarget = null;
            if (eff.id === 'damage') {
              etarget = pickDamageTarget(state, eff.amount);
              escore = eff.amount + 1;
            } else if (eff.id === 'draw') {
              escore = 1.5;
            } else if (eff.id === 'heal') {
              if (eff.target === 'own-hero') {
                etarget = side;
                escore = side.hp <= side.hpMax - eff.amount ? 2 : 0;
              } else {
                for (var b = 0; b < side.board.length; b += 1) {
                  var bm = side.board[b];
                  if (bm && bm.maxHp - bm.hp >= eff.amount && bm.atk >= 3) {
                    etarget = bm;
                    escore = 2;
                    break;
                  }
                }
              }
            } else if (eff.id === 'buff') {
              for (var b2 = 0; b2 < side.board.length; b2 += 1) {
                var bm2 = side.board[b2];
                if (bm2) {
                  etarget = bm2;
                  escore = 1.2;
                  break;
                }
              }
            }
            if (escore > bestScore) {
              bestScore = escore;
              bestCard = card;
              bestPlacement = { target: etarget };
            }
          }
        }
        if (bestCard && bestPlacement) {
          var res = playCard(state, bestCard, bestPlacement, events);
          played = res.ok;
        }
      }
      if (canUsePower(state)) {
        var spec = D.POWERS[side.power.id];
        var target = null;
        if (spec.target === 'enemy-any') {
          target = pickDamageTarget(state, 2);
        } else if (spec.target === 'own-minion') {
          for (i = 0; i < side.board.length; i += 1) {
            if (side.board[i]) {
              target = side.board[i];
              break;
            }
          }
        }
        var worth = true;
        if (side.power.id === 'heal' && side.hp > side.hpMax - 3) {
          worth = false;
        }
        if (side.power.id === 'buff' && !target) {
          worth = false;
        }
        if (worth && (spec.target === 'none' || target)) {
          usePower(state, target, events);
        }
      }
      var attackers = [];
      for (i = 0; i < side.board.length; i += 1) {
        var m = side.board[i];
        if (m && canAttack(state, m)) {
          attackers.push(m);
        }
      }
      for (var a = 0; a < attackers.length && !state.over; a += 1) {
        var atk = attackers[a];
        if (!isOnBoard(side, atk) || atk.attacked) {
          continue;
        }
        var targets = validAttackTargets(state, atk);
        var victim = chooseTrade(state, atk);
        if (!victim) {
          victim = targets.indexOf(state.player) !== -1 ? state.player : targets.slice().sort(function (x, y) {
            return (x.barrierActive ? 100 : x.hp) - (y.barrierActive ? 100 : y.hp);
          })[0];
        }
        if (victim) {
          attack(state, atk, victim, events);
        }
      }
    }
  };

  return {
    createStageMatch: createStageMatch,
    createStageDeck: createStageDeck,
    createRng: createRng,
    drawCard: drawCard,
    startTurn: startTurn,
    canPlayCard: canPlayCard,
    canAttack: canAttack,
    canUsePower: canUsePower,
    canAssemble: canAssemble,
    assemble: assemble,
    partialRecipeMatches: partialRecipeMatches,
    recipesMatching: recipesMatching,
    isValidDrop: isValidDrop,
    isValidSpellDrop: isValidSpellDrop,
    spellTargetValid: spellTargetValid,
    powerTargetValid: powerTargetValid,
    validAttackTargets: validAttackTargets,
    playCard: playCard,
    attack: attack,
    usePower: usePower,
    endTurn: endTurn,
    resolveAnswer: resolveAnswer,
    makeQuestion: makeQuestion,
    makeAssembleQuestion: makeAssembleQuestion,
    checkTime: checkTime,
    checkOver: checkOver,
    cleanupBoard: cleanupBoard,
    dealDamage: dealDamage,
    wordById: wordById,
    radicalById: radicalById,
    partById: partById,
    componentById: componentById,
    componentGlyph: componentGlyph,
    recipeByWord: recipeByWord,
    recipeDisplay: recipeDisplay,
    AI: AI
  };
}());
