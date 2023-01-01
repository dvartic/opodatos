"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { BiStats, BiTimer, BiListOl } from "react-icons/bi";
import { GiProgression, GiPapers } from "react-icons/gi";
import { GoGitCompare } from "react-icons/go";
import { FeatureElement } from "./feature-elements";

const featuresContent = [
    {
        title: "Plazas, Aspirantes y Ratio",
        text: "Los indicadores más básicos para tu oposición.",
        Icon: BiStats,
    },
    {
        title: "Perspectivas de éxito",
        text: "Obtén probabilidades de éxito medias según año según año de inicio y experiencia del opositor.",
        Icon: GiProgression,
    },
    {
        title: "Ratio aprobados por examen",
        text: "Identifica exámenes difíciles, filtros y dificultad real de la oposición.",
        Icon: GiPapers,
    },
    {
        title: "Seguimiento en tiempo real",
        text: "Información y datos a medida que avanza la convocatoria actual, en tiempo real.",
        Icon: BiTimer,
    },
    {
        title: "Comparador",
        text: "Compara datos estadísticos entre dos oposiciones de una manera sencilla.",
        Icon: GoGitCompare,
    },
    {
        title: "Ranking de oposiciones",
        text: "Descubre oposiciones ordenándolas en base a las métricas más relevantes.",
        Icon: BiListOl,
    },
];

export function Features() {
    return (
        <Box
            w={{ base: "85%", sm: "75%", md: "75%", lg: "75%" }}
            maxW="970px"
            ml="auto"
            mr="auto"
            mt={12}
            mb={12}
        >
            <Heading as="h2" textAlign="center" mb={2}>
                La información adecuada es clave para el éxito
            </Heading>
            <Flex flexWrap="wrap" justifyContent="center">
                {featuresContent.map((el, index) => {
                    return (
                        <FeatureElement
                            title={el.title}
                            text={el.text}
                            Icon={el.Icon}
                            key={index}
                        />
                    );
                })}
            </Flex>
        </Box>
    );
}
