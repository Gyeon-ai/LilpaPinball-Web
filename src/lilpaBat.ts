// @ts-nocheck
// 이 파일은 디자인 시안 `시안\릴파핀볼-공\bat.js`를 그대로 옮긴 것이다(2026-11-18). 그림을 고치려면 시안을 고친 뒤 다시 옮긴다.
// 맨 아래 export 한 줄만 덧붙였다.

// 릴파 핀볼 공: 찹쌀떡 박쥐 (36×36 도트)
// 따린 찹쌀떡 허스키(시안\따린핀볼-공)와 같은 방식: 36×36 도트 한 장, 동그란 공 테두리 없이 캐릭터 모양 그대로,
// 아주 짙은 남색 1칸 테두리, 장식은 밝은·기본·어두운 3단 색 + 반짝임 1점.
// 2026-11-18 2차: 사용자 지시("릴파 박쥐단 검색해서 확인해봐")로 박쥐단 팬 캐릭터의 공통 특징을 반영했다.
//   몸 전체가 짙은 남색 한 덩어리, 크고 뾰족한 귀, 옆으로 펼친 작은 날개, 큰 흰 눈, 하얀 송곳니(뱀파이어 이미지에서 온 박쥐단).
//   팬 캐릭터 그림은 가져오지 않고 특징만 참고해 새로 찍었다.
const N = 36;
const PX = {
  out: '#121327',                                   // 테두리
  k: '#2e3260', kHi: '#41478a', kSh: '#24284c',     // 몸·귀 털(남색)
  kSh2: '#1d2142',                                  // 오른쪽 아래 테두리 바로 안쪽의 가장 짙은 그늘
  mem: '#4a5196', rib: '#2a2e58',                   // 날개 막·뼈(조금 밝은 남색)
  memSh: '#3c4282',                                 // 몸에 가까운 날개 막 그늘
  earIn: '#8f8fd8', earInSh: '#6c6cc0', earInHi: '#aeaeec', // 속귀(연보라 남색) 3단
  eyeW: '#ffffff', eye: '#ffb04a', eyeD: '#1a1b33', // 큰 흰 눈 + 호박색 눈동자
  cheek: '#d9789a', mouth: '#c9cdf0', fang: '#ffffff',
};

