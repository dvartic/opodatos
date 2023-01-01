"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { FooterInViewProvider } from "./FooterInViewContext";
import theme from "../src/theme/theme";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <FooterInViewProvider>{children}</FooterInViewProvider>
            </ChakraProvider>
        </>
    );
}
