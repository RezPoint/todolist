export const COMMANDS = {
  START: '/start',
  ADD: '/add',
  LIST: '/list',
  DONE: '/done',
  TODO: '/todo',
  DELETE: '/delete',
  TODAY: '/today',
} as const

export const EMOJIS = {
  PENDING: '⏳',
  IN_PROGRESS: '🔄',
  DONE: '✅',
  LOW: '🟢',
  MEDIUM: '🟡',
  HIGH: '🔴',
} as const

export const MESSAGES = {
  WELCOME: '👋 Привет, {name}!',
  TASK_ADDED: '✅ Задача добавлена!',
  TASK_DELETED: '🗑️ Задача "{title}" удалена!',
  TASK_DONE: '✅ Задача "{title}" отмечена как выполненная!',
  TASK_TODO: '🔄 Задача "{title}" возвращена в работу!',
  NO_TASKS: '📭 У тебя пока нет задач. Добавь первую командой /add или просто напиши задачу!',
  ERROR: '❌ Ошибка. Попробуй позже.',
} as const

