"use client";

import {
    Box,
    Wrap,
    WrapItem,
    LinkBox,
    LinkOverlay,
    useMediaQuery,
    useColorModeValue,
    Text,
    Grid,
    GridItem,
    Heading,
    VStack,
    Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";

interface Props {
    tablesData: {
        latestOposicionLong: oposicionListLatest;
        leastCompetitionOposicionesOrder: oposicionListCompetition;
    };
}

type oposicionListLatest = {
    longName: string;
    year: number;
    grupo: { grupo: string };
    [key: string]: any;
}[];

type oposicionListCompetition = {
    longName: string;
    presentadosPlaza: number;
    grupo: { grupo: string };
    [key: string]: any;
}[];

export function OposicionesPreview({ tablesData }: Props) {
    // Detects wether the device supports hover or not through a media query, and executes a simple logic to assign different properties.
    const [isHoverNotSupported] = useMediaQuery("(hover: none)");
    const hover = () =>
        isHoverNotSupported
            ? { background: "inherit" }
            : { background: "blue.100" };

    const bgColor = useColorModeValue("white", "gray.700");
    const subtitleColor = useColorModeValue("gray.700", "gray.500");
    const tableHeaderColor = useColorModeValue("gray.600", "gray.300");

    function getGridRows(arr: any[]) {
        function progression(base: number, d: number) {
            return base + (base + d);
        }
        return progression(arr.length, 1);
    }

    const latestGridRows = getGridRows(tablesData.latestOposicionLong);
    const leastCompetitionGridRows = getGridRows(
        tablesData.leastCompetitionOposicionesOrder
    );

    return (
        <Box mt={12} mb={12} w="90%" ml="auto" mr="auto">
            <Wrap spacing={8} align="top" justify="center">
                <WrapItem>
                    <VStack spacing={3} align="center" w="100%" pt={2} pb={2}>
                        <Box>
                            <Heading as="h2" textAlign="center" fontSize="2xl">
                                ÚLTIMAS CONVOCATORIAS
                            </Heading>
                            <Text
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="normal"
                                color={subtitleColor}
                            >
                                De oposiciones incluidas en nuestra base de
                                datos
                            </Text>
                        </Box>
                        <Grid
                            templateColumns="auto"
                            templateRows={`repeat(${latestGridRows}, auto)`}
                            rowGap={{ base: 1, sm: 2 }}
                            borderRadius="md"
                            boxShadow="md"
                            backgroundColor={bgColor}
                            p={4}
                        >
                            <GridItem alignSelf="center">
                                <Grid
                                    templateColumns="2fr 1fr 2fr"
                                    columnGap={1}
                                >
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="center"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            OFERTA EMPLEO PÚBLICO
                                        </Text>
                                    </GridItem>
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="center"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            GRUPO
                                        </Text>
                                    </GridItem>
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="right"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            OPOSICIÓN
                                        </Text>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                            <GridItem alignSelf="center">
                                <Divider />
                            </GridItem>
                            {tablesData.latestOposicionLong.map(
                                (el, index, arr) => {
                                    function arithmeticProgression(d: number) {
                                        return index + (d + d * index);
                                    }
                                    const baseKey = arithmeticProgression(1);

                                    const gridArray = [
                                        <GridItem key={baseKey - 1}>
                                            <LinkBox
                                                rounded="md"
                                                _hover={hover()}
                                                p={1}
                                            >
                                                <Grid
                                                    templateColumns="2fr 1fr 2fr"
                                                    columnGap={1}
                                                >
                                                    <GridItem alignSelf="center">
                                                        <Text
                                                            textAlign="center"
                                                            fontSize={{
                                                                base: "xs",
                                                                sm: "sm",
                                                            }}
                                                        >
                                                            {el.year}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem alignSelf="center">
                                                        <Text
                                                            textAlign="center"
                                                            fontSize={{
                                                                base: "xs",
                                                                sm: "sm",
                                                            }}
                                                        >
                                                            {el.grupo.grupo}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem alignSelf="center">
                                                        <LinkOverlay as={NextLink} href="#">
                                                            <Text
                                                                textAlign="right"
                                                                fontSize={{
                                                                    base: "xs",
                                                                    sm: "sm",
                                                                }}
                                                            >
                                                                {el.longName}
                                                            </Text>
                                                        </LinkOverlay>
                                                    </GridItem>
                                                </Grid>
                                            </LinkBox>
                                        </GridItem>,
                                    ];

                                    if (index !== arr.length - 1) {
                                        gridArray.push(
                                            <GridItem
                                                key={baseKey}
                                                alignSelf="center"
                                            >
                                                <Divider />
                                            </GridItem>
                                        );
                                    }

                                    return gridArray;
                                }
                            )}
                        </Grid>
                    </VStack>
                </WrapItem>
                <WrapItem>
                    <VStack spacing={3} align="center" w="100%" pt={2} pb={2}>
                        <Box>
                            <Heading as="h2" textAlign="center" fontSize="2xl">
                                MENOR COMPETENCIA
                            </Heading>
                            <Text
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="normal"
                                color={subtitleColor}
                            >
                                Último proceso de selección iniciado
                            </Text>
                        </Box>
                        <Grid
                            templateColumns="auto"
                            templateRows={`repeat(${leastCompetitionGridRows}, auto)`}
                            rowGap={{ base: 1, sm: 2 }}
                            borderRadius="md"
                            boxShadow="md"
                            backgroundColor={bgColor}
                            p={4}
                        >
                            <GridItem alignSelf="center">
                                <Grid
                                    templateColumns="2fr 1fr 2fr"
                                    columnGap={1}
                                >
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="center"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            ASPIRANTES/PLAZAS
                                        </Text>
                                    </GridItem>
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="center"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            GRUPO
                                        </Text>
                                    </GridItem>
                                    <GridItem alignSelf="center">
                                        <Text
                                            textAlign="right"
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            fontWeight="bold"
                                            color={tableHeaderColor}
                                        >
                                            OPOSICIÓN
                                        </Text>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                            <GridItem alignSelf="center">
                                <Divider />
                            </GridItem>
                            {tablesData.leastCompetitionOposicionesOrder.map(
                                (el, index, arr) => {
                                    function arithmeticProgression(d: number) {
                                        return index + (d + d * index);
                                    }
                                    const baseKey = arithmeticProgression(1);

                                    const gridArray = [
                                        <GridItem key={baseKey - 1}>
                                            <LinkBox
                                                rounded="md"
                                                _hover={hover()}
                                                p={1}
                                            >
                                                <Grid
                                                    templateColumns="2fr 1fr 2fr"
                                                    columnGap={1}
                                                >
                                                    <GridItem alignSelf="center">
                                                        <Text
                                                            textAlign="center"
                                                            fontSize={{
                                                                base: "xs",
                                                                sm: "sm",
                                                            }}
                                                        >
                                                            {el.presentadosPlaza.toFixed(
                                                                1
                                                            )}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem alignSelf="center">
                                                        <Text
                                                            textAlign="center"
                                                            fontSize={{
                                                                base: "xs",
                                                                sm: "sm",
                                                            }}
                                                        >
                                                            {el.grupo.grupo}
                                                        </Text>
                                                    </GridItem>
                                                    <GridItem alignSelf="center">
                                                        <LinkOverlay as={NextLink} href="#">
                                                            <Text
                                                                textAlign="right"
                                                                fontSize={{
                                                                    base: "xs",
                                                                    sm: "sm",
                                                                }}
                                                            >
                                                                {el.longName}
                                                            </Text>
                                                        </LinkOverlay>
                                                    </GridItem>
                                                </Grid>
                                            </LinkBox>
                                        </GridItem>,
                                    ];

                                    if (index !== arr.length - 1) {
                                        gridArray.push(
                                            <GridItem
                                                key={baseKey}
                                                alignSelf="center"
                                            >
                                                <Divider />
                                            </GridItem>
                                        );
                                    }

                                    return gridArray;
                                }
                            )}
                        </Grid>
                    </VStack>
                </WrapItem>
            </Wrap>
        </Box>
    );
}
