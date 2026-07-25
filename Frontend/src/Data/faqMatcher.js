import { faqEntries } from "./mockData";

export function findFaqAnswer(question, language = "en") {
  const lower = question.toLowerCase();

  for (const entry of faqEntries) {
    if (entry.id === "fallback") continue;

    const matched = entry.keywords.some(
      (keyword) => lower.includes(keyword.toLowerCase())
    );

    if (matched) {
      return entry[language]?.a || entry.en.a;
    }
  }

  return null;
}
