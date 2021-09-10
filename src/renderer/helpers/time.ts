import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';

export async function GetCurrentHours() {
  const now = Date.now().toString();
  try {
    const collectors = [
      Services.Time.GetCurrentDateTimeFromTaobao,
      Services.Time.GetCurrentDateTimeFromJd,
      Services.Time.GetCurrentDateTimeFromSuning,
    ];
    return (await Adapter.ChokePreemptiveAdapter<string>(collectors)) || now;
  } catch (error) {
    console.log('获取远程时间出错', error);
    return now;
  }
}
