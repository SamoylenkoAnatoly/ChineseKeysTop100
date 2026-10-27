'use strict';

const test = require('node:test');
const assert = require('node:assert');

global.window = global;
require('../data.js');
require('../engine.js');

const D = window.KEYGAME_DATA;
const E = window.KEYGAME_ENGINE;

const USER_WORDS = ['体', '休', '从', '错', '银', '钱', '谢', '说', '话', '蚊', '虾', '虽', '草', '桥', '树', '林', '拿', '找', '打', '想', '快', '忙', '喝', '吃', '叫', '汉', '茶', '花', '海', '河'];

function makeMatch(stageId) {
  const rng = E.createRng(20261011);
  return E.createStageMatch('wizard', stageId || 'wen', rng, 1000);
}

function compCard(componentId, overrides) {
  const comp = E.componentById(componentId);
  const role = D.RADICALS.some((r) => r.id === componentId) ? 'key' : 'part';
  const base = role === 'key' ? D.KEY_CARD : D.PART_CARD;
  return Object.assign({
    uid: 'test-' + componentId + '-' + Math.random().toString(36).slice(2),
    wordId: componentId,
    componentId: componentId,
    hanzi: comp.glyph || comp.hanzi,
    pinyin: comp.pinyin,
    ru: comp.ru,
    note: comp.note,
    cost: base.cost,
    kind: 'component',
    isComponent: true,
    role: role,
    name: role === 'key' ? 'Ключ: ' + comp.ru : 'Часть: ' + comp.ru,
    text: '',
    minionAtk: base.atk,
    minionHp: base.hp,
    effect: null,
    ability: null,
    radicalId: role === 'key' ? componentId : null,
    locked: false
  }, overrides);
}

test('словарь совпадает с пользовательским списком', () => {
  assert.strictEqual(D.WORDS.length, USER_WORDS.length);
  const hanzi = D.WORDS.map((w) => w.hanzi);
  for (const word of USER_WORDS) {
    assert.ok(hanzi.includes(word), 'отсутствует: ' + word);
  }
  assert.strictEqual(new Set(D.WORDS.map((w) => w.id)).size, D.WORDS.length, 'id уникальны');
  assert.strictEqual(new Set(hanzi).size, hanzi.length, 'иероглифы уникальны');
});

test('ключи, части и рецепты: полный и корректный набор', () => {
  assert.strictEqual(D.RADICALS.length, 10);
  assert.strictEqual(D.PARTS.length, 25);
  assert.strictEqual(D.RECIPES.length, 30);
  const byHanzi = new Map(D.WORDS.map((w) => [w.hanzi, w]));
  for (const recipe of D.RECIPES) {
    const word = E.wordById(recipe.wordId);
    assert.ok(word, 'рецепт ссылается на слово');
    assert.ok(recipe.components.length >= 2, 'в рецепте минимум два компонента');
    for (const c of recipe.components) {
      assert.ok(E.componentById(c), 'компонент существует: ' + c);
    }
  }
  // особые рецепты: два одинаковых ключа и три компонента
  const linRecipe = D.RECIPES.find((r) => r.wordId === 'w-lin');
  assert.deepStrictEqual(linRecipe.components.sort(), ['mu', 'mu'], '林 = 木 + 木');
  const congRecipe = D.RECIPES.find((r) => r.wordId === 'w-cong');
  assert.deepStrictEqual(congRecipe.components.sort(), ['ren', 'ren'], '从 = 亻 + 亻');
  const chaRecipe = D.RECIPES.find((r) => r.wordId === 'w-cha');
  assert.strictEqual(chaRecipe.components.length, 3, '茶 из трёх компонентов');
  assert.deepStrictEqual(chaRecipe.display, ['艹', '人', '木']);
  // нет двух рецептов с одинаковым набором
  const keys = D.RECIPES.map((r) => r.components.slice().sort().join('|'));
  assert.strictEqual(new Set(keys).size, keys.length, 'наборы компонентов уникальны');
});

