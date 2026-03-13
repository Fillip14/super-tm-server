const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'http://localhost:4000';

export function useActions() {
  async function sendAction(action: string) {
    try {
      await fetch(`${API_URL}/api/actions/${action}`, {
        method: 'POST',
      });
    } catch (e) {
      console.error('Erro ao enviar ação:', e);
    }
  }

  return { sendAction };
}
