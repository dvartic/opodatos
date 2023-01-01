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

export function AccordionFilters() {
    return (
        <Accordion w="100%" allowMultiple defaultIndex={[0, 1, 2]}>
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
                        <Checkbox colorScheme={"blue"} size="md">
                            A1
                        </Checkbox>
                        <Checkbox colorScheme={"blue"} size="md">
                            A2
                        </Checkbox>
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
                            Num. Plazas
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Text>0</Text>
                            <Text as="i">73</Text>
                            <Text>150</Text>
                        </HStack>
                        <RangeSlider
                            aria-label={["0", "150"]}
                            defaultValue={[0, 150]}
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