test('колода игрока: только компоненты и заклинания', () => {
  const rng = E.createRng(42);
  const stage = D.STAGES[0];
  const deck = E.createStageDeck(stage, false, rng);
  const expected = stage.deck.keys + stage.deck.parts + stage.deck.spells;
  assert.strictEqual(deck.length, expected);
  const comps = deck.filter((c) => c.isComponent);
  const spells = deck.filter((c) => c.kind === 'spell');
  const ready = deck.filter((c) => c.kind === 'minion');
  assert.strictEqual(comps.length, stage.deck.keys + stage.deck.parts);
  assert.strictEqual(spells.length, stage.deck.spells);
  assert.strictEqual(ready.length, 0, 'готовых иероглифов в колоде игрока нет');
  const keys = comps.filter((c) => c.role === 'key');
  const parts = comps.filter((c) => c.role === 'part');
  assert.strictEqual(keys.length, stage.deck.keys);
  assert.strictEqual(parts.length, stage.deck.parts);
  for (const k of keys) {
    assert.strictEqual(k.minionAtk, 1);
    assert.strictEqual(k.minionHp, 1);
    assert.strictEqual(k.cost, 1);
  }
  for (const p of parts) {
    assert.strictEqual(p.minionAtk, 1);
    assert.strictEqual(p.minionHp, 2);
  }
});

test('колода стража: бойцы и заклинания с надбавкой этапа', () => {
  const stage3 = D.STAGES[2];
  const rng = E.createRng(7);
  const aiDeck = E.createStageDeck(stage3, true, rng);
  assert.strictEqual(aiDeck.length, stage3.deck.words + stage3.deck.spells);
  assert.strictEqual(aiDeck.filter((c) => c.isComponent).length, 0, 'у стража нет компонентов');
  const byName = new Map(D.MINION_TEMPLATES.map((t) => [t.name, t]));
  for (const c of aiDeck.filter((x) => x.kind === 'minion')) {
    const t = byName.get(c.name);
    assert.ok(t, 'шаблон найден: ' + c.name);
    assert.strictEqual(c.minionAtk, t.atk + stage3.bonusAtk);
    assert.strictEqual(c.minionHp, t.hp + stage3.bonusHp);
  }
});

test('createStageMatch: герои, руки и страж', () => {
  const state = makeMatch('wen');
  assert.strictEqual(state.player.hp, 30);
  assert.strictEqual(state.player.hpMax, 30);
  assert.strictEqual(state.ai.hp, 14);
  assert.strictEqual(state.ai.heroName, 'Вэнь');
  assert.strictEqual(state.ai.power.id, 'bolt');
  assert.strictEqual(state.turn, 'player');
  assert.strictEqual(state.player.hand.length, 5, 'стартовая рука 4 + добор хода');
  assert.strictEqual(state.ai.hand.length, 4);
  assert.strictEqual(state.stats.assembled, 0);
});

test('сборка: успех, характеристики и способности', () => {
  const cases = [
    [['ren', 'p-ben'], 'w-ti', null],
    [['jin', 'p-xi'], 'w-cuo', 'barrier'],
    [['shou', 'p-ding'], 'w-da', 'rush'],
    [['xin', 'p-guai'], 'w-kuai', 'medic'],
    [['ren', 'ren'], 'w-cong', null],
    [['mu', 'mu'], 'w-lin', null],
    [['cao', 'ren', 'mu'], 'w-cha', null]
  ];
  for (const [ids, wordId, ability] of cases) {
    const state = makeMatch('wen');
    const cards = ids.map((id) => compCard(id));
    cards.forEach((c) => state.player.hand.push(c));
    assert.strictEqual(E.canAssemble(state, cards), true, ids.join('+'));
    const res = E.assemble(state, cards, []);
    assert.strictEqual(res.ok, true, ids.join('+'));
    assert.strictEqual(res.word.id, wordId);
    const card = res.card;
    assert.strictEqual(card.hanzi, E.wordById(wordId).hanzi);
    assert.strictEqual(card.kind, 'minion');
    assert.strictEqual(card.assembled, true);
    assert.strictEqual(card.minionAtk, D.ASSEMBLY.atk);
    assert.strictEqual(card.minionHp, D.ASSEMBLY.hp);
    assert.strictEqual(card.ability, ability, ids.join('+') + ' способность');
    assert.strictEqual(card.cost, D.ASSEMBLY.cost);
    for (const c of cards) {
      assert.strictEqual(state.player.hand.indexOf(c), -1, 'компонент израсходован');
    }
    assert.ok(state.player.hand.indexOf(card) !== -1, 'собранный знак в руке');
    assert.ok(card.assembledFrom.length >= 3, 'строка происхождения заполнена');
  }
  const st = makeMatch('wen');
  assert.strictEqual(st.stats.assembled, 0);
  const pair = [compCard('shui'), compCard('p-ke')].map((c) => (st.player.hand.push(c), c));
  const deckBefore = st.player.deck.length;
  E.assemble(st, pair, []);
  assert.strictEqual(st.stats.assembled, 1);
  assert.strictEqual(st.player.deck.length, deckBefore - 1, 'сборка даёт добор карты');
});

