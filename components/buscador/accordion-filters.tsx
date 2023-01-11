"use client";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    Flex,
    HStack,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { GrupoOposicion } from "@prisma/client";

interface FilterValues {
    grupos: GrupoOposicion[];
    plazas: number[];
    aspirantes: number[];
    aspirantesPlaza: number[];
    experienceAverage: number[];
}
interface Props {
    filterValues: FilterValues;
    filterState: FilterValues;
    handleGrupoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePlazasChange: (values: number[]) => void;
    handleAspirantesChange: (values: number[]) => void;
    handleAspirantesPlazaChange: (values: number[]) => void;
    handleExperienceChange: (values: number[]) => void;
    postRangeSliderState: () => void;
}

export function AccordionFilters({
    filterValues,
    filterState,
    handleGrupoChange,
    handlePlazasChange,
    handleAspirantesChange,
    handleAspirantesPlazaChange,
    handleExperienceChange,
    postRangeSliderState,
}: Props) {
    return (
        <Accordion w="100%" allowMultiple defaultIndex={[0, 1, 2, 3, 4]}>
            {" "}
            {/* Default Index needs an array with indexes to default all accordions open */}
            <AccordionItem w="100%" mb={3}>
                <Text w="100%">
                    <AccordionButton w="100%">
                        <Flex
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            align="space-between"
                        >
                            Grupo
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack w="100%" align="start">
                        {filterValues.grupos.map((grupo, index) => {
                            return (
                                <Checkbox
                                    key={index}
                                    colorScheme={"blue"}
                                    size="md"
                                    value={grupo}
                                    onChange={handleGrupoChange}
                                    isChecked={filterState.grupos.includes(
                                        grupo
                                    )}
                                >
                                    {grupo}
                                </Checkbox>
                            );
                        })}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
            {/* Num. Plazas */}
            <AccordionItem w="100%">
                <Text w="100%">
                    <AccordionButton w="100%">
                        <Flex
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            align="space-between"
                        >
                            Plazas
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Text as="i">{filterState.plazas[0]}</Text>
                            <Text as="i">{filterState.plazas[1]}</Text>
                        </HStack>
                        <RangeSlider
                            min={filterValues.plazas[0]}
                            max={filterValues.plazas[1]}
                            value={filterState.plazas}
                            onChange={handlePlazasChange}
                            onChangeEnd={postRangeSliderState}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
            {/* Num. Aspirantes */}
            <AccordionItem w="100%">
                <Text w="100%">
                    <AccordionButton w="100%">
                        <Flex
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            align="space-between"
                        >
                            Aspirantes
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Text as="i">{filterState.aspirantes[0]}</Text>
                            <Text as="i">{filterState.aspirantes[1]}</Text>
                        </HStack>
                        <RangeSlider
                            min={filterValues.aspirantes[0]}
                            max={filterValues.aspirantes[1]}
                            value={filterState.aspirantes}
                            onChange={handleAspirantesChange}
                            onChangeEnd={postRangeSliderState}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
            {/* Aspirantes / Plaza */}
            <AccordionItem w="100%">
                <Text w="100%">
                    <AccordionButton w="100%">
                        <Flex
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            align="space-between"
                        >
                            Asp. / Plaza
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Text as="i">
                                {filterState.aspirantesPlaza[0].toFixed(2)}
                            </Text>
                            <Text as="i">
                                {filterState.aspirantesPlaza[1].toFixed(2)}
                            </Text>
                        </HStack>
                        <RangeSlider
                            min={filterValues.aspirantesPlaza[0]}
                            max={filterValues.aspirantesPlaza[1]}
                            value={filterState.aspirantesPlaza}
                            onChange={handleAspirantesPlazaChange}
                            onChangeEnd={postRangeSliderState}
                            step={0.1}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
            {/* Media Exp. Aprobados */}
            <AccordionItem w="100%">
                <Text w="100%">
                    <AccordionButton w="100%">
                        <Flex
                            flex="1"
                            textAlign="left"
                            fontWeight="bold"
                            align="space-between"
                        >
                            Experiencia
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Text as="i">
                                {filterState.experienceAverage[0]}
                            </Text>
                            <Text as="i">
                                {filterState.experienceAverage[1]}
                            </Text>
                        </HStack>
                        <RangeSlider
                            min={filterValues.experienceAverage[0]}
                            max={filterValues.experienceAverage[1]}
                            value={filterState.experienceAverage}
                            onChange={handleExperienceChange}
                            onChangeEnd={postRangeSliderState}
                            step={0.1}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}
