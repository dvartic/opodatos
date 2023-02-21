"use client";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    HStack,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { OposicionesDataBySlugReturnType } from "../../app/oposiciones/[slug]/page";
import { getOposicionInSlug } from "../../server/utils/utils";
import { MainGrid } from "./helper-components/main-grid";
import { TabsGraphs } from "./helper-components/tabs-graphs";

interface Props {
    slug: string;
    dataStructureArr: OposicionesDataBySlugReturnType;
}

export function OposicionStats({ slug, dataStructureArr }: Props) {
    // Color Mode Config
    const bg = useColorModeValue("white", "gray.800");

    // If exists, get second oposicion in slug
    const oposicionName1InSlug = getOposicionInSlug(1, slug);
    
    return (
        <VStack
            w="90%"
            maxW="1400px"
            ml="auto"
            mr="auto"
            backgroundColor={bg}
            borderRadius="md"
            mt={{ base: 14, sm: 16, md: 20, lg: 20 }}
            mb={{ base: 14, sm: 16, md: 20, lg: 20 }}
            p={{ base: 2, sm: 3, md: 4, lg: 6 }}
            spacing={10}
        >
            <HStack pl={3} pr={3} justify="space-between" w="100%">
                <Heading textAlign="center" as="h2" fontSize="4xl">
                    {dataStructureArr[0].oposicion0LatestYear?.longName}
                </Heading>
                {oposicionName1InSlug ? (
                    <Heading textAlign="center" as="h2" fontSize="4xl">
                        {dataStructureArr[0].oposicion1LatestYear?.longName}
                    </Heading>
                ) : null}
            </HStack>

            <Accordion defaultIndex={[0, 1]} allowMultiple w="100%">
                {dataStructureArr.map((dataBlock, indexA) => {
                    if (!dataBlock.oposicion0LatestYear) {
                        return null;
                    } else {
                        return (
                            <AccordionItem w="100%" key={indexA}>
                                {/* TITLE */}
                                <h3>
                                    <AccordionButton>
                                        <Box
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                            fontWeight="bold"
                                            fontSize="3xl"
                                        >
                                            {dataBlock.titleStr}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h3>
                                <AccordionPanel>
                                    <VStack spacing={10} align="start">
                                        <VStack
                                            pl={2}
                                            align="start"
                                            borderLeft="1px"
                                            borderColor="gray.300"
                                            spacing={5}
                                        >
                                            <MainGrid
                                                dataBlock={dataBlock}
                                                oposicionName1InSlug={
                                                    oposicionName1InSlug
                                                }
                                            />
                                            <Box>
                                                <Text fontSize="xs">
                                                    *Datos convocatoria{" "}
                                                    {
                                                        dataBlock
                                                            .oposicion0LatestYear
                                                            .year
                                                    }
                                                </Text>
                                                {oposicionName1InSlug &&
                                                dataBlock.oposicion1LatestYear ? (
                                                    <Text fontSize="xs">
                                                        **Datos convocatoria{" "}
                                                        {
                                                            dataBlock
                                                                .oposicion1LatestYear
                                                                .year
                                                        }
                                                    </Text>
                                                ) : null}
                                            </Box>
                                        </VStack>

                                        <VStack w="100%" align="start">
                                            <TabsGraphs
                                                dataBlock={dataBlock}
                                                oposicionName1InSlug={
                                                    oposicionName1InSlug
                                                }
                                            />
                                        </VStack>
                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    }
                })}
            </Accordion>
        </VStack>
    );
}
