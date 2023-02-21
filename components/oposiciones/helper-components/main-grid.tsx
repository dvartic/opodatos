"use client";

import { Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { calculatePercentageVariation, formatNumberToDisplay } from "../../../server/utils/utils";
import React from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { OposicionesDataBySlugReturnType } from "../../../app/oposiciones/[slug]/page";

interface Props {
    dataBlock: OposicionesDataBySlugReturnType[0];
    oposicionName1InSlug: string | null;
}

export function MainGrid({ dataBlock, oposicionName1InSlug }: Props) {
    if (!dataBlock.oposicion0LatestYear) {
        return null;
    } else {
        return (
            <HStack align="start" spacing={10}>
                <Grid
                    gridRowGap={2}
                    gridColumnGap={10}
                    autoRows="35px"
                    pl={2}
                    templateColumns="repeat(2, auto)"
                    justifyItems="start"
                    alignItems="center"
                    fontSize="sm"
                >
                    <GridItem fontSize="md" fontWeight="bold" borderBottom="1px" borderColor="gray.300">
                        Dato
                    </GridItem>
                    <GridItem fontSize="md" fontWeight="bold" borderBottom="1px" borderColor="gray.300">
                        {dataBlock.oposicion0LatestYear.longName}
                        {"*"}
                    </GridItem>

                    {/* Grid Main Content */}

                    {dataBlock.tableHeaders.map((header, indexB) => {
                        if (!dataBlock.oposicion0LatestYear) {
                            return null;
                        } else {
                            const objectKey = dataBlock.objectDataKeys[indexB];
                            return (
                                <React.Fragment key={indexB}>
                                    <GridItem fontWeight="bold">{header}</GridItem>
                                    <GridItem>
                                        {
                                            // @ts-ignore
                                            formatNumberToDisplay(dataBlock.oposicion0LatestYear[objectKey])
                                        }
                                    </GridItem>
                                </React.Fragment>
                            );
                        }
                    })}

                    {/* Second Grid corresponding to second oposicion (if it exists) */}
                </Grid>
                {oposicionName1InSlug && dataBlock.oposicion1LatestYear ? (
                    <Grid
                        gridRowGap={2}
                        gridColumnGap={4}
                        pl={2}
                        templateColumns="repeat(2, auto)"
                        autoRows="35px"
                        justifyItems="start"
                        alignItems="center"
                        fontSize="sm"
                    >
                        <GridItem fontSize="md" fontWeight="bold" gridColumn="span 2" borderBottom="1px" borderColor="gray.300">
                            {dataBlock.oposicion1LatestYear.longName}
                            {"**"}
                        </GridItem>

                        {/* Grid Main Content */}

                        {dataBlock.tableHeaders.map((header, indexC) => {
                            const moreIcon = dataBlock.isMoreBetter[dataBlock.objectDataKeys[indexC]] ? (
                                <CheckIcon color="green.500" boxSize={4} />
                            ) : (
                                <CloseIcon color="red.500" boxSize={3} />
                            );
                            const lessIcon = dataBlock.isMoreBetter[dataBlock.objectDataKeys[indexC]] ? (
                                <CloseIcon color="red.500" boxSize={3} />
                            ) : (
                                <CheckIcon color="green.500" boxSize={4} />
                            );

                            if (!dataBlock.oposicion1LatestYear || !dataBlock.oposicion0LatestYear) {
                                return null;
                            } else {
                                return (
                                    <React.Fragment key={indexC}>
                                        <GridItem>
                                            {formatNumberToDisplay(
                                                // @ts-ignore
                                                dataBlock.oposicion1LatestYear[dataBlock.objectDataKeys[indexC]]
                                            )}
                                        </GridItem>

                                        <GridItem>
                                            <HStack align="center" justify="center">
                                                {
                                                    // @ts-ignore
                                                    dataBlock.oposicion1LatestYear[dataBlock.objectDataKeys[indexC]] -
                                                        // @ts-ignore
                                                        (dataBlock.oposicion0LatestYear[dataBlock.objectDataKeys[indexC]] as number) >=
                                                    0
                                                        ? moreIcon
                                                        : lessIcon
                                                }
                                                <Text>
                                                    {formatNumberToDisplay(
                                                        calculatePercentageVariation(
                                                            // @ts-ignore
                                                            dataBlock.oposicion0LatestYear[dataBlock.objectDataKeys[indexC]] as number,
                                                            // @ts-ignore
                                                            dataBlock.oposicion1LatestYear[dataBlock.objectDataKeys[indexC]] as number
                                                        ) * 100
                                                    ) + "%"}
                                                </Text>
                                            </HStack>
                                        </GridItem>
                                    </React.Fragment>
                                );
                            }
                        })}
                    </Grid>
                ) : null}
            </HStack>
        );
    }
}
