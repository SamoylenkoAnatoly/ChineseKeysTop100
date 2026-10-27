window.QUEST_TASK = {
  id: "u1z1",
  storageKey: "hanzi-quest-u1-z1",
  code: "7473",

  mapTitle: "Испытание ключей",
  mapSub: "Десять ключей урока прошли проверку в Мастерской — настала пора испытаний. Пройди все четыре, и каждая снятая печать откроет одну цифру тайного кода.",

  finale: {
    readyIntro: "Все четыре печати дрожат и гудят! Сорви их — и тайный код Задания 1 откроется тебе.",
    openBtn: "Сорвать печати!",
    codeLabel: "Код Задания 1",
    doneNote: "Запомни этот код — он понадобится в конце уровня!"
  },

  tasks: [
    {
      zone: "t1",
      color: "#f4cc85",
      title: "Трактир «Наливай и плач»",
      menuLabel: "Трактир",
      subtitle: "Подбери перевод ключа",
      qLabel: "Что значит этот ключ?",
      character: { name: "Синнабон", role: "кот-каллиграф, твой проводник", img: "../assets/characters/cinnabon.svg" },
      intro: "Мяу-мяу! Заходи, путник, присаживайся поближе к камину. Я — Синнабон, трактирщик и кот-каллиграф. Проверим, знаешь ли ты переводы: слушай слог, вглядывайся в знак и выбирай верное значение. За старание — стакан молока!",
      doneText: "Все переводы покорились! Синнабон ставит перед тобой стакан молока и дарит первую цифру кода.",
      spark: ["#f4cc85", "#fff3c4", "#ffb74d"],
      ok: ["Мур-р! Верно!", "Отличный нюх на ключи!", "Так держать, подмастерье!", "Мурчально правильно!"],
      fail: ["Мяу… не совсем. Всмотрись ещё раз!", "Почти! Но ключ другой.", "Хвостом зачёркнуто — попробуй ещё!", "Этот перевод пахнет не так…"]
    },
    {
      zone: "t2",
      color: "#8fd14f",
      title: "Хижина Жаберта",
      menuLabel: "Хижина",
      subtitle: "Найди картину для ключа",
      qLabel: "Какая картина принадлежит этому ключу?",
      character: { name: "Жаберт", role: "болотный чародей", img: "../assets/characters/zhabert.svg" },
      intro: "Ква! Я — Жаберт, чародей тёмного болота. В моей хижине десять картин без подписей. Соотнеси каждую с её ключом — и болото аплодирует!",
      doneText: "Все картины разгаданы! Жаберт сочно квакает от восторга: вторая цифра — твоя.",
      spark: ["#8fd14f", "#d8f3b0", "#cbb1fb"],
      ok: ["Ква! Глазастый!", "Верно! Болото одобряет.", "Кв-ква, ты видишь суть!", "Жаба бы и сама не угадала быстрее!"],
      fail: ["Ква-а? Всмотрись в картинку!", "Не-а. Что на ней нарисовано?", "Даже улитка уже догадалась… попробуй снова!", "Туман болота сбил тебя. Ещё попытка!"]
    },
    {
      zone: "t3",
      color: "#80e5dc",
      title: "Лаборатория РОБ-ОТ-3000",
      menuLabel: "Лаборатория",
      subtitle: "Форма ключа в слове",
      qLabel: "Собери слово: вставь облик ключа",
      character: { name: "РОБ-ОТ-3000", role: "робот-справочник", img: "../assets/characters/robot.svg" },
      intro: "БИП-БУП! Я — РОБ-ОТ-3000, робот-справочник. Ключ, входя в слово, меняет облик: 水 куется в 氵, 手 — в 扌. Выбери форму, которую примет каждый ключ!",
      doneText: "Все формы выкованы без брака! РОБ-ОТ-3000 кланится: третья цифра у тебя.",
      spark: ["#80e5dc", "#ffffff", "#b0bec5"],
      ok: ["ФОРМА ПОДОБРАНА. ВЕРНО.", "0100 ВЕРНО! ЗАПИСАНО В ЖУРНАЛ.", "ЩЁЛК! ПАЗЛ СОШЁЛСЯ.", "КУЗНЕЦ ОДОБРЯЕТ. ДА-ДА."],
      fail: ["ОШИБКА ФОРМЫ. ПОВТОРИ ВВОД.", "НЕ СОВПАЛО. ПЕРЕСЧИТАЙ ЧЕРТЫ.", "МОДУЛЬ ПОДСКАЗКИ: КЛЮЧ МЕНЯЕТ ОБЛИК ВНУТРИ ЗНАКА.", "БИП. ЭТО НЕ ТА ЗАГОТОВКА."]
    },
    {
      zone: "t4",
      color: "#cbb1fb",
      title: "Звуковая башня",
      menuLabel: "Башня",
      subtitle: "Услышь тон и найди ключ",
      qLabel: "Определи тон, затем найди ключ",
      character: { name: "КоКо", role: "Магистр башни, хитрый волшебник", img: "../assets/characters/wizard.svg" },
      intro: "Ко-Ко! Я — Магистр КоКо, самый хитрый волшебник Звуковой башни. Узнаешь ключ по одному звучанию? Буду подсовывать похожие слоги — не попади́сь!",
      doneText: "Магистр КоКо сдался собственной хитрости! Последняя, четвёртая цифра — твоя.",
      spark: ["#cbb1fb", "#f4cc85", "#ffffff"],
      ok: ["Ко-ко! А ты не так-то прост!", "Тьфу, расколдовал!", "Хитрость не прошла! Верно!", "Ко-Ко удивлён. Это редко."],
      fail: ["Ко-Ко-Ко! Попался в мой фокус!", "Хе-хе! Это другой ключ.", "Смотри на тоны, дружок! Ещё попытка…", "Моя ловушка работает! Думай ещё."]
    }
  ],

  keys: [
    {
      ch: "水", py: "shuǐ", pyBase: "shui", t: 3, mean: "вода",
      form: "氵", formName: "три капли", audio: "../audio/shui3.mp3",
      art: "water", artTitle: "капли падают в волну",
      ex: { ch: "河", py: "hé", tr: "река", audio: "../audio/he2.mp3", parts: [{ t: "氵", rad: true }, { t: "可" }] }
    },
    {
      ch: "艹", py: "cǎo", pyBase: "cao", t: 3, mean: "трава",
      form: "艹", formName: "травяная шапка", audio: "../audio/cao3.mp3",
      art: "grass", artTitle: "травинки на земле",
      ex: { ch: "花", py: "huā", tr: "цветок", audio: "../audio/hua1.mp3", parts: [{ t: "艹", rad: true }, { t: "化" }] }
    },
    {
      ch: "木", py: "mù", pyBase: "mu", t: 4, mean: "дерево",
      form: "木", formName: "дерево", audio: "../audio/mu4.mp3",
      art: "tree", artTitle: "ствол и крона",
      ex: { ch: "林", py: "lín", tr: "лес", audio: "../audio/lin2.mp3", parts: [{ t: "木", rad: true }, { t: "木" }] }
    },
    {
      ch: "口", py: "kǒu", pyBase: "kou", t: 3, mean: "рот",
      form: "口", formName: "рот", audio: "../audio/kou3.mp3",
      art: "mouth", artTitle: "открытые губы",
      ex: { ch: "吃", py: "chī", tr: "есть", audio: "../audio/chi1.mp3", parts: [{ t: "口", rad: true }, { t: "乞" }] }
    },
    {
      ch: "手", py: "shǒu", pyBase: "shou", t: 3, mean: "рука",
      form: "扌", formName: "рука-коготь", audio: "../audio/shou3.mp3",
      art: "hand", artTitle: "ладонь с пальцами",
      ex: { ch: "打", py: "dǎ", tr: "бить", audio: "../audio/da3.mp3", parts: [{ t: "扌", rad: true }, { t: "丁" }] }
    },
    {
      ch: "心", py: "xīn", pyBase: "xin", t: 1, mean: "сердце",
      form: "忄", formName: "стоячее сердце", audio: "../audio/xin1.mp3",
      art: "heart", artTitle: "сердце",
      ex: { ch: "快", py: "kuài", tr: "быстрый", audio: "../audio/kuai4.mp3", parts: [{ t: "忄", rad: true }, { t: "夬" }] }
    },
    {
      ch: "金", py: "jīn", pyBase: "jin", t: 1, mean: "золото, металл",
      form: "钅", formName: "золотая игла", audio: "../audio/jin1.mp3",
      art: "metal", artTitle: "золотой слиток",
      ex: { ch: "钱", py: "qián", tr: "деньги", audio: "../audio/qian2.mp3", parts: [{ t: "钅", rad: true }, { t: "戋" }] }
    },
    {
      ch: "人", py: "rén", pyBase: "ren", t: 2, mean: "человек",
      form: "亻", formName: "стоячий человек", audio: "../audio/ren2.mp3",
      art: "person", artTitle: "человек шагает",
      ex: { ch: "休", py: "xiū", tr: "отдыхать", audio: "../audio/xiu1.mp3", parts: [{ t: "亻", rad: true }, { t: "木" }] }
    },
    {
      ch: "虫", py: "chóng", pyBase: "chong", t: 2, mean: "насекомое",
      form: "虫", formName: "жучок", audio: "../audio/chong2.mp3",
      art: "insect", artTitle: "жук",
      ex: { ch: "蚊", py: "wén", tr: "комар", audio: "../audio/wen2.mp3", parts: [{ t: "虫", rad: true }, { t: "文" }] }
    },
    {
      ch: "言", py: "yán", pyBase: "yan", t: 2, mean: "речь, слово",
      form: "讠", formName: "слово", audio: "../audio/yan2.mp3",
      art: "speech", artTitle: "облачко со словами",
      ex: { ch: "说", py: "shuō", tr: "говорить", audio: "../audio/shuo1.mp3", parts: [{ t: "讠", rad: true }, { t: "兑" }] }
    }
  ],

  extraTranslations: [
    "огонь", "гора", "луна", "ветер", "камень", "глаз", "птица", "дверь",
    "нож", "звезда", "солнце", "дождь", "конь", "собака", "снег", "поле"
  ],

  pixelArts: {
    water: {
      palette: { c: "#8fd0f2", w: "#eaf7ff", b: "#2f6fb5" },
      rows: [
        "................",
        "...cc.....cc....",
        "..cwwc...cwwc...",
        "...cc.....cc....",
        "................",
        ".......cc.......",
        "......cwwc......",
        ".......cc.......",
        "................",
        "..bbbbbbbbbbb...",
        ".bwwbbbbbbwwbb..",
        "bbbbbbbbbbbbbbbb",
        "bbwwbbbbbbwwbbbb",
        ".bbbbbbbbbbbbbb.",
        "................",
        "................"
      ]
    },
    grass: {
      palette: { g: "#5fbf5a", d: "#8a5a3b", w: "#c9b8a0" },
      rows: [
        "................",
        "..g.....g......g",
        "..g....gg....gg.",
        "...g...g....gg..",
        "..gg..gg...gg...",
        "..gg..gg..gg.g..",
        "...gg.gg.gg.g...",
        "...gggggggggg...",
        "....gggggggg....",
        "....gggggg......",
        "..dddddddddd....",
        ".ddddddddddddd..",
        "dddwwdddddddddd.",
        "dddddddddddddddd",
        ".dddddddddddddd.",
        "................"
      ]
    },
    tree: {
      palette: { g: "#4e9b4e", G: "#8ed081", t: "#8a5a3b", T: "#5f3d22" },
      rows: [
        ".....gggggg.....",
        "...gggggggggg...",
        "..ggGggggggGgg..",
        ".gggggggggggggg.",
        ".gGggggggggGggg.",
        "..gggggggggggg..",
        "..ggggGggggggg..",
        "...gggggggggg...",
        "....gggggggg....",
        "......tTt.......",
        "......tTt.......",
        "......tTt.......",
        "......tTt.......",
        "....ttTTTtt.....",
        "...ttTTTTTtt....",
        "................"
      ]
    },
    mouth: {
      palette: { r: "#e26d6d", k: "#7a2f3d", w: "#ffffff" },
      rows: [
        "................",
        "................",
        "...rrrrrrrrr....",
        "..rrrrrrrrrrr...",
        ".rrrrrrrrrrrrr..",
        ".rrrrrrrrrrrrr..",
        ".rrkkkkkkkkkrr..",
        ".rrkkkkkkkkkrr..",
        ".rrkwkwkwkwkrr..",
        ".rrkkkkkkkkkrr..",
        ".rrrrrrrrrrrrr..",
        "..rrrrrrrrrrr...",
        "...rrrrrrrrr....",
        "................",
        "................",
        "................"
      ]
    },
    hand: {
      palette: { s: "#eab98a", S: "#d9a06e" },
      rows: [
        "................",
        "..s..s..s..s....",
        ".ss.ss.ss.ss....",
        ".ss.ss.ss.ss....",
        ".ss.ss.ss.ss....",
        ".ssssssssssss...",
        ".sssssssssssss..",
        ".sssssssssssss..",
        ".ssssssssssss...",
        ".ssssssssssss...",
        "..ssssssssss....",
        "..sssssssss.....",
        "...ssssssss.....",
        "................",
        "................",
        "................"
      ]
    },
    heart: {
      palette: { h: "#e05263", H: "#f597a3" },
      rows: [
        "................",
        "................",
        "..hhh....hhh....",
        ".hHhhh..hhhhh...",
        ".hhhhh..hhhhhh..",
        "hhhhhhhhhhhhhhh.",
        "hhhhhhhhhhhhhhhh",
        "hhhhhhhhhhhhhhhh",
        ".hhhhhhhhhhhhhh.",
        "..hhhhhhhhhhhh..",
        "...hhhhhhhhhh...",
        "....hhhhhhhh....",
        ".....hhhhhh.....",
        "......hhhh......",
        ".......hh.......",
        "................"
      ]
    },
    metal: {
      palette: { m: "#f2c14e", M: "#ffe9a3", d: "#a87b24" },
      rows: [
        "................",
        "...........MM...",
        "....mmmmmmmm....",
        "...mMmmmmmmmm...",
        "..mmMmmmmmmmmm..",
        ".mmmmmmmmmmmmmm.",
        "mmmmmmmmmmmmmmmm",
        "mmmmmmmmmmmmmmmm",
        ".dddddddddddddd.",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................"
      ]
    },
    person: {
      palette: { o: "#ffd9a0" },
      rows: [
        "................",
        ".......oo.......",
        "......oooo......",
        "......oooo......",
        ".......oo.......",
        ".....o.ooo......",
        "....o..ooo..o...",
        ".......ooo......",
        "......oooo......",
        "......oooo......",
        "......oo.oo.....",
        "......oo..oo....",
        ".....oo...oo....",
        "....oo.....oo...",
        "................",
        "................"
      ]
    },
    insect: {
      palette: { k: "#3b3b46", h: "#5a5a68", b: "#d9534f", B: "#7a2f2b" },
      rows: [
        "................",
        "...k........k...",
        "....k......k....",
        "......hhhh......",
        "....hhhhhhhh....",
        "..k.bbbbbbbb.k..",
        ".kkbbbBbbBbbkk..",
        ".k.bbbbbbbbb.k..",
        "kkbbbBbbbBbbkk..",
        ".k.bbbbbbbbb.k..",
        ".kkbbbbbbbbbkk..",
        "..k...bbbb...k..",
        "......bbbb......",
        "................",
        "................",
        "................"
      ]
    },
    speech: {
      palette: { p: "#cbb1fb", w: "#ffffff", t: "#5a4a7a" },
      rows: [
        "................",
        "..pppppppppppp..",
        ".pwwwwwwwwwwwwp.",
        ".pwttttttwwwwwp.",
        ".pwwwwwwwwwwwwp.",
        ".pwttttttttttwp.",
        ".pwwwwwwwwwwwwp.",
        ".pwtttttwwwwwwp.",
        ".pwwwwwwwwwwwwp.",
        "..pppppppppppp..",
        "..pp............",
        ".ppp............",
        "................",
        "................",
        "................",
        "................"
      ]
    }
  }
};
