"use client";

import {
    Text,
    Box,
    Flex,
    useColorModeValue,
    useMediaQuery,
    Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useFooterIsInViewUpdate } from "../app/FooterInViewContext";

export function Footer() {
    // Detect if footer is in view and set value to Context for use in other components. Value needs to be set using useEffect to make sure the Context update happens at the right time
    const { ref, inView } = useInView({
        /* Options */
        threshold: 0.2,
    });
    const setFooterIsInView = useFooterIsInViewUpdate();
    useEffect(() => {
        setFooterIsInView(inView);
    }, [inView, setFooterIsInView]);

    // Sets different color variables depending on if the page is in dark or light mode. These variables are then used to set color in components.
    const bg = useColorModeValue("green.50", "gray.800");
    const linkColor = useColorModeValue("gray.700", "gray.300");
    const activeRouteColorLink = useColorModeValue("green.600", "green.400");
    const activeColorLink = useColorModeValue("green.700", "green.100");

    // Detects wether the device supports hover or not through a media query, and executes a simple logic to assign a different text-decoration property.
    const [isHoverNotSupported] = useMediaQuery("(hover: none)");
    const hover = () =>
        isHoverNotSupported
            ? { textDecoration: "none" }
            : { textDecoration: "underline" };

    // Detects the current route and stores a different value in the variables, which is then used to change Link navigation colors
    const pathname = usePathname();
    const isLink1Active = pathname?.includes("/blog");
    const isLink2Active = pathname?.includes("/contact");
    const link1Color = isLink1Active ? activeRouteColorLink : linkColor;
    const link2Color = isLink2Active ? activeRouteColorLink : linkColor;

    return (
        <footer ref={ref}>
            <Box w="100%" backgroundColor={bg} pt={6} pb={6}>
                <Flex
                    w="90%"
                    maxWidth="1400px"
                    justifyContent="space-between"
                    ml="auto"
                    mr="auto"
                    alignItems="center"
                    direction={{
                        base: "column",
                        sm: "column",
                        md: "row",
                        lg: "row",
                    }}
                >
                    <Box
                        w={{ base: "60%", sm: "50%", md: "40%", lg: "40%" }}
                        mb={3}
                    >
                        <Text
                            mb={1}
                            fontSize="2xl"
                            fontWeight="bold"
                            textAlign={{
                                base: "center",
                                sm: "center",
                                md: "left",
                                lg: "left",
                            }}
                        >
                            <Box as="span">Opo</Box>
                            <Box as="span" color="green.700">
                                Datos
                            </Box>
                        </Text>
                        <Text
                            fontSize="xs"
                            textAlign={{
                                base: "center",
                                sm: "center",
                                md: "left",
                                lg: "left",
                            }}
                        >
                            OpoDatos el principal portal estadístico y de datos
                            sobre oposiciones en España, pensado para ayudar a
                            los opositores a tomar decisiones informadas y
                            ayudarles en su preparación de oposiciones.
                        </Text>
                    </Box>
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        w={{ base: "50%", sm: "50%", md: "50%", lg: "40%" }}
                        fontSize={["xs", "xs", "sm"]}
                        fontWeight="bold"
                        direction={{
                            base: "column",
                            sm: "column",
                            md: "row",
                            lg: "row",
                        }}
                        mt={3}
                    >
                        <Link
                            as={NextLink}
                            href={"/"}
                            mb={1.5}
                            display="flex"
                            alignItems="center"
                            color={link1Color}
                            _hover={hover()}
                            _active={{ color: activeColorLink }}
                        >
                            Acerca de Nosotros
                        </Link>
                        <Link
                            as={NextLink}
                            href={"/"}
                            display="flex"
                            alignItems="center"
                            color={link2Color}
                            _hover={hover()}
                            _active={{ color: activeColorLink }}
                            mb={1.5}
                        >
                            Contacto
                        </Link>
                        <Link
                            as={NextLink}
                            href={"/"}
                            display="flex"
                            alignItems="center"
                            color={link2Color}
                            _hover={hover()}
                            _active={{ color: activeColorLink }}
                        >
                            Información Legal
                        </Link>
                    </Flex>
                </Flex>
            </Box>
        </footer>
    );
}
