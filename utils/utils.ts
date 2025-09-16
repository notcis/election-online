import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import qs from "query-string";
import crypto from "crypto";

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

export function decrypt(token: string) {
  try {
    const encryptedText = token.replace(/ /g, "+");
    const SECRET_KEY = Buffer.from(process.env.SECRET_KEY!, "base64"); // 32 bytes
    const IV = Buffer.from(process.env.IV!, "base64"); // 16 bytes
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ Decrypt failed:", err.message);
    return undefined;
  }
}
