export interface LogEntry {
  message: string;
}

export interface BotStatus {
  pos_char: boolean;
  hunt: boolean;
  heal: boolean;
  hp: number | null;
  mp: number | null;
  screenshot: string | null;
  cap: number | null;
  amount_MP: number | null;
}

export interface WsMessage {
  type: 'status' | 'log' | 'init';
  data: any;
}
