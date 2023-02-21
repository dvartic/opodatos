import { Providers } from "./providers";

export default function OposicionesLayout({children}: {children: React.ReactNode}) {
    return (
        <Providers>
            {children}
        </Providers>
    )
}