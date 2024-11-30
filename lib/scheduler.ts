import { PinData } from './csv-parser';

export interface ScheduledPin extends PinData {
  scheduledTime: Date;
}

export function schedulePins(pins: PinData[], pinsPerDay: number): ScheduledPin[] {
  const scheduledPins: ScheduledPin[] = [];
  const totalDays = Math.ceil(pins.length / pinsPerDay);
  let currentDate = new Date();
  currentDate.setHours(9, 0, 0, 0); // Start at 9 AM

  for (let day = 0; day < totalDays; day++) {
    const dayPins = pins.slice(day * pinsPerDay, (day + 1) * pinsPerDay);
    const intervalMinutes = Math.floor(720 / dayPins.length); // 12 hours divided by number of pins

    dayPins.forEach((pin, index) => {
      const scheduledTime = new Date(currentDate.getTime() + index * intervalMinutes * 60000);
      scheduledPins.push({ ...pin, scheduledTime });
    });

    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(9, 0, 0, 0); // Reset to 9 AM for the next day
  }

  return scheduledPins;
}

