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
    // try to decode percent-encoded token from URL (safe fallback)
    let raw = String(token);
    try {
      raw = decodeURIComponent(raw);
    } catch {
      // ignore decode errors and use raw
    }

    // normalize common base64 variants (remove whitespace, url-safe -> standard, pad)
    const normalizeBase64 = (s: string) => {
      let str = String(s).replace(/\s+/g, "");
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4 !== 0) {
        str += "=";
      }
      return str;
    };

    const candidate = raw.trim();

    // detect hex input (like "b74177dae56a8afec42463284dab2bb1")
    const isHex =
      /^[0-9a-fA-F]+$/.test(candidate) && candidate.length % 2 === 0;

    const encryptedText = isHex ? candidate : normalizeBase64(candidate);

    const SECRET_KEY_B64 = process.env.SECRET_KEY;
    const IV_B64 = process.env.IV;

    if (!SECRET_KEY_B64 || !IV_B64) {
      console.error("❌ Decrypt failed: missing SECRET_KEY or IV env");
      return undefined;
    }

    const SECRET_KEY = Buffer.from(SECRET_KEY_B64, "base64"); // expect 32 bytes
    const IV = Buffer.from(IV_B64, "base64"); // expect 16 bytes

    if (SECRET_KEY.length !== 32 || IV.length !== 16) {
      console.error("❌ Decrypt failed: invalid SECRET_KEY or IV length", {
        keyBytes: SECRET_KEY.length,
        ivBytes: IV.length,
      });
      return undefined;
    }

    // decode to buffer according to detected format then decrypt
    const encryptedBuf = isHex
      ? Buffer.from(encryptedText, "hex")
      : Buffer.from(encryptedText, "base64");

    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
    let decrypted = decipher.update(encryptedBuf, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ Decrypt failed:", err.message);
    return undefined;
  }
}
