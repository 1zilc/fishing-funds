import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';

export async function getCurrentHours() {
  const collectors = [
    Services.Time.GetCurrentDateTimeFromTaobao,
    Services.Time.GetCurrentDateTimeFromJd,
    Services.Time.GetCurrentDateTimeFromSuning,
  ];
  return Adapter.ChokePreemptiveAdapter<string>(collectors);
}
