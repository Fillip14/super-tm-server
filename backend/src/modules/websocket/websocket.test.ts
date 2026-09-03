import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';

jest.mock('../users/services/user.service', () => ({
  patchUserService: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../utils/validateUser', () => ({
  validateUser: jest.fn(),
}));

jest.mock('../../utils/log/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

import { validateUser } from '../../utils/validateUser';
import { AppError } from '../../errors/AppError';
import { HttpStatus } from '../../constants/api.constants';
import { initWebSocket, wss } from './websocket';

const USER_ID = '3ad971b9-4e35-4e3e-9bb4-f3693192b93c';
const VALIDATION_DELAY = 150;

const mockedValidateUser = validateUser as jest.MockedFunction<typeof validateUser>;

let server: Server;
let baseUrl: string;

const desktopUrl = () => {
  const token = jwt.sign({ userId: USER_ID }, process.env.JWT_SECRET as string);
  return `${baseUrl}/?token=${token}&client=desktop`;
};

// Resolve com a mensagem de erro enviada pelo servidor, ou null se a conexão foi aceita.
const connectDesktop = (): Promise<{ ws: WebSocket; rejection: string | null }> =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket(desktopUrl());
    let rejection: string | null = null;

    ws.on('message', (raw) => {
      const parsed = JSON.parse(raw.toString());
      if (parsed.error) rejection = parsed.error;
    });
    ws.on('error', reject);
    ws.on('open', () => setTimeout(() => resolve({ ws, rejection }), VALIDATION_DELAY * 3));
    ws.on('close', () => resolve({ ws, rejection }));
  });

beforeAll((done) => {
  server = createServer();
  initWebSocket(server);
  server.listen(0, () => {
    baseUrl = `ws://127.0.0.1:${(server.address() as AddressInfo).port}`;
    done();
  });
});

afterAll((done) => {
  wss.close(() => server.close(() => done()));
});

beforeEach(() => {
  // Espelha o validateUser real: round-trip de banco e, com isLogged=true, o CONFLICT
  // que vira duplicate_login (a coluna online fica true enquanto houver socket registrado).
  mockedValidateUser.mockImplementation(
    (_userId: string, _clientType: string, isLogged = false) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(
          () =>
            isLogged
              ? reject(new AppError('Usuário já logado.', HttpStatus.CONFLICT))
              : resolve(),
          VALIDATION_DELAY,
        ),
      ),
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('conexão desktop', () => {
  it('não deixa o usuário preso em duplicate_login quando o socket cai durante a validação', async () => {
    // Socket que fecha antes da validação terminar: não pode ficar registrado no mapa.
    const abandoned = new WebSocket(desktopUrl());
    await new Promise((resolve) => abandoned.on('open', resolve));
    abandoned.terminate();

    await new Promise((resolve) => setTimeout(resolve, VALIDATION_DELAY * 3));

    const { ws, rejection } = await connectDesktop();
    ws.close();

    expect(rejection).toBeNull();
  });

  it('recusa a segunda conexão desktop simultânea do mesmo usuário', async () => {
    const [first, second] = await Promise.all([connectDesktop(), connectDesktop()]);

    const rejections = [first.rejection, second.rejection].filter(Boolean);
    first.ws.close();
    second.ws.close();

    expect(rejections).toEqual(['duplicate_login']);
  });

  it('aceita reconexão depois que a conexão anterior fecha', async () => {
    const first = await connectDesktop();
    first.ws.close();
    await new Promise((resolve) => setTimeout(resolve, VALIDATION_DELAY));

    const second = await connectDesktop();
    second.ws.close();

    expect(second.rejection).toBeNull();
  });
});
