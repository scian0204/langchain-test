import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'chat ui',
  description: 'chat with llama',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.css"
          integrity="sha512-n5zPz6LZB0QV1eraRj4OOxRbsV7a12eAGfFcrJ4bBFxxAwwYDp542z5M0w24tKPEhKk2QzjjIpR5hpOjJtGGoA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/hi098123/prism-for-tistory/prism.css"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
