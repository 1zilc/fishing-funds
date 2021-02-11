import { useInterval } from 'ahooks';
import { getCurrentHours } from '@/actions/time';
import * as Utils from '@/utils';

export const useWorkDayTimeToDo = (todo: () => void, delay: number) => {
  useInterval(async () => {
    const timestamp = await getCurrentHours();
    const isWorkDayTime = Utils.JudgeWorkDayTime(Number(timestamp));
    if (isWorkDayTime) {
      todo();
    }
  }, delay);
};
