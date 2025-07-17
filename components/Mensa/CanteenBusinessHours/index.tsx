import { BusinessDay, BusinessHour } from '@/services/mensaTypes';
import { View } from 'react-native';
import { BusinessHourCard } from './BusinessHourCard';

interface CanteenBusinessHoursProps {
  businessDays: BusinessDay[];
}
const formatBusinessHours = (businessDays: BusinessDay[]) => {
  const monThuDays = ['Mo', 'Di', 'Mi', 'Do'];
  const fridayDay = 'Fr';
  const weekendDays = ['Sa', 'So'];

  const monThu = businessDays.filter(d => monThuDays.includes(d.day));
  const fri = businessDays.find(d => d.day === fridayDay);
  const satSun = businessDays.filter(d => weekendDays.includes(d.day));

  const formatHours = (dayObj: BusinessDay) =>
    dayObj.businessHours.map(
      h => `${h.openAt} – ${h.closeAt} (${h.businessHourType})`,
    );

  // Check if Mon-Thu have the same hours
  const monThuHours = monThu.map(formatHours);
  const allMonThuSame =
    monThuHours.length > 0 &&
    monThuHours.every(
      h => JSON.stringify(h) === JSON.stringify(monThuHours[0]),
    );

  // Format Friday hours
  const friHours = fri ? formatHours(fri) : [];

  const result: Record<string, string[]> = {};

  if (fri && JSON.stringify(friHours) === JSON.stringify(monThuHours[0])) {
    // Friday same as Mon-Thu, group Mo–Fr
    result['Mo–Fr'] = monThuHours[0];
  } else {
    // Friday different, split Friday out
    if (allMonThuSame && monThuHours.length > 0) {
      result['Mo–Do'] = monThuHours[0];
    } else {
      monThu.forEach(dayObj => {
        result[dayObj.day] = formatHours(dayObj);
      });
    }
    if (fri) {
      result['Fr'] = friHours;
    }
  }

  // Weekend (Sa–So)
  if (satSun.length > 0) {
    // Get Sat and Sun hours separately
    const satHours = satSun.find(d => d.day === 'Sa')?.businessHours || [];
    const sunHours = satSun.find(d => d.day === 'So')?.businessHours || [];

    const formatSatSunHours = (hours: BusinessHour[]) =>
      hours.map(h => `${h.openAt} – ${h.closeAt} (${h.businessHourType})`);

    const satFormatted = formatSatSunHours(satHours);
    const sunFormatted = formatSatSunHours(sunHours);

    if (JSON.stringify(satFormatted) === JSON.stringify(sunFormatted)) {
      result['Sa–So'] = satFormatted;
    } else {
      if (satSun.find(d => d.day === 'Sa')) {
        result['Sa'] = satFormatted;
      }
      if (satSun.find(d => d.day === 'So')) {
        result['So'] = sunFormatted;
      }
    }
  }

  return result;
};

export const CanteenBusinessHours = (props: CanteenBusinessHoursProps) => {
  return (
    <View>
      {Object.entries(formatBusinessHours(props.businessDays)).map(
        ([label, times]) => (
          <BusinessHourCard key={label} day={label} hours={times} />
        ),
      )}
    </View>
  );
};
