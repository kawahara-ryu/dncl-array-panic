// ============================================
// 問題データ
// ============================================

const questionData = {
  easy: [
    {
      id: "e1",
      type: "choice",
      title: "初級1：箱を開ける添字の魔法",
      code: [
        "Data = [10, 20, 30, 40]",
        "表示する( Data[2] )"
      ],
      visualData: [10, 20, 30, 40],
      catMsg: "『Data[2]』と指定されたニャ。どの箱の数字が表示されるかニャ？",
      choices: ["10", "20", "30", "40"],
      correct: "30",
      explanation: "配列の添字（インデックス）は「0」から始まるニャ！だからData[2]は左から3番目の「30」になるニャ！",
      traceSteps: [
        { line: 0, vars: { Data: "[10,20,30,40]" }, action: "配列Dataを準備したニャ！", activeIdx: -1 },
        { line: 1, vars: { Data: "[10,20,30,40]" }, action: "Data[2]（3番目の要素）を表示するニャ！", activeIdx: 2 }
      ]
    },
    {
      id: "e2",
      type: "dragdrop",
      title: "初級2：3の倍数だけカウント",
      code: [
        "count = 0",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  もし __DROPA__ == 0 ならば:",
        "    count = count + 1"
      ],
      visualData: [5, 9, 12, 14],
      catMsg: "3の倍数の箱がいくつあるか数えたいニャ。3で割った余りが0になるか調べるニャ！",
      dragItems: ["Data[i] % 3", "Data[i] / 3", "Data[3] % i", "Data[i] + 3"],
      correct: { DROPA: "Data[i] % 3" },
      explanation: "「3の倍数」かどうか調べるには、3で割った余りが0になるか（Data[i] % 3 == 0）を判定するニャ！",
      traceSteps: [
        { line: 0, vars: { count: 0 }, action: "countを0に初期化したニャ", activeIdx: -1 },
        { line: 1, vars: { count: 0, i: 0 }, action: "最初の箱(5)を調べるニャ", activeIdx: 0 },
        { line: 2, vars: { count: 0, i: 0 }, action: "5 % 3 は 2 だから違うニャ", activeIdx: 0 },
        { line: 1, vars: { count: 0, i: 1 }, action: "次の箱(9)を調べるニャ", activeIdx: 1 },
        { line: 2, vars: { count: 0, i: 1 }, action: "9 % 3 は 0 だニャ！", activeIdx: 1 },
        { line: 3, vars: { count: 1, i: 1 }, action: "countを1増やしたニャ！", activeIdx: 1 }
      ]
    },
    {
      id: "e3",
      type: "choice",
      title: "初級3：配列の一括更新（消費税）",
      code: [
        "// すべての商品の値段を税込(1.1倍)にする",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  Data[i] = __?__"
      ],
      visualData: [100, 200, 300, 400],
      catMsg: "全部の箱の値段を1.1倍に書き換えるニャ！",
      choices: ["Data * 1.1", "Data[i] * 1.1", "i * 1.1", "Data[i] + 1.1"],
      correct: "Data[i] * 1.1",
      explanation: "今の箱の中身（Data[i]）に1.1を掛けて、元の箱（Data[i]）に上書きするニャ！",
      traceSteps: [
        { line: 1, vars: { i: 0 }, action: "最初の箱(100)からスタートニャ", activeIdx: 0 },
        { line: 2, vars: { i: 0 }, action: "100 * 1.1 = 110 に書き換えたニャ！", activeIdx: 0 }
      ]
    },
    {
      id: "e4",
      type: "dragdrop",
      title: "初級4：ちゅ〜るの合計を求める",
      code: [
        "goukei = 0",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  goukei = goukei + __DROPA__"
      ],
      visualData: [5, 10, 15, 20],
      catMsg: "全部の箱の合計を計算したいニャ！空欄には何が入るかニャ？",
      dragItems: ["Data", "Data[i]", "Data[0]", "i"],
      correct: { DROPA: "Data[i]" },
      explanation: "ループごとに箱の中身を取り出すには、ループカウンタ「i」を添字にして「Data[i]」と書くニャ！",
      traceSteps: [
        { line: 0, vars: { goukei: 0 }, action: "合計を入れる箱を0にしたニャ", activeIdx: -1 },
        { line: 1, vars: { goukei: 0, i: 0 }, action: "iが0からスタートするニャ", activeIdx: 0 },
        { line: 2, vars: { goukei: 5, i: 0 }, action: "goukei(0) + Data[0](5) = 5", activeIdx: 0 },
        { line: 1, vars: { goukei: 5, i: 1 }, action: "iが1になったニャ", activeIdx: 1 },
        { line: 2, vars: { goukei: 15, i: 1 }, action: "goukei(5) + Data[1](10) = 15", activeIdx: 1 }
      ]
    },
    {
      id: "e5",
      type: "choice",
      title: "初級5：平均値の計算",
      code: [
        "// goukeiにはすでに合計(50)が入っているとする",
        "average = __?__"
      ],
      visualData: [5, 10, 15, 20],
      catMsg: "合計から平均値を計算するニャ。箱の数は関数で取得できるニャ！",
      choices: ["goukei / 4", "goukei / 要素数(Data)", "goukei / Data[i]", "要素数(Data) / goukei"],
      correct: "goukei / 要素数(Data)",
      explanation: "「要素数()」関数を使うと配列の長さを取得できるニャ。合計 ÷ 個数 で平均が求まるニャ！",
      traceSteps: [
        { line: 1, vars: { average: 12.5 }, action: "50 / 4 = 12.5 を計算したニャ！", activeIdx: -1 }
      ]
    }
  ],

  normal: [
    {
      id: "n1",
      type: "choice",
      title: "中級1：一番軽い箱を探せ（最小値）",
      code: [
        "saitei = Data[0]",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  もし Data[i] __?__ saitei ならば:",
        "    saitei = Data[i]"
      ],
      visualData: [20, 40, 10, 30],
      catMsg: "最小値を探すプログラムだニャ！今の最小値(saitei)よりどうだったら更新するニャ？",
      choices: [">", "<", ">=", "=="],
      correct: "<",
      hint: "「今の箱(Data[i])」が「仮の最小値(saitei)」よりも『小さい』時に更新したいニャ！",
      explanation: "「今見ている箱(Data[i])」が「これまでの最小値(saitei)」よりも「小さい（<）」場合に更新するニャ！",
      traceSteps: [
        { line: 0, vars: { saitei: 20 }, action: "とりあえず一番左の箱(20)を仮の最小値とするニャ！", activeIdx: 0 },
        { line: 1, vars: { saitei: 20, i: 0 }, action: "i=0の箱からチェックするニャ", activeIdx: 0 },
        { line: 2, vars: { saitei: 20, i: 0 }, action: "20 < 20 は成り立たないニャ", activeIdx: 0 },
        { line: 1, vars: { saitei: 20, i: 1 }, action: "i=1の箱をチェックするニャ", activeIdx: 1 },
        { line: 2, vars: { saitei: 20, i: 1 }, action: "40 < 20 は成り立たないニャ", activeIdx: 1 },
        { line: 1, vars: { saitei: 20, i: 2 }, action: "i=2の箱をチェックするニャ", activeIdx: 2 },
        { line: 2, vars: { saitei: 20, i: 2 }, action: "10 < 20 は成り立つニャ！", activeIdx: 2 },
        { line: 3, vars: { saitei: 10, i: 2 }, action: "最小値を10に更新したニャ！", activeIdx: 2 }
      ]
    },
    {
      id: "n2",
      type: "dragdrop",
      title: "中級2：一番重い箱の「位置」を記憶",
      code: [
        "saikou_i = 0  // 最大値が入っている箱の添字",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  もし Data[i] > Data[saikou_i] ならば:",
        "    __DROPA__"
      ],
      visualData: [15, 40, 20, 10],
      catMsg: "今度は最大値の「場所（インデックス）」を記録したいニャ！どう更新する？",
      dragItems: ["saikou_i = i", "saikou_i = Data[i]", "Data[i] = saikou_i", "i = saikou_i"],
      correct: { DROPA: "saikou_i = i" },
      hint: "箱の中身(Data)ではなく、箱の番号(i)を記録したいニャ！",
      explanation: "最大値が入っていた「場所」は変数「i」に入っているニャ。だから saikou_i に i を代入するニャ！",
      traceSteps: [
        { line: 0, vars: { saikou_i: 0 }, action: "仮の最大値の位置を0にするニャ", activeIdx: 0 },
        { line: 1, vars: { saikou_i: 0, i: 1 }, action: "i=1の箱を比べるニャ", activeIdx: 1 },
        { line: 2, vars: { saikou_i: 0, i: 1 }, action: "Data[1](40) > Data[0](15) だニャ！", activeIdx: 1 },
        { line: 3, vars: { saikou_i: 1, i: 1 }, action: "一番大きい箱の位置を1に更新したニャ！", activeIdx: 1 }
      ]
    },
    {
      id: "n3",
      type: "choice",
      title: "中級3：箱の中身を入れ替える魔術",
      code: [
        "// Dataの0番目と1番目を交換する",
        "temp = Data[0]",
        "Data[0] = __?__",
        "Data[1] = temp"
      ],
      visualData: [99, 11, 22, 33],
      catMsg: "2つの箱の中身を入れ替えるお約束だニャ！空いたData[0]に入れるのは？",
      choices: ["Data[0]", "Data[1]", "temp", "Data"],
      correct: "Data[1]",
      explanation: "退避用の変数tempにData[0]を避難させたから、Data[0]にはData[1]を上書きして大丈夫ニャ！",
      traceSteps: [
        { line: 1, vars: { temp: 99 }, action: "tempに99を避難させたニャ", activeIdx: 0 },
        { line: 2, vars: { temp: 99 }, action: "Data[0]にData[1]の11を上書きしたニャ", activeIdx: 1 },
        { line: 3, vars: { temp: 99 }, action: "Data[1]に避難させていた99を入れたニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "n4",
      type: "dragdrop",
      title: "中級4：バブルソートの条件",
      code: [
        "// 昇順（小さい順）に並べ替える",
        "もし Data[i] __DROPA__ Data[i+1] ならば:",
        "  交換する(Data[i], Data[i+1])"
      ],
      visualData: [40, 10, 30, 20],
      catMsg: "隣り合う箱を比較するニャ。左が右よりどうだったら交換するニャ？昇順だニャ！",
      dragItems: [">", "<", "==", "!="],
      correct: { DROPA: ">" },
      hint: "「左が大きい」時に交換して右に追いやると、昇順（小さい順）になるニャ！",
      explanation: "「昇順（小さい順）」にするには、左の値が右の値より「大きい（>）」時に交換して右に追いやるニャ！",
      traceSteps: [
        { line: 1, vars: { i: 0 }, action: "Data[0]とData[1]を比べるニャ (40 > 10)", activeIdx: 0 },
        { line: 2, vars: { i: 0 }, action: "40 > 10なので交換するニャ！", activeIdx: 1 }
      ]
    }
  ],

  hard: [
    {
      id: "h1",
      type: "choice",
      title: "上級1：線形探索のフラグ",
      code: [
        "flag = 0",
        "iを0から3まで1ずつ増やしながら繰り返す:",
        "  もし Data[i] == target ならば:",
        "    __?__"
      ],
      visualData: [100, 200, 300, 400],
      catMsg: "目当ての荷物(target)が見つかったら、どう目印を残すニャ？",
      choices: ["flag = 1", "flag = 0", "target = 1", "Data[i] = 1"],
      correct: "flag = 1",
      hint: "見つかったときの「目印（フラグ）」を1にするのが定番ニャ！",
      explanation: "見つかったことを後で判定するために、フラグ変数を1にするのが定石ニャ！",
      traceSteps: [
        { line: 0, vars: { flag: 0 }, action: "フラグを0（未発見）にしておくニャ", activeIdx: -1 },
        { line: 1, vars: { flag: 0, i: 0 }, action: "i=0を探すニャ", activeIdx: 0 },
        { line: 2, vars: { flag: 0, i: 0 }, action: "違ったニャ", activeIdx: 0 },
        { line: 1, vars: { flag: 0, i: 1 }, action: "i=1を探すニャ", activeIdx: 1 },
        { line: 2, vars: { flag: 0, i: 1 }, action: "見つけたニャ！", activeIdx: 1 },
        { line: 3, vars: { flag: 1, i: 1 }, action: "フラグを1に立てたニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "h2",
      type: "dragdrop",
      title: "上級2：二分探索の真ん中狙い",
      code: [
        "// 探したい範囲の左端をlow, 右端をhighとする",
        "low = 0",
        "high = 要素数(Data) - 1",
        "middle = __DROPA__"
      ],
      visualData: [10, 20, 30, 40],
      catMsg: "ソート済みの箱から探す二分探索だニャ！真ん中（middle）はどうやって計算するニャ？",
      dragItems: ["(low + high) / 2", "low + high", "high - low", "(high - low) / 2"],
      correct: { DROPA: "(low + high) / 2" },
      hint: "左端(low)と右端(high)の「平均」を計算すると真ん中になるニャ！",
      explanation: "左端と右端を足して2で割る（平均をとる）ことで、真ん中のインデックスが求まるニャ！",
      traceSteps: [
        { line: 1, vars: { low: 0, high: 3 }, action: "lowとhighをセットしたニャ", activeIdx: -1 },
        { line: 3, vars: { low: 0, high: 3, middle: 1.5 }, action: "真ん中を求めたニャ（※実際は整数に切り捨てる）", activeIdx: -1 }
      ]
    },
    {
      id: "h3",
      type: "choice",
      title: "上級3：2次元配列の全合計",
      code: [
        "// 2行3列の棚にある荷物をすべて足す",
        "goukei = 0",
        "iを0から1まで1ずつ増やしながら繰り返す:",
        "  jを0から2まで1ずつ増やしながら繰り返す:",
        "    goukei = goukei + __?__"
      ],
      visualData: [10, 20, 30, 40, 50, 60],
      is2D: [2, 3],
      catMsg: "2重ループで棚の荷物を全部足すニャ！どうやってアクセスするニャ？",
      choices: ["Tana[i][j]", "Tana[j][i]", "Tana[i]", "Tana[j]"],
      correct: "Tana[i][j]",
      hint: "2次元配列は「配列名[行][列]」の順番で書くニャ！ループ変数と対応させるニャ。",
      explanation: "外側のループ変数 i が行、内側の j が列を表すから、Tana[i][j] で順番に全てアクセスできるニャ！",
      traceSteps: [
        { line: 2, vars: { i: 0, j: 0 }, action: "i=0, j=0 の棚を足すニャ", activeIdx: 0 },
        { line: 3, vars: { i: 0, j: 1 }, action: "i=0, j=1 の棚を足すニャ", activeIdx: 1 },
        { line: 3, vars: { i: 0, j: 2 }, action: "i=0, j=2 の棚を足すニャ", activeIdx: 2 },
        { line: 2, vars: { i: 1, j: 0 }, action: "i=1, j=0 の棚を足すニャ", activeIdx: 3 },
        { line: 3, vars: { i: 1, j: 1 }, action: "i=1, j=1 の棚を足すニャ", activeIdx: 4 },
        { line: 3, vars: { i: 1, j: 2 }, action: "i=1, j=2 の棚を足すニャ", activeIdx: 5 }
      ]
    },
    {
      id: "h4",
      type: "dragdrop",
      title: "上級4：配列の逆順アクセス",
      code: [
        "// 配列の後ろから順番に表示する",
        "iを __DROPA__ から 0 まで __DROPB__ 繰り返す:",
        "  表示する(Data[i])"
      ],
      visualData: [11, 22, 33, 44],
      catMsg: "後ろから調べるのもよくあるニャ。スタート地点と増減はどうなるニャ？（要素数は4）",
      dragItems: ["3", "4", "1ずつ増やしながら", "1ずつ減らしながら"],
      correct: { DROPA: "3", DROPB: "1ずつ減らしながら" },
      explanation: "要素数が4の場合、一番後ろの添字は「3」だニャ。そこから「1ずつ減らしながら」ループするニャ！",
      traceSteps: [
        { line: 1, vars: { i: 3 }, action: "一番後ろの箱(3)からスタートニャ", activeIdx: 3 },
        { line: 2, vars: { i: 3 }, action: "Data[3](44)を表示したニャ", activeIdx: 3 },
        { line: 1, vars: { i: 2 }, action: "1減らしてi=2になったニャ", activeIdx: 2 },
        { line: 2, vars: { i: 2 }, action: "Data[2](33)を表示したニャ", activeIdx: 2 }
      ]
    },
    {
      id: "h5",
      type: "dragdrop",
      title: "上級5：2次元配列の棚指定",
      code: [
        "// Tanaは縦横に箱が積まれた2次元配列",
        "// 上から2段目(行)、左から3番目(列)の箱を開ける",
        "x = Tana[__DROPA__][__DROPB__]"
      ],
      visualData: [11, 22, 33, 44, 55, 66, 77, 88, 99],
      is2D: [3, 3],
      catMsg: "2次元配列も「0スタート」だニャ。2段目、3番目はどう指定するニャ？",
      dragItems: ["0", "1", "2", "3"],
      correct: { DROPA: "1", DROPB: "2" },
      explanation: "2段目はインデックス「1」、3番目はインデックス「2」になるニャ！ズレに注意だニャ！",
      traceSteps: [
        { line: 1, vars: {}, action: "Tana[1][2]にアクセスするニャ！", activeIdx: 5 },
        { line: 2, vars: { x: "目的の荷物" }, action: "荷物を取り出したニャ！", activeIdx: 5 }
      ]
    }
  ],

  ex: [
    {
      id: "ex1",
      type: "dragdrop",
      title: "EX級1：バブルソート完全版",
      code: [
        "// 配列Dataを昇順（小さい順）に並べ替える",
        "iを 0 から (要素数(Data) - 2) まで 1ずつ増やしながら繰り返す:",
        "  jを (要素数(Data) - 1) から i+1 まで 1ずつ減らしながら繰り返す:",
        "    もし Data[j-1] > Data[j] ならば:",
        "      __DROPA__ = Data[j]",
        "      Data[j] = Data[j-1]",
        "      Data[j-1] = __DROPB__"
      ],
      visualData: [8, 5, 2, 9],
      catMsg: "ソートの完全版だニャ！交換処理（3行）の空欄を完成させるニャ！",
      dragItems: ["temp", "Data[j]", "Data[i]", "Data[j-1]"],
      correct: { DROPA: "temp", DROPB: "temp" },
      hint: "値を交換するときは、片方を一時変数（tempなど）に退避させるのがお約束ニャ！",
      explanation: "値を交換するときは、退避用の一時変数（tempなど）を使うのが定石だニャ！",
      traceSteps: [
        { line: 1, vars: { i: 0 }, action: "外側のループ（i=0）開始ニャ！", activeIdx: -1 },
        { line: 2, vars: { i: 0, j: 3 }, action: "内側のループ（一番右 j=3）から左に向かっていくニャ！", activeIdx: 3 },
        { line: 3, vars: { i: 0, j: 3 }, action: "Data[2](2) > Data[3](9) かな？ → 違うニャ！", activeIdx: 2 },
        { line: 2, vars: { i: 0, j: 2 }, action: "jが2になったニャ！", activeIdx: 2 },
        { line: 3, vars: { i: 0, j: 2 }, action: "Data[1](5) > Data[2](2) かな？ → その通りニャ！", activeIdx: 1 },
        { line: 4, vars: { i: 0, j: 2, temp: 2 }, action: "Data[2]の「2」をtempに避難させるニャ！", activeIdx: 2 },
        { line: 5, vars: { i: 0, j: 2, temp: 2 }, action: "Data[2]にData[1]の「5」を上書きするニャ！", activeIdx: 2 },
        { line: 6, vars: { i: 0, j: 2, temp: 2 }, action: "Data[1]に避難させておいた「2」を入れるニャ！(スワップ完了)", activeIdx: 1, swap: [1, 2] },
        { line: 2, vars: { i: 0, j: 1 }, action: "jが1になったニャ！", activeIdx: 1 },
        { line: 3, vars: { i: 0, j: 1 }, action: "Data[0](8) > Data[1](2) かな？ → その通りニャ！", activeIdx: 0 },
        { line: 4, vars: { i: 0, j: 1, temp: 2 }, action: "Data[1]の「2」をtempに避難させるニャ！", activeIdx: 1 },
        { line: 5, vars: { i: 0, j: 1, temp: 2 }, action: "Data[1]にData[0]の「8」を上書きするニャ！", activeIdx: 1 },
        { line: 6, vars: { i: 0, j: 1, temp: 2 }, action: "Data[0]に避難させておいた「2」を入れるニャ！", activeIdx: 0, swap: [0, 1] },
        { line: 1, vars: { i: 1 }, action: "i=0の周が終わり、一番左に最小値「2」が確定したニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "ex2",
      type: "dragdrop",
      title: "EX級2：二分探索完全版",
      code: [
        "// 昇順に並んだ配列から探す。見つかったらその添字を表示",
        "low = 0",
        "high = 要素数(Data) - 1",
        "while low <= high:",
        "  middle = (low + high) / 2",
        "  もし Data[middle] == target ならば:",
        "    表示する(middle)",
        "    __DROPA__  // ループを抜ける",
        "  もし Data[middle] < target ならば:",
        "    low = __DROPB__",
        "  そうでなければ:",
        "    high = middle - 1"
      ],
      visualData: [10, 20, 30, 40],
      catMsg: "二分探索だニャ！見つかった後の処理と、探す範囲を右半分に絞る処理を入れるニャ！",
      dragItems: ["break", "continue", "middle + 1", "middle - 1", "low + 1"],
      correct: { DROPA: "break", DROPB: "middle + 1" },
      explanation: "見つかったらbreakで終了！真ん中より大きければ、次は真ん中の右側（middle + 1）から探すニャ！",
      traceSteps: [
        { line: 1, vars: { low: 0 }, action: "探索範囲の左端を0にするニャ！", activeIdx: 0 },
        { line: 2, vars: { low: 0, high: 3 }, action: "探索範囲の右端を3にするニャ！", activeIdx: 3, range: [0, 3] },
        { line: 3, vars: { low: 0, high: 3 }, action: "low <= high なのでループに入るニャ！", activeIdx: -1 },
        { line: 4, vars: { low: 0, high: 3, middle: 1 }, action: "(0+3)/2=1.5 なので、切り捨てて真ん中は「1」ニャ！", activeIdx: 1 },
        { line: 5, vars: { low: 0, high: 3, middle: 1, target: 30 }, action: "Data[1]の「20」とターゲットの「30」は同じかな？ → 違うニャ！", activeIdx: 1 },
        { line: 8, vars: { low: 0, high: 3, middle: 1, target: 30 }, action: "Data[1]の「20」は「30」より小さいニャ！", activeIdx: 1 },
        { line: 9, vars: { low: 2, high: 3, middle: 1, target: 30 }, action: "探す範囲を右半分（2〜3）に絞るニャ！(low = 1 + 1)", activeIdx: -1, range: [2, 3] },
        { line: 3, vars: { low: 2, high: 3 }, action: "まだ low <= high だから探すニャ！", activeIdx: -1 },
        { line: 4, vars: { low: 2, high: 3, middle: 2 }, action: "(2+3)/2=2.5 なので、真ん中は「2」ニャ！", activeIdx: 2 },
        { line: 5, vars: { low: 2, high: 3, middle: 2, target: 30 }, action: "Data[2]の「30」とターゲットの「30」は同じかな？ → 一致したニャ！", activeIdx: 2 },
        { line: 6, vars: { low: 2, high: 3, middle: 2, target: 30 }, action: "見つかった場所「2」を表示するニャ！", activeIdx: -1 },
        { line: 7, vars: { low: 2, high: 3, middle: 2, target: 30 }, action: "無事にbreakで探索終了ニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "ex3",
      type: "dragdrop",
      title: "EX級3：複数配列の売上集計",
      code: [
        "// 3つの配列: Shohin(商品名), Price(単価), Kosu(売れた個数)",
        "total = 0",
        "iを 0 から (要素数(Shohin) - 1) まで 1ずつ増やしながら繰り返す:",
        "  uriage = __DROPA__ * __DROPB__",
        "  total = total + uriage",
        "表示する(total)"
      ],
      visualData: ["<div style='font-size:0.6rem;line-height:1.2;margin-top:-5px;'>🍎<br>100円<br>2個</div>", "<div style='font-size:0.6rem;line-height:1.2;margin-top:-5px;'>🍊<br>50円<br>5個</div>", "<div style='font-size:0.6rem;line-height:1.2;margin-top:-5px;'>🍌<br>80円<br>3個</div>"],
      catMsg: "単価配列(Price)と個数配列(Kosu)の同じ添字同士を掛けて、売上を出すニャ！",
      dragItems: ["Price[i]", "Kosu[i]", "Shohin[i]", "Price[0]"],
      correct: [
        { DROPA: "Price[i]", DROPB: "Kosu[i]" },
        { DROPA: "Kosu[i]", DROPB: "Price[i]" }
      ],
      hint: "単価(Price)と個数(Kosu)の「同じ添字(i)同士」を掛け合わせるニャ！",
      explanation: "複数の配列でも、インデックス(i)を揃えれば対応するデータを同時に取り出せるニャ！",
      traceSteps: [
        { line: 1, vars: { total: 0 }, action: "合計を0で初期化するニャ！", activeIdx: -1 },
        { line: 2, vars: { total: 0, i: 0 }, action: "最初のデータ（りんご）を処理するニャ！", activeIdx: 0 },
        { line: 3, vars: { total: 0, i: 0, uriage: 200 }, action: "100円 × 2個 = 200円 の売上だニャ！", activeIdx: 0 },
        { line: 4, vars: { total: 200, i: 0, uriage: 200 }, action: "合計に200円を足したニャ！", activeIdx: 0 },
        { line: 2, vars: { total: 200, i: 1 }, action: "次のデータ（みかん）を処理するニャ！", activeIdx: 1 },
        { line: 3, vars: { total: 200, i: 1, uriage: 250 }, action: "50円 × 5個 = 250円 の売上だニャ！", activeIdx: 1 },
        { line: 4, vars: { total: 450, i: 1, uriage: 250 }, action: "合計に250円を足して450円になったニャ！", activeIdx: 1 },
        { line: 2, vars: { total: 450, i: 2 }, action: "最後のデータ（バナナ）を処理するニャ！", activeIdx: 2 },
        { line: 3, vars: { total: 450, i: 2, uriage: 240 }, action: "80円 × 3個 = 240円 の売上だニャ！", activeIdx: 2 },
        { line: 4, vars: { total: 690, i: 2, uriage: 240 }, action: "合計に240円を足して690円になったニャ！", activeIdx: 2 },
        { line: 5, vars: { total: 690 }, action: "全商品の合計「690」を表示するニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "ex4",
      type: "dragdrop",
      title: "EX級4：配列の反転（リバース）",
      code: [
        "// 配列Dataの中身を左右反転（逆順）に並べ替える",
        "N = 要素数(Data)",
        "iを 0 から (N / 2 - 1) まで 1ずつ増やしながら繰り返す:",
        "  temp = __DROPA__",
        "  Data[i] = Data[N - 1 - i]",
        "  __DROPB__ = temp"
      ],
      visualData: [10, 20, 30, 40],
      catMsg: "配列を左右対称に入れ替えるニャ！対称となる右側の添字は「N - 1 - i」になるニャ！",
      dragItems: ["Data[i]", "Data[N - 1 - i]", "Data[N - i]", "Data[N / 2]"],
      correct: { DROPA: "Data[i]", DROPB: "Data[N - 1 - i]" },
      hint: "左側の Data[i] と交換する相手は、右側にある Data[N - 1 - i] だニャ！",
      explanation: "Data[i] と Data[N-1-i] を交換することで、配列全体が綺麗に反転するニャ！",
      traceSteps: [
        { line: 1, vars: { N: 4 }, action: "要素数は「4」だニャ！", activeIdx: -1 },
        { line: 2, vars: { N: 4, i: 0 }, action: "4/2-1=1 なので、iは0から1まで繰り返すニャ。半分まででOKニャ！", activeIdx: 0 },
        { line: 3, vars: { N: 4, i: 0, temp: 10 }, action: "一番左のData[0]の「10」をtempに退避するニャ！", activeIdx: 0 },
        { line: 4, vars: { N: 4, i: 0, temp: 10 }, action: "Data[0]に一番右のData[3]の「40」を入れるニャ！", activeIdx: 3 },
        { line: 5, vars: { N: 4, i: 0, temp: 10 }, action: "一番右のData[3]にtempの「10」を入れてスワップ完了ニャ！", activeIdx: 0, swap: [0, 3] },
        { line: 2, vars: { N: 4, i: 1 }, action: "次はi=1ニャ！内側のペアを交換するニャ！", activeIdx: 1 },
        { line: 3, vars: { N: 4, i: 1, temp: 20 }, action: "左から2番目のData[1]の「20」をtempに退避するニャ！", activeIdx: 1 },
        { line: 4, vars: { N: 4, i: 1, temp: 20 }, action: "Data[1]に右から2番目のData[2]の「30」を入れるニャ！", activeIdx: 2 },
        { line: 5, vars: { N: 4, i: 1, temp: 20 }, action: "Data[2]にtempの「20」を入れてスワップ完了ニャ！", activeIdx: 1, swap: [1, 2] },
        { line: 2, vars: { N: 4 }, action: "真ん中まで交換し終わったのでループを抜けるニャ。配列が反転したニャ！", activeIdx: -1 }
      ]
    },
    {
      id: "ex5",
      type: "dragdrop",
      title: "EX級5：最大値と最小値の同時探索",
      code: [
        "// 1回のループで一番重い箱と一番軽い箱を同時に探す",
        "max_val = Data[0]",
        "min_val = Data[0]",
        "iを 1 から (要素数(Data) - 1) まで 1ずつ増やしながら繰り返す:",
        "  もし Data[i] > max_val ならば:",
        "    __DROPA__",
        "  もし Data[i] < min_val ならば:",
        "    __DROPB__"
      ],
      visualData: [50, 10, 80, 20],
      catMsg: "同じループの中で、最大値と最小値をいっぺんに更新する効率的なプログラムだニャ！",
      dragItems: ["max_val = Data[i]", "min_val = Data[i]", "Data[i] = max_val", "Data[i] = min_val"],
      correct: { DROPA: "max_val = Data[i]", DROPB: "min_val = Data[i]" },
      hint: "最大値より大きければ max_val を更新、最小値より小さければ min_val を更新するニャ！",
      explanation: "それぞれ条件に当てはまったときに、最大値用変数・最小値用変数を更新するニャ！",
      traceSteps: [
        { line: 1, vars: { max_val: 50 }, action: "最初の箱「50」を仮の最大値とするニャ！", activeIdx: 0 },
        { line: 2, vars: { max_val: 50, min_val: 50 }, action: "同じく「50」を仮の最小値とするニャ！", activeIdx: 0 },
        { line: 3, vars: { max_val: 50, min_val: 50, i: 1 }, action: "2番目の箱(i=1)からチェックスタートニャ！", activeIdx: 1 },
        { line: 4, vars: { max_val: 50, min_val: 50, i: 1 }, action: "「10」は最大値「50」より大きいかな？ → 違うニャ", activeIdx: 1 },
        { line: 6, vars: { max_val: 50, min_val: 50, i: 1 }, action: "「10」は最小値「50」より小さいかな？ → 小さいニャ！", activeIdx: 1 },
        { line: 7, vars: { max_val: 50, min_val: 10, i: 1 }, action: "最小値を「10」に更新したニャ！", activeIdx: 1 },
        { line: 3, vars: { max_val: 50, min_val: 10, i: 2 }, action: "次の箱(i=2)をチェックするニャ！", activeIdx: 2 },
        { line: 4, vars: { max_val: 50, min_val: 10, i: 2 }, action: "「80」は最大値「50」より大きいかな？ → 大きいニャ！", activeIdx: 2 },
        { line: 5, vars: { max_val: 80, min_val: 10, i: 2 }, action: "最大値を「80」に更新したニャ！", activeIdx: 2 },
        { line: 6, vars: { max_val: 80, min_val: 10, i: 2 }, action: "「80」は最小値「10」より小さいかな？ → 違うニャ", activeIdx: 2 },
        { line: 3, vars: { max_val: 80, min_val: 10, i: 3 }, action: "最後の箱(i=3)をチェックするニャ！", activeIdx: 3 },
        { line: 4, vars: { max_val: 80, min_val: 10, i: 3 }, action: "「20」は最大値「80」より大きいかな？ → 違うニャ", activeIdx: 3 },
        { line: 6, vars: { max_val: 80, min_val: 10, i: 3 }, action: "「20」は最小値「10」より小さいかな？ → 違うニャ", activeIdx: 3 },
        { line: 3, vars: { max_val: 80, min_val: 10 }, action: "すべての箱をチェックし終わったニャ！", activeIdx: -1 }
      ]
    }
  ]
};
