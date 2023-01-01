"use client";

import {
    Heading,
    VStack,
    Box,
    Text,
    Link,
    useColorModeValue,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { FaColumns } from "react-icons/fa";
import NextLink from "next/link";
import { SearchParent } from "./search-parent";
import BannerImage from "../../public/images/banner.jpg";

interface Props {
    oposicionList: {
        longName: string;
        name: string;
        grupo: { grupo: string };
    }[];
}

export function Banner({ oposicionList }: Props) {
    const linkColor = useColorModeValue("green.700", "green.400");
    const imageFilter = useColorModeValue(
        "brightness(5%) invert(95%)",
        "brightness(15%)"
    );

    return (
        <Box w="100%" pt={14} pb={14} mb={12} position="relative">
            <NextImage
                src={BannerImage}
                fill={true}
                alt="Banner image"
                style={{ zIndex: -1, objectFit: "cover", filter: imageFilter }}
                sizes="100vw"
                placeholder="blur"
            />
            <VStack
                ml="auto"
                mr="auto"
                w={{ base: "90%", sm: "85%", md: "75%", lg: "70%", xl: "50%" }}
                maxW="1200px"
                spacing={10}
            >
                <VStack>
                    <Heading as="h1" textAlign="center" fontSize="5xl">
                        Obtén datos de tu oposición
                    </Heading>
                    <Text textAlign="center" fontSize="lg">
                        Obtén información{" "}
                        <Text as="b">clave para tu éxito</Text> como ratios de
                        aspirantes, dificultad por prueba, tiempo medio para
                        superar o la experiencia del resto de opositores.
                        Información histórica y seguimientos de procesos en
                        tiempo real.
                    </Text>
                </VStack>
                <SearchParent oposicionList={oposicionList} />
                <VStack>
                    <Heading as="h2" textAlign="center">
                        <Box
                            as="span"
                            display="inline-block"
                            verticalAlign="top"
                        >
                            <FaColumns />
                        </Box>{" "}
                        O bien, accede al
                        <Link as={NextLink} href="/" color={linkColor}>
                            {" "}
                            buscador
                        </Link>
                    </Heading>
                    <Text textAlign="center">
                        Si estás pensando en opositar, utiliza nuestros rankings
                        y comparador para elegir oposición.
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );
}
