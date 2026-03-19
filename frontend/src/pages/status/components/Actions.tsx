import { memo } from 'react';

export const Actions = memo(
  ({
    sendAction,
    logout,
  }: {
    sendAction: (type: string, value: string) => void;
    logout: () => void;
  }) => {
    return (
      <div>
        <h2>Ações</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => sendAction('program', 'start')}>Iniciar Programa</button>
          <button onClick={() => sendAction('program', 'stop')}>Parar Programa</button>
          <button onClick={() => sendAction('hunt', 'start')}>Start Hunt</button>
          <button onClick={() => sendAction('hunt', 'stop')}>Stop Hunt</button>
          <button onClick={() => sendAction('heal', 'start')}>Iniciar Heal</button>
          <button onClick={() => sendAction('heal', 'stop')}>Parar Heal</button>

          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  },
);