const cx = (px) => (px < 18 ? px : 36 - px); // 좌우 대칭용
// 몸: 굴곡 없는 동그란 원(2026-11-18 사용자 지시 "몸통 굴곡 없는 동그란거로").
// 칸 가운데가 반 칸 위치에 오도록 중심을 (18, 22)로 잡아 위·아래·좌우 끝이 한 칸짜리 혹 없이 4칸 평평하게 끝난다.
// 2026-11-18 "너무 동글동글하잖아 살짝 타원형": 옆으로 살짝 넓은 타원(가로 27칸 × 세로 23칸)
const bodyAt = (px, py) => ((px - 18) / 13.6) ** 2 + ((py - 22.5) / 11.8) ** 2 <= 1;
function inPoly(P, x, y) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i], [xj, yj] = P[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// 귀: 머리와 한 덩어리로 이어진 짧고 넓은 고양이형 귀(끝이 둥근 세모).
// 2026-11-18 "귀를 살짝 둥글게 안쪽 염색도 제대로" → 사용자가 준 그림("이런 귀로도 해도 돼")대로
// 머리 옆선이 그대로 위로 올라가 귀가 되고, 두 귀 사이는 완만하게 오목하다. 테두리는 몸+귀를 합친 모양에 한 번만 두른다.
// 속귀는 작은 둥근 세모로, 테두리와 겉털 한 칸을 띄운다.
function segD(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
// 세모 T를 반지름 r만큼 둥글게 부풀린 모양(좌우 대칭)
const roundTri = (T, r) => (px, py) => {
  const x = cx(px);
  if (inPoly(T, x, py)) return true;
  let m = Infinity;
  for (let i = 0; i < T.length; i++) m = Math.min(m, segD(x, py, T[i], T[(i + 1) % T.length]));
  return m <= r;
};
const earAt = roundTri([[7.4, 19], [9.4, 8.2], [16.6, 12.6]], 2.4);
const earInAt = roundTri([[8.8, 13.4], [9.7, 10], [13.4, 12.6]], 0.9);
// 날개: 몸 옆에서 위로 펼친 박쥐 날개, 아래 가장자리가 세 번 오목(몸 뒤에 붙음)
const WING = [[8.6, 15.4], [3.6, 11.8], [0.2, 11.2], [0.2, 16], [0.9, 22.6], [2.3, 20.2], [3.7, 24.6], [5.0, 22.4], [6.6, 26.6], [8.6, 24.8]];
const RIBS = [[[6.8, 15.6], [1.0, 12.0]], [[6.4, 16.6], [1.0, 21.6]], [[6.6, 17.6], [3.7, 23.6]]];
const at = (fn) => (x, y) => x >= 0 && y >= 0 && x < N && y < N && fn(x + 0.5, y + 0.5);
const inBody = at(bodyAt);
const inHead = at((px, py) => bodyAt(px, py) || earAt(px, py)); // 몸 + 귀 한 덩어리
const inWing = at((px, py) => inPoly(WING, cx(px), py));
const edgeOf = (f, x, y) => !f(x - 1, y) || !f(x + 1, y) || !f(x, y - 1) || !f(x, y + 1);

// 명암 세기(2026-11-18 "명암 비교본도 주고"): 0 없음, 1 약하게, 2 보통(지금), 3 강하게
const SHADES = ['없음', '약하게', '보통', '강하게'];
let SHADE = 2;
function baseGrid(shade = SHADE) {
  const g = Array.from({ length: N }, () => Array(N).fill(null));
  // 뒤에서부터 날개 → 귀 → 몸 순서로 겹쳐 찍는다. 부위마다 테두리를 따로 둘러서 몸의 둥근 테두리가 끊기지 않는다.
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (inWing(x, y)) g[y][x] = edgeOf(inWing, x, y) ? PX.out : PX.mem;
  for (const [[x0, y0], [x1, y1]] of RIBS) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2);
    for (let i = 0; i <= n; i++) {
      const x = Math.floor(x0 + (x1 - x0) * i / n), y = Math.floor(y0 + (y1 - y0) * i / n);
      if (g[y]?.[x] === PX.mem) g[y][x] = PX.rib;
      if (g[y]?.[35 - x] === PX.mem) g[y][35 - x] = PX.rib;
    }
  }
  // 2026-11-18 "타요꺼처럼 퀄리티를 올려봐": 타요 퍼스나콘처럼 빛을 왼쪽 위에 두고 털을 여러 단으로 칠한다.
  //   테두리 바로 안쪽 오른쪽 아래 1칸 = 가장 짙은 그늘, 그 안쪽 띠 = 그늘, 왼쪽 위 가장자리 = 밝은 털, 정수리 = 밝은 털 덩어리.
  const isIn = (x, y) => inHead(x, y) && !edgeOf(inHead, x, y);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!inHead(x, y)) continue;
    if (edgeOf(inHead, x, y)) { g[y][x] = PX.out; continue; }
    if (earInAt(x + 0.5, y + 0.5)) {
      // 속귀: 위·바깥 가장자리는 깊어서 짙게, 아래 가운데는 밝게
      const rimTop = !earInAt(x + 0.5, y - 0.5) || !earInAt(x < 18 ? x - 0.5 : x + 1.5, y + 0.5);
      g[y][x] = rimTop ? PX.earInSh : (earInAt(x + 0.5, y + 1.5) ? PX.earIn : PX.earInHi);
      continue;
    }
    // 2026-11-18 "왜 귀랑 몸통 색이 달라?": 귀가 얇아서 왼쪽 귀는 통째로 밝게, 오른쪽 귀는 통째로 짙게 칠해졌다.
    // 귀와 정수리는 몸과 같은 기본 털 한 가지로 두고, 명암은 귀 아래(y 15부터) 몸 둘레에만 넣는다.
    const out = (dx, dy) => !isIn(x + dx, y + dy);
    if (y < 15 || shade === 0) g[y][x] = PX.k;
    else if (out(1, 1)) g[y][x] = PX.kSh2;
    else if (shade === 2 && (out(3, 2) || out(1, 3))) g[y][x] = PX.kSh;
    else if (shade === 3 && (out(2, 2) || out(1, 2))) g[y][x] = PX.kSh2;
    else if (shade === 3 && (out(5, 3) || out(2, 5))) g[y][x] = PX.kSh;
    else if (shade >= 2 && (out(-1, -1) || out(-2, -1)) && y < 22) g[y][x] = PX.kHi;
    else if (shade === 1 && out(-1, -1) && y < 22) g[y][x] = PX.kHi;
    else if (shade === 3 && (out(-3, -2) || out(-3, -1)) && y < 24) g[y][x] = PX.kHi;
    else g[y][x] = PX.k;
  }
  // 몸에 가까운 날개 막은 몸 그늘이 져서 조금 짙게(명암 없음이면 생략)
  if (shade > 0) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (g[y][x] === PX.mem && (inHead(x + 2, y) || inHead(x - 2, y))) g[y][x] = PX.memSh;
  // 강하게: 왼쪽 볼 위에 털 윤기 2칸
  if (shade === 3) for (const [x, y] of [[8, 17], [9, 16]]) if (g[y][x] === PX.k || g[y][x] === PX.kHi) g[y][x] = PX.mem;
  // 눈(5×6): 까만 눈 + 위 큰 반짝임·아래 작은 반짝임 + 아래쪽에 남색 물빛(2026-11-18 비교안 B "눈만 키우고 가운데로")
  const EYE = ['.EEE.', 'EWWEE', 'EWEEE', 'EEEEE', 'EBBWE', '.EEE.'];
  for (const ex of [10, 21]) stamp(g, ex, 19, EYE, { E: '#08080f', W: '#ffffff', B: '#2f3478' });
  // 볼: 2단 분홍(왼쪽 위가 밝음)
  for (const bx of [7, 26]) stamp(g, bx, 24, ['cCC', 'CCC'], { C: PX.cheek, c: '#f0a3bc' });
  // 입: ω 모양 + 하얀 송곳니 두 개
  // 입: 까만 ω(송곳니 없음, 2026-11-18 사용자 지시)
  stamp(g, 15, 24, ['M.MM.M', '.M..M.'], { M: '#08080f' });
  return g;
}
function stamp(g, x0, y0, rows, pal) {
  rows.forEach((row, dy) => [...row].forEach((ch, dx) => { if (ch !== '.' && pal[ch] !== undefined) { const x = x0 + dx, y = y0 + dy; if (x >= 0 && y >= 0 && x < N && y < N) g[y][x] = pal[ch]; } }));
}
const PAL = {
  O: PX.out, W: '#ffffff', k: PX.k,
  S: '#e6e7ee', s: '#b4b7c6', t: '#7c8094',             // 은색
  g: '#d3d5de', G: '#a2a5b6', h: '#73768b',             // 회색 리본
  n: '#4a5290', N: '#343a6e', m: '#20244a',             // 넥타이 남색(몸보다 조금 밝게)
  e: '#fff1a6', Y: '#ffc93a', y: '#c98a12',             // 금색
  f: '#b5c4ff', B: '#4d6bff', b: '#2f45c0',             // 파랑
  q: '#ffd0da', P: '#ff8fb0', p: '#d9568b',             // 분홍
  E: '#08080f',                                         // 눈·눈썹 검정
  i: '#bfe6ff',                                         // 눈물·땀 하늘색
  a: '#f7d9b0', A: '#e3b47e', c: '#fff4e2',             // 살구색(코)
  R: '#8a1e4f',                                         // 하트 선글라스 렌즈
  X: '#e8384f', x: '#ff8a9a', C: '#3fd6f0', z: '#b4f4ff', // 3D 안경 빨강·파랑 렌즈
  D: '#15161c', L: '#5d6070',                           // 까만 렌즈·렌즈 반짝임
  u: '#ffd166', o: '#ff8a3d', j: '#e0457b',             // 스키 고글 렌즈
  V: '#7b4bd6', v: '#b08cff',                           // 나비 가면 보라
};
function put(g, x0, y0, rows, pal = PAL) {
  rows.forEach((rw, dy) => [...rw].forEach((ch, dx) => {
    const x = x0 + dx, y = y0 + dy;
    if (ch === '.' || pal[ch] === undefined || x < 0 || y < 0 || x >= N || y >= N) return;
    g[y][x] = pal[ch];
  }));
}
const coverEyes = (g) => { for (const ex of [10, 21]) put(g, ex, 19, ['kkkkk', 'kkkkk', 'kkkkk', 'kkkkk', 'kkkkk', 'kkkkk']); };

