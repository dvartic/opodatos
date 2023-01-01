"use client";

import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { WarningIcon } from "@chakra-ui/icons";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <VStack
            align="center"
            mb={{ base: 12, sm: 14, md: 16 }}
            mt={{ base: 12, sm: 14, md: 16 }}
            spacing={5}
        >
            <WarningIcon boxSize={100} />
            <Heading as="h1" textAlign={"center"}>
                Something went wrong!
            </Heading>
            <Text textAlign={"center"}>
                This page did not load correctly. See developer console for
                technical details or try again later
            </Text>
            <Button onClick={() => reset()}>Try again</Button>
        </VStack>
    );
}
