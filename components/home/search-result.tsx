"use client";

import {
    Box,
    Text,
    Flex,
    LinkBox,
    LinkOverlay,
    useMediaQuery,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdQueryStats } from "react-icons/md";
import NextLink from "next/link";

interface Props {
    filteredOposiciones: {
        longName: string;
        name: string;
        grupo: { grupo: string };
    }[];
}

export function SearchResult({ filteredOposiciones }: Props) {
    // Detects wether the device supports hover or not through a media query, and executes a simple logic with memoized value to assign a different text-decoration property.
    const [isHoverNotSupported] = useMediaQuery("(hover: none)");
    const hover = () =>
        isHoverNotSupported
            ? { background: "inherit" }
            : { background: "blue.100" };

    const bg = useColorModeValue("white", "gray.700");
    const resultTextColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Box position="absolute" w="100%" bg={bg} borderRadius="md" mt={1}>
            {filteredOposiciones.map((el, index) => {
                return (
                    <LinkBox
                        p={1}
                        m={2}
                        borderRadius="md"
                        key={index}
                        _hover={hover()}
                        _active={{
                            background: "blue.200",
                        }}
                    >
                        <Box>
                            <Flex justifyContent="space-between">
                                <Stack
                                    direction={{ base: "column", sm: "row" }}
                                    align="center"
                                    spacing={{ base: 0, sm: 1.5 }}
                                >
                                    <Text
                                        display="inline-block"
                                        fontSize={{
                                            base: "xs",
                                            sm: "md",
                                            md: "sm",
                                        }}
                                        mr={2}
                                    >
                                        {el.grupo.grupo}
                                    </Text>
                                    <LinkOverlay
                                        as={NextLink}
                                        href="/"
                                        textAlign="left"
                                        display="inline-block"
                                        fontSize={{
                                            base: "sm",
                                            sm: "md",
                                            md: "md",
                                        }}
                                    >
                                        {el.longName}
                                    </LinkOverlay>
                                </Stack>
                                <Stack
                                    ml={2}
                                    direction={{
                                        base: "column-reverse",
                                        sm: "row",
                                    }}
                                    align="center"
                                    spacing={{ base: 0, sm: 1.5 }}
                                >
                                    <Text
                                        display="inline-block"
                                        fontWeight="bold"
                                        fontSize={{
                                            base: "xs",
                                            sm: "sm",
                                            md: "sm",
                                        }}
                                        color={resultTextColor}
                                    >
                                        Análisis estadístico
                                    </Text>
                                    <Box
                                        as="span"
                                        display="inline-block"
                                        verticalAlign="top"
                                        ml={2}
                                    >
                                        <MdQueryStats size={20} />
                                    </Box>
                                </Stack>
                            </Flex>
                        </Box>
                    </LinkBox>
                );
            })}
        </Box>
    );
}
