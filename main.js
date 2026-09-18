// ============================================
// ねこ宅配・配列パニック - メインロジック
// ============================================

// === Audio System ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, dur, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  osc.start(); osc.stop(audioCtx.currentTime + dur);
}

function playCorrect() {
  playTone(523, 'sine', 0.15, 0.12);
  setTimeout(() => playTone(659, 'sine', 0.15, 0.12), 100);
  setTimeout(() => playTone(784, 'sine', 0.25, 0.12), 200);
}

function playWrong() {
  playTone(200, 'sawtooth', 0.3, 0.15);
  setTimeout(() => playTone(150, 'sawtooth', 0.4, 0.15), 150);
}

function playClick() { playTone(1200, 'sine', 0.08, 0.05); }
function playTick() { playTone(800, 'square', 0.03, 0.03); }

let isMuted = false;
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById('mute-btn').textContent = isMuted ? '🔇 音声OFF' : '🔊 音声ON';
  const bgm = document.getElementById('bgm');
  if (bgm) {
    if (isMuted) {
      bgm.pause();
    } else {
      const gameScreen = document.getElementById('screen-game');
      if (gameScreen && gameScreen.classList.contains('active')) {
        bgm.play().catch(e => {});
      }
    }
  }
  if (!isMuted && audioCtx.state === 'suspended') audioCtx.resume();
}

// Override playTone to respect isMuted
const originalPlayTone = playTone;
playTone = function(freq, type, dur, vol = 0.1) {
  if (isMuted) return;
  originalPlayTone(freq, type, dur, vol);
}

function playSwap() {
  playTone(900, 'sine', 0.08, 0.05);
  setTimeout(() => playTone(1200, 'sine', 0.08, 0.05), 80);
}

// === BGM System (魔王魂 8bit) ===
function startBGM() {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (!isMuted) {
    bgm.volume = 0.4;
    bgm.play().catch(e => {
      console.log('Audio autoplay prevented:', e);
    });
  }
}

function stopBGM() {
  const bgm = document.getElementById('bgm');
  if (bgm) {
    bgm.pause();
    bgm.currentTime = 0;
  }
}

// === Game State ===
let currentDifficulty = 'easy';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let hp = 3;
let maxHp = 3;
let wrongAnswers = [];
let dragAnswers = {}; // { DROPA: "value", DROPB: "value" }
let combo = 0;
let selectedDragItem = null;
let isVisualizerMode = false;
let visualizerTimer = null;

const DIFFICULTY_CONFIG = {
  easy: { hp: 3, label: '初級' },
  normal: { hp: 3, label: '中級' },
  hard: { hp: 3, label: '上級' },
  ex: { hp: 3, label: 'EX級' }
};

let timeElapsed = 0;
let gameTimer = null;

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

// === Screen Navigation ===
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-achievements') renderAchievements();
}

function goToTitle() {
  playClick();
  stopBGM();
  stopTimer();
  if (visualizerTimer) {
    clearInterval(visualizerTimer);
    visualizerTimer = null;
  }
  isVisualizerMode = false;
  const traceCol = document.getElementById('terminal-col-trace');
  if (traceCol) traceCol.style.display = 'none';
  const exitBtn = document.getElementById('exit-visualizer-btn');
  if (exitBtn) exitBtn.style.display = 'none';
  const overlay = document.getElementById('trace-overlay');
  if (overlay) overlay.classList.add('hidden');
  showScreen('screen-title');
}

function retryGame() {
  playClick();
  document.getElementById('gameover-overlay').classList.remove('visible');
  startGame(currentDifficulty);
}

function startGame(difficulty) {
  playClick();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isVisualizerMode = false;
  const traceCol = document.getElementById('terminal-col-trace');
  if (traceCol) traceCol.style.display = 'none';
  const exitBtn = document.getElementById('exit-visualizer-btn');
  if (exitBtn) exitBtn.style.display = 'none';
  const overlay = document.getElementById('trace-overlay');
  if (overlay) overlay.classList.add('hidden');
  currentDifficulty = difficulty;
  currentQuestions = JSON.parse(JSON.stringify(questionData[difficulty]));
  currentQuestionIndex = 0;
  score = 0;
  combo = 0;
  document.getElementById('combo-text').textContent = '';
  hp = DIFFICULTY_CONFIG[difficulty].hp;
  maxHp = hp;
  wrongAnswers = [];
  
  // Timer setup
  timeElapsed = 0;
  document.getElementById('time-text').textContent = '00:00';
  if (gameTimer) clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    timeElapsed++;
    const m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
    const s = String(timeElapsed % 60).padStart(2, '0');
    document.getElementById('time-text').textContent = `${m}:${s}`;
  }, 1000);

  startBGM();
  updateHUD();
  loadQuestion();
  showScreen('screen-game');
}

