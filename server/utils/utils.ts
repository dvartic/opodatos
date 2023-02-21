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
export function computeLongName<Oposicion extends Name>(oposicion: Oposicion): WithFullName<Oposicion> {
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
        aspirantesPlaza: oposicion.numPresentados ? oposicion.numPresentados / oposicion.numPlazas : null,
    };
}

// Compute function ant types experienceAverage. This function ACCEPTS an array of mixed oposiciones.
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
export function computeExperienceAverage<Oposicion extends OposicionesMinExp>(
    oposiciones: Oposicion[]
): WithExperienceAverage<Oposicion>[] {
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
        const totalSuccessfulCandidatesExperience = oposiciones.reduce((acc, oposicionPrevious) => {
            const previousName = oposicionPrevious.name;
            const previousYear = oposicionPrevious.year;
            const previousOpositoresIds = oposicionPrevious.results.map((opositor) => opositor.opositorId);
            if (currentName === previousName && currentYear > previousYear) {
                const calculateMatches = (arr1: string[], arr2: string[]) =>
                    arr1.reduce((acc, opositorId) => acc + (arr2.includes(opositorId) ? 1 : 0), 0);

                const numberOfMatches = calculateMatches(successfulOpositoresIds, previousOpositoresIds);

                return (acc = acc + numberOfMatches);
            } else {
                return acc;
            }
        }, successfulOpositoresIds.length);
        const experienceAverage = totalSuccessfulCandidatesExperience / successfulOpositoresIds.length;

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

export function computeReorderObjectByYearAndName<Oposiciones extends OposicionesMinObject[]>(
    oposiciones: Oposiciones
): ReorderedObject<OposicionesMinObject> {
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

// Parse slug string for Oposicion routes, which can be either NameOposicion or a combination of two NameOposicion
export function getOposicionInSlug(num: 0 | 1, slug: string | null) {
    if (!slug) {
        return null;
    } else if (Object.keys(NameOposicion).includes(slug) && num === 0) {
        return slug as NameOposicion;
    } else {
        return slug.split("vs")[num] as NameOposicion;
    }
}

export function formatNumberToDisplay(num: string | number | null) {
    if (!num) {
        return "N/A";
    } else if (typeof num === "string") {
        return (Math.round(parseFloat(num) * 100 + Number.EPSILON) / 100).toLocaleString();
    } else {
        return (Math.round(num * 100 + Number.EPSILON) / 100).toLocaleString();
    }
}

export function calculatePercentageVariation(baseNum: number, mainNum: number) {
    return (mainNum - baseNum) / baseNum;
}

// Function that when given an array of objects and a minimum array of keys, will return the first object in the array that has all keys populated with non-null or non-undefined values.
type MinDataType = {
    [key: string]: any;
};
type ReturnType<T> = T | null;

export function getFirstObjectWithMinKeys<Oposicion extends MinDataType>(
    dataArr: Oposicion[],
    minKeysArr: string[]
): ReturnType<Oposicion> {
    const foundObject = dataArr.find((objectEl) => {
        return minKeysArr.every((key) => {
            if (objectEl[key]) {
                return typeof objectEl[key] !== null || undefined;
            } else {
                return false;
            }
        });
    });
    if (foundObject) {
        return foundObject;
    } else {
        return null;
    }
}

// Function that when given an oposicion data series containing a minimum set of keys, will return a probability of passing, continuing and abandoning for candidates
// This function REQUIRES a data series containing only one oposicion.
type PerspectivaExito = {
    name: NameOposicion;
    year: number;
    numPresentados: number | null; // We have removed null because we need this variable to perform the calculation.
    results: {
        opositorId: string;
        presentado: boolean;
        aprobado: boolean | null;
    }[];
};

export function generatePerspectivaExito(
    oposiciones: PerspectivaExito[],
    yearStart: number | null, //  included
    yearEnd: number | null // included
) {
    // Determine if yearStart and yearEnd are within acceptable ranges. yearStart must be lower than yearEnd, exist on oposiciones and be at least 2 years ahead of first year available. yearEnd must at max the last year available - 2
    if (!yearStart || !yearEnd) {
        return null;
    }
    const isYearStartLower = yearStart - yearEnd < 0;
    const doesYearStartExist = oposiciones.some((oposicion) => oposicion.year === yearStart);
    const isYearStartAtLeastFirstMinus2 = oposiciones.some((oposicion) => oposicion.year === yearStart - 2);
    const doesYearEndExist = oposiciones.some((oposicion) => oposicion.year === yearEnd);
    const isYearEndAtLeastLastPlus2 = oposiciones.some((oposicion) => oposicion.year === yearEnd + 2);

    if (
        !isYearStartLower ||
        !doesYearStartExist ||
        !doesYearEndExist ||
        !isYearEndAtLeastLastPlus2 ||
        !isYearStartAtLeastFirstMinus2
    ) {
        return null;
    } else {
        // Order oposiciones to make sure calculations are performed always with the same ordering
        const oposicionesOrder = oposiciones;
        oposicionesOrder.sort((oposicionA, oposicionB) => {
            return oposicionA.year - oposicionB.year;
        });

        // Get array of oposiciones in the period and arrays of oposiciones outside of period for data control
        const oposicionIndexStart = oposicionesOrder.findIndex((oposicion) => oposicion.year === yearStart);
        const oposicionIndexEnd = oposicionesOrder.findIndex((oposicion) => oposicion.year === yearEnd);
        const oposicionesInPeriod = oposicionesOrder.slice(
            oposicionIndexStart,
            oposicionIndexEnd + 1 // Plus 1 because end not included in slice
        );
        const oposicionesPeriodMinus2 = oposicionesOrder.slice(oposicionIndexStart - 2, oposicionIndexStart); // End not included
        const oposicionesPeriodPlus2 = oposicionesOrder.slice(oposicionIndexEnd + 1, oposicionIndexEnd + 3); // End not included

        // Create array containing all opositorIds that have attempted the exams per year in the period.
        const presentadosArraysIdsInPeriod = oposicionesInPeriod.map((oposicion) => {
            const resultsPresentados = oposicion.results.filter((result) => result.presentado === true);
            return resultsPresentados.map((result) => result.opositorId);
        });
        const flatArrayPresentados = presentadosArraysIdsInPeriod.flat(); // Merge all arrays
        const deduplicatedArrayPresentados = [...new Set(flatArrayPresentados)]; // Perform deduplication

        // Filter array of Ids with those that were already attending the exams in either yearStart -1 or -2
        const filteredArrayPresentados = deduplicatedArrayPresentados.filter((presentadoId) => {
            return !oposicionesPeriodMinus2.some((oposicion) => {
                const presentadosArrPreviously = oposicion.results
                    .filter((result) => result.presentado === true)
                    .map((result) => result.opositorId);
                return presentadosArrPreviously.includes(presentadoId);
            });
        });

        // Find Ids of people that passed the exams in the period
        const aprobadosArraysIdsInPeriod = oposicionesInPeriod.map((oposicion) => {
            const resultsAprobados = oposicion.results.filter((result) => result.aprobado === true);
            return resultsAprobados.map((result) => result.opositorId);
        });
        const flatArrayAprobados = aprobadosArraysIdsInPeriod.flat(); // Merge all arrays
        const deduplicatedArrayAprobados = [...new Set(flatArrayAprobados)]; // Perform deduplication

        // Filter Aprobados to only include those that started to attend in the period. This is the final value for people that have passed.
        const filteredArrayAprobados = deduplicatedArrayAprobados.filter((aprobadoId) =>
            filteredArrayPresentados.includes(aprobadoId)
        );

        // Find people that have started to attend exams in the period, have not passed, and CONTINUE to attends exams later.
        const arrayNotAprobados = filteredArrayPresentados.filter(
            (presentadosId) => !filteredArrayAprobados.includes(presentadosId)
        );
        const filteredArrayNotAprobadosAndContinue = arrayNotAprobados.filter((noAprobadoId) => {
            return oposicionesPeriodPlus2.some((oposicion) => {
                const presentadosArrAfter = oposicion.results
                    .filter((result) => result.presentado === true)
                    .map((result) => result.opositorId);
                return presentadosArrAfter.includes(noAprobadoId);
            });
        });
        const totalNumberPresentados = filteredArrayPresentados.length; // Count total number of people that started attending exams in the period
        const totalNumberAprobados = filteredArrayAprobados.length; // Count aprobados in the period of those that started attending exams in the period
        const totalNumberNotAprobadosThatContinue = filteredArrayNotAprobadosAndContinue.length;
        const totalNumberNotAprobadosNotContinue = totalNumberAprobados - totalNumberNotAprobadosThatContinue;

        return {
            aprobar: totalNumberAprobados / totalNumberPresentados,
            continuar: totalNumberNotAprobadosThatContinue / totalNumberPresentados,
            abandonar: 1 - totalNumberNotAprobadosNotContinue / totalNumberPresentados,
        };
    }
}

// Create data series for Perspectiva Exito with rolling values for period.
// This function REQUIRES only a data series of one oposicion to be passed
export function generatePerspectivaExitoDataSeries(oposiciones: PerspectivaExito[], rollingPeriods: number[]) {
    // You need to loop oposiciones and construct a data series. You need to call computePerspectivaExito

    const yearsArr = oposiciones.map((oposicion) => oposicion.year);
    yearsArr.sort((yearA, yearB) => yearA - yearB);

    return rollingPeriods.map((rollingPeriod) => {
        const trimmedYearsArr = yearsArr.slice(2 + rollingPeriod - 1, yearsArr.length - 2); // We need to remove 2 years at the start plus reserve the rolling period and 2 years at the end for control

        const dataSeries = trimmedYearsArr.map((year) => {
            const yearStart = year - rollingPeriod + 1;
            const yearEnd = year;

            const perspectivaExito = generatePerspectivaExito(oposiciones, yearStart, yearEnd)?.aprobar;
            return {
                x: year,
                y: perspectivaExito,
            };
        });

        return {
            [rollingPeriod]: dataSeries,
        };
    });
}
