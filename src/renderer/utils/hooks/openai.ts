import OpenAI from 'openai';
import { useMemo } from 'react';
import { useAppSelector } from '@/utils/hooks';

export function useOpenAI() {
  const openaiBaseURLSetting = useAppSelector((state) => state.setting.systemSetting.openaiBaseURLSetting);
  const openaiApiKeySetting = useAppSelector((state) => state.setting.systemSetting.openaiBaseURLSetting);

  const client = useMemo(
    () =>
      new OpenAI({
        baseURL: openaiBaseURLSetting,
        apiKey: openaiApiKeySetting,
        dangerouslyAllowBrowser: true,
      }),
    [openaiBaseURLSetting, openaiApiKeySetting]
  );

  return client;
}
