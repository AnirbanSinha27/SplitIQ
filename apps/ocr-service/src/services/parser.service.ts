// apps/ocr-service/src/services/parser.service.ts

type ParsedItem = {
  name: string;
  amount: number;
};

type ParsedBill = {
  items: ParsedItem[];
  tax: number | null;
  discount: number | null;
  total: number | null;
  confidence: number;
};

/* ------------------ Helpers ------------------ */

function normalize(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function extractAmount(line: string): number | null {
  // Only match amount at END of line (prevents qty like "2 Coffee")
  const match = line.match(/(\d+(\.\d{1,2})?)\s*$/);
  return match ? Number(match[1]) : null;
}

function isTax(line: string) {
  return /\bgst\b|\btax\b/i.test(line);
}

function isDiscount(line: string) {
  return /\bdiscount\b|\bdisc\b/i.test(line);
}

function isTotal(line: string) {
  return /\btotal\b|\bgrand total\b/i.test(line);
}

function isAddressLike(line: string) {
  return (
    /\broad\b|\bstreet\b|\barea\b|\bnear\b|\bsector\b/i.test(line) ||
    /\b\d{6}\b/.test(line) // Indian pincode
  );
}

function isPhoneLike(line: string) {
  return /\b\d{10}\b/.test(line);
}

function isGSTIN(line: string) {
  return /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b/.test(line);
}

function isNoise(line: string) {
  return (
    isAddressLike(line) ||
    isPhoneLike(line) ||
    isGSTIN(line)
  );
}

function isItemLine(line: string): boolean {
  const amount = extractAmount(line);

  if (amount === null) return false;
  if (isTotal(line)) return false;
  if (isTax(line)) return false;
  if (isDiscount(line)) return false;
  if (isNoise(line)) return false;

  return true;
}

/* ------------------ Main Parser ------------------ */

export function parseBill(text: string): ParsedBill {
  const lines = normalize(text);

  const items: ParsedItem[] = [];
  let tax: number | null = null;
  let discount: number | null = null;
  let total: number | null = null;

  for (const line of lines) {
    const amount = extractAmount(line);
    if (amount === null) continue;

    if (isTotal(line)) {
      total = amount;
    } else if (isTax(line)) {
      tax = (tax ?? 0) + amount;
    } else if (isDiscount(line)) {
      discount = (discount ?? 0) + Math.abs(amount);
    } else if (isItemLine(line)) {
      const name = line
        .replace(amount.toString(), '')
        .replace(/[-–—]+$/, '')
        .trim();

      if (name.length >= 2) {
        items.push({ name, amount });
      }
    }
  }

  /* ------------------ Confidence Scoring ------------------ */

  let confidence = 1;

  if (items.length === 0) confidence -= 0.6;
  else if (items.length < 2) confidence -= 0.3;

  if (!total) confidence -= 0.2;

  // Math consistency check
  if (total !== null) {
    const itemsSum = items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const expected =
      itemsSum + (tax ?? 0) - (discount ?? 0);

    if (Math.abs(expected - total) > 2) {
      confidence -= 0.3;
    }
  }

  // Clamp confidence between 0 and 1
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    items,
    tax,
    discount,
    total,
    confidence,
  };
}
