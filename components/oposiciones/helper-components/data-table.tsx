"use client";

import { Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { formatNumberToDisplay } from "../../../server/utils/utils";

interface Props {
    oposicionName1InSlug: string | null;
    longName0: string | null | undefined;
    longName1: string | null | undefined;
    formattedTableData:
        | {
              x: number;
              y: number | string | null;
              z?: number | string | null | undefined;
          }[]
        | undefined;
}

export function DataTable({
    oposicionName1InSlug,
    longName0,
    longName1,
    formattedTableData,
}: Props) {
    // Color Mode Config
    const bg = useColorModeValue("white", "gray.800");
    return (
        <Grid
            templateColumns={`repeat(${
                oposicionName1InSlug && longName1 ? 3 : 2
            }, auto)`}
            gridRowGap={5}
            justifyItems="center"
            alignItems="center"
            backgroundColor={bg}
            borderRadius="md"
            p={5}
            maxW={oposicionName1InSlug ? 600 : 400}
            ml="auto"
            mr="auto"
        >
            {/* GRID TABLE HEADERS */}
            <GridItem
                fontWeight="bold"
                borderBottom="1px"
                borderColor="gray.300"
                w="100%"
                textAlign="start"
                pl={2}
                pr={1}
                pb={2}
            >
                Año
            </GridItem>
            <GridItem
                fontWeight="bold"
                borderBottom="1px"
                borderColor="gray.300"
                w="100%"
                textAlign="center"
                pl={2}
                pr={1}
                pb={2}
            >
                {longName0}
            </GridItem>
            {oposicionName1InSlug && longName1 ? (
                <GridItem
                    fontWeight="bold"
                    borderBottom="1px"
                    borderColor="gray.300"
                    w="100%"
                    textAlign="center"
                    pl={2}
                    pr={1}
                    pb={2}
                >
                    {longName1}
                </GridItem>
            ) : null}

            {/* GRID TABLE DATA */}
            {formattedTableData
                ? formattedTableData.map((dataPoint, index) => {
                      return (
                          <React.Fragment key={index}>
                              <GridItem
                                  justifySelf="start"
                                  fontWeight="bold"
                                  pl={2}
                                  pr={2}
                              >
                                  {dataPoint.x}
                              </GridItem>
                              <GridItem pl={2} pr={2}>
                                  {formatNumberToDisplay(dataPoint.y)}
                              </GridItem>
                              {longName1 && dataPoint.z ? (
                                  <GridItem pl={2} pr={2}>
                                      {dataPoint.z !== "N/A"
                                          ? formatNumberToDisplay(dataPoint.z)
                                          : "N/A"}
                                  </GridItem>
                              ) : null}
                          </React.Fragment>
                      );
                  })
                : null}
        </Grid>
    );
}
