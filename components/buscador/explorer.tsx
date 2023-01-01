"use client";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Checkbox,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    GridItem,
    HStack,
    Icon,
    IconButton,
    InputGroup,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Select,
    SliderMark,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
    VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { SearchBox } from "./search-box";
import { FaColumns } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaSlidersH } from "react-icons/fa";
import { useFooterIsInView } from "../../app/FooterInViewContext";
import { AccordionFilters } from "./accordion-filters";

export function Explorer() {
    // Search state
    const [searchStr, setSearchStr] = useState("");

    // Footer is in view Context to hide filter button on mobile devices when footer is in view.
    const footerIsInView = useFooterIsInView();

    // You need the value at which the footer starts to show up in the viewport. 0 - 154. Necesitas al height del footer. Necesitas el total height indicado desde cliente.

    const bg = useColorModeValue("gray.100", "gray.700");
    const buttonColor = useColorModeValue("blue.500", "blue.300");
    const buttonHoverColor = useColorModeValue("blue.700", "blue.500");
    const borderColor = useColorModeValue("gray.700", "gray.400");
    const gridBg = useColorModeValue("white", "gray.900");

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStr(e.target.value);
    };

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

                    /* Que desaparezca en base a scroll para evitar encima de footer */
                />
            ) : null}
            <Box
                w="90%"
                maxW="1400px"
                ml="auto"
                mr="auto"
                backgroundColor={bg}
                borderRadius="md"
                p={{base: 2, sm: 3, md: 4, lg: 6}}
                mt="auto"
                mb="auto"
            >
                <Stack direction="row" spacing={10} w="100%">
                    {/* Component with filters */}

                    {isBiggerThan973 ? (
                        <VStack w={200} spacing={3} justify="space-between">
                            {/* Accordion with group */}
                            <AccordionFilters />
                            <Button w="100%" colorScheme="green">
                                Reiniciar Filtros
                            </Button>{" "}
                            {/* DISABLE IF NO FILTERS ARE APPLIED */}
                        </VStack>
                    ) : (
                        <Drawer
                            isOpen={isOpen}
                            placement="left"
                            onClose={onClose}
                            finalFocusRef={btnRef}
                        >
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader>Filtrado de datos</DrawerHeader>
                                <DrawerBody>
                                    <AccordionFilters />
                                </DrawerBody>
                                <DrawerFooter>
                                    <Button w="100%" colorScheme="green">
                                        Reiniciar Filtros
                                    </Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    )}

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
                            <Text fontSize={{base: 'sm', sm: 'md', md: 'lg'}}>
                                {"3"} Oposiciones Encontradas
                            </Text>
                            <SearchBox
                                searchStr={searchStr}
                                handleChange={handleChange}
                            />
                        </HStack>
                        <HStack w="100%" align="center" justify="space-between">
                            <HStack
                                spacing={{base: 3, sm: 6, md: 10}}
                                align="center"
                                justify="center"
                            >
                                <VStack spacing={3} align="start">
                                    <Text fontSize={{base: 'xs', sm: 'xs', md: 'sm'}}>{"2"} Seleccionadas</Text>
                                    <Button
                                        m={0}
                                        p={0}
                                        h="fit-content"
                                        backgroundColor="transparent"
                                        colorScheme="blue"
                                        color={buttonColor}
                                        _hover={hover()}
                                        fontSize={{base: '2xs', sm: 'xs', md: 'sm'}}
                                    >
                                        Eliminar Selección
                                    </Button>
                                </VStack>
                                <Button
                                    colorScheme="teal"
                                    rightIcon={<FaColumns />}
                                    size={{base: 'sm', sm: 'sm', md: 'md'}}
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
                                    placeholder="Convocatoria"
                                >
                                    <option value="integral">2021</option>
                                    <option value="contable">2022</option>
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
                            overflow='scroll'
                        >
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
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="start"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Oposición
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Grupo
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Plazas
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Aspirantes
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Aspirantes / Plaza
                            </GridItem>
                            <GridItem
                                borderBottom="1px"
                                borderColor="gray.300"
                                w="100%"
                                alignSelf="end"
                                textAlign="center"
                                pl={2}
                                pr={2}
                                pb={2}
                                display='flex'
                                alignItems='center'
                                h='100%'
                            >
                                Media Exp. Aprobados (Años)
                            </GridItem>

                            {/* Content */}

                            {/* Row1 */}
                            <GridItem pl={2} pr={2}>
                                <Checkbox colorScheme={"blue"} size="md" />
                            </GridItem>
                            <GridItem pl={2} pr={2} justifySelf='start'>
                                Inspector de Hacienda
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                A1
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                150
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                1600
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                10.67
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                5
                            </GridItem>

                            {/* Row2 */}
                            <GridItem pl={2} pr={2}>
                                <Checkbox colorScheme={"blue"} size="md" />
                            </GridItem>
                            <GridItem pl={2} pr={2} justifySelf='start'>
                                Inspector de Hacienda
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                A1
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                150
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                1600
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                10.67
                            </GridItem>
                            <GridItem pl={2} pr={2}>
                                5
                            </GridItem>
                        </Grid>
                    </VStack>
                </Stack>
            </Box>
        </Flex>
    );
}
