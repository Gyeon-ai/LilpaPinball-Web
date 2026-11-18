// 릴파 핀볼 이름표(왼쪽 위, 미니맵 위): 난워니 기반 시제품(시안\릴파핀볼-난워니기반)의 이름표를 그대로 옮겼다(2026-11-18).
// 글자는 '릴파 핀볼'로 고정(주소 ?title= 바꾸기 없음). 그림은 장식 없는 기본 박쥐.
import { lilpaBrandBallUrl } from './lilpaBall';

/** 미니맵은 화면 폭 1280px보다 좁으면 비례해 줄어든다. 이름표도 같은 비율로 줄인다 */
function syncMinimapScale() {
  const scale = Math.min(1, window.innerWidth / 1280);
  document.documentElement.style.setProperty('--mm-scale', String(scale));
}

export function setupLilpaBrand() {
  if (typeof document === 'undefined') return;
  syncMinimapScale();
  window.addEventListener('resize', syncMinimapScale);
  document.documentElement.style.setProperty('--brand-ball', `url("${lilpaBrandBallUrl()}")`);
}
