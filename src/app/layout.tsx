import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'chat ui',
  description: 'chat with llama',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
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
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css"
          integrity="sha512-h/laqMqQKUXxFuu6aLAaSrXYwGYQ7qk4aYCQ+KJwHZMzAGaEoxMM6h8C+haeJTU1V6E9jrSUnjpEzX23OmV/Aw=="
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
