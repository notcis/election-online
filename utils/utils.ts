import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import qs from "query-string";

export const convertZoneTimeToServer = (date: Date): Date => {
  return fromZonedTime(date, "UTC");
};

export const convertZoneTimeToClient = (date: Date): Date => {
  return toZonedTime(date, "UTC");
};

export const formatToThaiDate = (date: Date): string => {
  return format(toZonedTime(date, "UTC"), "dd/MM/yyyy HH:mm 'น.'");
};

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}
