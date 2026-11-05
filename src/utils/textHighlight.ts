/**
 * Normalizes text for matching by collapsing whitespace and line breaks
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Checks if the exact quote is present in the source text.
 * Returns an object with match status, index, and confidence score.
 */
export function verifyQuoteMatch(
  sourceText: string,
  exactQuote: string
): {
  isVerbatim: boolean;
  isNormalizedMatch: boolean;
  matchIndex: number;
  confidence: number;
} {
  if (!sourceText || !exactQuote) {
    return { isVerbatim: false, isNormalizedMatch: false, matchIndex: -1, confidence: 0 };
  }

  // 1. Direct verbatim match
  const verbatimIndex = sourceText.indexOf(exactQuote);
  if (verbatimIndex !== -1) {
    return {
      isVerbatim: true,
      isNormalizedMatch: true,
      matchIndex: verbatimIndex,
      confidence: 100,
    };
  }

  // 2. Case-insensitive verbatim match
  const lowerIndex = sourceText.toLowerCase().indexOf(exactQuote.toLowerCase());
  if (lowerIndex !== -1) {
    return {
      isVerbatim: false,
      isNormalizedMatch: true,
      matchIndex: lowerIndex,
      confidence: 95,
    };
  }

  // 3. Normalized whitespace match
  const normSource = normalizeText(sourceText);
  const normQuote = normalizeText(exactQuote);
  const normIndex = normSource.indexOf(normQuote);
  if (normIndex !== -1) {
    return {
      isVerbatim: false,
      isNormalizedMatch: true,
      matchIndex: normIndex,
      confidence: 90,
    };
  }

  // 4. Substring prefix match (first 40 characters)
  const shortQuote = normQuote.slice(0, 40);
  if (shortQuote.length >= 15 && normSource.includes(shortQuote)) {
    return {
      isVerbatim: false,
      isNormalizedMatch: false,
      matchIndex: normSource.indexOf(shortQuote),
      confidence: 75,
    };
  }

  return {
    isVerbatim: false,
    isNormalizedMatch: false,
    matchIndex: -1,
    confidence: 0,
  };
}

export interface PageSection {
  pageNumber: number;
  pageHeader: string;
  content: string;
}

/**
 * Parses multi-page notice text by recognizing common page delimiters.
 */
export function parsePages(text: string): PageSection[] {
  if (!text) return [];

  // Match separators like "=== Page X ===" or "--- Page X ---" or "[Page X]"
  const pageRegex = /(?:^|\n)(?:===+\s*Page\s*(\d+)\s*===+|---+\s*Page\s*(\d+)\s*---+|\[Page\s*(\d+)\])/gi;

  const matches = [...text.matchAll(pageRegex)];

  if (matches.length === 0) {
    return [
      {
        pageNumber: 1,
        pageHeader: 'Page 1 (Complete Notice)',
        content: text.trim(),
      },
    ];
  }

  const sections: PageSection[] = [];

  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const pageNum = parseInt(
      currentMatch[1] || currentMatch[2] || currentMatch[3] || `${i + 1}`,
      10
    );
    const startIdx = (currentMatch.index ?? 0) + currentMatch[0].length;
    const endIdx =
      i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;

    const pageContent = text.slice(startIdx, endIdx).trim();

    sections.push({
      pageNumber: pageNum,
      pageHeader: `Page ${pageNum}`,
      content: pageContent,
    });
  }

  return sections;
}