test('сборка: отказы', () => {
  const state = makeMatch('wen');
  const key = compCard('ren');
  const part = compCard('p-ben');
  state.player.hand.push(key);
  state.player.hand.push(part);

  const wrongPart = compCard('p-ke');
  state.player.hand.push(wrongPart);
  assert.strictEqual(E.canAssemble(state, [key, wrongPart]), false, 'чужая часть');
  assert.strictEqual(E.recipesMatching(['ren', 'p-ke']).length, 0, 'рецепта нет');

  const single = [compCard('ren'), compCard('mu')];
  single.forEach((c) => state.player.hand.push(c));
  assert.strictEqual(E.canAssemble(state, [single[0]]), false, 'одного компонента мало');
  assert.strictEqual(E.canAssemble(state, single), true, '亻+木 = 休');

  const locked = compCard('mu', { locked: true });
  state.player.hand.push(locked);
  assert.strictEqual(E.canAssemble(state, [compCard('ren'), locked]), false, 'залоченный компонент');

  assert.strictEqual(E.canAssemble(state, [key, part, single[0]]), false, 'лишний компонент');
  const outside = [compCard('cao'), compCard('p-zao')];
  assert.strictEqual(E.canAssemble(state, outside), false, 'компоненты вне руки');
});

test('частичное совпадение рецептов', () => {
  assert.strictEqual(E.partialRecipeMatches([]), true);
  assert.strictEqual(E.partialRecipeMatches(['ren']), true);
  assert.strictEqual(E.partialRecipeMatches(['ren', 'mu']), true, '休');
  assert.strictEqual(E.partialRecipeMatches(['ren', 'p-ben']), true, '体');
  assert.strictEqual(E.partialRecipeMatches(['jin', 'p-ben']), false, 'такого рецепта нет');
  assert.strictEqual(E.partialRecipeMatches(['cao', 'ren']), true, 'начало 茶');
  assert.strictEqual(E.partialRecipeMatches(['cao', 'ren', 'mu']), true, 'полный 茶');
  assert.strictEqual(E.partialRecipeMatches(['cao', 'ren', 'p-zao']), false, 'лишняя часть');
  assert.strictEqual(E.partialRecipeMatches(['mu']), true, '木 ждёт пару');
});

test('вопросы: ключи, части, слова и сборка', () => {
  const rng = E.createRng(5);
  const keyCard = compCard('kou');
  const q1 = E.makeQuestion(keyCard, rng);
  assert.strictEqual(q1.subject, 'radical');
  assert.strictEqual(q1.hanzi, '口');
  assert.strictEqual(q1.options.length, 4);
  assert.ok(q1.options.includes(q1.correct));
  assert.strictEqual(q1.speakText, '口');

  const partCard = compCard('p-ben');
  const q2 = E.makeQuestion(partCard, rng);
  assert.strictEqual(q2.subject, 'part');
  assert.strictEqual(q2.hanzi, '本');
  assert.strictEqual(q2.options.length, 4);
  assert.ok(q2.options.includes(q2.correct));

  const assembled = { wordId: 'w-cha', kind: 'minion', hanzi: '茶' };
  const q3 = E.makeQuestion(assembled, rng);
  assert.strictEqual(q3.subject, 'word');
  assert.strictEqual(q3.hanzi, '茶');
  assert.ok(q3.options.includes(q3.correct));

  const recipe = E.recipeByWord('w-ti');
  const aq = E.makeAssembleQuestion(recipe, rng);
  assert.strictEqual(aq.subject, 'assemble');
  assert.strictEqual(aq.hanzi, '体');
  assert.strictEqual(aq.partsDisplay, '亻 + 本');
  assert.strictEqual(aq.field, 'ru', 'вопрос о переводе');
  assert.strictEqual(aq.correct, 'тело');
  assert.strictEqual(aq.options.length, 4);
  assert.ok(aq.options.includes('тело'));
  for (const opt of aq.options) {
    assert.ok(D.WORDS.some((w) => w.ru === opt), 'вариант — перевод из урока');
  }
  const aqCha = E.makeAssembleQuestion(E.recipeByWord('w-cha'), rng);
  assert.strictEqual(aqCha.partsDisplay, '艹 + 人 + 木');
  assert.strictEqual(aqCha.correct, 'чай');
});

