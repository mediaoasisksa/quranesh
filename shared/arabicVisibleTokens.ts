export type ArabicToken = {
  raw: string;
  norm: string;
};

const ARABIC_DIACRITICS =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

const ARABIC_PUNCT =
  /[.,/#!$%^&*;:{}=\-_`~()«»"""'،؛؟[\]\\|<>]/g;

export function normalizeArabic(input: string): string {
  return input
    .replace(ARABIC_DIACRITICS, "")
    .replace(/\u0640/g, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(ARABIC_PUNCT, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractVisibleArabicTokens(displayedArabicText: string): ArabicToken[] {
  const cleaned = displayedArabicText
    .replace(ARABIC_PUNCT, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];

  const rawTokens = cleaned.split(" ").filter(Boolean);

  return rawTokens
    .map((raw) => ({
      raw,
      norm: normalizeArabic(raw),
    }))
    .filter((t) => t.norm.length > 0);
}

export function buildVisibleArabicSet(displayedArabicText: string): Set<string> {
  return new Set(extractVisibleArabicTokens(displayedArabicText).map((t) => t.norm));
}

export function isChoiceVisibleInDisplayedText(
  choice: string,
  displayedArabicText: string
): boolean {
  const visibleSet = buildVisibleArabicSet(displayedArabicText);
  return visibleSet.has(normalizeArabic(choice));
}

export function getUniqueVisibleChoices(displayedArabicText: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const token of extractVisibleArabicTokens(displayedArabicText)) {
    if (!seen.has(token.norm)) {
      seen.add(token.norm);
      out.push(token.raw);
    }
  }

  return out;
}
