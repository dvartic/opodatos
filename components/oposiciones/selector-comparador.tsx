"use client";

import { ChevronDownIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Button,
    Grid,
    GridItem,
    InputGroup,
    Select,
    Stack,
    VStack,
    IconButton,
    useColorModeValue,
    Text,
    Box,
    useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { OposicionesDataLatestYearReturnType } from "../../app/oposiciones/[slug]/page";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    slug: string | null;
    oposicionesDataLatestYear: OposicionesDataLatestYearReturnType;
}

export function SelectorComparador({ slug, oposicionesDataLatestYear }: Props) {
    // If slug null, initialize selectedOposicion state with a random oposicion
    const initialOposicion = slug
        ? slug
        : oposicionesDataLatestYear[
              Math.floor(Math.random() * oposicionesDataLatestYear.length)
          ].name;
    const [selectedOposicion, setSelectedOposicion] =
        useState(initialOposicion);

    // State for second possible card when user presses the "+" button. Initialize state with null (no card)
    const [secondOposicion, setSecondOposicion] = useState<string | null>(null);
    function handleAddRemoveOposicion() {
        if (!secondOposicion) {
            // Initialize secondOposicion state with a random oposicion except the one already selected in the first card
            const filteredSelectedOnFirstCard =
                oposicionesDataLatestYear.filter(
                    (oposicion) => oposicion.name !== selectedOposicion
                );
            const randomOposicionName =
                filteredSelectedOnFirstCard[
                    Math.floor(
                        Math.random() * filteredSelectedOnFirstCard.length
                    )
                ].name;
            setSecondOposicion(randomOposicionName);
        } else {
            setSecondOposicion(null);
        }
    }

    // Handle select and toast to show error if user attempts to select the same oposicion twice
    const toast = useToast();
    function handleSelectOposicion(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value, id } = e.target;
        if (id === "card-0") {
            if (value === secondOposicion) {
                toast({
                    title: "Error",
                    description:
                        "No puedes seleccionar la misma oposición dos veces",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                return;
            } else {
                setSelectedOposicion(value);
            }
        } else if (id === "card-1") {
            if (value === selectedOposicion) {
                toast({
                    title: "Error",
                    description:
                        "No puedes seleccionar la misma oposición dos veces",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                return;
            } else {
                setSecondOposicion(value);
            }
        }
    }

    // Return a array with both cards to display in order, index 0 is first card, index 1 is second card.
    const stateArr = [selectedOposicion, secondOposicion];
    const oposicionesCardsToDisplay = stateArr.map((oposicionName) => {
        return oposicionesDataLatestYear.find((oposicion) => {
            return oposicion.name === oposicionName;
        });
    });

    // Handle routing to oposicion pages and comparison page
    const router = useRouter();

    function handleAccederOposicion(e: React.MouseEvent<HTMLButtonElement>) {
        // Access button id from event
        const oposicionName = e.currentTarget.id;
        router.push(`/oposiciones/${oposicionName}`);
    }

    function handleAccederComparador() {
        router.push(`/oposiciones/${selectedOposicion}vs${secondOposicion}`);
    }

    // Color mode settings
    const bgColor = useColorModeValue("white", "gray.800");
    const itemBgColor = useColorModeValue("gray.50", "gray.700");
    const gridBorderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={4}
            mt={{ base: 14, sm: 16, md: 20, lg: 20 }}
            mb={{ base: 14, sm: 16, md: 20, lg: 20 }}
            maxW="90%"
            ml="auto"
            mr="auto"
            align="center"
            justify="center"
        >
            <VStack
                backgroundColor={bgColor}
                borderRadius="md"
                boxShadow="md"
                spacing={8}
                p={{ base: 4, sm: 6, md: 10 }}
            >
                <Stack
                    direction={{ base: "column", sm: "row" }}
                    align="center"
                    justify="center"
                    spacing={{ base: 4, sm: 6, md: 10 }}
                >
                    {oposicionesCardsToDisplay.map((oposicion, index) => {
                        if (oposicion) {
                            return (
                                <VStack key={index} spacing={5}>
                                    <InputGroup backgroundColor={itemBgColor}>
                                        <Select
                                            fontSize={{
                                                base: "xs",
                                                sm: "sm",
                                                md: "md",
                                            }}
                                            icon={<ChevronDownIcon />}
                                            value={oposicion.name}
                                            id={`card-${index}`}
                                            onChange={handleSelectOposicion}
                                        >
                                            {oposicionesDataLatestYear.map(
                                                (oposicionYear, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={
                                                                oposicionYear.name
                                                            }
                                                        >
                                                            {
                                                                oposicionYear.longName
                                                            }
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </InputGroup>
                                    <Grid
                                        w="100%"
                                        templateColumns="repeat(2, auto)"
                                        p={4}
                                        gridRowGap={3}
                                        gridColumnGap={10}
                                        justifyItems="start"
                                        alignItems="center"
                                        fontSize={{
                                            base: "xs",
                                            sm: "sm",
                                            md: "md",
                                        }}
                                        overflow="scroll"
                                        backgroundColor={itemBgColor}
                                        borderRadius="md"
                                        border="1px"
                                        borderColor={gridBorderColor}
                                    >
                                        <GridItem>Grupo</GridItem>
                                        <GridItem>
                                            {oposicion.grupo.grupo}
                                        </GridItem>
                                        <GridItem>Plazas</GridItem>
                                        <GridItem>
                                            {oposicion.numPlazas}
                                        </GridItem>
                                        <GridItem>Aspirantes</GridItem>
                                        <GridItem>
                                            {oposicion.numPresentados}
                                        </GridItem>
                                        <GridItem>Aspirantes/Plaza</GridItem>
                                        <GridItem>
                                            {oposicion.aspirantesPlaza
                                                ? oposicion.aspirantesPlaza.toFixed(
                                                      2
                                                  )
                                                : "N/A"}
                                        </GridItem>
                                        <GridItem>
                                            Experiencia Media Aprobados
                                        </GridItem>
                                        <GridItem>
                                            {oposicion.experienceAverage
                                                ? oposicion.experienceAverage.toFixed(
                                                      2
                                                  )
                                                : "N/A"}
                                        </GridItem>
                                    </Grid>
                                    <Box>
                                        <Text as="i" size="sm">
                                            Datos de últ. convocatoria en
                                            nuestra base de datos:{" "}
                                        </Text>
                                        <Text
                                            as="i"
                                            fontWeight="bold"
                                            size="sm"
                                        >
                                            {oposicion.year}
                                        </Text>
                                    </Box>
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        id={oposicion.name}
                                        onClick={handleAccederOposicion}
                                    >
                                        Accede a Oposición
                                    </Button>
                                </VStack>
                            );
                        }
                    })}
                </Stack>
                <Button
                    isDisabled={!secondOposicion}
                    colorScheme="green"
                    onClick={handleAccederComparador}
                >
                    Comparar Ahora
                </Button>
            </VStack>

            <IconButton
                aria-label="Añadir oposición para comparar"
                variant="ghost"
                size="lg"
                icon={secondOposicion === null ? <AddIcon /> : <MinusIcon />}
                onClick={handleAddRemoveOposicion}
            />
        </Stack>
    );
}
