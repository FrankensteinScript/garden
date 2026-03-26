import './global.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata = {
    title: 'Zahradka - Monitoring rostlin',
    description: 'Aplikace pro monitoring a správu vašich rostlin',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="cs">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
