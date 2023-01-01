import { Providers } from "./providers";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>Next.js</title>
            </head>
            <body>
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
