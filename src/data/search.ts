/** Explicit search allowlist. Public access does not imply indexability. */
export const publicPages = [
  { path: '/', lang: 'en' },
  { path: '/resume/en/', lang: 'en' },
  { path: '/resume/zh/', lang: 'zh' },
] as const;

// The homepage is not a translation of a resume. Only these two are alternates.
export const resumeAlternates = [
  { lang: 'en', path: '/resume/en/' },
  { lang: 'zh', path: '/resume/zh/' },
  { lang: 'x-default', path: '/resume/en/' },
] as const;
