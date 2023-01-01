"use client";
import {
    Flex,
    Heading,
    HStack,
    Link,
    IconButton,
    Box,
    Menu,
    MenuList,
    MenuButton,
    MenuItem,
    useColorMode,
    useColorModeValue,
    useMediaQuery,
} from "@chakra-ui/react";
import { MoonIcon, HamburgerIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
    // Chakra implementation for dark/light theme. The returned toggleColorMode is then used in a button to change the theme. The colorMode variable stores the current theme as 'light' or 'dark', and can be used to change other parts of the UI.
    const { colorMode, toggleColorMode } = useColorMode();

    // Sets different color variables depending on if the page is in dark or light mode. These variables are then used to set color in components.
    const bg = useColorModeValue("gray.50", "black");
    // const svgColor = useColorModeValue("black", "white");
    const svgBg = useColorModeValue("gray.300", "gray.700");
    const activeRouteColorLink = useColorModeValue("green.900", "green.500");
    const activeColorLink = useColorModeValue("green.700", "green.200");
    const hoverColor = useColorModeValue("green.600", "green.100");

    // Detects wether the device supports hover or not through a media query, and executes a simple logic to assign a different text-decoration property.
    const [isHoverNotSupported] = useMediaQuery("(hover: none)");
    const hover = () =>
        isHoverNotSupported
            ? { textDecoration: "none" }
            : { color: hoverColor };

    const hoverLogo = () =>
        isHoverNotSupported
            ? { textDecoration: "none" }
            : { textDecoration: "underline" };

    // Detects the current route and stores a different value in the variables, which is then used to change Link navigation colors
    const pathname = usePathname();
    const isLink1Active = pathname.includes("/blog");
    const isLink2Active = pathname.includes("/contact");
    const link1Color = isLink1Active ? activeRouteColorLink : "inherit";
    const link2Color = isLink2Active ? activeRouteColorLink : "inherit";

    return (
        <header>
            <Box
                backgroundColor={bg}
                boxShadow="xl"
                overflow="visible"
                zIndex={2}
                position="relative"
            >
                <Flex
                    justifyContent="space-between"
                    w="90%"
                    maxWidth="1400px"
                    ml="auto"
                    mr="auto"
                    h={20}
                    alignItems="center"
                >
                    <Link href="/" as={NextLink} _hover={hoverLogo()}>
                        <Heading
                            as="h1"
                            display="flex"
                            alignItems="center"
                            size="xl"
                        >
                            <Box as="span">Opo</Box>
                            <Box as="span" color="green.700">
                                Datos
                            </Box>
                            <Box
                                as="sup"
                                fontSize="sm"
                                fontWeight="normal"
                            >
                                <Box as="i">beta</Box>
                            </Box>
                        </Heading>
                    </Link>

                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        w={["52%"]}
                        fontSize={["lg", "lg", "xl"]}
                        fontWeight="bold"
                        display={{
                            base: "none",
                            sm: "none",
                            md: "flex",
                            lg: "flex",
                            xl: "flex",
                            "2xl": "flex",
                        }}
                    >
                        <Link
                            href="/buscador"
                            as={NextLink}
                            display="flex"
                            alignItems="center"
                            color={link1Color}
                            _hover={hover()}
                            _active={{ color: activeColorLink }}
                        >
                            Buscador
                        </Link>
                        <Link
                            href="/"
                            as={NextLink}
                            display="flex"
                            alignItems="center"
                            color={link2Color}
                            _hover={hover()}
                            _active={{ color: activeColorLink }}
                        >
                            Comparador
                        </Link>
                        <Box paddingBottom={1.5}>
                            <IconButton
                                aria-label="Change Color Theme"
                                backgroundColor={svgBg}
                                icon={
                                    colorMode === "light" ? (
                                        <MoonIcon />
                                    ) : (
                                        <SunIcon />
                                    )
                                }
                                onClick={toggleColorMode}
                            />
                        </Box>
                    </Flex>
                    <Box
                        display={{
                            base: "block",
                            sm: "block",
                            md: "none",
                            lg: "none",
                            xl: "none",
                            "2xl": "none",
                        }}
                    >
                        <HStack fontSize={["lg", "lg", "xl"]}>
                            <Box paddingBottom={1.5}>
                                <IconButton
                                    aria-label="Change Color Theme"
                                    icon={
                                        colorMode === "light" ? (
                                            <MoonIcon />
                                        ) : (
                                            <SunIcon />
                                        )
                                    }
                                    onClick={toggleColorMode}
                                />
                            </Box>
                            <Menu>
                                <MenuButton
                                    position="relative"
                                    bottom={1}
                                    as={IconButton}
                                    aria-label="Options"
                                    icon={<HamburgerIcon />}
                                    variant="outline"
                                />
                                <MenuList>
                                    <MenuItem href="/buscador" as={NextLink}>
                                        Buscador
                                    </MenuItem>
                                    <MenuItem href="/" as={NextLink}>
                                        Comparador
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>
                    </Box>
                </Flex>
            </Box>
        </header>
    );
}