// 외계인 안경 색: 초록 테 3단 + 까만 렌즈
const ALIEN = { O: PX.out, l: '#9cf58a', G: '#3cc43c', d: '#1f8a2a', D: '#15161c', L: '#5d6070', W: '#d6d9e4' };
// 외계인 안경 왼쪽 렌즈(오른쪽은 좌우 뒤집기): 바깥 위가 넓고 코 쪽 아래가 뾰족한 아몬드 모양
// 2026-11-18 "외계인 안경 더 꼴받게": 렌즈를 얼굴 반만 하게 키우고 바깥 위 끝이 머리 밖(날개 위)까지 뻗게, 렌즈에 반짝임 2개
const ALIEN_L = [
  'll............',
  'lGll..........',
  'GDDGll........',
  'GDLDDGll......',
  '.GDWLDDDGl....',
  '.GDDDDDDDDGl..',
  '..GDDDDDDDDDG.',
  '..dDDDDDDDDDDG',
  '...dDDDDDDDLDG',
  '....ddDDDDDDd.',
  '......ddddd...',
];

// 2026-11-18 사용자 지시 "지금 선택한 4종 말고 다른걸로 장식 후보 만들어와":
// 고른 4가지(기본·은테 안경·외계인 안경·하트 눈)는 그대로 두고, 고르지 않은 회색 리본·웃는 눈·별 머리핀·금 왕관은 뺐다.
// 1차 새 후보(헤드셋·메롱·땀방울·반창고·졸린 눈·별 눈·울먹 눈·째려보기·꽃 핀)는 사용자가 "다 별로야 다시"라 빼고 2차 후보로 바꿨다.
const EYE_PAL = { E: '#08080f', W: '#ffffff', k: PX.k };
// 까만 장식이 남색 몸에 묻히지 않게, 장식 둘레 바로 밖에 연보라 빛 테두리 1칸을 두른다(볼·눈·입은 덮지 않음)
function lightHalo(g, colors) {
  const isT = (x, y) => colors.has(g[y]?.[x]);
  const skip = new Set([PX.cheek, '#f0a3bc', '#08080f', '#ffffff']);
  const halo = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (isT(x, y) || !g[y][x] || skip.has(g[y][x])) continue;
    if (isT(x, y + 1) || isT(x + 1, y) || isT(x - 1, y)) halo.push([x, y, isT(x, y + 1)]);
    else if (isT(x, y - 1)) halo.push([x, y, false]);
  }
  for (const [x, y, above] of halo) g[y][x] = above ? '#a8a6e6' : '#6f6fb8';
}
// 머리 위쪽(y가 yMax 이하) 칸을 비운다. 모자가 박쥐 귀를 덮을 때 귀 끝이 모자 밖으로 삐져나오지 않게 쓴다.
function clearTop(g, yMax) { for (let y = 0; y <= yMax; y++) for (let x = 0; x < N; x++) g[y][x] = null; }
// inside(x, y)가 참인 칸을 colorAt 색으로 채우고, 바깥과 맞닿은 칸은 테두리색으로 칠한다(모자 모양 그리기용)
function drawShape(g, inside, colorAt) {
  const ins = (x, y) => x >= 0 && y >= 0 && x < N && y < N && inside(x, y);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!ins(x, y)) continue;
    g[y][x] = (!ins(x - 1, y) || !ins(x + 1, y) || !ins(x, y - 1) || !ins(x, y + 1)) ? PX.out : colorAt(x, y);
  }
}
// 2026-11-18 사용자 확정("이대로 만들어줘"): 아래 10가지가 최종 장식이다. 털 색은 남색 하나, 명암은 "보통".
const ITEMS = [
  ['기본', () => {}],
  // 동그란 은테 안경: 둥근 테(위 밝게·아래 어둡게) + 다리
  ['은테 안경', (g) => {
    const rim = ['..SSs..', '.S...s.', 'S.....t', 'S.....t', 's.....t', 's.....t', '.s...t.', '..ttt..'];
    put(g, 9, 18, rim); put(g, 20, 18, rim);
    put(g, 16, 20, ['SSss']);
    put(g, 5, 20, ['ssss']); put(g, 27, 20, ['ssss']);
  }],
  // 초록 외계인 안경(사용자가 준 사진의 장난감 안경): 얼굴 반만 한 까만 렌즈 + 초록 테
  ['외계인 안경', (g) => {
    coverEyes(g);
    put(g, 3, 14, ALIEN_L, ALIEN);
    put(g, 19, 14, ALIEN_L.map((r) => [...r].reverse().join('')), ALIEN);
    put(g, 17, 21, ['ll', 'dd'], ALIEN);
  }],
  // 하트 눈
  ['하트 눈', (g) => {
    coverEyes(g);
    const H = ['.PP.PP', 'PqPPPp', 'PPPPPp', '.PPPp.', '..Pp..'];
    put(g, 9, 20, H); put(g, 21, 20, H);
  }],

  // ── 2차 후보에서 고른 것 ──
  // 픽셀 선글라스: 까만 각진 선글라스 + 흰 반사 사선(인터넷 밈 느낌)
  ['픽셀 선글라스', (g) => {
    coverEyes(g);
    // 2026-11-18 사용자 "이게 나았는데 왜 위에 회색줄로 바꼈어?": 회색 윗줄을 빼고 처음처럼 전부 까맣게 되돌림
    put(g, 8, 19, ['EEEEEEEEEEEEEEEEEEEE', 'EWWEEEEE....EWWEEEEE', 'EEWWEEEE....EEWWEEEE', '.EEEEEE......EEEEEE.', '..EEEE........EEEE..'], EYE_PAL);
    put(g, 5, 19, ['EEE'], EYE_PAL); put(g, 28, 19, ['EEE'], EYE_PAL);
  }],
  // 전투메이드 가면(2026-11-18 사용자가 준 릴파 전투메이드 그림): 바깥 끝이 박쥐 날개처럼 뾰족한 까만 눈가면,
  // 눈구멍 위에 금색 테두리, 위 가장자리에 회색 윤기. 그림은 가져오지 않고 특징만 따라 새로 찍었다.
  ['전투메이드 가면', (g) => {
    // 가면 검정은 눈 검정(#08080f)과 다른 값으로 둬서, 아래 테두리 계산이 눈동자를 가면으로 착각하지 않게 한다
    const P2 = { E: '#0c0c15', L: '#3c3f50', Y: PAL.Y, e: PAL.e };
    const half = [
      'EE.............',
      'ELLE...........',
      '.ELLEEE........',
      '.EEEEEEeYYYEEEE',
      '..EEEEY.....EEE',
      '..EEEE......EEE',
      '.EEEEE......EEE',
      'EEEEEE......EE.',
      '.E.EEEE....EEE.',
      '....EEEEEEEE...',
    ];
    put(g, 3, 15, half, P2);
    put(g, 18, 15, half.map((r) => [...r].reverse().join('')), P2);
    // 2026-11-18 "가면이 살짝 잘 안보이는데": 까만 가면이 남색 몸에 묻혀서, 가면 바깥 둘레 바로 밖에
    // 연보라 빛 테두리 1칸을 둘렀다(가면 자체는 까만 그대로, 눈구멍 안은 건드리지 않음). 위쪽은 더 밝게.
    const isMask = (x, y) => { const c = g[y]?.[x]; return c === P2.E || c === P2.L || c === P2.Y || c === P2.e; };
    const inHole = (x, y) => y >= 19 && y <= 23 && ((x >= 9 && x <= 14) || (x >= 21 && x <= 26));
    const halo = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (isMask(x, y) || inHole(x, y) || !g[y][x] || [PX.cheek, '#f0a3bc', '#08080f'].includes(g[y][x])) continue; // 볼·입은 그대로
      if (isMask(x, y + 1) || isMask(x + 1, y) || isMask(x - 1, y)) halo.push([x, y, isMask(x, y + 1)]);
      else if (isMask(x, y - 1)) halo.push([x, y, false]);
    }
    for (const [x, y, above] of halo) g[y][x] = above ? '#a8a6e6' : '#6f6fb8';
  }],
  // ── 3차 후보에서 고른 것(2026-11-18 "지금 선택한거 말고 더 다시"로 만든 8가지 중 해적 안대만 남음) ──
  // 해적 안대: 왼쪽 눈을 덮는 까만 안대 + 이마를 가로지르는 끈(둘레에 연보라 빛 테두리)
  ['해적 안대', (g) => {
    const P2 = { D: '#0c0c15', L: '#3c3f50', s: '#2a2c3a' };
    for (let i = 0; i <= 14; i++) { const x = 14 + i, y = 18 - Math.round(i * 0.45); if (g[y]?.[x]) g[y][x] = P2.s; }
    for (let i = 0; i <= 3; i++) { const x = 8 - i, y = 18 - i; if (g[y]?.[x]) g[y][x] = P2.s; }
    put(g, 8, 18, ['.DDDDDD.', 'DLLDDDDD', 'DLDDDDDD', 'DDDDDDDD', 'DDDDDDDD', '.DDDDDD.', '..DDDD..'], P2);
    lightHalo(g, new Set([P2.D, P2.L, P2.s]));
    // 2026-11-18 "해적 안대에 L 박아줄래 릴파": 안대 가운데 금색 L(릴파). 빛 테두리 뒤에 찍어야 테두리로 덮이지 않는다
    put(g, 11, 19, ['e..', 'Y..', 'Y..', 'Yyy']);
  }],
  // ── 사용자가 그림을 주며 요청한 것(2026-11-18 "루돌프, 빙글빙글 안경, 릴트리버 이런거 만들어줘", 릴트리버는 "구현이 잘 안된다 패스"로 뺌) ──
  // 그림은 가져오지 않고 특징만 따라 새로 찍었다.
  // 루돌프: 사용자가 준 두 번째 그림("이런 모습이거든?")을 따라 다시 그렸다.
  //   이마를 가로지르는 하얀 털 머리띠 + 머리띠 위 빨간 리본·하늘색 눈꽃, 머리띠 양 끝에서 솟은 통통한 진빨강 인형 뿔(박쥐 귀 자리를 덮음),
  //   뿔에 감긴 연두 전선과 색색 꼬마전구, 빨간 코. 이전 가는 뿔·Y자 뿔은 귀 위에서 붕 떠 보여서 버렸다.
  ['루돌프', (g) => {
    const P2 = {
      O: '#4a0a14', A: '#a51d30', a: '#d8404f', d: '#7a1222',         // 뿔(테두리·기본·밝은·그늘)
      w: '#9be38a', u: '#ffd166', G: '#5dff8f', B: '#6fa8ff', P: '#ff8fb0', // 전선과 전구
      W: '#ffffff', g: '#e2e2ec', h: '#b9bacb',                          // 털 머리띠
      X: '#d0213a', C: '#7fc8ff',                                        // 리본, 눈꽃
    };
    // 박쥐 속귀는 뿔 밑에 비치지 않게 털색으로 덮는다
    const inner = new Set([PX.earIn, PX.earInSh, PX.earInHi]);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (inner.has(g[y][x])) g[y][x] = PX.k;
    const antler = [
      '....OO..',
      '...OaAO.',
      'OO.OaAO.',
      'OaOOaAAO',
      'OaAOaAAO',
      '.OaAAAdO',
      '..OaAAdO',
      '..OaAAdO',
      '..OaAAdO',
      '..OAAddO',
    ];
    // 하얀 털 머리띠(2026-11-18 "머리띠는 빼볼래?"로 잠깐 뺐다가 "아 머리띠 그냥 넣어줘"로 다시 넣음)
    // 2026-11-18 "머리띠만 다시 어울리게": 머리 밖으로 삐져나온 일자 띠(4줄) → 머리 둥근 윗선을 따라 휘는 3줄 띠, 머리 안쪽에만 칠한다.
    //   양 끝은 뿔 밑으로 들어가게 뿔보다 먼저 그리고, 리본·눈꽃은 띠 폭에 맞게 작게 줄였다.
    const inside = (x, y) => g[y][x] && g[y][x] !== PX.out;
    for (let x = 7; x <= 28; x++) {
      const top = 11 + Math.round(1.6 * ((x + 0.5 - 18) / 11) ** 2);
      [[0, x % 4 === 1 ? 'g' : 'W'], [1, x % 3 === 0 ? 'W' : 'g'], [2, x % 2 ? 'h' : 'g']].forEach(([dy, c]) => {
        if (inside(x, top + dy)) g[top + dy][x] = P2[c];
      });
    }
    put(g, 6, 2, antler, P2); put(g, 22, 2, antler.map((r) => [...r].reverse().join('')), P2);
    // 뿔에 감긴 전선(연두)과 꼬마전구
    for (const [x, y, c] of [[7, 6, 'u'], [9, 7, 'w'], [10, 6, 'w'], [11, 5, 'B'], [10, 9, 'G'], [11, 10, 'w'], [12, 9, 'P'],
                             [28, 6, 'G'], [26, 7, 'w'], [25, 6, 'w'], [24, 5, 'u'], [25, 9, 'P'], [24, 10, 'w'], [23, 9, 'B']]) g[y][x] = P2[c];
    // 작은 빨간 리본(왼쪽)과 작은 하늘색 눈꽃(오른쪽)
    put(g, 13, 11, ['X.X', '.X.', 'X.X'], P2);
    put(g, 21, 11, ['C.C', '.C.', 'C.C'], P2);
    put(g, 17, 22, ['aA', 'AA'], P2);
  }],
  // 빙글빙글 안경 2: 사용자가 준 그림처럼 크고 동그란 흰 렌즈에 까만 소용돌이 + 까만 테(기존 빙글빙글 안경은 그대로 두고 비교용으로 추가)
  ['빙글빙글 안경', (g) => {
    coverEyes(g);
    const lens = [
      '..EEEEE..',
      '.EWWWWWE.',
      'EWEEEEEWE',
      'EWEWWWEWE',
      'EWEWEWEWE',
      'EWEWEEEWE',
      'EWEWWWWWE',
      '.EWEEEEE.',
      '..EEEEE..',
    ];
    put(g, 6, 16, lens, EYE_PAL); put(g, 21, 16, lens.map((r) => [...r].reverse().join('')), EYE_PAL);
    put(g, 15, 20, ['EEEEEE'], EYE_PAL);
  }],
  // ── 5차 후보에서 고른 것(2026-11-18, 머리 코스튬 6가지 중 천사 링만 남음) ──
  // 천사 링: 머리 위에 떠 있는 금색 고리
  ['천사 링', (g) => {
    // 2026-11-18 "천사링 살짝 내려줄래": 2칸 내림(y 1→3)
    put(g, 10, 3, ['...eeeeeeeeee...', '.YY..........YY.', '..yyyyyyyyyyyy..']);
    put(g, 13, 3, ['W'], { W: '#ffffff' });
  }],
];

