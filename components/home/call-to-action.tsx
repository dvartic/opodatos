"use client";

import {
    Heading,
    Button,
    VStack,
    Box,
    Text,
    List,
    ListIcon,
    ListItem,
    useColorModeValue,
    Stack,
    StackDivider,
} from "@chakra-ui/react";
import { SearchIcon, CheckIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { StatsSearchIcon } from "../icons/stats-search";
import { StatsCompareIcon } from "../icons/stats-compare";
import { StatsAnalysisIcon } from "../icons/stats-analysis";
import { FaColumns } from "react-icons/fa";
import NextLink from "next/link";

export function CallToAction() {
    const iconColor = useColorModeValue("green.800", "green.400");
    const dividerColor = useColorModeValue("gray.700", "gray.300");
    const buttonBg = useColorModeValue("green.500", "green.400");
    return (
        <VStack
            w={{ base: "90%", sm: "90%", md: "90%", lg: "90%" }}
            maxW="1100px"
            ml="auto"
            mr="auto"
            mt={20}
            spacing={12}
            mb={20}
            divider={<StackDivider borderColor={dividerColor} />}
        >
            <Box w="100%">
                <Stack
                    direction={{ base: "column", sm: "column", md: "row" }}
                    align="center"
                    spacing={{ base: 5, sm: 5, md: 12 }}
                    w="100%"
                >
                    <VStack
                        spacing={5}
                        align="start"
                        w={{ base: "100%", sm: "100%", md: "70%" }}
                    >
                        <Box>
                            <Heading as="h2">Explora</Heading>
                            <Text>
                                Encuentra oposiciones inmediatamente y ordena en
                                base a las principales métricas
                            </Text>
                        </Box>
                        <Button
                            as={NextLink}
                            href="#"
                            colorScheme="green"
                            bg={buttonBg}
                            rightIcon={<SearchIcon />}
                        >
                            Accede al Buscador
                        </Button>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold">
                                CARACTERÍSTICAS
                            </Text>
                            <List spacing={1} mt={2}>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Resultados inmediatos
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Filtros avanzados
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Plazas, aspirantes, ratios y experiencia de
                                    opositores
                                </ListItem>
                            </List>
                        </Box>
                    </VStack>
                    <StatsSearchIcon
                        w={{ base: "20%", sm: "20%", md: "30%" }}
                        h="100%"
                        color={iconColor}
                    />
                </Stack>
            </Box>
            <Box w="100%">
                <Stack
                    direction={{
                        base: "column",
                        sm: "column",
                        md: "row-reverse",
                    }}
                    align="center"
                    spacing={{ base: 5, sm: 5, md: 12 }}
                    w="100%"
                >
                    <VStack
                        spacing={5}
                        align="start"
                        w={{ base: "100%", sm: "100%", md: "70%" }}
                    >
                        <Heading as="h2">Compara</Heading>
                        <Text>
                            Compara oposiciones en detalle y determina la que
                            mejor se adapta a tus objetivos
                        </Text>
                        <Button
                            as={NextLink}
                            href="#"
                            colorScheme="green"
                            bg={buttonBg}
                            rightIcon={<FaColumns />}
                        >
                            Accede al Comparador
                        </Button>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold">
                                CARACTERÍSTICAS
                            </Text>
                            <List spacing={1} mt={2}>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Comparativa detallada
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Datos precisos y agregados
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Gráficos interactivos
                                </ListItem>
                            </List>
                        </Box>
                    </VStack>
                    <StatsCompareIcon
                        w={{ base: "20%", sm: "20%", md: "30%" }}
                        h="100%"
                        color={iconColor}
                    />
                </Stack>
            </Box>
            <Box w="100%">
                <Stack
                    direction={{ base: "column", sm: "column", md: "row" }}
                    align="center"
                    spacing={{ base: 5, sm: 5, md: 12 }}
                    w="100%"
                >
                    <VStack
                        spacing={5}
                        align="start"
                        w={{ base: "100%", sm: "100%", md: "70%" }}
                    >
                        <Heading as="h2">Analiza</Heading>
                        <Text>
                            Ve directo a tu oposición para acceder a análisis en
                            máximo detalle así como datos de la convocatoria en
                            curso
                        </Text>
                        <Button
                            as={NextLink}
                            href="#"
                            colorScheme="green"
                            rightIcon={<ArrowForwardIcon />}
                            bg={buttonBg}
                        >
                            Accede a tu Oposición
                        </Button>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold">
                                CARACTERÍSTICAS
                            </Text>
                            <List spacing={1} mt={2}>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Datos de múltiples años
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Todas las estadísticas disponibles
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckIcon} color="blue.600" />
                                    Datos actualizados de convocatorias en curso
                                </ListItem>
                            </List>
                        </Box>
                    </VStack>
                    <StatsAnalysisIcon
                        w={{ base: "20%", sm: "20%", md: "30%" }}
                        h="100%"
                        color={iconColor}
                    />
                </Stack>
            </Box>
        </VStack>
    );
}
