"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useColorModeValue,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { OposicionesDataBySlugReturnType } from "../../../app/oposiciones/[slug]/page";
import { DataTable } from "./data-table";
import { NivoGraphLine } from "./nivo-graph-line";

interface Props {
    dataBlock: OposicionesDataBySlugReturnType[0];
    oposicionName1InSlug: string | null;
}

export function TabsGraphs({ dataBlock, oposicionName1InSlug }: Props) {
    // Color Mode Config
    const tableBoxBg = useColorModeValue("gray.100", "black");

    // View data table disclosure config
    const { getDisclosureProps, getButtonProps } = useDisclosure();
    const buttonProps = getButtonProps();
    const disclosureProps = getDisclosureProps();

    if (!dataBlock.oposicion0LatestYear) {
        return null;
    } else {
        return (
            <Tabs variant="soft-rounded" colorScheme="green" w="100%">
                <TabList>
                    {Object.keys(dataBlock.graphsDataObject).map((key, indexD) => {
                        const header =
                            dataBlock.graphsDataObject[key as keyof typeof dataBlock.graphsDataObject]["graphHeader"];
                        return (
                            <React.Fragment key={indexD}>
                                <Tab>{header}</Tab>
                            </React.Fragment>
                        );
                    })}
                </TabList>

                <TabPanels w="100%">
                    {Object.keys(dataBlock.graphsDataObject).map((key, indexE) => {
                        const tsKey = key as keyof typeof dataBlock.graphsDataObject;
                        return (
                            <TabPanel key={indexE}>
                                <VStack w="100%" spacing={10}>
                                    <NivoGraphLine graphData={dataBlock.graphsDataObject[tsKey]["nivoData"]} />

                                    {/* Data Table. Button controls a state that opens it */}
                                    <VStack align="start" spacing={10} w="100%">
                                        <Button {...buttonProps} colorScheme="green" rightIcon={<ChevronDownIcon />}>
                                            {" "}
                                            Abrir tabla de datos
                                        </Button>
                                        <Box
                                            {...disclosureProps}
                                            w="100%"
                                            p={10}
                                            backgroundColor={tableBoxBg}
                                            borderRadius="md"
                                        >
                                            <DataTable
                                                oposicionName1InSlug={oposicionName1InSlug}
                                                longName0={dataBlock.oposicion0LatestYear?.longName}
                                                longName1={
                                                    dataBlock.oposicion1LatestYear
                                                        ? dataBlock.oposicion1LatestYear.longName
                                                        : null
                                                }
                                                formattedTableData={dataBlock.formattedTableData[indexE]}
                                            />
                                        </Box>
                                    </VStack>
                                </VStack>
                            </TabPanel>
                        );
                    })}
                </TabPanels>
            </Tabs>
        );
    }
}
