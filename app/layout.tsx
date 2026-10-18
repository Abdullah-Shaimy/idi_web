import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import SecurityProvider from '../components/layout/SecurityProvider';
import AppChrome from '../components/layout/AppChrome';

export const metadata = {
  title: "Institute of Da'wa Islamiyya | Excellence in Hifz",
  description:
    'A peaceful and excellent Al Quran Hifz Madrasa. Nurturing hearts with the light of the Quran.',
  icons: {
    icon: '/assets/images/idi_logo.webp',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Serif+Tamil:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Mukta+Malar:wght@400;500;600;700;800&family=Arima+Madurai:wght@400;500;700;800;900&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="content-protected notranslate" data-sensitive-page="true">
        <LanguageProvider>
          <SecurityProvider>
            <AppChrome>{children}</AppChrome>
          </SecurityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
