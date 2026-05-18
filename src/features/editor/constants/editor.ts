export const MAX_HISTORY_COUNT = 20;
export const DEFAULT_PROJECT_TITLE = '새 프로젝트';
export const DEFAULT_STAGE_WIDTH = 960;
export const DEFAULT_STAGE_HEIGHT = 600;

export const CREATE_NEW_PROJECT_CONFIRM_MESSAGE =
  '현재 작업을 종료하고 새 프로젝트를 시작하시겠습니까?';

export const RESTORE_HISTORY_CONFIRM_MESSAGE = (title: string) =>
  `"${title}" 작업으로 돌아가시겠습니까?\n현재 작업 내용은 사라집니다.`;

export const MAX_HISTORY_REACHED_MESSAGE = (maxHistory: number) =>
  `작업이력이 최대 ${maxHistory}개에 도달했습니다.\n기존 이력을 삭제 후 다시 시도해 주세요.`;
