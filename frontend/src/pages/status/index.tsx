import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { StatusInfo } from './components/StatusInfo';
import { Actions } from './components/Actions';
import { Logs } from './components/Logs';

export const Status = () => {
  const { status, logs, sendAction } = useWebSocket();
  const { logout } = useAuth();

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <StatusInfo status={status} />
      <Actions sendAction={sendAction} logout={logout} />
      <Logs logs={logs} />
    </div>
  );
};
