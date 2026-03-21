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
          <p>CAP: {status.cap}</p>
          <p>Potions MP: {status.amount_MP}</p>
          {/* {status.screenshot && (
            <div>
              <p>Minimap:</p>
              <img
                src={`data:image/jpeg;base64,${status.screenshot}`}
                alt="minimap"
                style={{ imageRendering: 'pixelated', border: '1px solid #0f0' }}
              />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};
