// 릴파 핀볼의 공 그림 "찹쌀떡 박쥐"(2026-11-18 사용자 확정, docs/DESIGN.md "릴파 핀볼 공").
// 그리는 코드는 시안 `시안\릴파핀볼-공\bat.js`를 그대로 옮긴 `src/lilpaBat.ts`에 있다. 그림을 고치려면 시안을 고친 뒤 다시 옮긴다.
// 털 색은 남색 하나(FURS[0]), 장식 10가지(ITEMS) 중 하나를 이름 해시로 고른다(같은 이름은 항상 같은 공).
// 36×36 도트 한 장을 칸 그대로 4배(144×144)로 키워 두고, 경기 중에는 공 크기에 맞춰 줄여 붙인다(동그란 테두리 없음).
// 그림 파일이 없어 불러오기 실패가 없다. 공 크기·물리는 그대로다.
import { FURS, gridToCanvas, ITEMS, itemGrid, N } from './lilpaBat';

/** 경기 중 공 그림을 실제 공 크기의 몇 배로 그릴지(공 크기·물리는 그대로) */
export const BALL_ART_SCALE = 1;

const SCALE = 4;

function upscale(src: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = N * SCALE;
  canvas.height = N * SCALE;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false; // 도트 칸 그대로
  ctx.drawImage(src, 0, 0, N * SCALE, N * SCALE);
  return canvas;
}

type Item = [name: string, draw: (grid: unknown) => void];
const ITEM_LIST = ITEMS as unknown as Item[];

let skins: HTMLCanvasElement[] = [];
let names: string[] = [];

/** 장식 10가지를 한 번만 그려 둔다 */
export function loadLilpaBalls(): Promise<HTMLCanvasElement[]> {
  if (typeof document === 'undefined') return Promise.resolve([]);
  if (skins.length === 0) {
    skins = ITEM_LIST.map(([, fn]) => upscale(gridToCanvas(itemGrid(fn), FURS[0])));
    names = ITEM_LIST.map(([name]) => name);
  }
  return Promise.resolve(skins);
}

export function getLilpaBalls(): HTMLCanvasElement[] {
  return skins;
}

/** 장식 이름 목록(확인용) */
export function getLilpaBallNames(): string[] {
  return names;
}

function nameHash(name: string): number {
  let hash = 0;
  for (const character of name) hash = (Math.imul(hash, 31) + (character.codePointAt(0) ?? 0)) >>> 0;
  return hash;
}

/** 같은 이름은 항상 같은 공. 아직 안 그렸으면 undefined(도트 공으로 그린다) */
export function getLilpaBall(name: string): HTMLCanvasElement | undefined {
  if (skins.length === 0) return undefined;
  return skins[nameHash(name) % skins.length];
}

/** 이름표·탭 아이콘용: 장식 없는 기본 박쥐(첫 번째) */
export function lilpaBrandBallUrl(): string {
  if (typeof document === 'undefined') return '';
  return upscale(gridToCanvas(itemGrid(ITEM_LIST[0][1]), FURS[0])).toDataURL('image/png');
}

// ── 경기장 위 공 둘레 연보라 빛(2026-11-18 사용자 "C로 하고서", 기준 시안\릴파핀볼-공\테두리비교.html C 줄의 sized()) ──
// 박쥐 테두리는 그대로 두고 공 그림 뒤에 흐린 연보라 빛을 깐다. 빛 퍼짐은 화면에 그려지는 공 지름의 25%(최소 3px),
// 빛을 켠 채 같은 그림을 두 번 겹쳐 그린다. 공이 많아도 가볍게, 장식 × 화면 지름(px)마다 빛까지 그린 그림을 한 번만 만들어 둔다.
// 당첨 상자 안의 공은 이 빛을 쓰지 않는다(붉은 빛, src/rouletteRenderer.ts).
const GLOW_COLOR = 'rgba(160, 150, 255, 0.9)';
const glowCache = new Map<HTMLCanvasElement, Map<number, GlowSprite>>();

export type GlowSprite = { canvas: HTMLCanvasElement; ratio: number };

/** 박쥐 공 그림이면 화면 지름 px에 맞춰 빛을 입힌 그림(ratio = 그림 전체 폭 ÷ 공 지름)을 돌려준다. 아니면 undefined */
/** 비교용(시제품): 주소 뒤 ?glow=0 이면 빛 없이 그린다 */
const GLOW_ON = new URLSearchParams(globalThis.location?.search ?? '').get('glow') !== '0';

export function lilpaGlowSprite(skin: CanvasImageSource, diameterPx: number): GlowSprite | undefined {
  if (!GLOW_ON || !(skin instanceof HTMLCanvasElement) || !skins.includes(skin)) return undefined;
  const px = Math.max(4, Math.min(256, Math.round(diameterPx)));
  let bySize = glowCache.get(skin);
  if (!bySize) {
    bySize = new Map();
    glowCache.set(skin, bySize);
  }
  const cached = bySize.get(px);
  if (cached) return cached;
  const pad = Math.ceil(px * 0.35);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = px + pad * 2;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = true; // 경기 중 공 그림과 같은 방식(144칸 그림을 부드럽게 줄임)
  ctx.imageSmoothingQuality = 'high';
  ctx.shadowColor = GLOW_COLOR;
  ctx.shadowBlur = Math.max(3, px * 0.25);
  ctx.drawImage(skin, pad, pad, px, px);
  ctx.drawImage(skin, pad, pad, px, px);
  const sprite = { canvas, ratio: canvas.width / px };
  bySize.set(px, sprite);
  return sprite;
}

// 시제품 확인용: 브라우저 콘솔에서 장식 목록과 이름별 공을 볼 수 있게 열어 둔다
(globalThis as any).__lilpaBalls = { list: getLilpaBalls, names: getLilpaBallNames, of: getLilpaBall, glow: lilpaGlowSprite };
