// URLs must remain stable if the taxonomy order changes. FNV-1a yields a short,
// deterministic ASCII token from the reader-facing Arabic subtopic label.
export function topicSectionSlug(label: string): string {
  let hash = 2166136261;
  for (const char of label) {
    hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619);
  }
  return "s-" + (hash >>> 0).toString(36);
}

export function topicSectionFromSlug(subtopics: readonly string[], slug: string): string | undefined {
  return subtopics.find(section => topicSectionSlug(section) === slug);
}
