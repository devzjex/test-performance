import './globals.scss';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import localFont from 'next/font/local';
import AppProvider from './AppProvider';
import Script from 'next/script';
import UserIdClarity from './UserIdClarity';

const myFont = localFont({
  src: './Roboto.ttf',
  variable: '--font-roboto',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <head>
        <meta name="msvalidate.01" content="E3A35D39D5ED6402C9DFEA7C906925EC" />
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PQMXQ54L');
            `,
          }}
        />
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-16742733927" />
        <Script
          id="ga-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16742733927');
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ongl9bmim3");
            `,
          }}
        />
        <UserIdClarity />
      </head>
      <body>
        <AntdRegistry>
          <AppProvider>{children}</AppProvider>
        </AntdRegistry>

        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                window.$crisp = [];
                window.CRISP_WEBSITE_ID = 'e6fb67aa-d67d-46a4-8305-1c4b23d16979';

                (function () {
                    const d = document;
                    const s = d.createElement('script');
                    s.src = 'https://client.crisp.chat/l.js';
                    s.async = 1;
                    d.getElementsByTagName('head')[0].appendChild(s);
                })();
                `,
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W3WPY2DK7L" strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-W3WPY2DK7L');
                `,
          }}
        />

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PQMXQ54L"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}
