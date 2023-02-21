"use client";

import { Box, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import { ResponsiveLine } from "@nivo/line";

interface Props {
    graphData: any;
}

export function NivoGraphLine({ graphData }: Props) {
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
        <Box h="60vh" minH="450px" w="100%">
            <ResponsiveLine
                data={graphData}
                theme={nivoTheme}
                colors={{
                    scheme: "category10",
                }}
                margin={{
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                }}
                xScale={{
                    type: "point",
                }}
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
                pointColor={{
                    from: "color",
                }}
                pointBorderWidth={2}
                pointBorderColor={{
                    from: "color",
                }}
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
        </Box>
    );
}
