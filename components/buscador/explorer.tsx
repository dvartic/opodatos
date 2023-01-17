"use client";

import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    HStack,
    IconButton,
    InputGroup,
    Link,
    Select,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
    VStack,
} from "@chakra-ui/react";
import React, { useMemo, useRef, useState } from "react";
import { SearchBox } from "./search-box";
import { FaColumns } from "react-icons/fa";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FaSlidersH } from "react-icons/fa";
import { useFooterIsInView } from "../../app/FooterInViewContext";
import { OposicionProps } from "../../app/buscador/page";
import { Filters } from "./filters";
import { normalizeStr } from "../../server/utils/utils";
import NextLink from "next/link";

export function Explorer({ oposiciones }: OposicionProps) {
    // Search state and handlers. The parent holds a state that gets set by the child after the user stops writing.
    const [searchStrParent, setSearchStrParent] = useState("");
    function updateSearchStrParent(searchStr: string) {
        setSearchStrParent(searchStr);
    }

    // Selected Convocatoria State and handlers
    const years = Object.keys(oposiciones).reverse();
    const lastConvocatoria = years[0];
    const [selectedConvocatoria, setSelectedConvocatoria] =
        useState(lastConvocatoria);
    function handleConvocatoriaChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedConvocatoria(e.target.value);
    }

    // Selected Oposicion State and handlers
    const [selectedOposiciones, setSelectedOposiciones] = useState(
        [] as string[]
    );
    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedOposiciones((prevCheckedItems) => [
                ...prevCheckedItems,
                value,
            ]);
        } else {
            setSelectedOposiciones((prevCheckedItems) =>
                prevCheckedItems.filter((item) => item !== value)
            );
        }
    }
    function handleClearSelection() {
        setSelectedOposiciones([]);
    }

    // Sort state and handlers
    const [sortBy, setSortBy] = useState("grupo");
    const [sortOrder, setSortOrder] = useState("asc");
    function handleClickSortBy(
        e: React.MouseEvent<HTMLButtonElement> &
            React.MouseEvent<HTMLDivElement>
    ) {
        const { value } = e.currentTarget;
        if (value === sortBy) {
            setSortOrder((prevSortOrder) => {
                if (prevSortOrder === "asc") {
                    return "desc";
                } else {
                    return "asc";
                }
            });
        } else {
            setSortBy(value);
            setSortOrder("asc");
        }
    }

    // Perform filter, sorting and seach on oposiciones based on states
    const oposicionesByConvocatoria = oposiciones[Number(selectedConvocatoria)];

    // Perform search based on searchStrParent
    const oposicionesNamesSearch = Object.keys(
        oposicionesByConvocatoria
    ).filter((name) => {
        const oposicionLongName = oposicionesByConvocatoria[name].longName;
        return normalizeStr(oposicionLongName).includes(
            normalizeStr(searchStrParent)
        );
    });
    const oposicionesByConvocatoriaAndSearch = oposicionesNamesSearch.reduce(
        (acc, name) => {
            acc[name] = oposicionesByConvocatoria[name];
            return acc;
        },
        {} as typeof oposicionesByConvocatoria
    );

    /* Calculate filter values for display in filter component and initialize filter state
    Initialize filter state based on this initial values. This state will be updated by child component using the handlers.
    Based on this filter state, perform filtering for display
    */
    const filterValues = useMemo(() => {
        const grupoArr = Object.keys(oposicionesByConvocatoriaAndSearch).map(
            (name) => {
                return oposicionesByConvocatoriaAndSearch[name].grupo.grupo;
            }
        );
        const plazasArr = Object.keys(oposicionesByConvocatoriaAndSearch).map(
            (name) => {
                return oposicionesByConvocatoriaAndSearch[name].numPlazas;
            }
        );
        const aspirantesArr = Object.keys(
            oposicionesByConvocatoriaAndSearch
        ).map((name) => {
            if (oposicionesByConvocatoriaAndSearch[name].numPresentados) {
                return oposicionesByConvocatoriaAndSearch[name]
                    .numPresentados as number;
            } else {
                return 0;
            }
        });
        const aspirantesPlazaArr = Object.keys(
            oposicionesByConvocatoriaAndSearch
        ).map((name) => {
            if (oposicionesByConvocatoriaAndSearch[name].numPresentados) {
                return (
                    (oposicionesByConvocatoriaAndSearch[name]
                        .numPresentados as number) /
                    oposicionesByConvocatoriaAndSearch[name].numPlazas
                );
            } else {
                return 0;
            }
        });
        const experienceAverageArr = Object.keys(
            oposicionesByConvocatoriaAndSearch
        ).map((name) => {
            if (oposicionesByConvocatoriaAndSearch[name].experienceAverage) {
                return oposicionesByConvocatoriaAndSearch[name]
                    .experienceAverage as number;
            } else {
                return 0;
            }
        });
        return {
            grupos: [...new Set(grupoArr)].sort((a, b) => {
                const grupoBaseOrder = ["A1", "A2", "C1", "C2", "E"];
                return grupoBaseOrder.indexOf(a) - grupoBaseOrder.indexOf(b);
            }),
            plazas: [Math.min(...plazasArr), Math.max(...plazasArr)],
            aspirantes: [
                Math.min(...aspirantesArr),
                Math.max(...aspirantesArr),
            ],
            aspirantesPlaza: [
                Math.min(...aspirantesPlazaArr),
                Math.max(...aspirantesPlazaArr),
            ],
            experienceAverage: [
                Math.min(...experienceAverageArr),
                Math.max(...experienceAverageArr),
            ],
        };
    }, [oposicionesByConvocatoriaAndSearch]);

    const [filterStateParent, setFilterStateParent] = useState(filterValues);

    function updateFilterStateParent(filterState: typeof filterValues) {
        setFilterStateParent(filterState);
    }

    const isFilterInactive = useMemo(() => {
        return (
            JSON.stringify(filterStateParent) === JSON.stringify(filterValues)
        );
    }, [filterStateParent, filterValues]);

    const filteredOposicionesNames = Object.keys(
        oposicionesByConvocatoriaAndSearch
    ).filter((name) => {
        const oposicion = oposicionesByConvocatoriaAndSearch[name];

        // Perform filtering based on filterStateParent

        // Filter by grupo
        if (!filterStateParent.grupos.includes(oposicion.grupo.grupo)) {
            return false;
        }
        // Filter by plazas
        else if (
            oposicion.numPlazas < filterStateParent.plazas[0] ||
            oposicion.numPlazas > filterStateParent.plazas[1]
        ) {
            return false;
        }
        // Filter by aspirantes
        else if (
            (oposicion.numPresentados &&
                (oposicion.numPresentados < filterStateParent.aspirantes[0] ||
                    oposicion.numPresentados >
                        filterStateParent.aspirantes[1])) ||
            (JSON.stringify(filterStateParent.aspirantes) !==
                JSON.stringify(filterValues.aspirantes) &&
                !oposicion.numPresentados)
        ) {
            return false;
        }
        // Filter by aspirantes/plaza
        else if (
            (oposicion.numPresentados &&
                (oposicion.numPresentados / oposicion.numPlazas <
                    filterStateParent.aspirantesPlaza[0] ||
                    oposicion.numPresentados / oposicion.numPlazas >
                        filterStateParent.aspirantesPlaza[1])) ||
            (JSON.stringify(filterStateParent.aspirantesPlaza) !==
                JSON.stringify(filterValues.aspirantesPlaza) &&
                !oposicion.numPresentados)
        ) {
            return false;
        }

        // Filter by experienceAverage
        else if (
            (oposicion.experienceAverage &&
                (oposicion.experienceAverage <
                    filterStateParent.experienceAverage[0] ||
                    oposicion.experienceAverage >
                        filterStateParent.experienceAverage[1])) ||
            (JSON.stringify(filterStateParent.experienceAverage) !==
                JSON.stringify(filterValues.experienceAverage) &&
                !oposicion.experienceAverage)
        ) {
            return false;
        } else {
            return true;
        }
    });
    const filteredOposiciones = filteredOposicionesNames.reduce((acc, name) => {
        acc[name] = oposicionesByConvocatoriaAndSearch[name];
        return acc;
    }, {} as typeof oposicionesByConvocatoriaAndSearch);

    const sortedFilteredOposicionesArray = Object.keys(filteredOposiciones)
        .map((name) => filteredOposiciones[name])
        .sort((a, b) => {
            if (sortBy === "oposicion") {
                if (sortOrder === "asc") {
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else if (sortBy === "grupo") {
                const grupoBaseOrder = ["A1", "A2", "C1", "C2", "E"];
                if (sortOrder === "asc") {
                    return (
                        grupoBaseOrder.indexOf(a.grupo.grupo) -
                        grupoBaseOrder.indexOf(b.grupo.grupo)
                    );
                } else {
                    return (
                        grupoBaseOrder.indexOf(b.grupo.grupo) -
                        grupoBaseOrder.indexOf(a.grupo.grupo)
                    );
                }
            } else if (sortBy === "plazas") {
                if (sortOrder === "asc") {
                    return a.numPlazas - b.numPlazas;
                } else {
                    return b.numPlazas - a.numPlazas;
                }
            } else if (sortBy === "aspirantes") {
                if (sortOrder === "asc") {
                    if (!a.numPresentados && b.numPresentados) {
                        return 1;
                    } else if (a.numPresentados && !b.numPresentados) {
                        return -1;
                    } else if (!a.numPresentados && !b.numPresentados) {
                        return 0;
                    } else if (a.numPresentados && b.numPresentados) {
                        return a.numPresentados - b.numPresentados;
                    } else {
                        return 0;
                    }
                } else {
                    if (!a.numPresentados && b.numPresentados) {
                        return -1;
                    } else if (a.numPresentados && !b.numPresentados) {
                        return 1;
                    } else if (!a.numPresentados && !b.numPresentados) {
                        return 0;
                    } else if (a.numPresentados && b.numPresentados) {
                        return b.numPresentados - a.numPresentados;
                    } else {
                        return 0;
                    }
                }
            } else if (sortBy === "aspirantesPlaza") {
                const aAspirantesPlaza = a.numPresentados
                    ? a.numPresentados / a.numPlazas
                    : 0;
                const bAspirantesPlaza = b.numPresentados
                    ? b.numPresentados / b.numPlazas
                    : 0;

                if (sortOrder === "asc") {
                    return aAspirantesPlaza - bAspirantesPlaza;
                } else {
                    return bAspirantesPlaza - aAspirantesPlaza;
                }
            } else if ("experienceAverage") {
                const aExperienceAverage = a.experienceAverage
                    ? a.experienceAverage
                    : 0;
                const bExperienceAverage = b.experienceAverage
                    ? b.experienceAverage
                    : 0;
                if (sortOrder === "asc") {
                    return aExperienceAverage - bExperienceAverage;
                } else {
                    return bExperienceAverage - aExperienceAverage;
                }
            } else {
                return 0;
            }
        });

    // Footer is in view Context to hide filter button on mobile devices when footer is in view.
    const footerIsInView = useFooterIsInView();

    const bg = useColorModeValue("gray.100", "gray.700");
    const buttonColor = useColorModeValue("blue.500", "blue.300");
    const buttonHoverColor = useColorModeValue("blue.700", "blue.500");
    const buttonActiveColor = useColorModeValue("blue.800", "blue.400");
    const borderColor = useColorModeValue("gray.700", "gray.400");
    const gridBg = useColorModeValue("white", "gray.900");
    const headerColor = useColorModeValue("black", "white");
    const activeBg = useColorModeValue("blue.200", "blue.700");

    const [
        isBiggerThan973,
        isSmallerThan768,
        isSmallerThan301,
        isSmallerThan480,
    ] = useMediaQuery([
        "(min-width: 973px)",
        "(max-width: 768px)",
        "(max-width: 301px)",
        "(max-width: 480px)",
    ]);

    // Detects wether the device supports hover or not through a media query, and executes a simple logic to assign a different text-decoration property.
    const [isHoverNotSupported] = useMediaQuery("(hover: none)");
    const hover = () =>
        isHoverNotSupported
            ? { textDecoration: "none" }
            : { color: buttonHoverColor };

    // Drawer management
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);

    function getUsedVerticalViewportSpace() {
        const headerHeight = 80;
        const bannerHeight = isSmallerThan301
            ? 191.8
            : isSmallerThan768
            ? 151.9
            : 155.2;
        const marginsHeight = isSmallerThan480
            ? 56
            : isSmallerThan768
            ? 64
            : 80;
        return headerHeight + bannerHeight + marginsHeight * 2;
    }

    return (
        <Flex
            w="100%"
            minH={`calc(100vh - ${getUsedVerticalViewportSpace()}px)`}
            mt={{ base: 14, sm: 16, md: 20, lg: 20 }}
            mb={{ base: 14, sm: 16, md: 20, lg: 20 }}
            align="center"
            justify="start"
        >
            {!footerIsInView && !isBiggerThan973 ? (
                <IconButton
                    ref={btnRef}
                    aria-label="Open filters drawer"
                    icon={<FaSlidersH />}
                    colorScheme="teal"
                    onClick={onOpen}
                    position="fixed"
                    bottom={6}
                    left="5%"
                />
            ) : null}
            <Box
                w="90%"
                maxW="1400px"
                ml="auto"
                mr="auto"
                backgroundColor={bg}
                borderRadius="md"
                boxShadow="2xl"
                p={{ base: 2, sm: 3, md: 4, lg: 6 }}
                mt="auto"
                mb="auto"
            >
                <Stack direction="row" spacing={10} w="100%">
                    {/* Component with filters. React Keyed Fragment will force a new component when filterValues changes (which changes based on selected convocatoria) */}
                    <React.Fragment key={JSON.stringify(filterValues)}>
                        <Filters
                            filterValues={filterValues}
                            updateFilterStateParent={updateFilterStateParent}
                            isOpen={isOpen}
                            onClose={onClose}
                            btnRef={btnRef}
                            isBiggerThan973={isBiggerThan973}
                            isFilterInactive={isFilterInactive}
                        />
                    </React.Fragment>
                    {/* Main component. May get separated later */}
                    <VStack spacing={5} w="100%">
                        <HStack
                            w="100%"
                            borderBottom="1px"
                            borderColor={borderColor}
                            align="center"
                            justify="space-between"
                            pt={2}
                            pb={2}
                            spacing={4}
                        >
                            <Text fontSize={{ base: "sm", sm: "md", md: "lg" }}>
                                {sortedFilteredOposicionesArray.length}{" "}
                                Oposiciones Encontradas
                            </Text>
                            <SearchBox
                                updateSearchStrParent={updateSearchStrParent}
                            />
                        </HStack>
                        <HStack w="100%" align="center" justify="space-between">
                            <HStack
                                spacing={{ base: 3, sm: 6, md: 10 }}
                                align="center"
                                justify="center"
                            >
                                <VStack spacing={3} align="start">
                                    <Text
                                        fontSize={{
                                            base: "xs",
                                            sm: "xs",
                                            md: "sm",
                                        }}
                                    >
                                        {selectedOposiciones.length}{" "}
                                        Seleccionadas
                                    </Text>
                                    <Button
                                        m={0}
                                        p={0}
                                        h="fit-content"
                                        backgroundColor="transparent"
                                        color={buttonColor}
                                        _hover={hover()}
                                        _active={{
                                            backgroundColor: "transparent",
                                            color: buttonActiveColor,
                                        }}
                                        fontSize={{
                                            base: "2xs",
                                            sm: "xs",
                                            md: "sm",
                                        }}
                                        onClick={handleClearSelection}
                                        visibility={
                                            selectedOposiciones.length > 0
                                                ? "visible"
                                                : "hidden"
                                        }
                                    >
                                        Eliminar Selección
                                    </Button>
                                </VStack>
                                <Button
                                    colorScheme="teal"
                                    rightIcon={<FaColumns />}
                                    size={{ base: "sm", sm: "sm", md: "md" }}
                                >
                                    Comparar
                                </Button>
                            </HStack>
                            <InputGroup maxW={200}>
                                <Select
                                    fontSize={{
                                        base: "2xs",
                                        sm: "xs",
                                        md: "sm",
                                    }}
                                    icon={<ChevronDownIcon />}
                                    value={selectedConvocatoria}
                                    onChange={handleConvocatoriaChange}
                                >
                                    {years.map((year, index) => {
                                        return (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </InputGroup>
                        </HStack>
                        <Grid
                            w="100%"
                            gridRowGap={5}
                            templateColumns="repeat(7, auto)" /* 7 columns */
                            backgroundColor={gridBg}
                            borderRadius="md"
                            p={4}
                            justifyItems="center"
                            alignItems="center"
                            fontSize="sm"
                            overflow="scroll"
                        >
                            {/* TABLE HEADER */}
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                            >
                                {""}
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "oposicion"
                                        ? "blue.500"
                                        : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="start"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                h="100%"
                            >
                                <Button
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="oposicion"
                                    onClick={handleClickSortBy}
                                >
                                    Oposición
                                    {sortBy === "oposicion" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Button>
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "grupo" ? "blue.500" : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="100%"
                            >
                                <Button
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="grupo"
                                    onClick={handleClickSortBy}
                                >
                                    <Box w="14px" />
                                    Grupo
                                    {sortBy === "grupo" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Button>
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "plazas"
                                        ? "blue.500"
                                        : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="100%"
                            >
                                <Button
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="plazas"
                                    onClick={handleClickSortBy}
                                >
                                    <Box w="14px" />
                                    Plazas
                                    {sortBy === "plazas" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Button>
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "aspirantes"
                                        ? "blue.500"
                                        : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="100%"
                            >
                                <Button
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="aspirantes"
                                    onClick={handleClickSortBy}
                                >
                                    <Box w="14px" />
                                    Aspirantes
                                    {sortBy === "aspirantes" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Button>
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "aspirantesPlaza"
                                        ? "blue.500"
                                        : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="100%"
                            >
                                <Box
                                    as="button"
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    fontWeight="bold"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="aspirantesPlaza"
                                    onClick={handleClickSortBy}
                                >
                                    <Box w="14px" flexShrink={0} />
                                    <Box>Aspirantes / Plaza</Box>
                                    {sortBy === "aspirantesPlaza" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Box>
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor={
                                    sortBy === "experienceAverage"
                                        ? "blue.500"
                                        : "gray.300"
                                }
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={1}
                                pr={1}
                                pb={2}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="100%"
                            >
                                <Box
                                    as="button"
                                    w="100%"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    m={0}
                                    p={0}
                                    h="fit-content"
                                    backgroundColor="transparent"
                                    fontWeight="bold"
                                    color={headerColor}
                                    _hover={hover()}
                                    _active={{
                                        backgroundColor: "transparent",
                                        color: buttonActiveColor,
                                    }}
                                    fontSize="inherit"
                                    value="experienceAverage"
                                    onClick={handleClickSortBy}
                                >
                                    <Box w="14px" flexShrink={0} />
                                    <Box>Media Exp. Aprobados (Años)</Box>
                                    {sortBy === "experienceAverage" ? (
                                        sortOrder === "asc" ? (
                                            <ChevronDownIcon />
                                        ) : (
                                            <ChevronUpIcon />
                                        )
                                    ) : (
                                        <ChevronDownIcon visibility="hidden" />
                                    )}
                                </Box>
                            </GridItem>

                            {/* TABLE CONTENT */}
                            {sortedFilteredOposicionesArray.map(
                                (oposicion, index) => {
                                    const name = oposicion.name;

                                    return (
                                        <React.Fragment key={index}>
                                            <GridItem pl={2} pr={2}>
                                                <Checkbox
                                                    colorScheme={"blue"}
                                                    size="md"
                                                    value={name}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                    isChecked={selectedOposiciones.includes(
                                                        name
                                                    )}
                                                />
                                            </GridItem>
                                            <GridItem
                                                pl={2}
                                                pr={2}
                                                justifySelf="start"
                                            >
                                                <Link
                                                    as={NextLink}
                                                    href={`/oposiciones/${name}`}
                                                    _hover={hover()}
                                                    _active={{
                                                        color: activeBg,
                                                    }}
                                                >
                                                    {oposicion.longName}
                                                </Link>
                                            </GridItem>
                                            <GridItem pl={2} pr={2}>
                                                {oposicion.grupo.grupo}
                                            </GridItem>
                                            <GridItem pl={2} pr={2}>
                                                {oposicion.numPlazas}
                                            </GridItem>
                                            <GridItem pl={2} pr={2}>
                                                {oposicion.numPresentados}
                                            </GridItem>
                                            <GridItem pl={2} pr={2}>
                                                {oposicion.numPresentados
                                                    ? (
                                                          oposicion.numPresentados /
                                                          oposicion.numPlazas
                                                      ).toFixed(2)
                                                    : "N/A"}
                                            </GridItem>
                                            <GridItem pl={2} pr={2}>
                                                {!oposicion.experienceAverage
                                                    ? "N/A"
                                                    : oposicion.experienceAverage}
                                            </GridItem>
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </Grid>
                    </VStack>
                </Stack>
            </Box>
        </Flex>
    );
}
