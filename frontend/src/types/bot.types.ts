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

export interface WsMessage {
  type: 'status' | 'log' | 'init';
  data: any;
}
