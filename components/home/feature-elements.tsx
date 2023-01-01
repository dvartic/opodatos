"use client";

import {
    Box,
    Heading,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface Props {
    title: string;
    text: string;
    Icon: IconType;
}

export function FeatureElement({ title, text, Icon }: Props) {
    const bgColor = useColorModeValue("white", "gray.700");
    const titleColor = useColorModeValue("green.800", "green.400");

    return (
        <VStack
            w="3xs"
            h="2xs"
            p={5}
            spacing={5}
            backgroundColor={bgColor}
            boxShadow="2xl"
            borderRadius="md"
            margin={4}
        >
            <Box w="100%">
                <Icon size={50} />
            </Box>

            <VStack>
                <Heading
                    w="100%"
                    as="h3"
                    fontSize="xl"
                    color={titleColor}
                    textAlign="left"
                >
                    {title}
                </Heading>
                <Text>{text}</Text>
            </VStack>
        </VStack>
    );
}