function updateHUD() {
  document.getElementById('score-text').textContent = score;
  const hpBar = document.getElementById('hp-bar');
  hpBar.style.width = (hp / maxHp * 100) + '%';
  if (hp === 1) hpBar.style.background = 'var(--danger)';
  else hpBar.style.background = 'var(--primary)';
  
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) {
    if (hp <= 1 || isVisualizerMode) {
      hintBtn.style.opacity = '0.5';
      hintBtn.style.pointerEvents = 'none';
    } else {
      hintBtn.style.opacity = '1';
      hintBtn.style.pointerEvents = 'auto';
    }
  }
}

// === Escape HTML ===
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, match => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[match];
  });
}

// === Question Loading ===
function loadQuestion() {
  if (currentQuestionIndex >= currentQuestions.length) {
    if (wrongAnswers.length === 0) unlockAchievement('clear_all');
    showResult();
    return;
  }
  
  const q = currentQuestions[currentQuestionIndex];
  document.getElementById('question-title').textContent = q.title;
  document.getElementById('cat-speech').textContent = q.catMsg;
  document.getElementById('trace-btn').style.display = 'none';
  dragAnswers = {};

  // Visual Arena
  const visualArena = document.getElementById('visual-arena');
  visualArena.innerHTML = '';
  
  if (q.is2D) {
    visualArena.style.display = 'grid';
    visualArena.style.gridTemplateColumns = `repeat(${q.is2D[1]}, auto)`;
    visualArena.style.gap = '15px';
    visualArena.style.justifyContent = 'center';
  } else {
    visualArena.style.display = 'flex';
    visualArena.style.flexWrap = 'wrap';
    visualArena.style.justifyContent = 'center';
    visualArena.style.gap = '15px';
    visualArena.style.gridTemplateColumns = '';
  }

  q.visualData.forEach((val, idx) => {
    const box = document.createElement('div');
    box.className = 'box-item';
    const displayIdx = q.is2D ? `[${Math.floor(idx / q.is2D[1])}][${idx % q.is2D[1]}]` : `[${idx}]`;
    box.innerHTML = `<span class="box-val">${val}</span><span class="box-index">${displayIdx}</span>`;
    box.id = `visual-box-${idx}`;
    visualArena.appendChild(box);
  });

  // Code Display
  const codeDisplay = document.getElementById('code-display');
  let codeHtml = '';
  q.code.forEach(line => {
    let htmlLine = escapeHtml(line);
    // Replace drop zones
    if (q.type === 'dragdrop') {
      htmlLine = htmlLine.replace(/__(DROP[A-Z])__/g, '<span class="drop-zone" id="zone-$1" ondragover="handleDragOver(event)" ondrop="handleDrop(event, \'$1\')" onclick="handleZoneClick(\'$1\')"></span>');
    }
    // Replace choice placeholders
    if (q.type === 'choice') {
      htmlLine = htmlLine.replace(/__\?__/g, '<span class="drop-zone" style="width:100px; border-bottom: 2px solid var(--secondary); color: var(--secondary);">?</span>');
    }
    codeHtml += `<span class="code-line">${htmlLine}</span>`;
  });
  codeDisplay.innerHTML = codeHtml;

  // Action Controls
  const choicesArea = document.getElementById('choices-area');
  choicesArea.innerHTML = '';
  
  if (q.type === 'choice') {
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.onclick = () => handleAnswer(choice === q.correct, choice, q);
      choicesArea.appendChild(btn);
    });
  } else if (q.type === 'dragdrop') {
    // Shuffle drag items
    selectedDragItem = null;
    const items = [...q.dragItems].sort(() => Math.random() - 0.5);
    items.forEach(item => {
      const dragEl = document.createElement('div');
      dragEl.className = 'drag-item';
      dragEl.textContent = item;
      dragEl.draggable = true;
      dragEl.ondragstart = (e) => handleDragStart(e, item);
      dragEl.onclick = (e) => handleDragClick(e, item);
      choicesArea.appendChild(dragEl);
    });
    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = '✔️ 決定';
    submitBtn.onclick = () => checkDragDrop(q);
    choicesArea.appendChild(submitBtn);
  }
}

// === Drag & Drop Logic ===
let draggedItemData = null;

function handleDragStart(e, itemText) {
  draggedItemData = itemText;
  e.target.classList.add('dragging');
  setTimeout(() => e.target.classList.remove('dragging'), 100);
}

function handleDragClick(e, itemText) {
  playClick();
  document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('selected-drag'));
  e.target.classList.add('selected-drag');
  selectedDragItem = itemText;
}

