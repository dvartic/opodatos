import { Banner } from "../../components/buscador/banner";
import { Explorer } from "../../components/buscador/explorer";
import { getLongName } from "../../server/utils/utils";

export const revalidate = 1800;

// Necesitas: nombre, grupo, plazas, aspirantes, aspirantes/plaza, Media Exp. Aprobados. Todos los años.
async function getBuscadorData() {
    const oposiciones = await prisma.oposicion.findMany({
        orderBy: { year: "desc" },
        select: {
            name: true,
            grupo: true,
            year: true,
            numPlazas: true,
            numPresentados: true,
            results: {
                select: {
                    opositorId: true,
                    presentado: true,
                    aprobado: true,
                },
            },
        },
    });

    const oposicionesLongName = oposiciones.map((el) => {
        const longName = getLongName(el.name);
        return {
            longName: longName,
            ...el,
        };
    });

    // Group oposiciones by year and name in an object.

    // Type for reduce accumulator
    type Oposicion = typeof oposicionesLongName[0];
    interface Accumulator {
        [year: number]: {
            [name: string]: Oposicion;
        };
    }

    const oposicionesGroupedByYear = oposicionesLongName.reduce(
        (accumulator, oposicion) => {
            const year = oposicion.year;
            const name = oposicion.name;

            return {
                ...accumulator,
                [year]: {
                    ...accumulator[year],
                    [name]: oposicion,
                },
            };
        },
        {} as Accumulator
    );

    // Calculate average experience of successful candidates by year and oposicion

    const years = Object.keys(oposicionesGroupedByYear);
    const yearsNumber = years.map(Number);
    const objectLenght = years.length;

    interface OposicionExp extends Oposicion {
        experienceAverage: number | null;
    }
    interface OposicionYearExp {
        [name: string]: OposicionExp;
    }
    interface OposicionYearNameExp {
        [year: number]: OposicionYearExp;
    }

    const oposicionWithExp = yearsNumber.reduce((accumulator, year, indexI) => {
        // Get oposiciones for the current looped year
        const oposicionEachYear = oposicionesGroupedByYear[year];

        // Get array of oposicion names
        const namesArray = Object.keys(oposicionEachYear);

        // Perform a reduce loop adding experience to each oposicion. Loop performed based on namesArray, that contains each oposicion name per year.
        const oposicionWithExperience = namesArray.reduce(
            (accumulator, name, indexJ) => {
                // Get currently looped oposicion. Name is resolved.
                const oposicionCurrent = oposicionEachYear[name];

                // Access results array on the current oposicion
                const results = oposicionCurrent.results;

                // Get array with successful candiates IDs for the current process
                const successfulOpositoresIds = results.filter((opositor) => {
                    return opositor.aprobado === true;
                });

                // Cross check each successful candidate ID in the currently looped process agains all previous processes of the same oposicion but previous years. Returns an array that adds the experience property to each candidate.
                const successfulCandidatesExperience =
                    successfulOpositoresIds.map((opositor) => {
                        const candidateId = opositor.opositorId;
                        const previousYears = yearsNumber.slice(
                            indexI,
                            objectLenght
                        );

                        const experience = previousYears.reduce(
                            (accumulator, year) => {
                                const oposicion =
                                    oposicionesGroupedByYear[year][name];
                                const results = oposicion.results;
                                if (
                                    results.find(
                                        (opositor) =>
                                            opositor.opositorId === candidateId
                                    )
                                ) {
                                    return accumulator + 1;
                                } else {
                                    return accumulator;
                                }
                            },
                            0
                        );

                        return {
                            ...opositor,
                            experience: experience,
                        };
                    });

                // Loop  each successful candidate to calculate average experience of all successful candidates
                const experienceSum = successfulCandidatesExperience.reduce(
                    (accumulator, opositor) => {
                        return accumulator + opositor.experience;
                    },
                    0
                );
                const experienceAverage =
                    experienceSum / successfulCandidatesExperience.length;

                // Return a new object with the current oposicion and the experienceAverage property of all candidates
                return {
                    ...accumulator,
                    [namesArray[indexJ]]: {
                        ...oposicionCurrent,
                        experienceAverage: experienceAverage,
                    },
                };
            },
            {} as OposicionYearExp
        );

        // Return a new object that adds each looped oposicion containing the experienceAverage property
        return {
            ...accumulator,
            [yearsNumber[indexI]]: {
                ...accumulator[yearsNumber[indexI]],
                ...oposicionWithExperience,
            },
        };
    }, {} as OposicionYearNameExp);

    return oposicionWithExp;
}

// Provide type export to import from relevant components
type OposicionReturnValue = Awaited<ReturnType<typeof getBuscadorData>>;
export interface OposicionProps {
    oposiciones: OposicionReturnValue;
}

export default async function Page() {
    const oposiciones = await getBuscadorData();
    return (
        <main>
            <Banner />
            <Explorer oposiciones={oposiciones} />
        </main>
    );
}
