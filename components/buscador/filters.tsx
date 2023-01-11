"use client";

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    VStack,
} from "@chakra-ui/react";
import { GrupoOposicion } from "@prisma/client";
import { useEffect, useState } from "react";
import { AccordionFilters } from "./accordion-filters";

interface FilterValues {
    grupos: GrupoOposicion[];
    plazas: number[];
    aspirantes: number[];
    aspirantesPlaza: number[];
    experienceAverage: number[];
}
interface Props {
    filterValues: FilterValues;
    updateFilterStateParent: (filterState: FilterValues) => void;
    isOpen: boolean;
    onClose: () => void;
    btnRef: React.RefObject<HTMLButtonElement>;
    isBiggerThan973: boolean;
    isFilterInactive: boolean;
}

export function Filters({
    filterValues,
    updateFilterStateParent,
    isOpen,
    onClose,
    btnRef,
    isBiggerThan973,
    isFilterInactive,
}: Props) {
    const [filterState, setFilterState] = useState(filterValues);

    // State handlers
    function handleGrupoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = e.target;
        if (checked) {
            setFilterState((prevFilterState) => {
                return {
                    ...prevFilterState,
                    grupos: [
                        ...prevFilterState.grupos,
                        value as GrupoOposicion,
                    ],
                };
            });
        } else {
            setFilterState((prevFilterState) => {
                return {
                    ...prevFilterState,
                    grupos: prevFilterState.grupos.filter(
                        (item) => item !== value
                    ),
                };
            });
        }
    }
    function handlePlazasChange(e: number[]) {
        setFilterState((prevFilterState) => {
            return {
                ...prevFilterState,
                plazas: e,
            };
        });
    }
    function handleAspirantesChange(e: number[]) {
        setFilterState((prevFilterState) => {
            return {
                ...prevFilterState,
                aspirantes: e,
            };
        });
    }
    function handleAspirantesPlazaChange(e: number[]) {
        setFilterState((prevFilterState) => {
            return {
                ...prevFilterState,
                aspirantesPlaza: e,
            };
        });
    }
    function handleExperienceChange(e: number[]) {
        setFilterState((prevFilterState) => {
            return {
                ...prevFilterState,
                experienceAverage: e,
            };
        });
    }

    // Post state to parent component. Function called on onChangeEnd for RangeSliders
    function postRangeSliderState() {
        updateFilterStateParent(filterState);
    }

    // Reset filters when clicking Button
    function resetFilters() {
        setFilterState(filterValues);
        updateFilterStateParent(filterValues);
    }

    // useEffect to post state of checkbox to parent component. Only needs to be executed when filterState.grupos changes, not the whole object, despite linter suggestion
    useEffect(() => {
        updateFilterStateParent(filterState);
    }, [filterState.grupos, updateFilterStateParent]);

    return (
        <>
            {isBiggerThan973 ? (
                <VStack w={200} spacing={3} justify="space-between">
                    {/* Accordion with group */}
                    <AccordionFilters
                        filterValues={filterValues}
                        filterState={filterState}
                        handleGrupoChange={handleGrupoChange}
                        handlePlazasChange={handlePlazasChange}
                        handleAspirantesChange={handleAspirantesChange}
                        handleAspirantesPlazaChange={
                            handleAspirantesPlazaChange
                        }
                        handleExperienceChange={handleExperienceChange}
                        postRangeSliderState={postRangeSliderState}
                    />
                    <Button
                        w="100%"
                        colorScheme="green"
                        isDisabled={isFilterInactive}
                        onClick={resetFilters}
                    >
                        Reiniciar Filtros
                    </Button>{" "}
                    {/* DISABLE IF NO FILTERS ARE APPLIED */}
                </VStack>
            ) : (
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Filtrado de datos</DrawerHeader>
                        <DrawerBody>
                            <AccordionFilters
                                filterValues={filterValues}
                                filterState={filterState}
                                handleGrupoChange={handleGrupoChange}
                                handlePlazasChange={handlePlazasChange}
                                handleAspirantesChange={handleAspirantesChange}
                                handleAspirantesPlazaChange={
                                    handleAspirantesPlazaChange
                                }
                                handleExperienceChange={handleExperienceChange}
                                postRangeSliderState={postRangeSliderState}
                            />
                        </DrawerBody>
                        <DrawerFooter>
                            <Button
                                w="100%"
                                colorScheme="green"
                                isDisabled={isFilterInactive}
                                onClick={resetFilters}
                            >
                                Reiniciar Filtros
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    );
}
