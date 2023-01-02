import { Banner } from "../../components/buscador/banner";
import { Explorer } from "../../components/buscador/explorer";

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

    // Group oposiciones by year and name in an object.

    // Type for reduce accumulator
    type Oposicion = typeof oposiciones[0];
    interface Accumulator {
        [year: number]: {
            [name: string]: Oposicion;
        };
    }

    const oposicionesGroupedByYear = oposiciones.reduce(
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

    interface OposicionYear {
        [name: string]: Oposicion;
    }
    function getOposicionesGroupedByYearWithExperience() {
        function getOposicionWithExperience(
            namesArray: string[],
            year: OposicionYear,
            i: number
        ) {
            const oposicionWithExperience = namesArray.reduce(
                (accumulator, name, index) => {
                    const oposicionCurrent = year[name];
                    const results = oposicionCurrent.results;

                    // Get array with successful candiates IDs for the current process
                    const successfulOpositoresIds = results.filter(
                        (opositor) => {
                            return opositor.aprobado === true;
                        }
                    );

                    // Check array of successful candidates IDs in previous years and same oposicion
                    const successfulCandidatesExperience =
                        successfulOpositoresIds.map((opositor) => {
                            const candidateId = opositor.opositorId;
                            const previousYears = yearsNumber.slice(
                                i,
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
                                                opositor.opositorId ===
                                                candidateId
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

                    // Calculate average experience of successful candidates
                    const experienceSum = successfulCandidatesExperience.reduce(
                        (accumulator, opositor) => {
                            return accumulator + opositor.experience;
                        },
                        0
                    );

                    const experienceAverage =
                        experienceSum / successfulCandidatesExperience.length;

                    return {
                        ...accumulator,
                        [namesArray[index]]: {
                            ...oposicionCurrent,
                            experienceAverage: experienceAverage,
                        },
                    };
                },
                {}
            );

            return oposicionWithExperience;
        }

        type OposicionWithExperience = ReturnType<
            typeof getOposicionWithExperience
        >;
        interface Accumulator2 {
            [year: number]: OposicionWithExperience;
        }

        const reducedResult = yearsNumber.reduce((accumulator, year, index) => {
            const oposicionEachYear = oposicionesGroupedByYear[year];
            const namesArray = Object.keys(oposicionEachYear);

            const oposicionWithExperience = getOposicionWithExperience(
                namesArray,
                oposicionEachYear,
                index
            );

            return {
                ...accumulator,
                [yearsNumber[index]]: {
                    ...accumulator[yearsNumber[index]],
                    ...oposicionWithExperience,
                },
            };
        }, {} as Accumulator2);

        return reducedResult;
    }

    const oposicionesGroupedByYearWithExperience =
        getOposicionesGroupedByYearWithExperience();

    return oposicionesGroupedByYearWithExperience;
}

export default async function Page() {
    const oposiciones = await getBuscadorData();
    /* console.log(oposiciones); */
    return (
        <main>
            <Banner />
            <Explorer />
        </main>
    );
}
