"use client";

import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    useColorModeValue,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

// It will receive some props or fetch them on client. With them it will provide search functionality.

interface Props {
    updateSearchStrParent: (searchStr: string) => void;
}

export function SearchBox({ updateSearchStrParent }: Props) {
    // Main search state
    const [searchStr, setSearchStr] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStr(e.target.value);
    };

    // Subscribe state to parent after user stops typing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateSearchStrParent(searchStr);
        }, 200);
        return () => clearTimeout(timeoutId);
    }, [searchStr, updateSearchStrParent]);

    const inputBg = useColorModeValue("white", "gray.700");

    return (
        <Box
            maxW={400}
            flexGrow={1}
            flexShrink={1}
            ml="auto"
            mr="auto"
            boxShadow="md"
        >
            <Box>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Search2Icon />
                    </InputLeftElement>
                    <Input
                        backgroundColor={inputBg}
                        placeholder="Técnico de Hacienda"
                        fontSize={{ base: "sm", sm: "sm", md: "md" }}
                        size="md"
                        variant="outline"
                        value={searchStr}
                        onChange={handleChange}
                    />
                </InputGroup>
            </Box>
        </Box>
    );
}
