window.KEYGAME_DATA = (function () {
  'use strict';

  var WORDS = [
    { id: 'w-ti', hanzi: '体', pinyin: 'tǐ', ru: 'тело', radical: 'ren', note: 'Человек 亻 + основа 本: тело — основа человека.' },
    { id: 'w-xiu', hanzi: '休', pinyin: 'xiū', ru: 'отдыхать; отдых', radical: 'ren', note: 'Человек 亻 прислонился к дереву 木 — отдых.' },
    { id: 'w-cong', hanzi: '从', pinyin: 'cóng', ru: 'следовать; из (откуда)', radical: 'ren', note: 'Один человек 人 идёт следом за другим — следовать.' },
    { id: 'w-cuo', hanzi: '错', pinyin: 'cuò', ru: 'ошибка; ошибаться', radical: 'jin', note: 'Металл 钅 + прежде 昔: в старину ошибку отливали в металле.' },
    { id: 'w-yin', hanzi: '银', pinyin: 'yín', ru: 'серебро', radical: 'jin', note: 'Металл 钅 + знак светлого оттенка: серебро — белый металл.' },
    { id: 'w-qian', hanzi: '钱', pinyin: 'qián', ru: 'деньги', radical: 'jin', note: 'Металл 钅: деньги — это медные и железные монеты.' },
    { id: 'w-xie', hanzi: '谢', pinyin: 'xiè', ru: 'благодарить', radical: 'yan', note: 'Речь 讠: благодарность выражают словами.' },
    { id: 'w-shuo', hanzi: '说', pinyin: 'shuō', ru: 'говорить; сказать', radical: 'yan', note: 'Речь 讠 + обмен 兑: говорить, обмениваясь словами.' },
    { id: 'w-hua', hanzi: '话', pinyin: 'huà', ru: 'слова; речь; разговор', radical: 'yan', note: 'Речь 讠 + язык 舌: слова выходят из языка.' },
    { id: 'w-wen2', hanzi: '蚊', pinyin: 'wén', ru: 'комар', radical: 'chong', note: 'Насекомое 虫 + узор 文: комар с узорчатым тельцем.' },
    { id: 'w-xia', hanzi: '虾', pinyin: 'xiā', ru: 'креветка', radical: 'chong', note: 'Насекомое 虫 + низ 下: креветка живёт внизу, на дне.' },
    { id: 'w-sui', hanzi: '虽', pinyin: 'suī', ru: 'хотя; несмотря на', radical: 'chong', note: 'Рот 口 над насекомым 虫 — служебное слово «хотя».' },
    { id: 'w-cao', hanzi: '草', pinyin: 'cǎo', ru: 'трава', radical: 'cao', note: 'Трава 艹 + рано 早: трава встаёт раньше всех.' },
    { id: 'w-cha', hanzi: '茶', pinyin: 'chá', ru: 'чай', radical: 'cao', note: 'Трава 艹, человек 人 и дерево 木: человек среди травы и дерева собирает чай.' },
    { id: 'w-hua2', hanzi: '花', pinyin: 'huā', ru: 'цветок', radical: 'cao', note: 'Трава 艹 + превращение 化: цветок — превращение травы.' },
    { id: 'w-qiao', hanzi: '桥', pinyin: 'qiáo', ru: 'мост', radical: 'mu', note: 'Дерево 木 + высокий 乔: мост из высоких брёвен.' },
    { id: 'w-shu', hanzi: '树', pinyin: 'shù', ru: 'дерево (растение)', radical: 'mu', note: 'Дерево 木 + пара 对: саженец, посаженный руками.' },
    { id: 'w-lin', hanzi: '林', pinyin: 'lín', ru: 'лес; роща', radical: 'mu', note: 'Два дерева 木 рядом — уже лес.' },
    { id: 'w-na', hanzi: '拿', pinyin: 'ná', ru: 'брать; взять', radical: 'shou', note: 'Соединить 合 над рукой 手: сложить руки, чтобы взять.' },
    { id: 'w-zhao', hanzi: '找', pinyin: 'zhǎo', ru: 'искать', radical: 'shou', note: 'Рука 扌 + копьё 戈: искать, держа копьё.' },
    { id: 'w-da', hanzi: '打', pinyin: 'dǎ', ru: 'бить; ударять', radical: 'shou', note: 'Рука 扌 + гвоздь 丁: рука бьёт по гвоздю.' },
    { id: 'w-xiang', hanzi: '想', pinyin: 'xiǎng', ru: 'думать; хотеть', radical: 'xin', note: 'Смотреть 相 на сердце 心 — размышлять.' },
    { id: 'w-kuai', hanzi: '快', pinyin: 'kuài', ru: 'быстрый; скоро', radical: 'xin', note: 'Сердце 忄 спешит — быстрый.' },
    { id: 'w-mang', hanzi: '忙', pinyin: 'máng', ru: 'занятой; хлопотный', radical: 'xin', note: 'Сердце 忄 + терять 亡: занятое сердце всё забывает.' },
    { id: 'w-he', hanzi: '喝', pinyin: 'hē', ru: 'пить', radical: 'kou', note: 'Рот 口 + жажда 曷: пить, когда сухо во рту.' },
    { id: 'w-chi', hanzi: '吃', pinyin: 'chī', ru: 'есть; кушать', radical: 'kou', note: 'Рот 口 + просить 乞: рот просит еды.' },
    { id: 'w-jiao', hanzi: '叫', pinyin: 'jiào', ru: 'звать; кричать', radical: 'kou', note: 'Рот 口 изгибается 丩 — кричит и зовёт.' },
    { id: 'w-han', hanzi: '汉', pinyin: 'hàn', ru: 'китаец; китайский (язык)', radical: 'shui', note: 'Вода 氵 + ещё 又: река Ханьшуй дала имя ханьцам.' },
    { id: 'w-hai', hanzi: '海', pinyin: 'hǎi', ru: 'море', radical: 'shui', note: 'Вода 氵 + каждая 每: море собирает каждую воду.' },
    { id: 'w-he2', hanzi: '河', pinyin: 'hé', ru: 'река', radical: 'shui', note: 'Вода 氵 + можно 可: река, по которой можно плыть.' }
  ];

  var RADICALS = [
    { id: 'ren', glyph: '亻', full: '人', pinyin: 'rén', ru: 'человек', note: 'Ключ «человек»: слева пишется узким 亻.' },
    { id: 'jin', glyph: '钅', full: '金', pinyin: 'jīn', ru: 'металл; золото', note: 'Ключ «металл»: слева в виде 钅.' },
    { id: 'yan', glyph: '讠', full: '言', pinyin: 'yán', ru: 'речь; слово', note: 'Ключ «речь»: слева в виде 讠.' },
    { id: 'chong', glyph: '虫', full: '虫', pinyin: 'chóng', ru: 'насекомое; червь', note: 'Ключ «насекомое»: узкая колонка слева или снизу.' },
    { id: 'cao', glyph: '艹', full: '艸', pinyin: 'cǎo', ru: 'трава', note: 'Ключ «трава»: шапка наверху 艹.' },
    { id: 'mu', glyph: '木', full: '木', pinyin: 'mù', ru: 'дерево', note: 'Ключ «дерево»: ствол с ветвями и корнями.' },
    { id: 'shou', glyph: '扌', full: '手', pinyin: 'shǒu', ru: 'рука', note: 'Ключ «рука»: слева в виде 扌.' },
    { id: 'xin', glyph: '忄', full: '心', pinyin: 'xīn', ru: 'сердце', note: 'Ключ «сердце»: слева узкое 忄 или снизу 心.' },
    { id: 'kou', glyph: '口', full: '口', pinyin: 'kǒu', ru: 'рот; отверстие', note: 'Ключ «рот»: слева или снизу.' },
    { id: 'shui', glyph: '氵', full: '水', pinyin: 'shuǐ', ru: 'вода', note: 'Ключ «вода»: слева три капли 氵.' }
  ];

  var PARTS = [
    { id: 'p-ben', hanzi: '本', pinyin: 'běn', ru: 'корень; основа', note: 'Дерево с подчёркнутым корнем: основа, источник.' },
    { id: 'p-xi', hanzi: '昔', pinyin: 'xī', ru: 'прежде; прошлое', note: 'Волны над солнцем: прежние дни, вода и закат.' },
    { id: 'p-gen', hanzi: '艮', pinyin: 'gèn', ru: 'крепкий; знак горы', note: 'Знак горы из восьми триграмм: твёрдый и незыблемый.' },
    { id: 'p-jian', hanzi: '戋', pinyin: 'jiān', ru: 'малый; узкий', note: 'Два копья крест-накрест: маленький, тонкий.' },
    { id: 'p-she', hanzi: '射', pinyin: 'shè', ru: 'стрелять', note: 'Рука с телом: стрелять из лука.' },
    { id: 'p-dui', hanzi: '兑', pinyin: 'duì', ru: 'менять; обменивать', note: 'Рот и человек: обмен словами.' },
    { id: 'p-shge', hanzi: '舌', pinyin: 'shé', ru: 'язык (орган)', note: 'Рот с высунутым языком.' },
    { id: 'p-wen', hanzi: '文', pinyin: 'wén', ru: 'узор; письменность', note: 'Пересечённые линии: узор, а затем — письмо.' },
    { id: 'p-xia', hanzi: '下', pinyin: 'xià', ru: 'низ; вниз', note: 'Черта под чертой: низ, вниз.' },
    { id: 'p-zao', hanzi: '早', pinyin: 'zǎo', ru: 'рано; утро', note: 'Солнце над полем: раннее утро.' },
    { id: 'p-hua', hanzi: '化', pinyin: 'huà', ru: 'превращаться', note: 'Человек, меняющий облик: превращение.' },
    { id: 'p-qiao', hanzi: '乔', pinyin: 'qiáo', ru: 'высокий', note: 'Высокий и статный: высокие сапоги, высокий шест.' },
    { id: 'p-dui2', hanzi: '对', pinyin: 'duì', ru: 'правильно; пара', note: 'Рука и мера: соответствие, пара, «верно».' },
    { id: 'p-he', hanzi: '合', pinyin: 'hé', ru: 'соединять', note: 'Крыша над ртами: соединить вместе.' },
    { id: 'p-ge', hanzi: '戈', pinyin: 'gē', ru: 'копьё', note: 'Длинное древковое оружие: копьё-крюк.' },
    { id: 'p-ding', hanzi: '丁', pinyin: 'dīng', ru: 'гвоздь', note: 'Гвоздь с шляпкой: «дзынь» от удара.' },
    { id: 'p-xiang', hanzi: '相', pinyin: 'xiāng', ru: 'взаимно; облик', note: 'Глаз 目 смотрит на дерево 木: наблюдение.' },
    { id: 'p-guai', hanzi: '夬', pinyin: 'guài', ru: 'решать', note: 'Знак решимости: развилка, требующая выбора.' },
    { id: 'p-wang', hanzi: '亡', pinyin: 'wáng', ru: 'терять; исчезать', note: 'Человек за укрытием: пропал, потерян.' },
    { id: 'p-he2', hanzi: '曷', pinyin: 'hé', ru: 'жажда; почему', note: 'Солнце над человеком: «доколе?» — жажда.' },
    { id: 'p-qi', hanzi: '乞', pinyin: 'qǐ', ru: 'просить', note: 'Протянутая рука: просить, умолять.' },
    { id: 'p-jiu', hanzi: '丩', pinyin: 'jiū', ru: 'изгибаться', note: 'Петля, свитая из нити: изгиб, крюк.' },
    { id: 'p-you', hanzi: '又', pinyin: 'yòu', ru: 'снова; правая рука', note: 'Правая рука: «снова», «а также».' },
    { id: 'p-mei', hanzi: '每', pinyin: 'měi', ru: 'каждый', note: 'Мать с украшением: «каждый раз».' },
    { id: 'p-ke', hanzi: '可', pinyin: 'kě', ru: 'можно; годиться', note: 'Рот с разрешения: «можно».' }
  ];

  var RECIPES = [
    { wordId: 'w-ti', components: ['ren', 'p-ben'] },
    { wordId: 'w-xiu', components: ['ren', 'mu'] },
    { wordId: 'w-cong', components: ['ren', 'ren'] },
    { wordId: 'w-cuo', components: ['jin', 'p-xi'] },
    { wordId: 'w-yin', components: ['jin', 'p-gen'] },
    { wordId: 'w-qian', components: ['jin', 'p-jian'] },
    { wordId: 'w-xie', components: ['yan', 'p-she'] },
    { wordId: 'w-shuo', components: ['yan', 'p-dui'] },
    { wordId: 'w-hua', components: ['yan', 'p-shge'] },
    { wordId: 'w-wen2', components: ['chong', 'p-wen'] },
    { wordId: 'w-xia', components: ['chong', 'p-xia'] },
    { wordId: 'w-sui', components: ['kou', 'chong'] },
    { wordId: 'w-cao', components: ['cao', 'p-zao'] },
    { wordId: 'w-cha', components: ['cao', 'ren', 'mu'], display: ['艹', '人', '木'] },
    { wordId: 'w-hua2', components: ['cao', 'p-hua'] },
    { wordId: 'w-qiao', components: ['mu', 'p-qiao'] },
    { wordId: 'w-shu', components: ['mu', 'p-dui2'] },
    { wordId: 'w-lin', components: ['mu', 'mu'] },
    { wordId: 'w-na', components: ['shou', 'p-he'] },
    { wordId: 'w-zhao', components: ['shou', 'p-ge'] },
    { wordId: 'w-da', components: ['shou', 'p-ding'] },
    { wordId: 'w-xiang', components: ['xin', 'p-xiang'], display: ['相', '心'] },
    { wordId: 'w-kuai', components: ['xin', 'p-guai'] },
    { wordId: 'w-mang', components: ['xin', 'p-wang'] },
    { wordId: 'w-he', components: ['kou', 'p-he2'] },
    { wordId: 'w-chi', components: ['kou', 'p-qi'] },
    { wordId: 'w-jiao', components: ['kou', 'p-jiu'] },
    { wordId: 'w-han', components: ['shui', 'p-you'] },
    { wordId: 'w-hai', components: ['shui', 'p-mei'] },
    { wordId: 'w-he2', components: ['shui', 'p-ke'] }
  ];

  var ASSEMBLY = {
    cost: 2,
    atk: 4,
    hp: 5,
    abilities: { jin: 'barrier', shou: 'rush', xin: 'medic' }
  };

  var KEY_CARD = { kind: 'component', role: 'key', cost: 1, atk: 1, hp: 1, name: 'Ключ' };
  var PART_CARD = { kind: 'component', role: 'part', cost: 1, atk: 1, hp: 2, name: 'Часть' };

  var uniqueIds = Object.create(null);
  var seenHanzi = Object.create(null);
  var radicalIds = Object.create(null);
  var partIds = Object.create(null);
  RADICALS.forEach(function (r) {
    if (radicalIds[r.id]) {
      throw new Error('data.js: duplicate radical id ' + r.id);
    }
    radicalIds[r.id] = true;
  });
  PARTS.forEach(function (p) {
    if (partIds[p.id]) {
      throw new Error('data.js: duplicate part id ' + p.id);
    }
    partIds[p.id] = true;
  });
  for (var i = 0; i < WORDS.length; i += 1) {
    var item = WORDS[i];
    if (uniqueIds[item.id]) {
      throw new Error('data.js: duplicate word id ' + item.id);
    }
    if (seenHanzi[item.hanzi]) {
      throw new Error('data.js: duplicate hanzi ' + item.hanzi);
    }
    if (!radicalIds[item.radical]) {
      throw new Error('data.js: word ' + item.hanzi + ' has unknown radical ' + item.radical);
    }
    uniqueIds[item.id] = true;
    seenHanzi[item.hanzi] = true;
  }
  var wordByIds = Object.create(null);
  WORDS.forEach(function (w) { wordByIds[w.id] = true; });
  var recipeSeen = Object.create(null);
  var wordRecipeCount = Object.create(null);
  RECIPES.forEach(function (r) {
    if (!wordByIds[r.wordId]) {
      throw new Error('data.js: recipe for unknown word ' + r.wordId);
    }
    wordRecipeCount[r.wordId] = (wordRecipeCount[r.wordId] || 0) + 1;
    r.components.forEach(function (c) {
      if (!radicalIds[c] && !partIds[c]) {
        throw new Error('data.js: recipe ' + r.wordId + ' uses unknown component ' + c);
      }
    });
    var key = r.components.slice().sort().join('|');
    if (recipeSeen[key]) {
      throw new Error('data.js: duplicate recipe components ' + key);
    }
    recipeSeen[key] = true;
  });
  WORDS.forEach(function (w) {
    if (wordRecipeCount[w.id] !== 1) {
      throw new Error('data.js: word ' + w.hanzi + ' must have exactly one recipe');
    }
  });

  var PLAYERS = [
    {
      id: 'cinnabon',
      name: 'Синнабон',
      title: 'трактирная целительница',
      portrait: '../assets/characters/cinnabon.svg',
      power: { id: 'heal', name: 'Тёплый отвар', mana: 2, desc: 'Восстановить 3 HP вашему герою (не выше 30).' }
    },
    {
      id: 'raccoon',
      name: 'Енот',
      title: 'картёжник-щелкун',
      portrait: '../assets/characters/raccoon.svg',
      power: { id: 'draw', name: 'Тайный рукав', mana: 2, desc: 'Взять карту.' }
    },
    {
      id: 'robot',
      name: 'Робот',
      title: 'жестяной вышибала',
      portrait: '../assets/characters/robot.svg',
      power: { id: 'shield', name: 'Жестяной заслон', mana: 2, desc: 'Щит на 3 урона вашему герою до начала вашего следующего хода (не суммируется).' }
    },
    {
      id: 'wizard',
      name: 'Волшебник',
      title: 'хранитель свечей',
      portrait: '../assets/characters/wizard.svg',
      power: { id: 'bolt', name: 'Всполох', mana: 2, desc: 'Нанести 2 урона выбранному врагу.' }
    },
    {
      id: 'zhabert',
      name: 'Жаберт',
      title: 'болотный наставник',
      portrait: '../assets/characters/zhabert.svg',
      power: { id: 'buff', name: 'Болотная закваска', mana: 2, desc: 'Дать своему бойцу +1/+1.' }
    }
  ];

  var STAGES = [
    {
      id: 'wen',
      index: 1,
      name: 'Вэнь',
      title: 'комар-трубач',
      portrait: 'assets/characters/wen-mosquito.svg',
      hp: 14,
      powerId: 'bolt',
      powerName: 'Кровососущий укол',
      powerDesc: 'Нанести 2 урона выбранному врагу.',
      quote: 'Пи-и-и! Мой зудящий марш не для слабых ушей!',
      deck: { words: 10, keys: 14, parts: 10, spells: 3 },
      bonusAtk: 0,
      bonusHp: 0
    },
    {
      id: 'xia',
      index: 2,
      name: 'Ся',
      title: 'креветка-стражница',
      portrait: 'assets/characters/xia-shrimp.svg',
      hp: 22,
      powerId: 'shield',
      powerName: 'Панцирная стойка',
      powerDesc: 'Щит на 3 урона креветке до её следующего хода.',
      quote: 'Мой панцирь крепче, чем твоя память на ключи!',
      deck: { words: 16, keys: 18, parts: 14, spells: 4 },
      bonusAtk: 0,
      bonusHp: 1
    },
    {
      id: 'he',
      index: 3,
      name: 'Хэ',
      title: 'дракон реки',
      portrait: 'assets/characters/he-dragon.svg',
      hp: 30,
      powerId: 'draw',
      powerName: 'Прилив',
      powerDesc: 'Взять карту из реки.',
      quote: 'Река помнит все три тысячи знаков. А ты помнишь хоть один ключ?',
      deck: { words: 24, keys: 22, parts: 20, spells: 4 },
      bonusAtk: 1,
      bonusHp: 1
    }
  ];

  var ABILITIES = {
    barrier: { name: 'Щит', short: 'Первый урон — 0', text: 'Полностью поглощает первое попадание с положительным уроном.' },
    rush: { name: 'Натиск', short: 'Сразу по бойцу', text: 'В ход появления атакует только бойца. Со следующего хода — любую вражескую цель.' },
    medic: { name: 'Лекарь', short: 'Герою +2 HP', text: 'При появлении восстанавливает своему герою 2 HP, не выше максимума.' }
  };

  var MINION_TEMPLATES = [
    { kind: 'minion', cost: 1, atk: 2, hp: 1, name: 'Ученик кисти', text: '', ability: null },
    { kind: 'minion', cost: 2, atk: 2, hp: 3, name: 'Подмастерье', text: '', ability: null },
    { kind: 'minion', cost: 3, atk: 3, hp: 3, name: 'Мастер двора', text: '', ability: null },
    { kind: 'minion', cost: 4, atk: 4, hp: 4, name: 'Наставник', text: '', ability: null },
    { kind: 'minion', cost: 5, atk: 5, hp: 5, name: 'Старейшина', text: '', ability: null },
    { kind: 'minion', cost: 2, atk: 1, hp: 2, name: 'Щитоносец', text: ABILITIES.barrier.text, ability: 'barrier' },
    { kind: 'minion', cost: 3, atk: 3, hp: 2, name: 'Быстрый разведчик', text: ABILITIES.rush.text, ability: 'rush' },
    { kind: 'minion', cost: 3, atk: 2, hp: 3, name: 'Травник', text: ABILITIES.medic.text, ability: 'medic' }
  ];

  var SPELLS = [
    { kind: 'spell', name: 'Чайный пар', cost: 1, text: 'Нанести 2 урона выбранному врагу.', effect: { id: 'damage', amount: 2, target: 'enemy-any' } },
    { kind: 'spell', name: 'Бамбуковый настой', cost: 1, text: 'Восстановить 3 HP вашему герою.', effect: { id: 'heal', amount: 3, target: 'own-hero' } },
    { kind: 'spell', name: 'Свиток иероглифа', cost: 0, text: 'Взять карту.', effect: { id: 'draw', amount: 1, target: 'none' } },
    { kind: 'spell', name: 'Расписная кисть', cost: 2, text: 'Дать выбранному своему бойцу +1/+1.', effect: { id: 'buff', amount: 1, target: 'own-minion' } }
  ];

  var HERO_MAX_HP = 30;
  var BOARD_SIZE = 5;
  var HAND_LIMIT = 8;
  var START_HAND_SIZE = 4;
  var MATCH_MS = 10 * 60 * 1000;
  var MAX_MANA = 10;

  var POWERS = {
    heal: { id: 'heal', mana: 2, target: 'none' },
    draw: { id: 'draw', mana: 2, target: 'none' },
    shield: { id: 'shield', mana: 2, target: 'none' },
    bolt: { id: 'bolt', mana: 2, target: 'enemy-any' },
    buff: { id: 'buff', mana: 2, target: 'own-minion' }
  };

  return {
    WORDS: WORDS,
    RADICALS: RADICALS,
    PARTS: PARTS,
    RECIPES: RECIPES,
    ASSEMBLY: ASSEMBLY,
    KEY_CARD: KEY_CARD,
    PART_CARD: PART_CARD,
    PLAYERS: PLAYERS,
    STAGES: STAGES,
    ABILITIES: ABILITIES,
    MINION_TEMPLATES: MINION_TEMPLATES,
    SPELLS: SPELLS,
    HERO_MAX_HP: HERO_MAX_HP,
    BOARD_SIZE: BOARD_SIZE,
    HAND_LIMIT: HAND_LIMIT,
    START_HAND_SIZE: START_HAND_SIZE,
    MATCH_MS: MATCH_MS,
    MAX_MANA: MAX_MANA,
    POWERS: POWERS
  };
}());
