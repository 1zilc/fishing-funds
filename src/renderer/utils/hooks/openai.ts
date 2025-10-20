import type OpenAI from 'openai';

const { ipcRenderer } = window.contextModules.electron;
export function useOpenAI() {
  function chat(params: OpenAI.ChatCompletionCreateParams): Promise<string> {
    return ipcRenderer.invoke('openai-chat', params);
  }

  return { chat };
}