function handleZoneClick(zoneId) {
  if (selectedDragItem) {
    const zone = document.getElementById(`zone-${zoneId}`);
    zone.textContent = selectedDragItem;
    zone.classList.add('filled');
    dragAnswers[zoneId] = selectedDragItem;
    playClick();
    document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('selected-drag'));
    selectedDragItem = null;
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, zoneId) {
  e.preventDefault();
  if (draggedItemData) {
    const zone = document.getElementById(`zone-${zoneId}`);
    zone.textContent = draggedItemData;
    zone.classList.add('filled');
    dragAnswers[zoneId] = draggedItemData;
    playClick();
  }
}

function checkDragDrop(q) {
  let isCorrect = false;
  let reqLen = 0;
  if (Array.isArray(q.correct)) {
    isCorrect = q.correct.some(c => Object.keys(c).every(key => dragAnswers[key] === c[key]));
    reqLen = Object.keys(q.correct[0]).length;
  } else {
    isCorrect = Object.keys(q.correct).every(key => dragAnswers[key] === q.correct[key]);
    reqLen = Object.keys(q.correct).length;
  }
  // Also check if all required zones are filled
  const allFilled = reqLen === Object.keys(dragAnswers).length;
  if (!allFilled) return; // User hasn't finished dragging
  handleAnswer(isCorrect, JSON.stringify(dragAnswers), q);
}

// === Answer Handling ===
function flashScreen(type) {
  const flash = document.getElementById(type + '-flash');
  flash.classList.remove('hidden');
  flash.style.animation = 'none';
  void flash.offsetWidth;
  flash.style.animation = 'flash 0.3s forwards';
  setTimeout(() => flash.classList.add('hidden'), 300);
}

function handleAnswer(isCorrect, userAns, q) {
  if (isCorrect) {
    playCorrect();
    flashScreen('correct');
    combo++;
    score += 100 * combo;
    const comboText = document.getElementById('combo-text');
    if (combo > 1) {
      comboText.textContent = `🔥 ${combo} COMBO!`;
      comboText.style.transform = 'scale(1.5)';
      setTimeout(() => comboText.style.transform = 'scale(1)', 200);
    }
    updateHUD();
    document.getElementById('cat-speech').textContent = `✅ 正解ニャ！\n\n${q.explanation}`;
    document.getElementById('trace-btn').style.display = 'inline-block';
    
    // Change choices area to a Next button
    const choicesArea = document.getElementById('choices-area');
    choicesArea.innerHTML = `<button class="submit-btn" onclick="nextQuestion()">次へ進む ▶</button>`;
  } else {
    playWrong();
    flashScreen('damage');
    hp--;
    if (combo >= 2) {
      document.getElementById('combo-text').textContent = `${combo} COMBO!!`;
      if (combo >= 5) unlockAchievement('combo_5');
    }
    combo = 0;
    document.getElementById('combo-text').textContent = '';
    score = Math.max(0, score - 20);
    wrongAnswers.push({ question: q, userAnswer: userAns });
    updateHUD();
    if (hp <= 0) {
      setTimeout(showGameOver, 1000);
    }
    // Bug falling animation
    const bug = document.createElement('div');
    bug.className = 'bug-fall';
    document.body.appendChild(bug);
    setTimeout(() => bug.remove(), 1000);
  }
}

function nextQuestion() {
  playClick();
  currentQuestionIndex++;
  loadQuestion();
}

// === Trace Logic & Dynamic Generator ===
let currentTraceStep = 0;
let traceData = null;
let isTracePlaying = true;
let traceSpeedMultiplier = 1; // 1x, 2x, 3x
const TRACE_BASE_INTERVAL = 1400;

