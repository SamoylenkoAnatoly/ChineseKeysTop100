(function () {
  "use strict";

  var KEYS = [
    {
      ch: "水", py: "shuǐ", t: 3, mean: "вода", art: "water", strokes: 4, kx: 85, audio: "audio/shui3.mp3",
      form: "氵", formName: "три капли", pos: "слева",
      hint: "Три капли — и хвост: сначала точка слева, потом две капли и длинная черта.",
      ex: [
        { ch: "河", py: "hé", t: 2, tr: "река", audio: "audio/he2.mp3", stack: false,
          parts: [{ t: "氵", rad: true }, { t: "可", sub: "kě «возможно»" }],
          noteR: "<b class=\"rad\">氵 — ключ «вода».</b> Три капли слева: река — вода в движении, ключ мгновенно подсказывает категорию «жидкость».",
          noteS: "<b class=\"pho\">可 kě «возможно» — фонетик.</b> Смысла реки в нём нет, его работа — звук: kě похоже на hé.", role: { cat: "sense", text: "вода в движении" } },
        { ch: "海", py: "hǎi", t: 3, tr: "море", audio: "audio/hai3.mp3", stack: false,
          parts: [{ t: "氵", rad: true }, { t: "每", sub: "měi «каждый»" }],
          noteR: "<b class=\"rad\">氵 — ключ «вода».</b> Море — это очень много воды. Увидел три капли — ищи жидкость!",
          noteS: "<b class=\"pho\">每 měi «каждый» — фонетик.</b> Звук уплыл дальше (měi → hǎi), но родня всё ещё слышна.", role: { cat: "sense", text: "очень много воды" } },
        { ch: "汉", py: "hàn", t: 4, tr: "китайский", audio: "audio/han4.mp3", stack: false,
          parts: [{ t: "氵", rad: true }, { t: "又", sub: "yòu «снова»" }],
          noteR: "<b class=\"rad\">氵 — ключ «вода».</b> 汉 — река Хань: от неё пошло название народа хань и китайской письменности 汉字.",
          noteS: "<b class=\"pho\">又 yòu «снова» — фонетик.</b> Старинное чтение этой части дало слог hàn.", role: { cat: "shift", text: "река Хань → народ хань" } }
      ]
    },
    {
      ch: "艹", py: "cǎo", t: 3, mean: "трава", art: "grass", strokes: 3, kx: 140, audio: "audio/cao3.mp3",
      form: "艹", formName: "травяная шапка", pos: "сверху",
      hint: "Две травинки-антенны: сначала левая с крючочком, потом правая.",
      ex: [
        { ch: "花", py: "huā", t: 1, tr: "цветок", audio: "audio/hua1.mp3", stack: true,
          parts: [{ t: "艹", rad: true }, { t: "化", sub: "huà «превращаться»" }],
          noteR: "<b class=\"rad\">艹 — ключ «трава» сверху.</b> Цветок растёт из земли, как трава: зелёная шапка из травинок.",
          noteS: "<b class=\"pho\">化 huà «превращаться» — фонетик.</b> huà и huā различаются только тоном.", role: { cat: "sense", text: "растение-цветок" } },
        { ch: "茶", py: "chá", t: 2, tr: "чай", audio: "audio/cha2.mp3", stack: true,
          parts: [{ t: "艹", rad: true }, { t: "人", sub: "человек" }, { t: "木", sub: "дерево" }],
          noteR: "<b class=\"rad\">艹 — ключ «трава».</b> Чай — это листья, то есть трава. Шапка из двух травинок намекает на растение.",
          noteS: "<b class=\"pho\">人 «человек» + 木 «дерево» — смысловая картинка.</b> Человек собирает листья с дерева: обе части работают на смысл, а не на звук.", role: { cat: "sense", text: "чай — лист-трава" } },
        { ch: "草", py: "cǎo", t: 3, tr: "трава", audio: "audio/cao3.mp3", stack: true,
          parts: [{ t: "艹", rad: true }, { t: "早", sub: "zǎo «рано»" }],
          noteR: "<b class=\"rad\">艹 — ключ «трава».</b> А здесь знак буквально значит то же, что ключ: 草 — «трава».",
          noteS: "<b class=\"pho\">早 zǎo «рано» — фонетик.</b> zǎo → cǎo. Роса на траве бывает рано утром — запоминается само.", role: { cat: "sense", text: "тот же смысл: трава" } }
      ]
    },
    {
      ch: "木", py: "mù", t: 4, mean: "дерево", art: "tree", strokes: 4, kx: 75, audio: "audio/mu4.mp3",
      form: "木", formName: "дерево", pos: "слева или снизу",
      hint: "Горизонталь, вертикаль, затем левая и правая ветки — дерево готово.",
      ex: [
        { ch: "树", py: "shù", t: 4, tr: "дерево", audio: "audio/shu4.mp3", stack: false,
          parts: [{ t: "木", rad: true }, { t: "对", sub: "duì «правильный»" }],
          noteR: "<b class=\"rad\">木 — ключ «дерево» слева.</b> Знак про растения и деревянные вещи: вот и 树 «дерево».",
          noteS: "<b class=\"pho\">对 duì «правильный» — фонетик.</b> Звуки разошлись, но ключ узнаётся мгновенно — так бывает.", role: { cat: "sense", text: "растение-дерево" } },
        { ch: "林", py: "lín", t: 2, tr: "лес", audio: "audio/lin2.mp3", stack: false,
          parts: [{ t: "木", rad: true }, { t: "木", sub: "второе дерево" }],
          noteR: "<b class=\"rad\">木 — ключ «дерево».</b> Одно дерево хорошо, а два — уже лес: иероглиф рисует смысл прямо.",
          noteS: "<b class=\"pho\">Вторая 木 — не фонетик, а просто второе дерево.</b> Иногда части дублируют картинку: 林 = дерево + дерево.", role: { cat: "sense", text: "дерево + дерево" } },
        { ch: "桥", py: "qiáo", t: 2, tr: "мост", audio: "audio/qiao2.mp3", stack: false,
          parts: [{ t: "木", rad: true }, { t: "乔", sub: "qiáo «высокий»" }],
          noteR: "<b class=\"rad\">木 — ключ «дерево».</b> Первые мосты строили из брёвен: без ключа-дерева никуда.",
          noteS: "<b class=\"pho\">乔 qiáo «высокий» — фонетик.</b> Звучит точно как весь знак: qiáo.", role: { cat: "shift", text: "мост из брёвен" } }
      ]
    },
    {
      ch: "口", py: "kǒu", t: 3, mean: "рот", art: "mouth", strokes: 3, kx: 30, audio: "audio/kou3.mp3",
      form: "口", formName: "рот", pos: "слева или сверху",
      hint: "Рисуем квадратик: левая стенка, низ, правая стенка и крышка.",
      ex: [
        { ch: "吃", py: "chī", t: 1, tr: "есть", audio: "audio/chi1.mp3", stack: false,
          parts: [{ t: "口", rad: true }, { t: "乞", sub: "qǐ «просить»" }],
          noteR: "<b class=\"rad\">口 — ключ «рот» слева.</b> Есть и пить — дела рта: ключ сразу относит знак к еде.",
          noteS: "<b class=\"pho\">乞 qǐ «просить» — фонетик.</b> Старое чтение похоже на chī: просящий еду делает это ртом.", role: { cat: "sense", text: "рот — про еду" } },
        { ch: "喝", py: "hē", t: 1, tr: "пить", audio: "audio/he1.mp3", stack: false,
          parts: [{ t: "口", rad: true }, { t: "曷", sub: "hé" }],
          noteR: "<b class=\"rad\">口 — ключ «рот».</b> Без рта не напьёшься! Пара 吃–喝 — классические «ротовые» знаки.",
          noteS: "<b class=\"pho\">曷 hé — фонетик.</b> Звучит почти как весь знак hē.", role: { cat: "sense", text: "рот — про питьё" } },
        { ch: "叫", py: "jiào", t: 4, tr: "звать", audio: "audio/jiao4.mp3", stack: false,
          parts: [{ t: "口", rad: true }, { t: "丩", sub: "jiū" }],
          noteR: "<b class=\"rad\">口 — ключ «рот».</b> Звать — значит кричать. Кричать чем? Правильно, ртом!",
          noteS: "<b class=\"pho\">丩 jiū — фонетик.</b> Из старого чтения вырос jiào: форма уплыла, работа осталась.", role: { cat: "sense", text: "крик ртом" } }
      ]
    },
    {
      ch: "手", py: "shǒu", t: 3, mean: "рука", art: "hand", strokes: 4, kx: 64, audio: "audio/shou3.mp3",
      form: "扌", formName: "рука-коготь", pos: "слева",
      hint: "Откидная влево, две горизонтали — и вертикаль с крючком.",
      ex: [
        { ch: "打", py: "dǎ", t: 3, tr: "бить, играть", audio: "audio/da3.mp3", stack: false,
          parts: [{ t: "扌", rad: true }, { t: "丁", sub: "dīng «гвоздь»" }],
          noteR: "<b class=\"rad\">扌 — ключ «рука».</b> Стук, удар, игра (打球 играть в мяч) — всё делают рукой.",
          noteS: "<b class=\"pho\">丁 dīng «гвоздь» — фонетик.</b> dīng → dǎ: слог-родственник.", role: { cat: "sense", text: "удар рукой" } },
        { ch: "找", py: "zhǎo", t: 3, tr: "искать", audio: "audio/zhao3.mp3", stack: false,
          parts: [{ t: "扌", rad: true }, { t: "戈", sub: "gē «копьё»" }],
          noteR: "<b class=\"rad\">扌 — ключ «рука».</b> Искать — копаться руками: ключ подсказывает действие.",
          noteS: "<b class=\"pho\">戈 gē «копьё» — смысловая часть.</b> Древняя картинка: искать — осматривать местность с оружием. Звук она не даёт.", role: { cat: "sense", text: "поиск руками" } },
        { ch: "拿", py: "ná", t: 2, tr: "брать", audio: "audio/na2.mp3", stack: true,
          parts: [{ t: "合", sub: "hé «соединять»" }, { t: "手", rad: true }],
          noteR: "<b class=\"rad\">手 — ключ «рука», здесь в полном виде и понизу!</b> Брать — действие руки.",
          noteS: "<b class=\"pho\">合 hé «соединять» — смысловая часть.</b> Чтобы взять, соединяешь пальцы вокруг предмета. Весь знак читается ná.", role: { cat: "sense", text: "рука в полном виде" } }
      ]
    },
    {
      ch: "心", py: "xīn", t: 1, mean: "сердце", art: "heart", strokes: 4, kx: 61, audio: "audio/xin1.mp3",
      form: "忄", formName: "стоячее сердце", pos: "忄 слева или 心 снизу",
      hint: "Точка, широкий крючок-сердце — и ещё две точки поверх.",
      ex: [
        { ch: "想", py: "xiǎng", t: 3, tr: "думать, хотеть", audio: "audio/xiang3.mp3", stack: true,
          parts: [{ t: "相", sub: "xiāng «взаимно»" }, { t: "心", rad: true }],
          noteR: "<b class=\"rad\">心 — ключ «сердце» снизу.</b> Думать и хотеть — дела сердечные!",
          noteS: "<b class=\"pho\">相 xiāng «взаимно» — фонетик.</b> xiāng и xiǎng различаются только тоном: верх читается, низ — чувствует.", role: { cat: "sense", text: "дела сердечные" } },
        { ch: "快", py: "kuài", t: 4, tr: "быстрый", audio: "audio/kuai4.mp3", stack: false,
          parts: [{ t: "忄", rad: true }, { t: "夬", sub: "guài" }],
          noteR: "<b class=\"rad\">忄 — ключ «сердце» в стоячем виде.</b> Скорость — ощущение, а ощущения живут в сердце.",
          noteS: "<b class=\"pho\">夬 guài — фонетик.</b> Старое чтение дало слог kuài.", role: { cat: "shift", text: "ощущение → скорость" } },
        { ch: "忙", py: "máng", t: 2, tr: "занятой", audio: "audio/mang2.mp3", stack: false,
          parts: [{ t: "忄", rad: true }, { t: "亡", sub: "wáng «терять»" }],
          noteR: "<b class=\"rad\">忄 — ключ «сердце».</b> Занятость — состояние души: сердце в напряжении.",
          noteS: "<b class=\"pho\">亡 wáng «терять» — смысловая часть.</b> Когда занят, время словно теряется. Звуки wáng и máng — дальняя родня.", role: { cat: "shift", text: "состояние души" } }
      ]
    },
    {
      ch: "金", py: "jīn", t: 1, mean: "золото, металл", art: "metal", strokes: 8, kx: 167, audio: "audio/jin1.mp3",
      form: "钅", formName: "золотая игла", pos: "слева",
      hint: "Крышечка, «человечки», поперечина — и столбик с точками. Самый длинный ключ урока!",
      ex: [
        { ch: "钱", py: "qián", t: 2, tr: "деньги", audio: "audio/qian2.mp3", stack: false,
          parts: [{ t: "钅", rad: true }, { t: "戋", sub: "jiān «узкий»" }],
          noteR: "<b class=\"rad\">钅 — ключ «металл».</b> Деньги в Китае чеканили из металла — монеты с дырочкой.",
          noteS: "<b class=\"pho\">戋 jiān «узкий» — фонетик.</b> jiān похоже на qián: слог-родственник.", role: { cat: "sense", text: "монеты из металла" } },
        { ch: "错", py: "cuò", t: 4, tr: "ошибка", audio: "audio/cuo4.mp3", stack: false,
          parts: [{ t: "钅", rad: true }, { t: "昔", sub: "xī «прошлое»" }],
          noteR: "<b class=\"rad\">钅 — ключ «металл».</b> Изначально 错 — зазубрины на металлическом ноже: «ошибка» в металле.",
          noteS: "<b class=\"pho\">昔 xī «прошлое» — фонетик.</b> Из xī вырос cuò: звук уплыл, но слог дала именно эта часть.", role: { cat: "shift", text: "зазубрины → ошибка" } },
        { ch: "银", py: "yín", t: 2, tr: "серебро", audio: "audio/yin2.mp3", stack: false,
          parts: [{ t: "钅", rad: true }, { t: "艮", sub: "gèn" }],
          noteR: "<b class=\"rad\">钅 — ключ «металл».</b> Серебро — металл, всё честно. Смотри-ка: 错 и 银 — братья по ключу!",
          noteS: "<b class=\"pho\">艮 gèn — фонетик.</b> Старое чтение дало слог yín.", role: { cat: "sense", text: "металл — серебро" } }
      ]
    },
    {
      ch: "人", py: "rén", t: 2, mean: "человек", art: "person", strokes: 2, kx: 9, audio: "audio/ren2.mp3",
      form: "亻", formName: "стоячий человек", pos: "слева",
      hint: "Откидная влево, затем откидная вправо — и человек шагает.",
      ex: [
        { ch: "从", py: "cóng", t: 2, tr: "следовать; из, от", audio: "audio/cong2.mp3", stack: false,
          parts: [{ t: "人", rad: true }, { t: "人", sub: "второй человек" }],
          role: { cat: "sense", text: "человек + человек — полный облик" },
          noteR: "<b class=\"rad\">人 — ключ «человек» в полном виде, дважды!</b> Один человек идёт следом за другим: сначала «следовать», а от него — служебное 从 «из, от».",
          noteS: "<b class=\"pho\">Здесь фонетика нет.</b> Второй 人 — просто второй человек: знак-картинка, где обе части работают на смысл." },
        { ch: "休", py: "xiū", t: 1, tr: "отдыхать", audio: "audio/xiu1.mp3", stack: false,
          parts: [{ t: "亻", rad: true }, { t: "木", sub: "mù «дерево»" }],
          role: { cat: "sense", text: "человек у дерева — отдых" },
          noteR: "<b class=\"rad\">亻 — ключ «человек».</b> Человек прислонился к дереву и отдыхает: картинка рисует смысл прямо. Заметь: 木 — ключ из нашего урока!",
          noteS: "<b class=\"pho\">木 mù «дерево» — смысловая часть.</b> Звука она не даёт: xiū запоминается самой картинкой." },
        { ch: "体", py: "tǐ", t: 3, tr: "тело", audio: "audio/ti3.mp3", stack: false,
          parts: [{ t: "亻", rad: true }, { t: "本", sub: "běn «основа»" }],
          role: { cat: "shift", text: "основа → тело" },
          noteR: "<b class=\"rad\">亻 — ключ «человек».</b> Тело — «основа» человека: ключ задаёт, о ком речь, а 本 добавляет смысл основы.",
          noteS: "<b class=\"pho\">本 běn «основа» — смысловая часть.</b> Звук от неё дальний: tǐ запоминаем вместе с картинкой «человек + основа»." }
      ]
    },
    {
      ch: "虫", py: "chóng", t: 2, mean: "насекомое", art: "insect", strokes: 6, kx: 142, audio: "audio/chong2.mp3",
      form: "虫", formName: "жучок", pos: "слева или снизу",
      hint: "Квадратик-головка, вертикаль с крючком, точка — и последняя откидная.",
      ex: [
        { ch: "蚊", py: "wén", t: 2, tr: "комар", audio: "audio/wen2.mp3", stack: false,
          parts: [{ t: "虫", rad: true }, { t: "文", sub: "wén «узор»" }],
          noteR: "<b class=\"rad\">虫 — ключ «насекомое».</b> Комар — знаменитое насекомое, тут без вариантов.",
          noteS: "<b class=\"pho\">文 wén «узор» — фонетик.</b> Звучит ровно как весь знак: wén.", role: { cat: "sense", text: "насекомое-комар" } },
        { ch: "虾", py: "xiā", t: 1, tr: "креветка", audio: "audio/xia1.mp3", stack: false,
          parts: [{ t: "虫", rad: true }, { t: "下", sub: "xià «низ»" }],
          noteR: "<b class=\"rad\">虫 — ключ «насекомое».</b> Для китайской грамматики креветка — тоже «жучок»!",
          noteS: "<b class=\"pho\">下 xià «низ» — фонетик.</b> xià → xiā: тон изменился, слог тот же.", role: { cat: "shift", text: "креветка — тоже «жучок»" } },
        { ch: "虽", py: "suī", t: 1, tr: "хотя", audio: "audio/sui1.mp3", stack: true,
          parts: [{ t: "口", sub: "рот" }, { t: "虫", rad: true }],
          noteR: "<b class=\"rad\">虫 — ключ «насекомое», здесь понизу.</b> В древней форме слова «хотя» (虽然) прячется жучок-змейка.",
          noteS: "<b class=\"pho\">口 «рот» сверху — старинная смысловая часть.</b> Звук suī части напрямую не дают: знак из серии «запомни как есть».", role: { cat: "form", text: "осталась древняя форма" } }
      ]
    },
    {
      ch: "言", py: "yán", t: 2, mean: "речь, слово", art: "speech", strokes: 7, kx: 149, audio: "audio/yan2.mp3",
      form: "讠", formName: "слово", pos: "слева",
      hint: "Точка, три горизонтальные черты и квадратик-ротик: слово начинается со звука!",
      ex: [
        { ch: "说", py: "shuō", t: 1, tr: "говорить", audio: "audio/shuo1.mp3", stack: false,
          parts: [{ t: "讠", rad: true }, { t: "兑", sub: "duì «менять»" }],
          noteR: "<b class=\"rad\">讠 — ключ «речь» слева.</b> Говорить, сказать, поговорить — всё про слова.",
          noteS: "<b class=\"pho\">兑 duì «менять» — фонетик.</b> Звук далеко ушёл (duì → shuō), но слог дала именно эта часть.", role: { cat: "sense", text: "дело речи — говорить" } },
        { ch: "话", py: "huà", t: 4, tr: "слово, речь", audio: "audio/hua4.mp3", stack: false,
          parts: [{ t: "讠", rad: true }, { t: "舌", sub: "shé «язык»" }],
          noteR: "<b class=\"rad\">讠 — ключ «речь».</b> 话 — сказанное слово, целая фраза: 电话 «телефон» = «электрическая речь»!",
          noteS: "<b class=\"pho\">舌 shé «язык» — смысловая часть.</b> Без языка не скажешь слова. Звуки shé и huà — дальняя родня.", role: { cat: "sense", text: "сказанное слово" } },
        { ch: "谢", py: "xiè", t: 4, tr: "спасибо", audio: "audio/xie4.mp3", stack: false,
          parts: [{ t: "讠", rad: true }, { t: "射", sub: "shè «стрелять»" }],
          noteR: "<b class=\"rad\">讠 — ключ «речь».</b> Благодарят словами: вежливый ключ для вежливого знака.",
          noteS: "<b class=\"pho\">射 shè «стрелять» — фонетик.</b> shè и xiè похожи: благодарность — стрела добрых слов.", role: { cat: "sense", text: "слова благодарности" } }
      ]
    }
  ];

  var PIXEL_ARTS = {
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
  };

  var WORD_ARTS = {
    "河": {
      palette: { g: "#72a653", G: "#a5cf79", b: "#288db8", w: "#a7e5f5" }, bg: "#def0db", frame: "#4e8d66",
      rows: ["gggggbbbbggggggg", "gGgggbbwbbgggGgg", "ggggggbbwbbggggg", "gggggggbbwbbgggg", "ggGgggggbbwbbggg", "ggggggggbbwbbggg", "gggggggbbwbbgggg", "ggggggbbwbbggGgg", "gggggbbwbbgggggg", "gGggbbwbbggggggg", "gggbbwbbgggggggg", "ggbbwbbggggGgggg", "ggbbwbbggggggggg", "gggbbwbbgggggggg", "ggggbbwbbggggGgg", "gggggbbwbbgggggg"]
    },
    "海": {
      palette: { b: "#247ea6", B: "#55b7d1", w: "#fff3d8", t: "#815637" }, bg: "#d9eff8", frame: "#327fa6",
      rows: ["................", "........t.......", ".......wt.......", "......wwt.......", ".....wwwtw......", "....wwwwtww.....", "...wwwwwtwww....", "........t.......", "....ttttttttt...", ".....ttttttt....", "BBBBBBBBBBBBBBBB", "bbBBBbbbBBBbbbBB", "bbbbbbbbbbbbbbbb", "BBbbbBBBbbbBBBbb", "BBBBBBBBBBBBBBBB", "bbbBBBbbbBBBbbbB"]
    },
    "汉": {
      palette: { r: "#c83e43", R: "#f46c4f", y: "#edbd4f", d: "#8c293a" }, bg: "#fae0cf", frame: "#b96b47",
      rows: [".......yy.......", ".......yy.......", ".....yyyyyy.....", "....drrrrrrd....", "...drRryrRrrd...", "..drRRryrRRrrd..", "..drRRryrRRrrd..", "..drRRryrRRrrd..", "..drRRryrRRrrd..", "...drRryrRrrd...", "....drrrrrrd....", ".....yyyyyy.....", ".......yy.......", "......yyyy......", "......yyyy......", "......y..y......"]
    },
    "花": {
      palette: { p: "#d65383", P: "#f393b3", y: "#f4cb55", g: "#42864a" }, bg: "#f9e1ec", frame: "#b05b85",
      rows: ["................", "......pppp......", ".....pPPPPp.....", "..ppppPPPPpppp..", ".pPPPPyyyyPPPPp.", ".pPPPPyyyyPPPPp.", "..ppppyyyypppp..", ".....pPPPPp.....", "......pppp......", ".......gg.......", "...gg..gg.......", "...gggggg..gg...", ".....gggggggg...", ".......gggg.....", ".......gg.......", "......gggg......"]
    },
    "茶": {
      palette: { g: "#609449", G: "#a8cd72", w: "#fff3d8", d: "#98724b" }, bg: "#e6efd2", frame: "#74934a",
      rows: ["....g....g......", "...g....g.......", "....g....g......", "................", "...ddddddddd....", "..dGGGGGGGGGd...", "..dgggggggggd...", "..dwwwwwwwwwddd.", "..dwwwwwwwwwd.d.", "..dwwwwwwwwwd.d.", "..dwwwwwwwwwddd.", "...dwwwwwwwd....", "....ddddddd.....", ".ddddddddddddd..", "..ddddddddddd...", "................"]
    },
    "草": {
      palette: { g: "#399253", G: "#83bb4c", d: "#8d6240" }, bg: "#dff0ce", frame: "#5b9144",
      rows: ["................", ".....G..........", "..g..G......g...", "..g..G..G...g...", "...g.G..G..g....", "...g.G.gG..g..G.", ".G..gG.gG.g..G..", "..G.gG.gG.g.G...", "..G.gGgGgg.gG...", "...GgggGgggG....", "....GgggggG.....", "...ddddddddd....", "..ddddddddddd...", ".ddddddddddddd..", "................", "................"]
    },
    "树": {
      palette: { g: "#43854c", G: "#83b963", t: "#805337", T: "#b28148" }, bg: "#e3ecd3", frame: "#62884b",
      rows: [".......gg.......", "......gGGg......", ".....gGGGGg.....", "....gGGGGGGg....", "...gGGGGGGGGg...", "..ggggGGgggggg..", "....gGGGGGGg....", "...gGGGGGGGGg...", "..gGGGGGGGGGGg..", ".gggggggggggggg.", "......tTTt......", "......tTTt......", "......tTTt......", "......tTTt......", "....tttTTttt....", "...ttttTTtttt..."]
    },
    "林": {
      palette: { g: "#367546", G: "#6ea64e", t: "#865839" }, bg: "#d9edda", frame: "#427955",
      rows: [".......g........", "......gGg.......", ".....gGGGg......", "...g.gGGGg......", "..gGggGGGGg..g..", ".gGGGgggggg.gGg.", ".gGGGg.t...gGGGg", "gGGGGGgt...gGGGg", "gggggggt..gGGGGg", "..tt......gggggg", "..tt..g.....tt..", ".....gGg....tt..", "....gGGGg.......", "....ggggg.......", "......t.........", "GGGGGGtGGGGGGGGG"]
    },
    "桥": {
      palette: { t: "#98633a", T: "#d1a36a", b: "#3e9abb", w: "#b2dfeb" }, bg: "#ede6d2", frame: "#9b794c",
      rows: ["................", "................", "...tttttttttt...", "..tTTTTTTTTTTt..", ".tTtTTtTTtTTtTt.", ".t.t..t..t..t.t.", "tttttttttttttttt", "TTTTTTTTTTTTTTTT", "t..t........t..t", "t..t........t..t", "bbbttbbbbbbttbbb", "bwwttbbbwwbttbbb", "bbbttbbbbbbttbbb", "bbbbbwwbbbbbbwwb", "bbbbbbbbbbbbbbbb", "wwbbbbbbwwbbbbbb"]
    },
    "吃": {
      palette: { w: "#fff9e8", b: "#408eac", B: "#9eced8", t: "#956543" }, bg: "#f9e8cf", frame: "#b68b4d",
      rows: ["..........t..t..", ".........t..t...", "........t..t....", ".......t..t.....", "......t..t......", ".....t..t.......", "....wwwwwwww....", "...wwwwwwwwww...", "..wwwwwwwwwwww..", "..bbbbbbbbbbbb..", "...bBBBBBBBBb...", "...bBBBBBBBBb...", "....bBBBBBBb....", ".....bbbbbb.....", "......bbbb......", "................"]
    },
    "喝": {
      palette: { s: "#e6ae7b", h: "#654539", b: "#4599b4", w: "#d4edf0" }, bg: "#dff0f0", frame: "#4b8e99",
      rows: ["....hhhh........", "...hhsshh.......", "...hssssh.......", "...hsshss.......", "...hssssss......", "....ssssss......", "....ssss.bbbb...", ".....sss.bwwb...", "......ssbwwbb...", ".......sbwwb....", ".....ssssbb.....", "....sssssss.....", "...ssss.sss.....", "...sss..sss.....", "................", "................"]
    },
    "叫": {
      palette: { s: "#e9b67f", h: "#684732", r: "#aa3f4d", y: "#d79c30" }, bg: "#f9e4d5", frame: "#bc7954",
      rows: ["................", "...hhhh.........", "..hhsshh....y...", "..hssssh...y....", "..hsshss..y.....", "..hsssss........", "...sssrrr..yyyy.", "...sssrrr.......", "....ssss..y.....", ".....ss....y....", "....ssss....y...", "...ssssss.......", "...ssssss.......", "................", "................", "................"]
    },
    "打": {
      palette: { b: "#407cba", w: "#d1e8ed", t: "#8c5a38", y: "#e2b947" }, bg: "#e0eafa", frame: "#557fb4",
      rows: ["................", "..........yy....", ".........yyyy...", "..........yy....", "..wwww..........", "................", ".....bbbb.......", "....bwwwwb......", "....bwwwwb......", "....bwwwwb......", ".....bbbb.......", "......tt........", ".....tt.........", "....tt..........", "...tt...........", "................"]
    },
    "找": {
      palette: { b: "#3b7a8f", w: "#b9e2e6", y: "#e1b14e", t: "#6f4f3c" }, bg: "#e2edf3", frame: "#557e99",
      rows: ["................", "....bbbbb.......", "...bwwwwwb......", "..bwwwwwwwb.....", "..bwwwywwwb.....", "..bwwyyywwb.....", "..bwwwywwwb.....", "...bwwwwwb......", "....bbbbb.......", "........tt......", ".........tt.....", "..........tt....", "...........tt...", "............t...", "................", "................"]
    },
    "拿": {
      palette: { s: "#e4ad7c", S: "#bb7d52", b: "#5486b7", B: "#a5c8e1" }, bg: "#f5e5d7", frame: "#b17f58",
      rows: ["................", "......bbbbbb....", ".....bBBBBBb....", "....bBBBBBBb....", "....bbbbbbbb....", "....bBBBBBBb....", "....bBBBBBBb....", "..ssbBBBBBBb....", ".sSSbbbbbbbb....", ".sSSssssssss....", "..sSSSSSSSSss...", "...ssssssSSss...", "........sSSs....", "........sSSs....", "........ssss....", "................"]
    },
    "想": {
      palette: { h: "#6a4c47", s: "#e3b18c", w: "#fff5e5", b: "#728daf" }, bg: "#eee4f6", frame: "#9271b0",
      rows: ["........wwwww...", ".......wbbbbbw..", ".......wbwwwbw..", ".......wbbbbbw..", "........wwwww...", ".......w........", "......w.........", "...hhhh.........", "..hhsshh........", "..hssssh........", "..hsshss........", "..hsssss........", "...ssss.........", "....ss..........", "..bbbbbb........", ".bbbbbbbb......."]
    },
    "快": {
      palette: { s: "#e6b483", b: "#458fa8", d: "#405975", y: "#d7ac42" }, bg: "#ddf0ed", frame: "#4d9291",
      rows: [".........sss....", ".........sss....", "..........s.....", "..yyy...bbbb....", ".......bbbbbb...", ".yyy..bb.bb.bb..", ".........bb.....", "..yyy...bbb.....", ".......dd.dd....", "......dd...dd...", ".....dd.....dd..", ".....d.......dd.", "....dd..........", "...dd...........", "................", "................"]
    },
    "忙": {
      palette: { s: "#e3ae7d", h: "#67504a", b: "#5486ab", t: "#956b49", w: "#fff4d3", d: "#786447" }, bg: "#f8ebce", frame: "#b5934e",
      rows: ["..........wwww..", ".........wddwdw.", ".........wdwwwdw", ".........wwdwww.", "..........wwww..", "...hhh..........", "..hsssh.........", "..hsssh.........", "...sss...wwww...", "..bbbb..wwwwww..", ".bbbbbsswwwwww..", "tttttttttttttttt", "..t..bb......t..", "..t..dd......t..", "..t..dd......t..", "..t.ddd......t.."]
    },
    "钱": {
      palette: { y: "#e7b339", Y: "#fff09c", d: "#a77726" }, bg: "#fff0c9", frame: "#b38c2f",
      rows: ["................", "....dddddd......", "...dYYYYYYd.....", "..dYYyyyyYYd....", "..dYyy..yyYd....", "..dYyy..yyYd....", "..dYYyyyyYYd....", "...dYYYYYYd.....", "....ddddddddd...", "......dYYYYYYd..", ".....dYYyyyyYYd.", ".....dYyy..yyYd.", ".....dYyy..yyYd.", ".....dYYyyyyYYd.", "......dYYYYYYd..", ".......dddddd..."]
    },
    "错": {
      palette: { w: "#fff9e8", b: "#7995ad", r: "#ca4c50", d: "#bea989" }, bg: "#f6dfdc", frame: "#b46b69",
      rows: ["..ddddddddddd...", "..dwwwwwwwwwd...", "..dwbwbwbwwwd...", "..dwwwwwwwwwd...", "..dwbbbbbbwwd...", "..dwwwwwwwwwd...", "..dwbbbbwwwwd...", "..dwwwwwwwwwd...", "..dwwwwwwrwwd.r.", "..dwwwwwwwrwd.r.", "..dwwwwwwwwrr...", "..dwwwwwwwrwd.r.", "..dddddddrddd.r.", "........r......r", "................", "................"]
    },
    "银": {
      palette: { b: "#7892ac", B: "#b8cbdc", w: "#f4fbff", d: "#506a85" }, bg: "#e9edf7", frame: "#7b8da9",
      rows: ["................", "...........w....", "..........www...", "...........w....", ".....bbbbbb.....", "....bwwwwwwb....", "...bwwBBBBwwb...", "..bwwBBBBBBwwb..", ".bwwBBBBBBBBwwb.", ".bbbbbbbbbbbbbb.", ".dBBBBBBBBBBBBd.", "..dddddddddddd..", "................", "................", "................", "................"]
    },
    "从": {
      palette: { s: "#e5b282", b: "#527caa", g: "#669356", y: "#d6a440" }, bg: "#e3edfa", frame: "#6384aa",
      rows: ["................", "...ss......ss...", "...ss......ss...", "................", "..bbbb....gggg..", "..bbbb....gggg..", ".bbbbbb..gggggg.", "..bbbb....gggg..", "...bb......gg...", "..b..b....g..g..", "..b..b....g..g..", ".bb..bb..gg..gg.", "................", ".........y......", "..yyyyyyyyy.....", ".........y......"]
    },
    "休": {
      palette: { g: "#4b8c51", G: "#8dbb63", t: "#92623d", s: "#dfac7a", b: "#5d83ad" }, bg: "#e5efd9", frame: "#779752",
      rows: [".........gggg...", "........gGGGGg..", ".......gGGGGGGg.", ".......gggggggg.", ".........tt.....", ".........tt.....", ".....ss..tt.....", ".....ss..tt.....", "......bb.tt.....", ".....bbbbtt.....", "....bbbbbtt.....", "...bbbbbbtt.....", "..bbb....tt.....", ".........tt.....", "..GGGGGGGGGGGG..", "................"]
    },
    "体": {
      palette: { b: "#477daf", B: "#82b3d3", s: "#e5b788" }, bg: "#dfedf8", frame: "#5c87aa",
      rows: ["......ssss......", "......ssss......", ".......ss.......", ".....bbbbbb.....", "...bbbBBBBbbb...", "..bb.bBBBBb.bb..", ".bb..bBBBBb..bb.", ".....bBBBBb.....", ".....bbbbbb.....", "......b..b......", "......b..b......", ".....bb..bb.....", ".....bb..bb.....", "....bbb..bbb....", "................", "................"]
    },
    "蚊": {
      palette: { d: "#5c5268", w: "#b5d4df", b: "#8c728b" }, bg: "#e9e3ef", frame: "#8e7b9c",
      rows: ["................", "....w.....w.....", "...www...www....", "...wwww.wwww....", "....wwwdwww.....", "......ddd.......", "...ddddbdddd....", "......dbd.......", ".....ddbdd......", "....d..b..d.....", "...d...b...d....", "..d....d....d...", ".......d........", ".......d........", "................", "................"]
    },
    "虾": {
      palette: { r: "#cf695e", R: "#f2a183", d: "#a34c4b" }, bg: "#fae4db", frame: "#bc7b66",
      rows: ["................", "..r......r......", "...r....r.......", "....rrrrr.......", "...rRRRRRr......", "..rRRdRRRRr.....", "..rRRRRRRRr.....", "...rRRRRRr......", "....rRRRr.......", ".....rRRRr......", "......rRRRr.....", "......rRRRr.....", ".....rRRRr......", "...rrrRrr.......", "..rRRrr.........", "...rr..........."]
    },
    "虽": {
      palette: { y: "#e9b83e", Y: "#ffdc79", b: "#6099ba", w: "#d7e5ea", d: "#8da9b8" }, bg: "#e4eef7", frame: "#7c97b0",
      rows: [".........y......", ".....y..YYY..y..", ".......YYYYY....", "....y..YYYYY..y.", ".......YYYYY....", ".....ww.YYY.....", "...wwwwwwww.....", "..wwwwwwwwww....", ".wwwwwwwwwwww...", "..dddddddddd....", "................", "...b...b...b....", "..b...b...b.....", "................", "...b...b...b....", "..b...b...b....."]
    },
    "说": {
      palette: { s: "#e3ae7c", h: "#64504c", p: "#9671b9", w: "#f6edff", b: "#6481a4" }, bg: "#ece0f7", frame: "#9877b1",
      rows: ["........ppppppp.", ".......pwwwwwwwp", ".......pwpwpwwwp", ".......pwwwwwwwp", "........ppppppp.", "........p.......", "...hhhhp........", "..hsssh.........", "..hsssh.........", "...sss..........", "....s...........", "..bbbbb.........", ".bbbbbbb........", ".bbbbbbb........", "................", "................"]
    },
    "话": {
      palette: { p: "#9470b2", w: "#faf0ff", b: "#4e9fa6", W: "#dcf3ef" }, bg: "#e5e8fa", frame: "#7f84b3",
      rows: ["................", ".ppppppppp......", "pwwwwwwwwwp.....", "pwpwpwpwwwp.....", "pwwwwwwwwwp.....", ".ppppppppp......", "..pp............", "..p.............", "......bbbbbbbbb.", ".....bWWWWWWWWWb", ".....bWWbWbWbWWb", ".....bWWWWWWWWWb", "......bbbbbbbbb.", "............bb..", ".............b..", "................"]
    },
    "谢": {
      palette: { r: "#c96572", R: "#f2a7b0", y: "#f6d572", s: "#dfab80", S: "#bc8059" }, bg: "#f8e3e9", frame: "#b77b8f",
      rows: [".....rr..rr.....", ".....ryrryr.....", "......ryyr......", "....RRRyyRRR....", "....RRRyyRRR....", "....rrryyrrr....", "....RRRyyRRR....", "....RRRyyRRR....", "....rrrrrrrr....", "..ss........ss..", ".sSSs......sSSs.", ".sSSssssssssSSs.", "..sSSSSSSSSSSs..", "...ssssssssss...", "....ss....ss....", "................"]
    }
  };

  var TONE_NAMES = { 1: "1-й тон · красный", 2: "2-й тон · оранжевый", 3: "3-й тон · голубой", 4: "4-й тон · фиолетовый", 0: "нейтральный тон · серый" };
  var PRAISE = [
    "Мур-р! Идеальные черты!",
    "Кисть дрожит от восторга!",
    "Вот это каллиграфия!",
    "Синнабон жмёт лапу!",
    "Прекрасно! Ключ тебе покорился!",
    "Мастер бы гордился! Мяу!"
  ];
  var KOCO_LINES = [
    "Слышишь? Тон — это мелодия слога. Не проспи её!",
    "Хе-хе! Пропой вместе с кристаллом — он обожает дуэты.",
    "Один ключ — одна песня. Десять ключей — целый концерт!",
    "Голос вверх, голос вниз… тон решает всё!",
    "Звёзды сегодня подпевают. А ты?",
    "Попробуй «Медленно» — магия любит неторопливых."
  ];
  var KOCO_DRAW = {
    good: [
      "Мелодия поймана! Ты слышишь тоны, как настоящий маг!",
      "Идеальная линия! Кристалл мурлычет от удовольствия!",
      "Вот это форма! Резонатор аплодирует искрами!"
    ],
    mid: [
      "Почти-почти! Ещё разок — и кристалл вскрикнет от восторга.",
      "Слышу знакомую песню, но она пока стесняется. Попробуй снова!"
    ],
    off: [
      "Хе-хе, это песня другого тона. Послушай ещё раз и повтори рукой!",
      "Не та мелодия… Кристалл шепнул: «проверь меня ещё разок»."
    ]
  };
  var KOCO_TONE = {
    1: "Верный росчерк! Голос ровный и высокий — первый тон! Руна летит на красную доску.",
    2: "Точно! Голос идёт вверх — второй тон! Оранжевая доска приняла руну.",
    3: "Вот это нырок — вниз и снова вверх! Третий тон, голубая доска твоя!",
    4: "Решительно! Голос упал сверху — четвёртый тон! Фиолетовая доска запомнила руну."
  };
  var NOTE_DEFAULT = "Собрано! Нажми на кубик — расскажу его роль";
  var FLOORS = ["hall", "inside", "practice", "tower", "final"];

  document.addEventListener("DOMContentLoaded", function () {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function sparkle(host, count) {
      if (!reducedMotion && window.HanziSite) {
        window.HanziSite.sparkBurst(host, { count: count || 40, colors: ["#29b6f6", "#cbb1fb", "#80e5dc", "#f4cc85"] });
      }
    }

    function toneClass(t) { return "tone-" + t; }

    function strokesLabel(n) {
      var d10 = n % 10;
      var d100 = n % 100;
      if (d10 === 1 && d100 !== 11) return n + " черта";
      if (d10 >= 2 && d10 <= 4 && (d100 < 10 || d100 >= 20)) return n + " черты";
      return n + " черт";
    }

    function play(el, audio, text, rate) {
      if (window.HanziSite) {
        if (audio) window.HanziSite.playAudio(audio, rate || 1, text);
        else window.HanziSite.speak(text, 0.85);
      }
      if (el) {
        el.classList.add("speaking");
        setTimeout(function () { el.classList.remove("speaking"); }, 900);
      }
    }

    function el(tag, cls, text) {
      var node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = text;
      return node;
    }

    var FACTS_STORE = "hanzi-facts-u1";

    var KEY_FACTS = {
      water: [
        "Древний рисунок — поток реки: центральная черта это струя, боковые — брызги и водовороты.",
        "В словах вода сжимается слева в «три капли» 氵: 河 — река, 海 — море, 汽 — пар.",
        "Радикал №85 — один из самых продуктивных: под его началом больше 1 500 иероглифов."
      ],
      grass: [
        "Родился из 艸 — пучка травы, растущей вверх двумя ростками; нынешняя «травяная крыша» — ровно две травинки.",
        "Живёт на верхушке иероглифа: 花 — цветок, 茶 — чай, 草 — трава. Видишь крышу сверху — речь о растениях.",
        "Радикал №140. Раздел иероглифов с «травяной крышей» — один из самых объёмных в словарях: растений в языке тысячи."
      ],
      tree: [
        "Дерево целиком: крона вверх, корни вниз. Пиктограмма почти не менялась 3 000 лет.",
        "Иероглифы собираются конструктором: два дерева 林 — лес, три 森 — чаща.",
        "Радикал №75, больше 1 300 иероглифов: 村 — деревня, 桥 — мост, 桌 — стол."
      ],
      mouth: [
        "Рисунок открытого рта — квадрат губ. Простейший ключ урока: всего 3 черты.",
        "Слева помечает действия рта: 吃 — есть, 喝 — пить, 唱 — петь, 叫 — звать.",
        "Радикал №30, 1 100+ иероглифов. Утроение рта 品 — «вкус, товар»: всё надо попробовать."
      ],
      hand: [
        "Ладонь с расставленными пальцами; полная форма 手 пишется отдельно или снизу иероглифа.",
        "Слева рука превращается в 扌: 打 — бить, 找 — искать, 推 — толкать. А 看 — рука-козырёк над глазом.",
        "Радикал №64, 1 200+ иероглифов. 手机 — «ручная машина»: так по-китайски называется мобильный телефон."
      ],
      heart: [
        "Стилизованное сердце: три точки и крючок. Это рисунок органа, а не чувства.",
        "Прячется в двух видах: 忄слева (忙 — занятой) и 心 снизу (想 — думать, 念 — скучать).",
        "Радикал №61. В традиционном 愛 «любовь» есть сердце, а в упрощённом 爱 его место занял «друг» 友."
      ],
      metal: [
        "Рисунок шахты: колпак над самородками, спрятанными в земле, — металл буквально добывали из-под земли.",
        "Слева сжимается в «золотую иглу» 钅: 钱 — деньги, 银 — серебро, 铁 — железо.",
        "Радикал №167. В философии у-син 金 — стихия металла: ей отданы осень и запад."
      ],
      person: [
        "Человек в профиль с опущенной рукой — один из древнейших иероглифов Китая.",
        "Слева — «одиночка» 亻: 你 — ты, 他 — он. 从 — один идёт за другим, 众 — толпа из трёх.",
        "Радикал №9. Слово 仁 «гуманность» — два человека: по Конфуцию мораль рождается между людьми."
      ],
      insect: [
        "Изначально — змея: треугольная голова и извивающееся тело. Значило всех ползущих тварей.",
        "Стоит в словах о живности: 蚊 — комар, 蝴蝶 — бабочка; даже 蛇 «змея» тоже с ключом 虫.",
        "Радикал №142, 1 000+ иероглифов: в древности даже рыбы и рептилии записывались через «насекомое»."
      ],
      speech: [
        "Слова, текущие изо рта: точка-мысль над звуковыми волнами, внизу — сам рот 口.",
        "Слева превращается в «речевой флаг» 讠: 说 — говорить, 话 — речь, 语 — язык, 读 — читать.",
        "Радикал №149, 860+ иероглифов. 信 «доверять» = человек + его слово: слово должно быть честным."
      ]
    };

    var PROGRESS_STORE = "hanzi-progress-u1";
    var storageWarning = false;

    function isRecord(value) {
      return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function warnStorage() {
      if (storageWarning) return;
      storageWarning = true;
      var warning = el("p", "storage-warning", "Не удаётся сохранить прогресс в этом браузере. Результаты доступны до закрытия или перезагрузки страницы.");
      warning.setAttribute("role", "status");
      var main = document.querySelector("main");
      if (main) main.insertBefore(warning, main.firstChild);
    }

    function readStore(name) {
      var raw;
      try { raw = localStorage.getItem(name); }
      catch (err) { warnStorage(); return null; }
      try { return raw ? JSON.parse(raw) : null; }
      catch (err) { return null; }
    }

    function writeStore(name, state) {
      try { localStorage.setItem(name, JSON.stringify(state)); }
      catch (err) { warnStorage(); }
    }

    function loadFactState() {
      var state = { v: 1, o: {}, r: {} };
      var data = readStore(FACTS_STORE);
      if (!isRecord(data) || data.v !== 1) return state;
      KEYS.forEach(function (key) {
        var count = isRecord(data.o) ? data.o[key.art] : null;
        state.o[key.art] = Number.isInteger(count) && count >= 0 && count <= KEY_FACTS[key.art].length ? count : 0;
        var round = isRecord(data.r) ? data.r[key.art] : "";
        state.r[key.art] = typeof round === "string" && /^(m|f|mf|fm)?$/.test(round) ? round : "";
        if (state.o[key.art] === KEY_FACTS[key.art].length) state.r[key.art] = "";
      });
      return state;
    }

    function loadProgress() {
      var state = { v: 1, hall: {}, inside: {}, tower: {} };
      var data = readStore(PROGRESS_STORE);
      KEYS.forEach(function (key) { state.inside[key.art] = {}; });
      if (!isRecord(data) || data.v !== 1) return state;
      KEYS.forEach(function (key) {
        if (isRecord(data.hall) && data.hall[key.art] === true) state.hall[key.art] = true;
        if (isRecord(data.tower) && data.tower[key.art] === true) state.tower[key.art] = true;
        var words = isRecord(data.inside) && isRecord(data.inside[key.art]) ? data.inside[key.art] : {};
        key.ex.forEach(function (ex) {
          if (words[ex.ch] === true) state.inside[key.art][ex.ch] = true;
        });
      });
      return state;
    }

    var lessonProgress = loadProgress();
    var factsState = loadFactState();

    function saveFactState() {
      writeStore(FACTS_STORE, factsState);
      refreshProgress();
    }

    function saveProgress() {
      writeStore(PROGRESS_STORE, lessonProgress);
      refreshProgress();
    }

    function wordsCount(key) {
      return key.ex.filter(function (ex) { return lessonProgress.inside[key.art][ex.ch] === true; }).length;
    }

    function progressSummary() {
      var counts = [0, 0, 0, 0];
      var totals = [KEYS.length, 0, 0, KEYS.length];
      KEYS.forEach(function (key) {
        if (lessonProgress.hall[key.art]) counts[0]++;
        counts[1] += wordsCount(key);
        counts[2] += factsState.o[key.art] || 0;
        if (lessonProgress.tower[key.art]) counts[3]++;
        totals[1] += key.ex.length;
        totals[2] += KEY_FACTS[key.art].length;
      });
      var done = counts.map(function (n, i) { return n === totals[i]; });
      return { counts: counts, totals: totals, done: done, completed: done.filter(Boolean).length };
    }

    function setText(id, text) {
      var node = document.getElementById(id);
      if (node && node.textContent !== text) node.textContent = text;
    }

    function refreshProgress() {
      var summary = progressSummary();
      setText("hall-count", "Зажжено " + summary.counts[0] + " из " + summary.totals[0]);
      setText("inside-count", "Слов собрано " + summary.counts[1] + " из " + summary.totals[1]);
      setText("practice-count", "Фактов открыто " + summary.counts[2] + " из " + summary.totals[2]);
      setText("tower-count", "Рун освоено " + summary.counts[3] + " из " + summary.totals[3]);
      Array.prototype.forEach.call(document.querySelectorAll(".floor-track button"), function (btn, i) {
        var done = i < 4 ? summary.done[i] : summary.completed === 4;
        btn.classList.toggle("done", done);
        var label = btn.querySelector(".f-label");
        btn.setAttribute("aria-label", (label ? label.textContent : "Этаж " + (i + 1)) + (done ? " — пройден" : " — не завершён"));
      });
      KEYS.forEach(function (key, i) {
        var insideTile = document.querySelectorAll("#inside-shelf .ip-tile")[i];
        var practiceTile = document.querySelectorAll("#writer-select .sel-tile")[i];
        [[insideTile, wordsCount(key), key.ex.length, "Собрано"], [practiceTile, factsState.o[key.art] || 0, KEY_FACTS[key.art].length, "Факты"]].forEach(function (item) {
          var tile = item[0];
          if (!tile) return;
          var badge = tile.querySelector(".key-progress");
          if (!badge) {
            badge = el("span", "key-progress");
            (tile.querySelector(".t-text") || tile).appendChild(badge);
          }
          var done = item[1] === item[2];
          badge.replaceChildren();
          if (done) badge.textContent = "✓ Готово";
          else {
            badge.appendChild(el("span", "progress-kind", item[3]));
            badge.appendChild(el("span", "progress-value", item[1] + "/" + item[2]));
          }
          tile.classList.toggle("progress-done", done);
          tile.setAttribute("aria-label", "Ключ " + key.ch + " " + key.py + ". " + item[3] + " " + item[1] + " из " + item[2] + (done ? ". Пройден" : ""));
        });
      });
      var insidePanel = document.getElementById("inside-panel");
      if (insidePanel && insidePanel.dataset.art) {
        var selected = KEYS.filter(function (key) { return key.art === insidePanel.dataset.art; })[0];
        if (selected) {
          var assembled = wordsCount(selected);
          setText("inside-key-count", (assembled === selected.ex.length ? "✓ " : "") + "Собрано " + assembled + "/" + selected.ex.length);
          var keyCount = document.getElementById("inside-key-count");
          if (keyCount) keyCount.classList.toggle("progress-done", assembled === selected.ex.length);
        }
      }
      Array.prototype.forEach.call(document.querySelectorAll(".ip-word[data-art]"), function (btn) {
        var done = lessonProgress.inside[btn.dataset.art][btn.dataset.word] === true;
        btn.classList.toggle("progress-done", done);
        var badge = btn.querySelector(".word-progress");
        if (badge) badge.textContent = done ? "✓ Собрано" : "Не собрано";
      });
      refreshDiplomaStats();
    }

    function renderArt(artId, collection) {
      var art = (collection || PIXEL_ARTS)[artId];
      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 16 16");
      svg.setAttribute("class", "t-art");
      svg.setAttribute("shape-rendering", "crispEdges");
      svg.setAttribute("aria-hidden", "true");
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

    var speakerSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke-linejoin="round"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" stroke-linecap="round"/></svg>';

    function soundButton(audio, text, label) {
      var btn = el("button", "sound-button");
      btn.type = "button";
      btn.innerHTML = speakerSvg;
      btn.appendChild(el("span", null, label || "Послушать"));
      btn.addEventListener("click", function () { play(btn, audio, text); });
      return btn;
    }

    function probeInto(box, ch, py, mean) {
      if (!box) return;
      var token = (box._picToken = (box._picToken || 0) + 1);
      var sources = ["img/" + ch + ".jpg", "img/" + ch + "1.jpg", "img/" + ch + ".png", "img/" + ch + "1.png"];
      function attempt(i) {
        if (token !== box._picToken) return;
        var probe = new Image();
        probe.onload = function () {
          if (token !== box._picToken) return;
          var img = box.querySelector("img");
          if (!img) {
            img = document.createElement("img");
            box.appendChild(img);
          }
          img.alt = "Картинка: " + ch + " " + (py || "") + (mean ? " («" + mean + "»)" : "");
          img.src = sources[i];
        };
        probe.onerror = function () {
          if (token !== box._picToken) return;
          if (i + 1 < sources.length) attempt(i + 1);
          else {
            var img = box.querySelector("img");
            if (img) img.remove();
          }
        };
        probe.src = sources[i];
      }
      attempt(0);
    }

    function keyTile(key, index, compact) {
      var tile = el("button", "key-tile");
      tile.type = "button";
      tile.setAttribute("role", "listitem");
      tile.setAttribute("aria-label", "Ключ " + key.ch + " " + key.py + " («" + key.mean + "», " + strokesLabel(key.strokes) + "). Послушать произношение");
      tile.appendChild(el("span", "key-num", "№" + key.kx));
      tile.appendChild(el("span", "key-strokes", strokesLabel(key.strokes)));
      var hanzi = el("span", "key-hanzi", key.ch);
      hanzi.setAttribute("lang", "zh-CN");
      tile.appendChild(hanzi);
      tile.appendChild(el("span", "key-pinyin tone-text " + toneClass(key.t), key.py));
      tile.appendChild(el("span", "key-meaning", key.mean));
      tile.dataset.index = String(index);
      tile.addEventListener("click", function () {
        play(tile, key.audio, key.ch);
      });
      return tile;
    }

    var inited = {};

    var showFloor = (function () {
      var buttons = Array.prototype.slice.call(document.querySelectorAll(".floor-track button"));

      function setCurrent(id) {
        var idx = FLOORS.indexOf(id);
        buttons.forEach(function (btn, i) {
          btn.classList.toggle("current", i === idx);
          if (i === idx) btn.setAttribute("aria-current", "true");
          else btn.removeAttribute("aria-current");
        });
      }

      return function (id, noScroll) {
        FLOORS.forEach(function (fid) {
          var section = document.getElementById(fid);
          if (section) section.hidden = fid !== id;
        });
        setCurrent(id);
        var workshop = document.getElementById("workshop-room");
        if (workshop) workshop.hidden = id !== "hall";
        var section = document.getElementById(id);
        if (section && !noScroll) section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        if (id === "inside" && !inited.inside) { inited.inside = true; initInside(); }
        if (id === "practice" && !inited.practice) { inited.practice = true; initPractice(); }
        else if (id === "practice") checkWriterSize();
        if (id === "tower" && !inited.tower) { inited.tower = true; initTower(); }
        if (id === "final" && !inited.final) { inited.final = true; initFinal(); }
        refreshProgress();
      };
    })();

    Array.prototype.forEach.call(document.querySelectorAll(".floor-track button"), function (btn) {
      btn.addEventListener("click", function () { showFloor(btn.getAttribute("data-floor")); });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"), function (btn) {
      btn.addEventListener("click", function () { showFloor(btn.getAttribute("data-goto")); });
    });

    function croak() {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        var ctx = new Ctx();
        var oscillator = ctx.createOscillator();
        var gain = ctx.createGain();
        var start = ctx.currentTime;
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(150, start);
        oscillator.frequency.exponentialRampToValueAtTime(80, start + 0.18);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.24);
        oscillator.onended = function () { ctx.close().catch(function () {}); };
      } catch (error) {}
    }

    function chime() {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        var ctx = new Ctx();
        [660, 990].forEach(function (freq, index) {
          var oscillator = ctx.createOscillator();
          var gain = ctx.createGain();
          var start = ctx.currentTime + index * 0.03;
          oscillator.type = "sine";
          oscillator.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(index ? 0.05 : 0.08, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
          oscillator.connect(gain);
          gain.connect(ctx.destination);
          oscillator.start(start);
          oscillator.stop(start + 1);
        });
        setTimeout(function () { ctx.close().catch(function () {}); }, 1300);
      } catch (error) {}
    }

    (function initRoomDecor() {
      var typeTimer = null;
      var zapTimer = null;
      var bellTimer = null;
      var runesTimer = null;

      function showReplica(btn) {
        var replica = btn.querySelector(".hero-replica");
        if (!replica) return;
        clearTimeout(btn._replicaTimer);
        replica.textContent = btn.getAttribute("data-spell") || "";
        replica.classList.remove("show");
        void replica.offsetWidth;
        replica.classList.add("show");
        btn._replicaTimer = setTimeout(function () { replica.classList.remove("show"); }, 1700);
      }

      function typeLine(target, text) {
        clearInterval(typeTimer);
        target.hidden = false;
        if (reducedMotion) { target.textContent = text; return; }
        var shown = 0;
        target.textContent = "";
        typeTimer = setInterval(function () {
          shown++;
          target.textContent = text.slice(0, shown);
          if (shown >= text.length) clearInterval(typeTimer);
        }, 24);
      }

      function castButton(btn, opts) {
        btn.addEventListener("click", function () {
          showReplica(btn);
          if (opts && opts.sound) opts.sound();
          if (opts && opts.typeInto) typeLine(opts.typeInto, btn.getAttribute("data-spell") || "");
          if (reducedMotion) return;
          clearTimeout(btn._castTimer);
          btn.classList.remove("casting");
          void btn.offsetWidth;
          btn.classList.add("casting");
          if (opts && opts.sparkle) sparkle(btn, 20);
          btn._castTimer = setTimeout(function () { btn.classList.remove("casting"); }, 1600);
        });
      }

      var zhabert = document.getElementById("zhabert-hero");
      if (zhabert) castButton(zhabert, { sound: croak });
      var robot = document.getElementById("robot-hero");
      var powerLine = document.getElementById("power-line");
      if (robot) castButton(robot, powerLine ? { typeInto: powerLine } : null);
      var wizard = document.getElementById("wizard-hero");
      if (wizard) castButton(wizard, { sparkle: true });
      var cereZhab = document.getElementById("cere-zhabert");
      if (cereZhab) castButton(cereZhab, { sound: croak });
      var cereKoko = document.getElementById("cere-koko");
      if (cereKoko) castButton(cereKoko, { sparkle: true });
      var cereCat = document.getElementById("cere-cinnabon");
      if (cereCat) castButton(cereCat, { sparkle: true });
      var cereRobo = document.getElementById("cere-robo");
      if (cereRobo) castButton(cereRobo, null);

      Array.prototype.forEach.call(document.querySelectorAll(".lily-hit"), function (pad) {
        pad.addEventListener("click", function () {
          if (reducedMotion) return;
          pad.classList.remove("splash");
          void pad.offsetWidth;
          pad.classList.add("splash");
          setTimeout(function () { pad.classList.remove("splash"); }, 1000);
        });
      });

      Array.prototype.forEach.call(document.querySelectorAll(".power-bank"), function (bank) {
        bank.addEventListener("click", function () {
          if (reducedMotion) return;
          bank.classList.remove("surge");
          void bank.offsetWidth;
          bank.classList.add("surge");
          var rail = document.querySelector(".cable-rail");
          if (rail) {
            rail.classList.remove("zap");
            void rail.offsetWidth;
            rail.classList.add("zap");
          }
          clearTimeout(zapTimer);
          zapTimer = setTimeout(function () {
            bank.classList.remove("surge");
            var liveRail = document.querySelector(".cable-rail");
            if (liveRail) liveRail.classList.remove("zap");
          }, 700);
        });
      });

      var bell = document.getElementById("bell-btn");
      if (bell) bell.addEventListener("click", function () {
        chime();
        if (reducedMotion) return;
        clearTimeout(bellTimer);
        bell.classList.remove("ringing");
        void bell.offsetWidth;
        bell.classList.add("ringing");
        bellTimer = setTimeout(function () { bell.classList.remove("ringing"); }, 1000);
        var windows = document.querySelectorAll(".arch-window");
        clearTimeout(runesTimer);
        Array.prototype.forEach.call(windows, function (win) {
          win.classList.remove("runes-lit");
          void win.offsetWidth;
          win.classList.add("runes-lit");
        });
        runesTimer = setTimeout(function () {
          Array.prototype.forEach.call(windows, function (win) { win.classList.remove("runes-lit"); });
        }, 1300);
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          clearInterval(typeTimer);
          clearTimeout(zapTimer);
          clearTimeout(bellTimer);
          clearTimeout(runesTimer);
          Array.prototype.forEach.call(document.querySelectorAll(".casting, .splash, .surge, .zap, .ringing, .runes-lit"), function (node) {
            node.classList.remove("casting", "splash", "surge", "zap", "ringing", "runes-lit");
          });
        }
      });
    })();

    (function initHall() {
      var strip = document.getElementById("hall-strip");
      var count = document.getElementById("hall-count");
      var bubble = document.getElementById("cinnabon-bubble");
      if (!strip) return;
      var lit = lessonProgress.hall;
      var litCount = progressSummary().counts[0];
      var currentKey = 0;
      var picturesBox = document.getElementById("gd-pictures");

      function applyDetail(key, index) {
        currentKey = index;
        var glyph = document.getElementById("gd-glyph");
        if (!glyph) return;
        glyph.textContent = key.ch;
        var py = document.getElementById("gd-py");
        py.textContent = key.py;
        py.className = "reading tone-text " + toneClass(key.t);
        document.getElementById("gd-tone").textContent = TONE_NAMES[key.t];
        document.getElementById("gd-mean").textContent = key.mean;
        document.getElementById("gd-strokes").textContent = String(key.strokes);
        document.getElementById("gd-kx").textContent = "№" + key.kx + " из 214";
        document.getElementById("gd-form").textContent = key.form + " " + key.pos;
        document.getElementById("gd-num").textContent = "— ключ " + (index + 1) + " из 10 —";
        document.getElementById("gd-sound-label").textContent = "Послушать " + key.py;
        probeInto(picturesBox, key.ch, key.py, key.mean);
        Array.prototype.forEach.call(strip.children, function (tile, i) {
          tile.classList.toggle("active", i === index);
        });
      }

      var soundBtn = document.getElementById("gd-sound");
      if (soundBtn) {
        soundBtn.addEventListener("click", function () {
          play(soundBtn, KEYS[currentKey].audio, KEYS[currentKey].ch);
        });
      }

      KEYS.forEach(function (key, i) {
        var tile = keyTile(key, i, true);
        tile.classList.toggle("lit", lit[key.art] === true);
        tile.addEventListener("click", function () {
          if (!lit[key.art]) {
            lit[key.art] = true;
            litCount++;
            tile.classList.add("lit");
            sparkle(tile, 18);
            if (count) count.textContent = "Зажжено " + litCount + " из " + KEYS.length;
            saveProgress();
            if (litCount === KEYS.length) hallComplete(true);
          }
          applyDetail(key, i);
          play(tile, key.audio, key.ch);
        });
        strip.appendChild(tile);
      });
      function hallComplete(celebrate) {
        var sign = document.querySelector(".workshop-sign");
        if (sign) sign.classList.add("sign-lit");
        if (bubble) bubble.innerHTML = "<p>Мур-р-р! Все десять ключей <b>зажжены</b> — вывеска сияет золотом! Мастерская открыта: поднимайся на <b>этаж 2</b> — там ключи идут в дело внутри настоящих иероглифов.</p>";
        var cta = document.querySelector("#hall .finale-actions .action-button");
        if (cta) cta.classList.add("pulse");
        var rack = document.getElementById("hall-rack");
        if (rack && celebrate) sparkle(rack, 70);
      }
      if (litCount === KEYS.length) hallComplete(false);
      applyDetail(KEYS[0], 0);
    })();

    var selectInsideKey = null;

    function initInside() {
      var shelf = document.getElementById("inside-shelf");
      var panel = document.getElementById("inside-panel");
      if (!shelf || !panel) return;
      var panelTheme = "";

      function makeKeyIdentity(key) {
        var details = el("div", "ip-key-details");
        details.setAttribute("role", "group");
        details.setAttribute("aria-label", "Облик ключа " + key.ch + " в иероглифе");
        details.appendChild(el("div", "ip-key-details-title", "Облик в иероглифе"));
        var identity = el("div", "ip-head-identity");
        var full = el("span", "ip-full", key.ch);
        full.setAttribute("lang", "zh-CN");
        identity.appendChild(full);
        identity.appendChild(el("span", "ip-head-arrow", "→"));
        var form = el("span", "ip-form", key.form);
        form.setAttribute("lang", "zh-CN");
        identity.appendChild(form);
        details.appendChild(identity);
        var meta = el("div", "ip-meta");
        meta.appendChild(el("span", "ip-form-name", "«" + key.formName + "»"));
        meta.appendChild(el("span", "ip-pos", "Положение: " + key.pos));
        details.appendChild(meta);
        details.appendChild(soundButton(key.audio, key.ch, key.py));
        return details;
      }

      function makeExample(key, ex) {
        var card = el("div", "ip-ex");

        var build = el("div", "ip-build");
        var heading = el("div", "ip-word-heading");
        var top = el("div", "ip-ex-top");
        top.appendChild(el("span", "ip-ex-py tone-text " + toneClass(ex.t), ex.py));
        top.appendChild(el("span", "ip-ex-tr", "«" + ex.tr + "»"));
        heading.appendChild(top);
        heading.appendChild(soundButton(ex.audio, ex.ch, "Послушать " + ex.py));
        build.appendChild(heading);

        var formula = el("div", "ip-formula");
        var result = el("div", "ip-result");
        var plate = el("div", "ip-plate");
        var qMark = el("span", "q", "?");
        var plateChar = el("span", "ch", ex.ch);
        plateChar.setAttribute("lang", "zh-CN");
        plateChar.hidden = true;
        plate.appendChild(qMark);
        plate.appendChild(plateChar);
        result.appendChild(plate);
        var resultStatus = el("span", "ip-result-status", "Результат");
        resultStatus.setAttribute("role", "status");
        result.appendChild(resultStatus);

        var partsBox = el("div", "ip-parts" + (ex.stack ? " stack" : ""));
        var components = [];
        partsBox.setAttribute("role", "group");
        partsBox.setAttribute("aria-label", "Собери иероглиф слова «" + ex.tr + "» из кубиков");
        var note = el("div", "ip-note", "Собери иероглиф слова «" + ex.tr + "»: нажимай кубики — в любом порядке!");
        note.setAttribute("role", "status");

        var explanation = el("div", "ip-explanation");

        var assembled = false;
        var left = ex.parts.length;

        function complete(restore) {
          if (assembled) return;
          assembled = true;
          qMark.hidden = true;
          plateChar.hidden = false;
          plate.classList.add("assembled");
          if (restore) plate.classList.add("restored");
          resultStatus.textContent = "✓ Собрано";
          resultStatus.classList.add("complete");
          revealPicture();
          note.textContent = NOTE_DEFAULT;
          components.forEach(function (button) {
            button.classList.add("done");
            button.setAttribute("aria-label", button.dataset.label + ". Собрано. Узнать роль");
          });
          if (!restore) {
            lessonProgress.inside[key.art][ex.ch] = true;
            saveProgress();
            sparkle(plate, 30);
            play(null, ex.audio, ex.ch);
          }
        }

        ex.parts.forEach(function (part, pi) {
          var radCls = part.rad ? "r-part" : "";
          if (part.rad && ex.role && ex.role.cat && ex.role.cat !== "sense") radCls += " rc-" + ex.role.cat;
          var component = el("div", "ip-component");
          var button = el("button", "ip-part " + radCls);
          button.type = "button";
          button.dataset.label = (part.rad ? "Ключ" : "Другая часть") + " " + part.t;
          button.setAttribute("aria-label", button.dataset.label);
          var glyph = el("span", "ip-part-glyph", part.t);
          glyph.setAttribute("lang", "zh-CN");
          button.appendChild(glyph);
          if (ex.stack) button.classList.add("s-" + (pi + 1));
          function onPart() {
            if (assembled) {
              components.forEach(function (item) { item.classList.remove("active"); });
              button.classList.add("active");
              note.innerHTML = part.rad ? ex.noteR : ex.noteS;
              sparkle(partsBox, 8);
              return;
            }
            if (button.classList.contains("done")) return;
            button.classList.add("done");
            button.setAttribute("aria-label", button.dataset.label + ". Добавлено");
            left--;
            sparkle(button, 10);
            if (left <= 0) complete();
            else note.textContent = "Отлично! Осталось кубиков: " + left;
          }
          button.addEventListener("click", onPart);
          components.push(button);
          component.appendChild(button);
          component.appendChild(el("span", "ip-component-label", part.rad ? "Ключ" : "Другая часть"));
          if (!ex.stack && pi > 0) {
            var plus = el("span", "ip-plus", "+");
            plus.setAttribute("aria-hidden", "true");
            partsBox.appendChild(plus);
          }
          partsBox.appendChild(component);
        });
        formula.appendChild(partsBox);
        var arrow = el("span", "ip-formula-arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        formula.appendChild(arrow);
        formula.appendChild(result);
        build.appendChild(formula);
        if (ex.role && ex.role.text) {
          var radPart = null;
          ex.parts.forEach(function (p) { if (p.rad && !radPart) radPart = p; });
          if (radPart) {
            var roles = el("div", "ip-roles");
            var chip = el("span", "ip-role cat-" + (ex.role.cat || "sense"));
            var chipKey = el("i", null, radPart.t);
            chipKey.setAttribute("lang", "zh-CN");
            chip.appendChild(chipKey);
            chip.appendChild(document.createTextNode(ex.role.text));
            roles.appendChild(chip);
            explanation.appendChild(roles);
          }
        }
        explanation.appendChild(note);
        build.appendChild(explanation);
        build.appendChild(makeKeyIdentity(key));
        card.appendChild(build);

        var picBox = el("div", "ip-pictures veiled");
        var zoom = el("button", "ip-picture-zoom");
        zoom.type = "button";
        zoom.disabled = true;
        zoom.setAttribute("aria-label", "Увеличить картинку: " + ex.ch + " «" + ex.tr + "»");
        zoom.title = "Нажми, чтобы увеличить картинку";
        zoom.addEventListener("click", function () {
          var img = zoom.querySelector("img");
          var site = window.HanziSite;
          if (!img || !site || !site.lightbox) return;
          site.lightbox(img.src, img.alt);
          var overlay = document.querySelector(".hz-lightbox");
          if (!overlay) return;
          overlay.setAttribute("role", "dialog");
          overlay.setAttribute("aria-modal", "true");
          overlay.setAttribute("aria-label", "Увеличенная картинка: " + ex.tr);
          var close = el("button", "ip-picture-close", "Закрыть ×");
          close.type = "button";
          overlay.insertBefore(close, overlay.firstChild);
          overlay.addEventListener("click", function () { zoom.focus({ preventScroll: true }); });
          overlay.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              site.closeOverlays();
              zoom.focus({ preventScroll: true });
            } else if (event.key === "Tab") {
              event.preventDefault();
              close.focus();
            }
          });
          close.focus();
        });
        picBox.appendChild(zoom);
        card.appendChild(picBox);
        probeInto(zoom, ex.ch, ex.py, ex.tr);

        function revealPicture() {
          picBox.classList.remove("veiled");
          picBox.classList.add("revealed");
          zoom.disabled = false;
        }

        if (lessonProgress.inside[key.art][ex.ch]) complete(true);
        return card;
      }

      selectInsideKey = function (index) {
        var key = KEYS[index];
        if (panelTheme) panel.classList.remove(panelTheme);
        panelTheme = "theme-" + key.art;
        panel.classList.add(panelTheme);
        panel.dataset.art = key.art;
        panel.setAttribute("aria-label", "Досье ключа " + key.ch + " «" + key.mean + "»: выбери слово и собери его из частей");
        panel.replaceChildren();
        var head = el("div", "ip-head");
        var keyCount = el("span", "ip-key-count");
        keyCount.id = "inside-key-count";
        keyCount.setAttribute("role", "status");
        head.appendChild(keyCount);
        panel.appendChild(head);

        var wordsBox = el("div", "ip-words");
        wordsBox.setAttribute("role", "group");
        wordsBox.setAttribute("aria-label", "Выбери слово и собери его иероглиф");
        var exBox = el("div", "ip-workspace");
        exBox.id = "inside-workspace";
        exBox.setAttribute("role", "group");
        exBox.setAttribute("aria-label", "Сборка выбранного слова и иллюстрация");
        key.ex.forEach(function (ex, i) {
          var wordBtn = el("button", "ip-word");
          wordBtn.type = "button";
          wordBtn.setAttribute("aria-pressed", String(i === 0));
          wordBtn.setAttribute("aria-controls", "inside-workspace");
          var art = WORD_ARTS[ex.ch];
          if (art) {
            wordBtn.style.setProperty("--word-bg", art.bg);
            wordBtn.style.setProperty("--word-frame", art.frame);
          }
          wordBtn.appendChild(renderArt(ex.ch, WORD_ARTS));
          wordBtn.appendChild(el("span", "w-py tone-text " + toneClass(ex.t), ex.py));
          wordBtn.appendChild(el("span", "w-tr", ex.tr));
          wordBtn.dataset.art = key.art;
          wordBtn.dataset.word = ex.ch;
          wordBtn.appendChild(el("span", "word-progress"));
          wordBtn.addEventListener("click", function () {
            Array.prototype.forEach.call(wordsBox.children, function (b, bi) {
              b.classList.toggle("active", bi === i);
              b.setAttribute("aria-pressed", String(bi === i));
            });
            exBox.replaceChildren(makeExample(key, key.ex[i]));
            play(wordBtn, ex.audio, ex.ch);
          });
          wordsBox.appendChild(wordBtn);
        });
        panel.appendChild(wordsBox);
        panel.appendChild(exBox);
        wordsBox.children[0].classList.add("active");
        exBox.appendChild(makeExample(key, key.ex[0]));

        Array.prototype.forEach.call(shelf.children, function (tile, i) {
          tile.classList.toggle("active", i === index);
        });
        refreshProgress();
      };

      KEYS.forEach(function (key, i) {
        var tile = el("button", "ip-tile");
        tile.type = "button";
        tile.setAttribute("role", "listitem");
        tile.setAttribute("aria-label", "Показать ключ " + key.ch + " " + key.py + " («" + key.mean + "»)");
        tile.classList.add("theme-" + key.art);
        tile.appendChild(renderArt(key.art));
        var hanzi = el("span", "t-hanzi", key.ch);
        hanzi.setAttribute("lang", "zh-CN");
        tile.appendChild(hanzi);
        var text = el("span", "t-text");
        text.appendChild(el("span", "t-py tone-text " + toneClass(key.t), key.py));
        text.appendChild(el("span", "t-mean", key.mean));
        tile.appendChild(text);
        tile.addEventListener("click", function () {
          selectInsideKey(i);
          play(tile, key.audio, key.ch);
        });
        shelf.appendChild(tile);
      });

      selectInsideKey(0);
    }

    var selectPracticeKey = null;
    var checkWriterSize = function () {};

    function initPractice() {
      var select = document.getElementById("writer-select");
      var target = document.getElementById("writer-target");
      var status = document.getElementById("w-status");
      var progress = document.getElementById("w-progress");
      var dotsBox = document.getElementById("w-dots");
      var success = document.getElementById("w-success");
      var formCell = document.getElementById("form-cell");
      var formTarget = document.getElementById("writer-target-form");
      var formStatus = document.getElementById("w-form-status");
      var formProgress = document.getElementById("w-form-progress");
      var formBar = document.getElementById("w-form-bar");
      var formCap = document.getElementById("w-form-cap");
      if (!select || !target) return;

      var writer = null;
      var writerChar = "";
      var writerSize = 0;
      var loadFailed = false;
      var quizVersion = 0;
      var completeTimer = null;
      var resizeTimer = null;
      var dots = [];
      var formWriter = null;
      var formSize = 0;
      var formTotal = 0;
      var formLoadFailed = false;
      var formVersion = 0;
      var formTimer = null;
      var factsBox = document.getElementById("fact-list");

      function setDotsCount(n) {
        dotsBox.replaceChildren();
        dots = [];
        for (var i = 0; i < n; i++) {
          var s = el("span");
          dotsBox.appendChild(s);
          dots.push(s);
        }
      }

      function setProgress(count, total) {
        progress.textContent = "Черта " + count + " из " + total;
        dots.forEach(function (dot, index) { dot.classList.toggle("done", index < count); });
      }

      function renderFacts(newIndex) {
        if (!factsBox) return;
        var key = KEYS[currentKey];
        var facts = KEY_FACTS[key.art] || [];
        var openCount = factsState.o[key.art] || 0;
        var round = factsState.r[key.art] || "";
        var hasForm = !!(key.form && key.form !== key.ch);
        var hint = hasForm
          ? "Напиши " + key.ch + " и вторую форму " + key.form + " — откроется факт №"
          : "Напиши " + key.ch + " правильно — откроется факт №";
        factsBox.replaceChildren();
        facts.forEach(function (text, i) {
          var opened = i < openCount;
          var cardHint = hint + (i + 1);
          if (i === openCount && hasForm) {
            if (round.indexOf("m") >= 0 && round.indexOf("f") < 0) cardHint = "Полная форма написана! Теперь обведи " + key.form + " — откроется факт №" + (i + 1);
            else if (round.indexOf("f") >= 0 && round.indexOf("m") < 0) cardHint = "Форма " + key.form + " написана! Теперь обведи полную " + key.ch + " — откроется факт №" + (i + 1);
          }
          var card = el("div", "fact-card" + (opened ? " open" : " locked") + (opened && i + 1 === newIndex ? " fact-new" : ""));
          card.setAttribute("role", "listitem");
          card.appendChild(el("p", "fact-head", "ФАКТ №" + (i + 1)));
          card.appendChild(el("p", "fact-text", opened ? text : cardHint));
          factsBox.appendChild(card);
        });
      }

      function factWritten(kind) {
        var key = KEYS[currentKey];
        var opened = factsState.o[key.art] || 0;
        if (opened >= 3) return;
        var round = factsState.r[key.art] || "";
        if (round.indexOf(kind) < 0) round += kind;
        var hasForm = !!(key.form && key.form !== key.ch);
        if (round.indexOf("m") >= 0 && (!hasForm || round.indexOf("f") >= 0)) {
          factsState.o[key.art] = opened + 1;
          factsState.r[key.art] = "";
          saveFactState();
          renderFacts(opened + 1);
        } else {
          factsState.r[key.art] = round;
          saveFactState();
          renderFacts();
        }
      }

      function startQuiz() {
        if (!writer || loadFailed) { createWriter(); return; }
        var total = KEYS[currentKey].strokes;
        var version = ++quizVersion;
        var credited = false;
        clearTimeout(completeTimer);
        writer.cancelQuiz();
        writer.resumeAnimation();
        success.hidden = true;
        setProgress(0, total);
        status.textContent = "Обведи ключ пальцем или мышкой";
        writer.quiz({
          onCorrectStroke: function (data) {
            if (version !== quizVersion) return;
            setProgress(data.strokeNum + 1, total);
            status.textContent = "Отлично! Продолжай";
            sparkle(target, 12);
          },
          onMistake: function (data) {
            if (version !== quizVersion) return;
            status.textContent = "Попробуй черту №" + (data.strokeNum + 1) + " ещё раз. Кнопка «Показать черты» поможет";
          },
          onComplete: function () {
            if (version !== quizVersion || credited) return;
            credited = true;
            setProgress(total, total);
            var praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
            status.textContent = "Ключ " + KEYS[currentKey].ch + " написан верно!";
            success.textContent = praise + " " + KEYS[currentKey].ch + " «" + KEYS[currentKey].mean + "» (" + KEYS[currentKey].py + ") написан безупречно!";
            success.hidden = false;
            sparkle(target, 60);
            completeTimer = setTimeout(function () { if (version === quizVersion) sparkle(target, 25); }, 300);
            factWritten("m");
          }
        });
      }

      function createWriter() {
        quizVersion++;
        clearTimeout(completeTimer);
        if (!window.HanziWriter) {
          status.textContent = "Тренажёр не загрузился. Проверь интернет и обнови страницу";
          return;
        }
        var key = KEYS[currentKey];
        if (writer) { writer.cancelQuiz(); writer.pauseAnimation(); }
        target.replaceChildren();
        loadFailed = false;
        var size = target.clientWidth || 200;
        writerSize = size;
        writerChar = key.ch;
        writer = HanziWriter.create(target, key.ch, {
          width: size,
          height: size,
          padding: 10,
          showOutline: true,
          strokeColor: "#29b6f6",
          outlineColor: "#dacbb4",
          drawingColor: "#0288d1",
          highlightColor: "#b3e5fc",
          highlightCompleteColor: "#29b6f6",
          onLoadCharDataError: function () {
            loadFailed = true;
            status.textContent = "Не удалось загрузить черты. Проверь интернет и выбери ключ заново";
          }
        });
        startQuiz();
      }

      function setFormProgress(count, total) {
        formProgress.textContent = "Черта " + count + " из " + total;
      }

      function startFormQuiz() {
        if (!formWriter || formLoadFailed || formCell.hidden) return;
        var version = ++formVersion;
        var credited = false;
        clearTimeout(formTimer);
        formWriter.cancelQuiz();
        formWriter.resumeAnimation();
        if (formTotal) setFormProgress(0, formTotal);
        formStatus.textContent = "Обведи вторую форму — " + KEYS[currentKey].form;
        formWriter.quiz({
          onCorrectStroke: function (data) {
            if (version !== formVersion) return;
            if (formTotal) setFormProgress(data.strokeNum + 1, formTotal);
            formStatus.textContent = "Отлично! Продолжай";
            sparkle(formTarget, 12);
          },
          onMistake: function (data) {
            if (version !== formVersion) return;
            formStatus.textContent = "Попробуй черту №" + (data.strokeNum + 1) + " ещё раз";
          },
          onComplete: function () {
            if (version !== formVersion || credited) return;
            credited = true;
            if (formTotal) setFormProgress(formTotal, formTotal);
            formStatus.textContent = "Форма " + KEYS[currentKey].form + " написана верно! Отличная работа!";
            sparkle(formTarget, 60);
            formTimer = setTimeout(function () { if (version === formVersion) sparkle(formTarget, 25); }, 300);
            factWritten("f");
          }
        });
      }

      function createFormWriter() {
        formVersion++;
        clearTimeout(formTimer);
        if (formWriter) { formWriter.cancelQuiz(); formWriter.pauseAnimation(); }
        formWriter = null;
        formLoadFailed = false;
        formTotal = 0;
        formProgress.textContent = "";
        formTarget.replaceChildren();
        var key = KEYS[currentKey];
        var hasForm = !!(key.form && key.form !== key.ch);
        formCell.hidden = !hasForm;
        formBar.hidden = !hasForm;
        if (hasForm) {
          formCap.textContent = "В составе: " + key.form + (key.formName ? " — " + key.formName : "") + (key.pos ? " (" + key.pos + ")" : "");
          formStatus.textContent = "Обведи вторую форму — " + key.form;
          if (window.HanziWriter) {
            var size = formTarget.clientWidth || 180;
            formSize = size;
            formWriter = HanziWriter.create(formTarget, key.form, {
              width: size,
              height: size,
              padding: 10,
              showOutline: true,
              strokeColor: "#35c0d8",
              outlineColor: "#dacbb4",
              drawingColor: "#1a7f95",
              highlightColor: "#b3e5fc",
              highlightCompleteColor: "#35c0d8",
              onLoadCharDataError: function () {
                formLoadFailed = true;
                formStatus.textContent = "Не удалось загрузить черты формы. Проверь интернет";
              }
            });
            var loadingWriter = formWriter;
            HanziWriter.loadCharacterData(key.form).then(function (data) {
              if (loadingWriter !== formWriter || KEYS[currentKey] !== key) return;
              formTotal = data && data.strokes ? data.strokes.length : 0;
              if (!formCell.hidden) setFormProgress(0, formTotal);
            }).catch(function () {});
            startFormQuiz();
          } else {
            formStatus.textContent = "Тренажёр не загрузился. Проверь интернет и обнови страницу";
          }
        } else {
          formStatus.textContent = "";
        }
      }

      var currentKey = 0;

      selectPracticeKey = function (index) {
        currentKey = index;
        var key = KEYS[index];
        document.getElementById("w-char").textContent = key.ch;
        document.getElementById("w-badge").textContent = strokesLabel(key.strokes);
        document.getElementById("w-hint").textContent = key.hint;
        Array.prototype.forEach.call(select.children, function (tile, i) {
          tile.classList.toggle("active", i === index);
        });
        setDotsCount(key.strokes);
        setProgress(0, key.strokes);
        success.hidden = true;
        createWriter();
        createFormWriter();
        renderFacts();
        refreshProgress();
      };

      KEYS.forEach(function (key, i) {
        var tile = el("button", "sel-tile");
        tile.type = "button";
        tile.setAttribute("role", "listitem");
        tile.setAttribute("aria-label", "Выбрать ключ " + key.ch + " " + key.py);
        tile.classList.add("theme-" + key.art);
        tile.appendChild(renderArt(key.art));
        var hanzi = el("span", "s-hanzi", key.ch);
        hanzi.setAttribute("lang", "zh-CN");
        tile.appendChild(hanzi);
        tile.appendChild(el("span", "s-py tone-text " + toneClass(key.t), key.py));
        tile.addEventListener("click", function () {
          selectPracticeKey(i);
          play(tile, key.audio, key.ch);
        });
        select.appendChild(tile);
      });

      document.getElementById("w-retry").addEventListener("click", function () { startQuiz(); startFormQuiz(); });
      document.getElementById("w-animate").addEventListener("click", function () {
        if (!writer || loadFailed) { createWriter(); return; }
        var version = ++quizVersion;
        clearTimeout(completeTimer);
        writer.cancelQuiz();
        writer.resumeAnimation();
        success.hidden = true;
        setProgress(0, KEYS[currentKey].strokes);
        status.textContent = "Смотри порядок черт";
        writer.animateCharacter({
          onComplete: function () {
            if (version !== quizVersion) return;
            status.textContent = "Теперь твоя очередь — нажми «Попробовать заново»";
          }
        });
        if (formWriter && !formCell.hidden && !formLoadFailed) {
          formVersion++;
          formWriter.cancelQuiz();
          formWriter.resumeAnimation();
          formStatus.textContent = "Смотри порядок черт формы";
          formWriter.animateCharacter();
        }
      });

      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (writer && target.clientWidth > 0 && Math.abs(target.clientWidth - writerSize) > 1) createWriter();
          if (formWriter && !formCell.hidden && formTarget.clientWidth > 0 && Math.abs(formTarget.clientWidth - formSize) > 1) createFormWriter();
        }, 150);
      });
      checkWriterSize = function () {
        if (writer && target.clientWidth > 0 && Math.abs(target.clientWidth - writerSize) > 1) createWriter();
        if (formWriter && !formCell.hidden && formTarget.clientWidth > 0 && Math.abs(formTarget.clientWidth - formSize) > 1) createFormWriter();
      };
      document.addEventListener("visibilitychange", function () {
        if (!writer) return;
        if (document.hidden) writer.pauseAnimation();
        else writer.resumeAnimation();
        if (formWriter) {
          if (document.hidden) formWriter.pauseAnimation();
          else formWriter.resumeAnimation();
        }
      });

      selectPracticeKey(0);
    }

    var salutedFinal = false;

    function initTower() {
      var shelf = document.getElementById("tower-runes");
      var line = document.getElementById("tower-line");
      var gate = document.getElementById("tower-gate");
      var sGlyph = document.getElementById("s-glyph");
      var sPy = document.getElementById("s-py");
      var sCap = document.getElementById("s-tone-cap");
      var playBtn = document.getElementById("s-play");
      var slowBtn = document.getElementById("s-slow");
      var plotCap = document.getElementById("tone-plot-cap");
      var path = document.getElementById("tone-path");
      var dot = document.getElementById("tone-dot");
      var svgEl = document.getElementById("tone-svg");
      var userPath = document.getElementById("user-path");
      if (!shelf || !sGlyph || !path || !svgEl || !userPath) return;
      var plotBox = svgEl.parentNode;
      var placed = lessonProgress.tower;
      var towerDone = false;
      var current = null;
      var tiles = {};
      var slots = {};
      for (var t = 1; t <= 4; t++) slots[t] = document.getElementById("tone-slots-" + t);
      var drawing = false;
      var drawnPts = [];
      var guideCtx = null;
      var guideOsc = null;
      var guideGain = null;
      var START_LINE = "Выбери руну и послушай её мелодию — потом ровно по пунктирной кривой проведи пальцем по резонатору. Верный росчерк отправит руну на доску своего тона!";
      var INVITE_LINE = "Слушай мелодию — и повтори её точным росчерком на резонаторе!";
      var TONE_PATHS = {
        1: "M14 18 C 70 16, 150 18, 204 20",
        2: "M14 58 C 60 46, 120 26, 204 12",
        3: "M14 18 C 46 16, 76 50, 116 46 C 156 42, 176 14, 204 10",
        4: "M14 12 C 60 26, 120 46, 204 58",
        0: "M56 44 C 90 43, 130 44, 164 44"
      };
      var TONE_MELODY = {
        1: "Мелодия 1-го тона: голос держится высоко и ровно, как гудок.",
        2: "Мелодия 2-го тона: голос поднимается снизу вверх — как вопрос с удивлением.",
        3: "Мелодия 3-го тона: голос ныряет вниз и снова взлетает — птица над водой.",
        4: "Мелодия 4-го тона: голос падает сверху вниз — решительное «да!».",
        0: "Нейтральный тон: коротко и тихо, без своей мелодии."
      };
      var rafId = null;
      var hideTimer = null;
      var animVersion = 0;

      function say(text) { if (line) line.textContent = text; }

      function masteredCount() {
        return KEYS.filter(function (k) { return placed[k.art]; }).length;
      }

      function updateTowerProgress(restore) {
        var mastered = masteredCount();
        if (mastered === KEYS.length && !towerDone) {
          towerDone = true;
          if (!restore) {
            [0, 380, 760].forEach(function (delay) {
              setTimeout(function () { sparkle(plotBox, 50); }, delay);
            });
          }
          say("Хе-хе-хе! Все десять рун освоены! В грамоте проверь остальные испытания: код откроется за все четыре этажа.");
          if (gate) gate.classList.add("pulse");
        }
        refreshProgress();
      }

      function renderPlaced(key) {
        var tile = tiles[key.ch];
        if (tile) {
          tile.classList.add("placed", toneClass(key.t));
          tile.setAttribute("aria-label", "Мелодия ключа " + key.ch + " " + key.py + " — освоена");
        }
        var slot = slots[key.t];
        if (!slot || slot.querySelector('[data-art="' + key.art + '"]')) return;
        var copy = el("div", "tone-key " + toneClass(key.t));
        copy.dataset.art = key.art;
        copy.setAttribute("aria-hidden", "true");
        var hanziCopy = el("span", "tk-hanzi", key.ch);
        hanziCopy.setAttribute("lang", "zh-CN");
        copy.appendChild(hanziCopy);
        copy.appendChild(el("span", "tk-py", key.py));
        slot.appendChild(copy);
      }

      function stopTone() {
        animVersion++;
        if (rafId !== null) cancelAnimationFrame(rafId);
        clearTimeout(hideTimer);
        rafId = null;
        hideTimer = null;
        dot.setAttribute("opacity", "0");
        path.setAttribute("stroke", "#c9b4f2");
      }

      function animateTone(rate) {
        stopTone();
        var version = animVersion;
        var len = path.getTotalLength();
        var dur = 900 / (rate || 1);
        var t0 = null;
        if (reducedMotion) {
          path.setAttribute("stroke", "#fb8c00");
          hideTimer = setTimeout(stopTone, dur + 350);
          return;
        }
        var first = path.getPointAtLength(0);
        dot.setAttribute("cx", first.x);
        dot.setAttribute("cy", first.y);
        dot.setAttribute("opacity", "1");
        function frame(ts) {
          if (version !== animVersion) return;
          if (t0 === null) t0 = ts;
          var t = Math.min((ts - t0) / dur, 1);
          var ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          var point = path.getPointAtLength(ease * len);
          dot.setAttribute("cx", point.x);
          dot.setAttribute("cy", point.y);
          if (t < 1) rafId = requestAnimationFrame(frame);
          else {
            rafId = null;
            hideTimer = setTimeout(function () { if (version === animVersion) stopTone(); }, 350);
          }
        }
        rafId = requestAnimationFrame(frame);
      }

      function guideFreq(y) {
        var cy = Math.max(4, Math.min(66, y));
        return 180 + (66 - cy) / 62 * 240;
      }
      function startGuide(y) {
        stopGuide();
        try {
          var Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return;
          guideCtx = new Ctx();
          guideOsc = guideCtx.createOscillator();
          guideGain = guideCtx.createGain();
          guideOsc.type = "sine";
          guideOsc.frequency.value = guideFreq(y);
          guideGain.gain.value = 0.0001;
          guideOsc.connect(guideGain);
          guideGain.connect(guideCtx.destination);
          guideOsc.start();
          guideGain.gain.setTargetAtTime(0.045, guideCtx.currentTime, 0.02);
        } catch (error) {
          guideCtx = null; guideOsc = null; guideGain = null;
        }
      }
      function moveGuide(y) {
        if (!guideOsc || !guideCtx) return;
        try { guideOsc.frequency.setTargetAtTime(guideFreq(y), guideCtx.currentTime, 0.02); } catch (error) {}
      }
      function stopGuide() {
        if (!guideCtx) return;
        var ctx = guideCtx, osc = guideOsc, gain = guideGain;
        guideCtx = null; guideOsc = null; guideGain = null;
        try {
          gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
          setTimeout(function () {
            try { osc.stop(); ctx.close().catch(function () {}); } catch (error) {}
          }, 180);
        } catch (error) {
          try { ctx.close(); } catch (e2) {}
        }
      }

      function svgPoint(event) {
        var rect = svgEl.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) / rect.width * 220,
          y: (event.clientY - rect.top) / rect.height * 70
        };
      }
      function clearUserPath() {
        drawnPts = [];
        userPath.setAttribute("d", "");
        userPath.setAttribute("opacity", "0");
      }
      function softStopDraw() {
        if (drawing) drawing = false;
        stopGuide();
      }

      function pathLengthOf(pts) {
        var len = 0;
        for (var i = 1; i < pts.length; i++) {
          len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        }
        return len;
      }
      function refSamples() {
        var total = path.getTotalLength();
        var pts = [];
        for (var i = 0; i <= 60; i++) pts.push(path.getPointAtLength(total * i / 60));
        return pts;
      }
      function seriesY(pts, n) {
        var minX = Infinity, maxX = -Infinity;
        pts.forEach(function (pt) {
          if (pt.x < minX) minX = pt.x;
          if (pt.x > maxX) maxX = pt.x;
        });
        var span = maxX - minX;
        if (span < 1) {
          var mid = pts[Math.floor(pts.length / 2)].y;
          var flat = [];
          for (var k = 0; k < n; k++) flat.push(mid);
          return flat;
        }
        var out = [];
        for (var s = 0; s < n; s++) {
          var xt = minX + span * s / (n - 1);
          var y = null;
          for (var i = 0; i < pts.length - 1; i++) {
            var a = pts[i], b = pts[i + 1];
            var lo = Math.min(a.x, b.x), hi = Math.max(a.x, b.x);
            if (xt >= lo && xt <= hi && hi - lo > 0.0001) {
              y = a.y + (b.y - a.y) * ((xt - a.x) / (b.x - a.x));
              break;
            }
          }
          if (y === null) y = pts[Math.floor(pts.length / 2)].y;
          out.push(y);
        }
        return out;
      }
      function znorm(v) {
        var mean = v.reduce(function (s, x) { return s + x; }, 0) / v.length;
        var std = Math.sqrt(v.reduce(function (s, x) { return s + (x - mean) * (x - mean); }, 0) / v.length);
        if (std < 1.5) return null;
        return v.map(function (x) { return (x - mean) / std; });
      }
      function pearson(a, b) {
        var n = a.length, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
        for (var i = 0; i < n; i++) {
          sa += a[i]; sb += b[i]; saa += a[i] * a[i]; sbb += b[i] * b[i]; sab += a[i] * b[i];
        }
        var ma = sa / n, mb = sb / n;
        var cov = sab / n - ma * mb;
        var va = saa / n - ma * ma;
        var vb = sbb / n - mb * mb;
        if (va <= 0 || vb <= 0) return 0;
        return cov / Math.sqrt(va * vb);
      }
      function evaluateDraw() {
        if (drawnPts.length < 3 || pathLengthOf(drawnPts) < 24) {
          say("Совсем коротенько! Проведи линию через весь резонатор.");
          return;
        }
        var ref = seriesY(refSamples(), 8);
        var usr = seriesY(drawnPts, 8);
        var refZ = znorm(ref), usrZ = znorm(usr);
        var corr;
        if (!refZ || !usrZ) {
          var refD = Math.abs(ref[ref.length - 1] - ref[0]);
          var usrD = Math.abs(usr[usr.length - 1] - usr[0]);
          if (refD < 4) corr = usrD < 8 ? 0.85 : (usrD < 20 ? 0.55 : 0.2);
          else corr = usrD < 10 ? 0.2 : (usrD >= refD * 0.5 ? 0.7 : 0.5);
        } else {
          corr = pearson(refZ, usrZ);
        }
        var bucket;
        if (corr >= 0.72) { bucket = "good"; sparkle(plotBox, 30); }
        else if (corr >= 0.45) { bucket = "mid"; sparkle(plotBox, 14); }
        else bucket = "off";
        if (bucket === "good" && current && !placed[current.art]) {
          placed[current.art] = true;
          renderPlaced(current);
          if (slots[current.t]) sparkle(slots[current.t], 16);
          saveProgress();
          say(KOCO_TONE[current.t] || KOCO_DRAW.good[0]);
          updateTowerProgress(false);
          return;
        }
        var bucketLines = KOCO_DRAW[bucket];
        say(bucketLines[Math.floor(Math.random() * bucketLines.length)]);
      }

      svgEl.addEventListener("pointerdown", function (event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        stopTone();
        drawing = true;
        var p = svgPoint(event);
        drawnPts = [p];
        userPath.setAttribute("d", "M" + p.x.toFixed(1) + " " + p.y.toFixed(1));
        userPath.setAttribute("opacity", "1");
        startGuide(p.y);
        try { svgEl.setPointerCapture(event.pointerId); } catch (error) {}
      });
      svgEl.addEventListener("pointermove", function (event) {
        if (!drawing) return;
        var p = svgPoint(event);
        var last = drawnPts[drawnPts.length - 1];
        var dx = p.x - last.x, dy = p.y - last.y;
        if (dx * dx + dy * dy < 2.25) return;
        drawnPts.push(p);
        userPath.setAttribute("d", userPath.getAttribute("d") + " L" + p.x.toFixed(1) + " " + p.y.toFixed(1));
        moveGuide(p.y);
      });
      svgEl.addEventListener("pointerup", function () {
        if (!drawing) return;
        drawing = false;
        stopGuide();
        evaluateDraw();
      });
      svgEl.addEventListener("pointercancel", function () { softStopDraw(); });

      function renderAltar(key) {
        current = key;
        sGlyph.textContent = key.ch;
        sPy.textContent = key.py;
        sPy.className = "pinyin-hero tone-text " + toneClass(key.t);
        if (sCap) sCap.textContent = TONE_NAMES[key.t] + " · песня «" + key.mean + "»";
        path.setAttribute("d", TONE_PATHS[key.t] || TONE_PATHS[0]);
        if (plotCap) plotCap.textContent = TONE_MELODY[key.t] || TONE_MELODY[0];
        if (playBtn) playBtn.disabled = false;
        if (slowBtn) slowBtn.disabled = false;
      }

      function clearAltar() {
        current = null;
        sGlyph.textContent = "♪";
        sPy.textContent = "выбери руну";
        sPy.className = "pinyin-hero";
        if (sCap) sCap.textContent = "Кристалл ждёт свою руну…";
        path.setAttribute("d", TONE_PATHS[2]);
        if (plotCap) plotCap.textContent = "Выбери руну — резонатор нарисует её мелодию.";
        if (playBtn) playBtn.disabled = true;
        if (slowBtn) slowBtn.disabled = true;
        stopTone();
      }

      function pickRune(key, tile) {
        softStopDraw();
        clearUserPath();
        renderAltar(key);
        play(tile, key.audio, key.ch);
        animateTone(1);
        if (placed[key.art]) {
          sparkle(tile, 14);
          say(KOCO_LINES[Math.floor(Math.random() * KOCO_LINES.length)]);
        } else {
          say(INVITE_LINE);
        }
      }

      KEYS.forEach(function (key) {
        var tile = el("button", "tower-rune");
        tile.type = "button";
        tile.setAttribute("role", "listitem");
        tile.setAttribute("aria-label", "Мелодия ключа " + key.ch + " " + key.py + " («" + key.mean + "»)");
        var hanzi = el("span", "r-hanzi", key.ch);
        hanzi.setAttribute("lang", "zh-CN");
        tile.appendChild(hanzi);
        tile.appendChild(el("span", "r-py", key.py));
        tile.addEventListener("click", function () { pickRune(key, tile); });
        tiles[key.ch] = tile;
        shelf.appendChild(tile);
      });

      if (playBtn) playBtn.addEventListener("click", function () {
        if (!current) return;
        play(playBtn, current.audio, current.ch);
        animateTone(1);
      });
      if (slowBtn) slowBtn.addEventListener("click", function () {
        if (!current) return;
        play(slowBtn, current.audio, current.ch, 0.55);
        animateTone(0.55);
      });
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          stopTone();
          softStopDraw();
        }
      });

      say(START_LINE);

      clearAltar();
      KEYS.forEach(function (key) {
        if (placed[key.art]) renderPlaced(key);
      });
      updateTowerProgress(true);
    }

    function saluteFinal() {
      if (salutedFinal) return;
      salutedFinal = true;
      var box = document.getElementById("diploma");
      if (!box) return;
      [0, 380, 760].forEach(function (delay) {
        setTimeout(function () { sparkle(box, 50); }, delay);
      });
    }

    function refreshDiplomaStats() {
      var summary = progressSummary();
      var ready = summary.completed === 4;
      setText("dip-stat-floors", "Испытания " + summary.completed + "/4");
      setText("dip-stat-runes", "Рун освоено " + summary.counts[3] + " из " + summary.totals[3]);
      setText("dip-stat-facts", "Фактов открыто " + summary.counts[2] + " из " + summary.totals[2]);
      setText("dip-subtitle", ready ? "Мастерская ключей · Урок 1 завершён" : "Мастерская ключей · Заверши четыре испытания, чтобы получить код");
      Array.prototype.forEach.call(document.querySelectorAll(".dip-requirement"), function (row, i) {
        row.classList.toggle("requirement-done", summary.done[i]);
        var status = row.querySelector(".requirement-status");
        if (status) status.textContent = (summary.done[i] ? "✓ Готово · " : "Осталось пройти · ") + summary.counts[i] + "/" + summary.totals[i];
      });
      var codeBox = document.getElementById("diploma-code");
      if (codeBox) {
        var mode = ready ? "ready" : "locked";
        if (codeBox.dataset.mode !== mode) {
          codeBox.dataset.mode = mode;
          codeBox.classList.toggle("code-ready", ready);
          codeBox.replaceChildren();
          if (ready) {
            codeBox.appendChild(el("p", "code-label", "Код подмастерья"));
            var digits = el("div", "code-digits");
            digits.setAttribute("aria-label", "Код 4545");
            "4545".split("").forEach(function (digit) {
              var cell = el("span", "code-digit", digit);
              cell.setAttribute("aria-hidden", "true");
              digits.appendChild(cell);
            });
            codeBox.appendChild(digits);
            codeBox.appendChild(el("p", "code-message", "Все четыре испытания пройдены!"));
          } else {
            codeBox.appendChild(el("p", "code-label", "Код пока закрыт"));
            codeBox.appendChild(el("p", "code-message", "Заверши все четыре этажа — здесь появится четырёхзначный код."));
          }
        }
      }
      setText("dip-date", new Date().toLocaleDateString("ru-RU"));
    }

    var CERE_SPEECH = {
      "cere-zhabert": {
        name: "Жаберт · хранитель хижины",
        html: "Ква! Мы с мухой следили за тобой из хижины: ты нашёл ключи внутри настоящих слов — <span class=\"hanzi-inline\">氵</span> в <span class=\"hanzi-inline\">河</span> «река», <span class=\"hanzi-inline\">艹</span> в <span class=\"hanzi-inline\">花</span> «цветок». Теперь каждый незнакомый знак будет сам прыгать к тебе в ладонь, как муха в мой язык!"
      },
      "cere-koko": {
        name: "Магистр Коко · башня тонов",
        html: "Хе-хе! Песнь ключей звучала чисто — все четыре тона спеты без фальши. Продолжай распевать слоги, подмастерье: у кого слух на тон, у того и иероглифы открываются, как двери моей башни."
      },
      "cere-cinnabon": {
        name: "Синнабон · мастер-каллиграф",
        html: "Мяу! Десять из десяти ключей — в твоём кармане. Помни секрет мастерской: встретив незнакомый иероглиф, сначала ищи знакомый ключ — <span class=\"hanzi-inline\">水</span> подскажет воду, <span class=\"hanzi-inline\">讠</span> — разговор. Держи блюдце молока и свою грамоту!"
      },
      "cere-robo": {
        name: "РОБ-ОТ-3000 · лаборатория письма",
        html: "БИП-БУП! СКАНИРОВАНИЕ ЗАВЕРШЕНО: ЧЕРТЫ НАПИСАНЫ БЕЗУПРЕЧНО. ОШИБОК: 0. ЗАКЛЮЧЕНИЕ: ПОДМАСТЕРЬЕ ГОТОВ. ГРАМОТУ ВРУЧИТЬ!"
      }
    };

    function initFinal() {
      var box = document.getElementById("diploma");
      if (!box || box.childElementCount) return;
      var speech = document.getElementById("cere-speech");
      var countEl = document.getElementById("cere-count");
      var scene = document.querySelector(".cere-scene");
      var spoken = {};
      var spokenCount = 0;
      var TOTAL = Object.keys(CERE_SPEECH).length;

      if (countEl) countEl.textContent = "Речей заслушано 0 из " + TOTAL;

      Object.keys(CERE_SPEECH).forEach(function (id) {
        var btn = document.getElementById(id);
        if (!btn || !speech) return;
        btn.addEventListener("click", function () {
          var item = CERE_SPEECH[id];
          speech.innerHTML = "";
          speech.appendChild(el("span", "cere-speaker", item.name));
          var text = el("p", "cere-text");
          text.innerHTML = item.html;
          speech.appendChild(text);
          if (spoken[id]) return;
          spoken[id] = true;
          spokenCount++;
          if (btn.parentNode) btn.parentNode.classList.add("spoken");
          if (countEl) countEl.textContent = "Речей заслушано " + spokenCount + " из " + TOTAL;
          if (spokenCount === TOTAL) {
            if (scene) scene.classList.add("all-spoken");
            saluteFinal();
          }
        });
      });

      box.appendChild(el("h3", "dip-title", "Грамота подмастерья"));
      var subtitle = el("p", "dip-sub");
      subtitle.id = "dip-subtitle";
      box.appendChild(subtitle);

      var stats = el("div", "dip-stats");
      var statFloors = el("span", "dip-stat");
      statFloors.id = "dip-stat-floors";
      stats.appendChild(statFloors);
      var statRunes = el("span", "dip-stat");
      statRunes.id = "dip-stat-runes";
      stats.appendChild(statRunes);
      var statFacts = el("span", "dip-stat");
      statFacts.id = "dip-stat-facts";
      stats.appendChild(statFacts);
      box.appendChild(stats);

      var requirements = el("div", "dip-requirements");
      requirements.setAttribute("aria-label", "Условия получения кода");
      ["Нажми все 10 ключей", "Собери все 30 слов", "Открой все 30 фактов", "Освой все 10 рун резонатором"].forEach(function (label, i) {
        var row = el("div", "dip-requirement");
        var text = el("div", "requirement-text");
        text.appendChild(el("span", "requirement-label", "Этаж " + (i + 1) + " · " + label));
        text.appendChild(el("span", "requirement-status"));
        row.appendChild(text);
        var go = el("button", "action-button", "На этаж " + (i + 1));
        go.type = "button";
        go.addEventListener("click", function () { showFloor(FLOORS[i]); });
        row.appendChild(go);
        requirements.appendChild(row);
      });
      box.appendChild(requirements);
      var code = el("div", "diploma-code");
      code.id = "diploma-code";
      code.setAttribute("role", "status");
      code.setAttribute("aria-live", "polite");
      box.appendChild(code);

      var grid = el("div", "dip-grid");
      KEYS.forEach(function (key) {
        var tile = el("button", "dip-key theme-" + key.art);
        tile.type = "button";
        tile.setAttribute("aria-label", "Ключ " + key.ch + " " + key.py + " («" + key.mean + "»). Послушать и показать анимацию");
        tile.appendChild(renderArt(key.art));
        var h = el("span", "d-hanzi", key.ch);
        h.setAttribute("lang", "zh-CN");
        tile.appendChild(h);
        tile.appendChild(el("span", "d-py tone-text " + toneClass(key.t), key.py));
        tile.appendChild(el("span", "d-mean", key.mean));
        tile.addEventListener("click", function () {
          play(tile, key.audio, key.ch);
          if (reducedMotion) return;
          tile.classList.remove("animating");
          void tile.offsetWidth;
          tile.classList.add("animating");
        });
        tile.addEventListener("animationend", function () { tile.classList.remove("animating"); });
        grid.appendChild(tile);
      });
      box.appendChild(grid);

      var foot = el("div", "dip-foot");
      var date = el("span", "dip-date", new Date().toLocaleDateString("ru-RU"));
      date.id = "dip-date";
      foot.appendChild(date);
      var seal = el("span", "dip-seal");
      var sealImg = document.createElement("img");
      sealImg.src = "assets/cinnabon.svg";
      sealImg.alt = "Печать мастера Синнабона";
      seal.appendChild(sealImg);
      foot.appendChild(seal);
      foot.appendChild(el("span", "dip-sign", "猫 мяу"));
      box.appendChild(foot);

      var restart = document.getElementById("restart-btn");
      if (restart) restart.addEventListener("click", function () {
        if (!window.confirm("Пройти урок заново? Прогресс всех четырёх этажей, собранные слова, открытые факты и код грамоты будут сброшены.")) return;
        var error = document.getElementById("restart-error");
        if (error) error.hidden = true;
        try {
          localStorage.removeItem(PROGRESS_STORE);
          localStorage.removeItem(FACTS_STORE);
          if (localStorage.getItem(PROGRESS_STORE) !== null || localStorage.getItem(FACTS_STORE) !== null) throw new Error("Progress reset failed");
        } catch (err) {
          if (error) {
            error.textContent = "Не удалось полностью сбросить сохранённый прогресс. Разреши доступ к хранилищу браузера и попробуй ещё раз.";
            error.hidden = false;
          }
          return;
        }
        restart.disabled = true;
        window.location.reload();
      });

      refreshDiplomaStats();
    }

    showFloor("hall", true);
  });
})();