// 털 색: 남색 하나로 확정(2026-11-18 사용자 "털색도 남색으로만"). 비교했던 인디고 블루·밤보라·먹회색·황금박쥐는 뺐다.
const FURS = [
  // 이름, 털, 밝은 털, 그늘, 날개 막, 날개 뼈, 가장 짙은 그늘, 날개 막 그늘
  ['남색(기본)', PX.k, PX.kHi, PX.kSh, PX.mem, PX.rib, PX.kSh2, PX.memSh],
];

function gridToCanvas(g, fur = FURS[0]) {
  const map = { [PX.k]: fur[1], [PX.kHi]: fur[2], [PX.kSh]: fur[3], [PX.mem]: fur[4], [PX.rib]: fur[5], [PX.kSh2]: fur[6], [PX.memSh]: fur[7] };
  const cv = document.createElement('canvas'); cv.width = cv.height = N;
  const ctx = cv.getContext('2d');
  g.forEach((r, y) => r.forEach((c, x) => { if (c) { ctx.fillStyle = map[c] || c; ctx.fillRect(x, y, 1, 1); } }));
  return cv;
}
const itemGrid = (fn) => { const g = baseGrid(); fn(g); return g; };

export { N, ITEMS, FURS, baseGrid, itemGrid, gridToCanvas };
