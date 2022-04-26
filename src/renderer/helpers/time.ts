import * as Adapter from '@/utils/adpters';
import * as Services from '@/services';
import * as Enums from '@/utils/enums';

export async function GetCurrentHours(timestampSetting: Enums.TimestampType) {
  const now = Date.now().toString();
  try {
    const collectors = [
      Services.Time.GetCurrentDateTimeFromTaobao,
      Services.Time.GetCurrentDateTimeFromJd,
      Services.Time.GetCurrentDateTimeFromSuning,
    ];
    switch (timestampSetting) {
      case Enums.TimestampType.Local:
        return now;
      case Enums.TimestampType.Network:
      default:
        return (await Adapter.ChokePreemptiveAdapter<string>(collectors)) || now;
    }
  } catch (error) {
    return now;
  }
}
