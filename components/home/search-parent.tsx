"use client";

import { Box, Fade } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SearchBox } from "./search-box";
import { SearchResult } from "./search-result";
import { normalizeStr } from "../../server/utils/utils";

interface Props {
    oposicionList: {
        longName: string;
        name: string;
        grupo: { grupo: string };
    }[];
}

type OposicionList = {
    longName: string;
    name: string;
    grupo: { grupo: string };
}[];

export function SearchParent({ oposicionList }: Props) {
    const [searchStr, setSearchStr] = useState("");
    const [filteredOposiciones, setFilteredOposiciones] =
        useState<OposicionList>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sets the state searchStr of the component based on the input made by the user in the <Search> component. handleChange is passed to this <Search> component to achieve this.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStr(e.target.value);
    };

    // Waits until the user stops writing (100ms) to perform a search and update filteredOposiciones state with the results of the search. The 100ms counter is restarted every time the user makes a new input.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchStr === "") {
                setFilteredOposiciones([]);
                setIsMenuOpen(false);
            } else {
                const filteredArr = oposicionList.filter((element) => {
                    const isOposicion = normalizeStr(element.longName).includes(
                        searchStr.toLowerCase()
                    );
                    return isOposicion;
                });
                setFilteredOposiciones(filteredArr);
                setIsMenuOpen(true);
            }
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [searchStr, oposicionList]);

    return (
        <Box
            w={{ base: "100%", sm: "100%", md: "80%", lg: "60%" }}
            position="relative"
        >
            <SearchBox searchStr={searchStr} handleChange={handleChange} />
            <Fade in={isMenuOpen} unmountOnExit>
                <SearchResult filteredOposiciones={filteredOposiciones} />
            </Fade>
        </Box>
    );
}