// Dynamic Bubble Sort Trace Generator
function generateBubbleSortTrace(inputData) {
  const data = [...inputData];
  const N = data.length;
  const steps = [];

  // Step 0: Initial state
  steps.push({
    line: 0,
    vars: { i: '-', j: '-', temp: '-' },
    action: `ダンボール箱が${N}個届いたニャ！バブルソートで小さい順（昇順）に並べ替えるニャ！`,
    activeIdx: -1,
    activeIndices: [],
    sortedIndices: []
  });

  // Bubble sort: outer loop i from 0 to N - 2
  for (let i = 0; i <= N - 2; i++) {
    const alreadySorted = Array.from({ length: i }, (_, k) => k);

    // Outer loop start
    steps.push({
      line: 1,
      vars: { i: i, j: '-', temp: '-' },
      action: `外側ループ（i=${i}）開始ニャ！左から${i + 1}番目の位置に入れる最小値を探しにいくニャ！`,
      activeIdx: i,
      activeIndices: [i],
      sortedIndices: [...alreadySorted]
    });

    // Inner loop j from N - 1 down to i + 1
    for (let j = N - 1; j >= i + 1; j--) {
      // Inner loop step
      steps.push({
        line: 2,
        vars: { i: i, j: j, temp: '-' },
        action: `内側ループ: j=${j}。右端側から左に向かって順番に比較していくニャ！`,
        activeIdx: j,
        activeIndices: [j - 1, j],
        sortedIndices: [...alreadySorted]
      });

      const valLeft = data[j - 1];
      const valRight = data[j];
      const needSwap = valLeft > valRight;

      // Comparison check step
      steps.push({
        line: 3,
        vars: { i: i, j: j, "Data[j-1]": valLeft, "Data[j]": valRight, temp: '-' },
        action: `Data[${j - 1}](${valLeft}) と Data[${j}](${valRight}) を比較中ニャ…`,
        activeIdx: j,
        activeIndices: [j - 1, j],
        sortedIndices: [...alreadySorted]
      });

      if (needSwap) {
        // Swap Substep 1: temp = Data[j]
        steps.push({
          line: 4,
          vars: { i: i, j: j, "Data[j-1]": valLeft, "Data[j]": valRight, temp: valRight },
          action: `Data[${j - 1}](${valLeft}) > Data[${j}](${valRight}) だから交換するニャ！まず右の「${valRight}」をtempに退避！`,
          activeIdx: j,
          activeIndices: [j],
          sortedIndices: [...alreadySorted]
        });

        // Swap Substep 2: Data[j] = Data[j-1]
        steps.push({
          line: 5,
          vars: { i: i, j: j, "Data[j-1]": valLeft, "Data[j]": valRight, temp: valRight },
          action: `空いたData[${j}]に、左隣のData[${j - 1}](${valLeft})をコピーするニャ！`,
          activeIdx: j,
          activeIndices: [j - 1, j],
          sortedIndices: [...alreadySorted]
        });

        // Swap Substep 3: Data[j-1] = temp
        data[j] = valLeft;
        data[j - 1] = valRight;

        steps.push({
          line: 6,
          vars: { i: i, j: j, "Data[j-1]": valRight, "Data[j]": valLeft, temp: valRight },
          action: `Data[${j - 1}]にtempの「${valRight}」を戻して交換（スワップ）完了ニャ！✨`,
          activeIdx: j - 1,
          activeIndices: [j - 1, j],
          swap: [j - 1, j],
          sortedIndices: [...alreadySorted]
        });
      } else {
        // No swap needed
        steps.push({
          line: 3,
          vars: { i: i, j: j, "Data[j-1]": valLeft, "Data[j]": valRight, temp: '-' },
          action: `Data[${j - 1}](${valLeft}) <= Data[${j}](${valRight}) なので順番通り！交換不要ニャ。`,
          activeIdx: j,
          activeIndices: [j - 1, j],
          sortedIndices: [...alreadySorted]
        });
      }
    }

    // Outer loop round completion: index i is now fixed
    const newlySorted = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      line: 1,
      vars: { i: i, j: '-', temp: '-' },
      action: `【確定】i=${i}の周が完了！左から${i + 1}番目に最小値「${data[i]}」が確定したニャ！🎉`,
      activeIdx: i,
      activeIndices: [i],
      sortedIndices: newlySorted
    });
  }

  // All completed
  steps.push({
    line: 0,
    vars: { i: '-', j: '-', temp: '-' },
    action: `すべてのダンボール箱が小さい順にキレイに整列したニャ！仕分け完了ニャ！📦🐱✨`,
    activeIdx: -1,
    activeIndices: [],
    sortedIndices: Array.from({ length: N }, (_, k) => k)
  });

  return steps;
}

function openTraceTable() {
  playClick();
  const q = currentQuestions[currentQuestionIndex];
  if (!q || !q.traceSteps) return;
  traceData = q;
  currentTraceStep = 0;
  
  const overlay = document.getElementById('trace-overlay');
  overlay.classList.remove('hidden');
  
  renderTraceTable();
}

function closeTraceTable() {
  playClick();
  if (isVisualizerMode) {
    if (visualizerTimer) {
      clearInterval(visualizerTimer);
      visualizerTimer = null;
    }
    isVisualizerMode = false;
    const traceCol = document.getElementById('terminal-col-trace');
    if (traceCol) traceCol.style.display = 'none';
    const exitBtn = document.getElementById('exit-visualizer-btn');
    if (exitBtn) exitBtn.style.display = 'none';
    const overlay = document.getElementById('trace-overlay');
    if (overlay) overlay.classList.add('hidden');
    goToTitle();
    return;
  }
  document.getElementById('trace-overlay').classList.add('hidden');
  document.querySelectorAll('.box-item').forEach(b => {
    b.classList.remove('active-target', 'dimmed', 'comparing', 'sorted-fixed');
  });
  document.querySelectorAll('.code-line').forEach(l => l.classList.remove('active-trace'));
  
  // Reset visual boxes to initial state
  if (traceData && traceData.visualData) {
    document.querySelectorAll('.box-item').forEach((b, i) => {
      const valSpan = b.querySelector('.box-val');
      if (valSpan) valSpan.innerHTML = traceData.visualData[i];
    });
  }
}

