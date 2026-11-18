import type { ColorTheme } from '../types/ColorTheme';

export const initialZoom = 30;
export const canvasWidth = 1600;
export const canvasHeight = 900;
export const zoomThreshold = 5;
export const STUCK_DELAY = 5000;
export const UI_FONT_FAMILY = `'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', system-ui, sans-serif`;
// 오락실 도트 테마의 캔버스용 색과 글꼴(패널 쪽 값은 assets/style.scss의 :root)
export const DOT_LINE = '#5a5fa8';
export const DOT_INK = '#0c0b1a';
export const DOT_TEXT_SOFT = '#dcd9f5';
export const DOT_ACCENT = '#ffb04a';
export const DOT_RED = '#c4223a';
export const NAME_FONT_FAMILY = `'Noto Sans KR', sans-serif`;
export const DOT_FONT_FAMILY = `'Galmuri11', 'Noto Sans KR', sans-serif`;
export const NUMBER_FONT_FAMILY = `'Press Start 2P', 'Galmuri11', monospace`;
export const WINNER_NAME_FONT_FAMILY = `'Do Hyeon', 'Noto Sans KR', sans-serif`;

export enum Skills {
  None,
  Impact,
}

export const Themes: Record<string, ColorTheme> = {
  light: {
    background: '#eee',
    marbleLightness: 50,
    marbleWinningBorder: 'black',
    skillColor: '#69c',
    coolTimeIndicator: '#999',
    entity: {
      box: {
        fill: '#226f92',
        outline: 'black',
        bloom: 'cyan',
        bloomRadius: 0,
      },
      circle: {
        fill: 'yellow',
        outline: '#ed7e11',
        bloom: 'yellow',
        bloomRadius: 0,
      },
      polyline: {
        fill: 'white',
        outline: 'black',
        bloom: 'cyan',
        bloomRadius: 0,
      },
    },
    rankStroke: 'black',
    minimapBackground: '#fefefe',
    minimapViewport: '#6699cc',

    winnerBackground: 'rgba(255, 255, 255, 0.5)',
    winnerOutline: 'black',
    winnerText: '#cccccc',
  },
  dark: {
    background: '#1e2130', // 릴파 판(2026-11-18 "네온바랑 배경색 이걸로"): 경기장 바탕은 난워니 기반본 값(DOT_INK는 그대로)
    marbleLightness: 75,
    marbleWinningBorder: 'white',
    skillColor: 'white',
    coolTimeIndicator: 'red',
    entity: {
      box: {
        fill: '#ffb04a',
        outline: '#ffb04a',
        bloom: '#ffb04a',
        bloomRadius: 15,
      },
      circle: {
        fill: '#ffb04a',
        outline: '#ffb04a',
        bloom: '#ffb04a',
        bloomRadius: 15,
      },
      polyline: {
        fill: '#6f8bff',
        outline: '#6f8bff',
        bloom: '#6f8bff',
        bloomRadius: 22,
      },
    },
    rankStroke: '',
    minimapBackground: '#181a27',
    minimapViewport: 'white',
    winnerBackground: 'rgba(12, 11, 26, 0.88)',
    winnerOutline: '',
    winnerText: 'white',
  },
};
