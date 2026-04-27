export function normalizeDateOfBirth(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  // dd/mm/yyyy
  const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!slashMatch) return null;

  const day = slashMatch[1].padStart(2, "0");
  const month = slashMatch[2].padStart(2, "0");
  const year = slashMatch[3];

  const iso = `${year}-${month}-${day}`;
  return isValidIsoDate(iso) ? iso : null;
}

export function formatIsoToDobDisplay(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function parseDobDisplayToIso(display: string): string | null {
  const match = display.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return null;
  }

  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return isValidIsoDate(iso) ? iso : null;
}

export function openNativeDatePicker(input: HTMLInputElement) {
  try {
    (input as unknown as { showPicker?: () => void }).showPicker?.();
    return;
  } catch {
    // ignore and fallback
  }

  input.focus();
  input.click();
}

function isValidIsoDate(iso: string): boolean {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;

  // Ensure it round-trips to the same day (rejects 2026-02-31)
  const normalized = date.toISOString().slice(0, 10);
  return normalized === iso;
}