test('бой: призыв, атака, завершение', () => {
  const state = makeMatch('xia');
  const a = { isMinion: true, uid: 'm-a', card: null, atk: 3, hp: 3, maxHp: 3, ready: true, attacked: false, justPlayed: false };
  const b = { isMinion: true, uid: 'm-b', card: null, atk: 2, hp: 2, maxHp: 2, ready: true, attacked: false, justPlayed: false };
  state.player.board[0] = a;
  state.ai.board[0] = b;
  const targets = E.validAttackTargets(state, a);
  assert.ok(targets.includes(state.ai));
  assert.ok(targets.includes(b));
  assert.strictEqual(E.attack(state, a, b, []).ok, true);
  assert.strictEqual(b.hp, -1);
  assert.strictEqual(a.hp, 1);
  E.cleanupBoard(state, state.ai, []);
  assert.strictEqual(state.ai.board[0], null);

  E.dealDamage(state.ai, 99, []);
  assert.strictEqual(E.checkOver(state, []), true);
  assert.strictEqual(state.result, 'player');

  const state2 = makeMatch('he');
  assert.strictEqual(E.checkTime(state2, 1000, []), false);
  assert.strictEqual(E.checkTime(state2, 1000 + D.MATCH_MS + 1, []), true);
});

test('компонент играется на стол как боец', () => {
  const state = makeMatch('wen');
  const comp = compCard('p-ben', { cost: 1 });
  state.player.hand.push(comp);
  state.player.mana = 3;
  const res = E.playCard(state, comp, { slot: 0 }, []);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(state.player.board[0].atk, 1);
  assert.strictEqual(state.player.board[0].hp, 2);
});

test('собранный знак играет силой героя на стол', () => {
  const state = makeMatch('wen');
  const assembled = {
    uid: 'asm-1', wordId: 'w-cuo', hanzi: '错', pinyin: 'cuò', ru: 'ошибка', note: '',
    cost: D.ASSEMBLY.cost, kind: 'minion', name: 'ошибка', text: '',
    minionAtk: D.ASSEMBLY.atk, minionHp: D.ASSEMBLY.hp, effect: null,
    ability: 'barrier', assembled: true, assembledFrom: '钅 + 昔', radicalId: 'jin'
  };
  state.player.hand.push(assembled);
  state.player.mana = 3;
  const res = E.playCard(state, assembled, { slot: 2 }, []);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(state.player.board[2].atk, 4);
  assert.strictEqual(state.player.board[2].hp, 5);
  assert.strictEqual(state.player.board[2].barrierActive, true, 'щит от металла');
});

test('ход стража проходит без ошибок', () => {
  const state = makeMatch('he');
  for (let i = 0; i < 40 && !state.over; i += 1) {
    if (state.turn === 'ai') {
      E.AI.takeTurn(state, []);
    } else {
      const playable = state.player.hand.find((c) => !c.locked && c.cost <= state.player.mana && (c.isComponent || c.kind === 'spell'));
      if (playable) {
        if (playable.kind === 'spell') {
          const t = playable.effect.target === 'none' ? null : (playable.effect.target === 'own-hero' ? state.player : state.ai);
          E.playCard(state, playable, { target: t }, []);
        } else {
          const slot = state.player.board.findIndex((s) => !s);
          if (slot !== -1) {
            E.playCard(state, playable, { slot: slot }, []);
          }
        }
      }
      const attacker = state.player.board.find((m) => m && E.canAttack(state, m));
      if (attacker) {
        E.attack(state, attacker, state.ai, []);
      }
    }
    E.endTurn(state, []);
  }
  assert.ok(state.turnNumber > 0);
});

test('неверный ответ блокирует карту, верный учит', () => {
  const state = makeMatch('wen');
  const card = compCard('p-hua');
  state.player.hand.push(card);
  E.resolveAnswer(state, card, false, []);
  assert.strictEqual(card.locked, true);
  assert.strictEqual(state.stats.wrong, 1);
  assert.strictEqual(state.stats.mistakes['p-hua'], 1);
  card.locked = false;
  E.resolveAnswer(state, card, true, []);
  assert.strictEqual(state.stats.correct, 1);
  assert.strictEqual(state.stats.learned['p-hua'], 1);
});
