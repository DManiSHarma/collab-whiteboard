export const TOOLS = {
  SELECT: 'select',
  PEN: 'pen',
  RECT: 'rect',
  CIRCLE: 'circle',
  LINE: 'line',
  ARROW: 'arrow',
  ERASER: 'eraser',
  NOTE: 'note',
  HAND: 'hand',
};

export const NOTE_COLORS = [
  { name: 'Yellow', bg: '#FEF3C7', strip: '#F59E0B' },
  { name: 'Pink', bg: '#FCE7F3', strip: '#EC4899' },
  { name: 'Green', bg: '#D1FAE5', strip: '#10B981' },
  { name: 'Blue', bg: '#DBEAFE', strip: '#3B82F6' },
  { name: 'Purple', bg: '#EDE9FE', strip: '#8B5CF6' },
];

export const USER_COLORS = [
  '#6C5CE7', '#00B894', '#E17055', '#0984E3',
  '#FDCB6E', '#E84393', '#00CEC9', '#FF7675',
  '#A29BFE', '#55EFC4', '#FAB1A0', '#74B9FF',
];

export const DEFAULT_COLOR = '#FFFFFF';
export const DEFAULT_STROKE_WIDTH = 3;
export const DEFAULT_OPACITY = 1;
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.25;
export const CURSOR_THROTTLE_MS = 50;
export const SERVER_URL = 'http://localhost:3001';
