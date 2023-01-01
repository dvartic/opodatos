"use client";

import {
    Box,
    Heading,
    VStack,
    useColorModeValue,
    Text,
    useMediaQuery,
} from "@chakra-ui/react";
import { ResponsiveLine } from "@nivo/line";

interface Props {
    graphData: {
        id: string;
        color: string;
        data: {
            x: number;
            y: number | null;
        }[];
    }[];
}

export function PlazasGraph({ graphData }: Props) {
    const bg = useColorModeValue("white", "gray.700");

    const nivoTheme = useColorModeValue(
        {
            textColor: "#171923",
        },
        {
            textColor: "#ffffff",
            tooltip: {
                container: {
                    background: "#4A5568",
                },
            },
        }
    );

    const [isSmallerThan410] = useMediaQuery("(max-width: 410px)");
    const tickRoation = isSmallerThan410 ? 30 : 0;

    return (
        <VStack w="90%" maxW="900px" mr="auto" ml="auto" mt={20} mb={32}>
            <Box mb={2}>
                <Heading textAlign="center" as="h2">
                    Evolución de Plazas Ofertadas
                </Heading>
            </Box>
            <Box
                backgroundColor={bg}
                h="45vh"
                w="100%"
                borderRadius="md"
                boxShadow="lg"
            >
                <ResponsiveLine
                    data={graphData}
                    theme={nivoTheme}
                    colors={{ scheme: "category10" }}
                    margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: 0,
                        max: "auto",
                        stacked: true,
                        reverse: false,
                    }}
                    yFormat=" >-.0f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: tickRoation,
                        legend: "Año OEP",
                        legendOffset: 36,
                        legendPosition: "middle",
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Plazas",
                        legendOffset: -40,
                        legendPosition: "middle",
                    }}
                    lineWidth={3}
                    pointSize={8}
                    pointColor={{ from: "color" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "color" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    enableGridX={true}
                    enableGridY={false}
                    legends={[
                        {
                            anchor: "top-left",
                            direction: "column",
                            justify: false,
                            translateX: 0,
                            translateY: -20,
                            itemsSpacing: 0,
                            itemDirection: "left-to-right",
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: "circle",
                            symbolBorderColor: "rgba(0, 0, 0, .5)",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemBackground: "rgba(0, 0, 0, .03)",
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                />
                <Box mt={3}>
                    <Text textAlign="left" fontSize="sm" as="i">
                        De oposiciones incluidas en nuestra base de datos
                    </Text>
                </Box>
            </Box>
        </VStack>
    );
}
