"use client";

import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

export function Banner() {
    const bg = useColorModeValue("green.50", "gray.800");

    return (
        <Box w="100%" pt={14} pb={14} backgroundColor={bg}>
            <Heading textAlign="center">Análisis de datos</Heading>
        </Box>
    );
}
