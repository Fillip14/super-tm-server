export interface LogEntry {
  message: string;
  type: 'info' | 'warning' | 'error' | 'debug' | 'critical';
  time: string;
}

export interface BotStatus {
  pos_char: boolean;
  hunt: boolean;
  heal: boolean;
  hp: number | null;
  mp: number | null;
  minimap: string | null;
  cap: number | null;
  amount_MP: number | null;
}

export type WsMessage =
  | { type: 'status'; data: BotStatus }
  | { type: 'log'; data: LogEntry[] }
  | { type: 'init'; data: unknown };

export type BotCommand =
  | { category: 'program'; action: 'start' | 'stop' }
  | { category: 'hunt'; action: 'start' | 'stop' }
  | { category: 'heal'; action: 'start' | 'stop' }
  | { category: 'client'; action: 'reopen' };

export type BotCategory = BotCommand['category'];
