// components/SafeHtml.tsx
'use client';

import sanitizeHtml from 'sanitize-html';

type SafeHtmlProps = {
  html: string;
};

export default function SafeHtml({ html }: SafeHtmlProps) {
  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'img']),
    allowedAttributes: {
      '*': ['style', 'class'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt'],
      span: ['style'],
    },
    allowedStyles: {
      '*': {
        // Allow all font-size units (including 'medium', etc.)
        'font-size': [/^.*$/],
        'color': [/^.*$/],
        'text-align': [/^.*$/],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
