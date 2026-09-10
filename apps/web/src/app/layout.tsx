import './globals.css'
import { LanguageProvider } from '../context/LanguageContext'

export const metadata = {
  title: 'VASUNDHARA - National Land Acquisition & Management System',
  description: 'National Land Acquisition & Management System under RFCTLARR Act, 2013',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