function renderTraceTable() {
  const table = document.getElementById('trace-table');
  const stepDisplay = document.getElementById('trace-step-display');
  const stepData = traceData.traceSteps[currentTraceStep];
  
  // Highlight code line
  document.querySelectorAll('.code-line').forEach((l, i) => {
    if (i === stepData.line) l.classList.add('active-trace');
    else l.classList.remove('active-trace');
  });

  // Calculate visual data state up to current step
  let currentBoxes = [...traceData.visualData];
  let currentRange = null;

  for (let i = 0; i <= currentTraceStep; i++) {
    const s = traceData.traceSteps[i];
    if (s.swap) {
      const temp = currentBoxes[s.swap[0]];
      currentBoxes[s.swap[0]] = currentBoxes[s.swap[1]];
      currentBoxes[s.swap[1]] = temp;
    }
    if (s.range) {
      currentRange = s.range;
    }
  }

  // Update visual boxes
  document.querySelectorAll('.box-item').forEach((b, i) => {
    const isComparing = stepData.activeIndices ? stepData.activeIndices.includes(i) : (i === stepData.activeIdx);
    const isSorted = stepData.sortedIndices && stepData.sortedIndices.includes(i);

    if (isComparing) b.classList.add('comparing');
    else b.classList.remove('comparing');

    if (isSorted) b.classList.add('sorted-fixed');
    else b.classList.remove('sorted-fixed');

    if (i === stepData.activeIdx) b.classList.add('active-target');
    else b.classList.remove('active-target');
    
    const valSpan = b.querySelector('.box-val');
    if (valSpan) valSpan.innerHTML = currentBoxes[i];
    
    if (currentRange) {
      if (i < currentRange[0] || i > currentRange[1]) {
        b.classList.add('dimmed');
      } else {
        b.classList.remove('dimmed');
      }
    } else {
      b.classList.remove('dimmed');
    }
  });

  // Cat Speech sync
  if (stepData.action) {
    document.getElementById('cat-speech').textContent = stepData.action;
  }

  if (stepData.swap && (!window._lastPlayedSwapStep || window._lastPlayedSwapStep !== currentTraceStep)) {
    playSwap();
    window._lastPlayedSwapStep = currentTraceStep;
  }

  // Collect and sort headers
  let varsUsed = new Set();
  traceData.traceSteps.forEach(s => Object.keys(s.vars).forEach(v => varsUsed.add(v)));
  const preferredOrder = ['i', 'j', 'Data[j-1]', 'Data[j]', 'temp', 'low', 'high', 'middle', 'target', 'total', 'uriage', 'count', 'max_val', 'min_val', 'N'];
  const varArray = Array.from(varsUsed).sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  let html = '<thead><tr><th>Step</th>';
  varArray.forEach(v => { html += `<th>${v}</th>`; });
  html += '<th>処理内容</th></tr></thead><tbody>';

  // Build rows up to current step
  for (let i = 0; i <= currentTraceStep; i++) {
    const s = traceData.traceSteps[i];
    const isActive = (i === currentTraceStep) ? 'class="active-row" id="active-trace-row"' : '';
    html += `<tr ${isActive}><td>${i + 1}</td>`;
    varArray.forEach(v => {
      html += `<td>${s.vars[v] !== undefined ? s.vars[v] : '-'}</td>`;
    });
    html += `<td style="text-align:left;">${s.action}</td></tr>`;
  }
  html += '</tbody>';
  
  table.innerHTML = html;
  const tableInline = document.getElementById('trace-table-inline');
  if (tableInline) tableInline.innerHTML = html;

  const stepText = `Step ${currentTraceStep + 1} / ${traceData.traceSteps.length}`;
  stepDisplay.textContent = stepText;
  const stepDisplayInline = document.getElementById('trace-step-display-inline');
  if (stepDisplayInline) stepDisplayInline.textContent = stepText;
  
  const prevBtn = document.getElementById('trace-prev-btn');
  const nextBtn = document.getElementById('trace-next-btn');
  const prevBtnInline = document.getElementById('trace-prev-btn-inline');
  const nextBtnInline = document.getElementById('trace-next-btn-inline');
  const isFirst = (currentTraceStep === 0);
  const isLast = (currentTraceStep === traceData.traceSteps.length - 1);

  if (prevBtn) prevBtn.disabled = isFirst;
  if (nextBtn) nextBtn.disabled = isLast;
  if (prevBtnInline) prevBtnInline.disabled = isFirst;
  if (nextBtnInline) nextBtnInline.disabled = isLast;

  // Auto scroll table to active row
  const activeRows = document.querySelectorAll('.active-row');
  activeRows.forEach(row => {
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}

// === Trace Controls (Playback & Stepping) ===
function updateTraceTimer() {
  if (visualizerTimer) {
    clearInterval(visualizerTimer);
    visualizerTimer = null;
  }
  if (isVisualizerMode && isTracePlaying) {
    const interval = Math.round(TRACE_BASE_INTERVAL / traceSpeedMultiplier);
    visualizerTimer = setInterval(() => {
      if (currentTraceStep < traceData.traceSteps.length - 1) {
        playTick();
        currentTraceStep++;
        renderTraceTable();
      } else {
        clearInterval(visualizerTimer);
        visualizerTimer = null;
        isTracePlaying = false;
        updatePlayButtonState();
        unlockAchievement('popcorn');
      }
    }, interval);
  }
}

function updatePlayButtonState() {
  const text = isTracePlaying ? '⏸ 一時停止' : '▶ 再生';
  const playBtn = document.getElementById('trace-play-btn');
  const playBtnInline = document.getElementById('trace-play-btn-inline');
  if (playBtn) playBtn.textContent = text;
  if (playBtnInline) playBtnInline.textContent = text;
}

function toggleTracePlay() {
  playClick();
  isTracePlaying = !isTracePlaying;
  updatePlayButtonState();
  if (isTracePlaying) {
    if (currentTraceStep >= traceData.traceSteps.length - 1) {
      currentTraceStep = 0;
      renderTraceTable();
    }
    updateTraceTimer();
  } else {
    if (visualizerTimer) {
      clearInterval(visualizerTimer);
      visualizerTimer = null;
    }
  }
}

function traceRestart() {
  playClick();
  currentTraceStep = 0;
  renderTraceTable();
  if (isVisualizerMode) {
    isTracePlaying = true;
    updatePlayButtonState();
    updateTraceTimer();
  }
}

function cycleTraceSpeed() {
  playClick();
  if (traceSpeedMultiplier === 1) traceSpeedMultiplier = 2;
  else if (traceSpeedMultiplier === 2) traceSpeedMultiplier = 3;
  else traceSpeedMultiplier = 1;
  
  const speedText = `⚡ ${traceSpeedMultiplier}x`;
  const speedBtn = document.getElementById('trace-speed-btn');
  const speedBtnInline = document.getElementById('trace-speed-btn-inline');
  if (speedBtn) speedBtn.textContent = speedText;
  if (speedBtnInline) speedBtnInline.textContent = speedText;
  if (isVisualizerMode && isTracePlaying) {
    updateTraceTimer();
  }
}

function tracePrev() {
  if (currentTraceStep > 0) {
    playTick();
    currentTraceStep--;
    renderTraceTable();
  }
}

function traceNext() {
  if (currentTraceStep < traceData.traceSteps.length - 1) {
    playTick();
    currentTraceStep++;
    renderTraceTable();
  }
}

// === Game Over ===
function showGameOver() {
  stopBGM();
  stopTimer();
  playWrong();
  const overlay = document.getElementById('gameover-overlay');
  overlay.classList.add('visible');
  const hints = [
    'ヒント：配列の添字（インデックス）は「0」から始まるニャ！',
    'ヒント：変数に入っている値を追いかける「トレース表」を意識するニャ！',
    'ヒント：最大値を求めるときは、仮の最大値と1個ずつ比べるニャ！',
    'ヒント：2次元配列の添字も「0」から始まることに注意ニャ！'
  ];
  document.getElementById('gameover-hint').textContent = hints[Math.floor(Math.random() * hints.length)];
}

// === Hint & Visualizer ===
function useHint() {
  if (hp <= 1 || isVisualizerMode) return;
  playClick();
  hp--;
  updateHUD();
  if (hp === 1) unlockAchievement('hint_lover');
  
  const q = currentQuestions[currentQuestionIndex];
  const hintText = q.hint || "もう一度、添字や条件をよく見直すニャ！";
  document.getElementById('cat-speech').textContent = `💡 ヒント：\n${hintText}`;
}

function startVisualizer() {
  playClick();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isVisualizerMode = true;
  currentDifficulty = 'ex';

  // Parse custom array input or use default
  let arr = [9, 3, 5, 2, 8];
  const customInput = document.getElementById('custom-array-input');
  if (customInput && customInput.value.trim() !== '') {
    const parsed = customInput.value
      .split(/[,、\s]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));
    if (parsed.length >= 2) {
      arr = parsed.slice(0, 10);
    } else if (parsed.length === 1) {
      arr = [parsed[0], 5, 2, 8];
    }
  }

  const bubbleQuestion = {
    id: "ex1_visualizer",
    title: "バブルソート完全版",
    code: [
      "// 配列Dataを昇順（小さい順）に並べ替える",
      "iを 0 から (要素数(Data) - 2) まで 1ずつ増やしながら繰り返す:",
      "  jを (要素数(Data) - 1) から i+1 まで 1ずつ減らしながら繰り返す:",
      "    もし Data[j-1] > Data[j] ならば:",
      "      temp = Data[j]",
      "      Data[j] = Data[j-1]",
      "      Data[j-1] = temp"
    ],
    visualData: [...arr],
    traceSteps: generateBubbleSortTrace(arr)
  };

  // Setup Visual State
  traceData = bubbleQuestion;
  currentTraceStep = 0;
  hp = 3; maxHp = 3; score = 0; combo = 0;
  document.getElementById('combo-text').textContent = '';
  document.getElementById('score-text').textContent = score;
  document.getElementById('hp-bar').style.width = '100%';
  document.getElementById('hp-bar').style.background = 'var(--primary)';
  
  // Setup Visual Arena
  const visualArena = document.getElementById('visual-arena');
  visualArena.innerHTML = '';
  visualArena.style.display = 'flex';
  visualArena.style.flexWrap = 'wrap';
  visualArena.style.justifyContent = 'center';
  visualArena.style.gap = '15px';
  visualArena.style.gridTemplateColumns = '';

  bubbleQuestion.visualData.forEach((val, idx) => {
    const box = document.createElement('div');
    box.className = 'box-item';
    box.innerHTML = `<span class="box-val">${val}</span><span class="box-index">[${idx}]</span>`;
    box.id = `visual-box-${idx}`;
    visualArena.appendChild(box);
  });

  // Setup Code Display
  const codeDisplay = document.getElementById('code-display');
  let codeHtml = '';
  bubbleQuestion.code.forEach(line => {
    codeHtml += `<span class="code-line">${escapeHtml(line)}</span>`;
  });
  codeDisplay.innerHTML = codeHtml;
  document.getElementById('choices-area').innerHTML = '';
  
  document.getElementById('question-title').textContent = "📺 自動仕分け工場: バブルソート";
  document.getElementById('hint-btn').style.opacity = '0.5';
  document.getElementById('hint-btn').style.pointerEvents = 'none';
  document.getElementById('trace-btn').style.display = 'none';
  
  // Start BGM
  startBGM();

  showScreen('screen-game');
  
  // Keep popup overlay hidden, and display inline side-by-side trace panel
  const overlay = document.getElementById('trace-overlay');
  if (overlay) overlay.classList.add('hidden');
  
  const traceCol = document.getElementById('terminal-col-trace');
  if (traceCol) traceCol.style.display = 'flex';
  
  const exitBtn = document.getElementById('exit-visualizer-btn');
  if (exitBtn) exitBtn.style.display = 'inline-block';
  
  // Set initial control states
  isTracePlaying = true;
  traceSpeedMultiplier = 1;
  const speedBtn = document.getElementById('trace-speed-btn');
  const speedBtnInline = document.getElementById('trace-speed-btn-inline');
  if (speedBtn) speedBtn.textContent = '⚡ 1x';
  if (speedBtnInline) speedBtnInline.textContent = '⚡ 1x';
  updatePlayButtonState();

  renderTraceTable();
  updateTraceTimer();
}

// === Result Screen ===
function showResult() {
  stopBGM();
  stopTimer();
  playCorrect(); // Victory sound
  const total = currentQuestions.length;
  const correctNum = total - wrongAnswers.length;
  const percentage = Math.round((correctNum / total) * 100);

  let rank = 'C';
  if (percentage === 100) rank = 'S';
  else if (percentage >= 80) rank = 'A';
  else if (percentage >= 60) rank = 'B';
  
  document.getElementById('rank-display').textContent = rank;
  
  const m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
  const s = String(timeElapsed % 60).padStart(2, '0');
  let statsHtml = `
    <div class="stat-box"><div class="stat-label">正解数</div><div class="stat-val">${correctNum}/${total}</div></div>
    <div class="stat-box"><div class="stat-label">スコア</div><div class="stat-val">${score}</div></div>
    <div class="stat-box" style="width:90%; margin-top:10px;"><div class="stat-label">クリアタイム</div><div class="stat-val">${m}:${s}</div></div>
  `;
  document.getElementById('result-stats').innerHTML = statsHtml;

  const pwSection = document.getElementById('password-section');
  if (hp > 0) {
    pwSection.style.display = 'block';
    let pw = '';
    if (currentDifficulty === 'easy') pw = 'Data[i]に「ちゅ〜る」を代入しては即座に自分で食べてしまう初級猫';
    else if (currentDifficulty === 'normal') pw = '線形探索で探すのが面倒になり、すべてのダンボールを物理破壊して回る中級猫';
    else if (currentDifficulty === 'hard') pw = 'Tana[2][3]に隠したおやつをTana[3][2]と間違えて探し続け、絶望に沈む上級猫';
    else if (currentDifficulty === 'ex') pw = '二分探索で探す範囲を半分に割り続けた結果、最終的に自分が素粒子サイズになったEX級猫';
    
    if (percentage === 100) pw += '【全箱開封済みパーフェクト！】';
    document.getElementById('password-text').textContent = pw;
  } else {
    pwSection.style.display = 'none';
  }

  const reviewSection = document.getElementById('review-section');
  if (wrongAnswers.length > 0) {
    reviewSection.style.display = 'block';
    let reviewHtml = '<div style="color:var(--danger); font-family:var(--font-cyber); margin-bottom:10px;">📝 間違えた問題の復習</div>';
    wrongAnswers.forEach(wa => {
      reviewHtml += `
        <div class="review-item">
          <div class="review-q">${escapeHtml(wa.question.title)}</div>
          <div class="review-a">💡 ${escapeHtml(wa.question.explanation)}</div>
        </div>
      `;
    });
    reviewSection.innerHTML = reviewHtml;
  } else {
    reviewSection.style.display = 'none';
  }

  showScreen('screen-result');
}

// === Copy Password ===
function copyPassword() {
  const pwText = document.getElementById('password-text').textContent;
  if (!pwText) return;
  navigator.clipboard.writeText(pwText).then(() => {
    const btn = document.getElementById('copy-pw-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ コピー完了！';
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  });
}

// === Achievements System ===
const ACHIEVEMENTS = [
  { id: 'clear_all', title: '配列マスター', desc: 'いずれかの難易度をノーミスで全問正解クリア' },
  { id: 'combo_5', title: 'コンボの鬼', desc: '5コンボ以上を達成する' },
  { id: 'popcorn', title: 'ポップコーン職人', desc: '自動仕分け工場を最後まで見る' },
  { id: 'hint_lover', title: 'ヒント依存症', desc: 'ヒントを使い切る' }
];

let unlockedAchievements = JSON.parse(localStorage.getItem('neko_achievements')) || [];

function unlockAchievement(id) {
  if (!unlockedAchievements.includes(id)) {
    unlockedAchievements.push(id);
    localStorage.setItem('neko_achievements', JSON.stringify(unlockedAchievements));
    
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: var(--bg-panel); border: 2px solid #ffd700; border-radius: 5px; padding: 10px 20px;
      color: #ffd700; font-family: var(--font-cyber); font-weight: bold; font-size: 0.9rem;
      box-shadow: 0 0 15px rgba(255,215,0,0.5); transform: translateX(100%); transition: transform 0.3s;
    `;
    toast.innerHTML = `🏆 実績解除：<br><span style="font-size:1.1rem; color:#fff;">${ach.title}</span>`;
    document.getElementById('toast-container').appendChild(toast);
    
    playTone(1500, 'sine', 0.1, 0.05);
    setTimeout(() => playTone(2000, 'sine', 0.2, 0.05), 100);
    
    setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 50);
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';
  ACHIEVEMENTS.forEach(ach => {
    const isUnlocked = unlockedAchievements.includes(ach.id);
    const div = document.createElement('div');
    div.style.cssText = `
      border: 1px solid ${isUnlocked ? '#ffd700' : '#333'};
      background: ${isUnlocked ? 'rgba(255,215,0,0.1)' : '#111'};
      padding: 15px; border-radius: 8px; opacity: ${isUnlocked ? 1 : 0.5};
    `;
    div.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom:5px;">${isUnlocked ? '🏆' : '🔒'} ${ach.title}</div>
      <div style="font-size: 0.8rem; color: #ccc;">${ach.desc}</div>
    `;
    grid.appendChild(div);
  });
}

window.onload = () => {
  if (!localStorage.getItem('neko_story_played')) {
    localStorage.setItem('neko_story_played', 'true');
    alert("【通信傍受】\\nニャニャ！ねこ宅配便の中央サーバーに謎のバグが侵入したニャ！\\nこのままでは荷物のデータがバラバラになってしまうニャ！\\n新人バイトの君に、配列の「添字」を使ってバグを修正する任務を命ずるニャ！\\n頼んだニャ！📦");
  }
};
