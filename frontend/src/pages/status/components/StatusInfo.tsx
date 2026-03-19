import type { BotStatus } from '../../../types/bot.types';

export const StatusInfo = ({ status }: { status: BotStatus | null }) => {
  return (
    <div>
      <h2>Status do Bot</h2>
      {!status ? (
        <p>Aguardando bot...</p>
      ) : (
        <>
          <p>Programa: {status.pos_char ? 'Ativo' : 'Parado'}</p>
          <p>Heal: {status.heal ? 'Ativo' : 'Parado'}</p>
          <p>Hunt: {status.hunt ? 'Ativo' : 'Parado'}</p>
          <p>HP: {status.hp}%</p>
          <p>MP: {status.mp}%</p>
        </>
      )}
    </div>
  );
};
