import { NameOposicion } from "@prisma/client";

// Basic function to normalize a string
export function normalizeStr(str: string) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

// Get LongName from a given name of oposicion
export function getLongName(shortName: NameOposicion) {
    if (shortName === NameOposicion.THAC) {
        return "Técnico de Hacienda";
    } else if (shortName === NameOposicion.IHAC) {
        return "Inspector de Hacienda";
    } else {
        throw new TypeError("Error. longName has not been provided");
    }
}

// Compute function and types for LongName
type Name = {
    name: NameOposicion;
};
type WithFullName<T> = T & {
    longName: string;
};
export function computeLongName<Oposicion extends Name>(
    oposicion: Oposicion
): WithFullName<Oposicion> {
    return {
        ...oposicion,
        longName: getLongName(oposicion.name),
    };
}

// Compute function and types for aspirantes/plaza
type AspirantesPlaza = {
    numPresentados: number | null;
    numPlazas: number;
};
type WithAspirantesPlaza<T> = T & {
    aspirantesPlaza: number | null;
};
export function computeAspirantesPlaza<Oposicion extends AspirantesPlaza>(
    oposicion: Oposicion
): WithAspirantesPlaza<Oposicion> {
    return {
        ...oposicion,
        aspirantesPlaza: oposicion.numPresentados
            ? oposicion.numPresentados / oposicion.numPlazas
            : null,
    };
}

// Compute function ant types experienceAverage
type OposicionesMinExp = {
    name: NameOposicion;
    year: number;
    numPresentados: number | null;
    results: {
        opositorId: string;
        presentado: boolean;
        aprobado: boolean | null;
    }[];
};
type WithExperienceAverage<T> = T & {
    experienceAverage: number;
};
export function computeExperienceAverage<
    Oposicion extends OposicionesMinExp
>(oposiciones: Oposicion[]): WithExperienceAverage<Oposicion>[] {
    return oposiciones.map((oposicion) => {
        const currentName = oposicion.name;
        const currentYear = oposicion.year;

        // Ob current loop, obtain array of successful opositores ids
        const currentResults = oposicion.results;
        const successfulOpositoresIds = currentResults
            .filter((opositor) => {
                return opositor.aprobado === true;
            })
            .map((opositor) => opositor.opositorId);

        // Cross check successful opositores array with same oposicion in previous years. Return a number with the total number of matches.
        const totalSuccessfulCandidatesExperience = oposiciones.reduce(
            (acc, oposicionPrevious) => {
                const previousName = oposicionPrevious.name;
                const previousYear = oposicionPrevious.year;
                const previousOpositoresIds = oposicionPrevious.results.map(
                    (opositor) => opositor.opositorId
                );
                if (
                    currentName === previousName &&
                    currentYear > previousYear
                ) {
                    const calculateMatches = (arr1: string[], arr2: string[]) =>
                        arr1.reduce(
                            (acc, opositorId) =>
                                acc + (arr2.includes(opositorId) ? 1 : 0),
                            0
                        );

                    const numberOfMatches = calculateMatches(
                        successfulOpositoresIds,
                        previousOpositoresIds
                    );
                    
                    return (acc = acc + numberOfMatches);
                } else {
                    return acc;
                }
            },
            successfulOpositoresIds.length
        );
        const experienceAverage =
            totalSuccessfulCandidatesExperience /
            successfulOpositoresIds.length;

        return {
            ...oposicion,
            experienceAverage,
        };
    });
}

// Compute function and types to convert to object based on year and name
type OposicionesMinObject = {
    name: NameOposicion;
    year: number;
};

type ReorderedObject<T> = {
    [year: number]: {
        [name: string]: T;
    };
};

export function computeReorderObjectByYearAndName<
    Oposiciones extends OposicionesMinObject[]
>(oposiciones: Oposiciones): ReorderedObject<OposicionesMinObject> {
    return oposiciones.reduce((accumulator, oposicion) => {
        const year = oposicion.year;
        const name = oposicion.name;

        return {
            ...accumulator,
            [year]: {
                ...accumulator[year],
                [name]: oposicion,
            },
        };
    }, {} as ReorderedObject<OposicionesMinObject>);
}
