import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
    styles: {
        global: (props: any) => ({
            body: {
                bg: mode(null, "gray.900")(props),
                bgGradient: mode(
                    "linear(to-b, gray.200, white, gray.100)",
                    null
                )(props),
            },
        }),
    },
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    }
});

export default theme;
