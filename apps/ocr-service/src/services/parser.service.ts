function normalize(text: string): string[] {
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
  }

function isTax(line: string) {
    return /gst|tax/i.test(line);
}
  
function isDiscount(line: string) {
    return /discount|disc/i.test(line);
}
  
function extractAmount(line: string): number | null {
   const match = line.match(/(-?\d+(\.\d{1,2})?)/);
   return match ? Number(match[1]) : null;
}

function isItem(line: string) {
    return (
      extractAmount(line) !== null &&
      !/total/i.test(line) &&
      !isTax(line) &&
      !isDiscount(line)
    );
}

export function parseBill(text: string) {
    const lines = normalize(text);
  
    const items: any[] = [];
    let tax = 0;
    let discount = 0;
    let total = 0;
  
    for (const line of lines) {
      const amount = extractAmount(line);
      if (amount === null) continue;
  
      if (/total/i.test(line)) {
        total = amount;
      } else if (isTax(line)) {
        tax += amount;
      } else if (isDiscount(line)) {
        discount += Math.abs(amount);
      } else if (isItem(line)) {
        const name = line.replace(amount.toString(), '').trim();
        items.push({ name, amount });
      }
    }
  
    return {
      items,
      tax,
      discount,
      total,
      confidence: Math.min(1, items.length / 5),
    };
  }
  
  
  