import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'পথিক (Pothik) - বাংলাদেশের সর্বাধুনিক ট্যুরিজম প্ল্যাটফর্ম',
  description:
    'বাংলাদেশের ৬৪ জেলার প্রতিটি আকর্ষণীয় পর্যটন স্পট, প্রিমিয়াম রিসোর্ট বুকিং ও ভেরিফাইড ট্যুর গাইড সেবা। Discover Bangladesh like never before.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pothik-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
