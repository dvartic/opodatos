import { NameOposicion } from "@prisma/client";
import { notFound } from "next/navigation";
import { Banner } from "../../../components/oposiciones/banner";
import { OposicionStats } from "../../../components/oposiciones/oposicion-stats-2";
import { SelectorComparador } from "../../../components/oposiciones/selector-comparador";
import {
    computeLongName,
    computeAspirantesPlaza,
    computeExperienceAverage,
    getOposicionInSlug,
    getFirstObjectWithMinKeys,
    generatePerspectivaExito,
    generatePerspectivaExitoDataSeries,
} from "../../../server/utils/utils";
import prisma from "../../../server/db/client";

export const revalidate = 1800;

interface Props {
    params: { slug: string };
}

// Helper function to get all possible slugs, which are names of each oposicion plus combinations for comparison routes
function getValidSlugs() {
    // Get all slugs
    const namesObject = NameOposicion;
    const namesArr = Object.keys(namesObject);

    // Get all possible combinations of two names (without duplicates) that can be used for comparison routes
    const combinationsArr = namesArr.flatMap((name, index) => {
        return namesArr.slice(index + 1).flatMap((name2) => [name + "vs" + name2, name2 + "vs" + name]);
    });

    const slugsArr = namesArr.concat(combinationsArr);
    return slugsArr;
}

export async function generateStaticParams() {
    const slugsArr = getValidSlugs();

    return slugsArr.map((slug) => {
        return { slug: slug };
    });
}

async function getOposicionesDataLatestYear() {
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

    const oposicionesLongName = oposiciones.map((oposicion) => {
        return computeLongName(oposicion);
    });

    const oposicionesWithLongNameAspPlaza = oposicionesLongName.map((oposicion) => {
        return computeAspirantesPlaza(oposicion);
    });

    const oposicionesWithExp = computeExperienceAverage(oposicionesWithLongNameAspPlaza);

    // Find latest year for each oposicion and return it
    const oposicionNames = Object.keys(NameOposicion);
    return oposicionNames.map((name) => {
        // Filter oposiciones by required name
        const oposicionArrWithExactName = oposicionesWithExp.filter((oposicion) => name === oposicion.name);

        // Find the latest year with a minimum non-null set of keys
        return getFirstObjectWithMinKeys(oposicionArrWithExactName, [
            "numPlazas",
            "numPresentados",
        ]) as typeof oposicionesWithExp[0];
    });
}
export type OposicionesDataLatestYearReturnType = Awaited<ReturnType<typeof getOposicionesDataLatestYear>>;

// Get data for OposicionStats component based on slug
async function getOposicionesDataBySlugs(slug: string) {
    // Parse slug string, which can be either NameOposicion or a combination of two NameOposicion
    const oposicionName0InSlug = getOposicionInSlug(0, slug) as NameOposicion;
    const oposicionName1InSlug = getOposicionInSlug(1, slug);

    // Get all data for oposiciones with names being oposicionName1InSlug and oposicionName2InSlug
    const oposicionesData = await prisma.oposicion.findMany({
        where: {
            OR: [
                { name: oposicionName0InSlug },
                {
                    name: oposicionName1InSlug ? oposicionName1InSlug : undefined,
                },
            ],
        },
        orderBy: [{ year: "desc" }, { createdAt: "asc" }],
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

    // Add computed fields
    const oposicionesLongName = oposicionesData.map((oposicion) => {
        return computeLongName(oposicion);
    });
    const oposicionesWithLongNameAspPlaza = oposicionesLongName.map((oposicion) => {
        return computeAspirantesPlaza(oposicion);
    });
    const oposicionesWithExp = computeExperienceAverage(oposicionesWithLongNameAspPlaza);

    // Split data into two arrays, one for each oposicion. Remember that data is already ordered by year.
    const oposicionDataSlug0 = oposicionesWithExp.filter((oposicion) => {
        return oposicion.name === oposicionName0InSlug;
    });

    let oposicionDataSlug1: typeof oposicionesWithExp | undefined;
    if (oposicionName1InSlug) {
        oposicionDataSlug1 = oposicionesWithExp.filter((oposicion) => {
            return oposicion.name === oposicionName1InSlug;
        });
    }

    // Function that returns a data object for Nivo based on data to display, for cases where the data needed is already part of a oposicion object (native or computed field)
    type Variable = "numPlazas" | "numPresentados" | "aspirantesPlaza" | "experienceAverage";
    function getNivoObjectFromField(variable: Variable) {
        return Array.from({
            length: oposicionName1InSlug ? 2 : 1,
        }).map((el, index) => {
            if (index === 0) {
                return {
                    id: oposicionName0InSlug,
                    color: "hsl(255, 70%, 50%)",
                    data: oposicionDataSlug0
                        .map((oposicion) => {
                            return {
                                x: oposicion.year,
                                y: oposicion[variable],
                            };
                        })
                        .sort((dataPointA, dataPointB) => dataPointA.x - dataPointB.x),
                };
            } else {
                return {
                    id: oposicionName1InSlug,
                    color: "hsl(255, 70%, 50%)",
                    data: oposicionDataSlug1
                        ?.map((oposicion) => {
                            return {
                                x: oposicion.year,
                                y: oposicion[variable],
                            };
                        })
                        .sort((dataPointA, dataPointB) => dataPointA.x - dataPointB.x),
                };
            }
        });
    }

    // Generate Data Object for first group of graphs
    const graphsDataObject0 = {
        numPlazas: {
            graphHeader: "Plazas",
            nivoData: getNivoObjectFromField("numPlazas"),
        },
        numPresentados: {
            graphHeader: "Aspirantes",
            nivoData: getNivoObjectFromField("numPresentados"),
        },
        aspirantesPlaza: {
            graphHeader: "Aspirantes/Plaza",
            nivoData: getNivoObjectFromField("aspirantesPlaza"),
        },
    };

    // Generate Second Data Object for second group of graphs
    const perspectivaExito = Array.from({
        length: oposicionName1InSlug ? 2 : 1,
    }).map((el, index) => {
        if (index === 0) {
            return {
                id: oposicionName0InSlug,
                color: "hsl(255, 70%, 50%)",
                data: generatePerspectivaExitoDataSeries(oposicionDataSlug0, [4]).flatMap((result) => result["4"]),
            };
        } else {
            if (oposicionDataSlug1) {
                // Check that the variable actually exists
                return {
                    id: oposicionName1InSlug,
                    color: "hsl(255, 70%, 50%)",
                    data: generatePerspectivaExitoDataSeries(oposicionDataSlug1, [4]).flatMap((result) => result["4"]),
                };
            }
        }
    }) as ReturnType<typeof getNivoObjectFromField>;
    const graphsDataObject1 = {
        experienceAverage: {
            graphHeader: "Experiencia Media Aprobados",
            nivoData: getNivoObjectFromField("experienceAverage"),
        },
        perspectivaExito: {
            graphHeader: "Perspectiva de Éxito",
            nivoData: perspectivaExito,
        },
    };

    // Merges two arrays deep of objects into a new object by key year, removes duplicates and sorts by year
    type DataElement = {
        id: NameOposicion | null;
        color: string;
        data:
            | {
                  x: number;
                  y: number | null;
              }[]
            | undefined;
    }[];
    function getFormatDataForTable(dataElement: DataElement) {
        // Make sure that route includes two oposiciones to merge
        if (oposicionName0InSlug && oposicionName1InSlug) {
            // Determine length of the final array based on years of both oposiciones. "x" is the year
            const years0Array = dataElement[0].data?.map((dataPoint) => dataPoint.x);

            const years1Array = dataElement[1]?.data?.map((dataPoint) => dataPoint.x);
            const yearsConcat = years0Array?.concat(years1Array ? years1Array : []);
            const yearsUnique = [...new Set(yearsConcat)]; // Remove duplicates
            const yearsUniqueSorted = yearsUnique.sort((a, b) => a - b); // Sort by year

            // Access data arrays from each oposicion
            const data0 = dataElement[0]?.data;
            const data1 = dataElement[1]?.data;

            // Create an array of objects merging data from both oposiciones. Maps each unique year ordered before
            return yearsUniqueSorted.map((year) => {
                const oposicion0y = data0?.find((dataPoint) => dataPoint.x === year)?.y as number;
                const oposicion1y = data1?.find((dataPoint) => dataPoint.x === year)?.y as number;
                return {
                    x: year,
                    y: oposicion0y ? oposicion0y : "N/A",
                    z: oposicion1y ? oposicion1y : "N/A",
                };
            });
        } else {
            // If single route, return just data for the first oposicion. x is the year and y the value
            return dataElement[0]?.data;
        }
    }

    // Define tuples with keys that each element should have
    const minKeys0: ("numPlazas" | "numPresentados" | "aspirantesPlaza")[] = [
        "numPlazas",
        "numPresentados",
        "aspirantesPlaza",
    ];

    const minKeys1: ["experienceAverage"] = ["experienceAverage"];
    const minKeysPlusCustom1: ["experienceAverage", "perspectivaExito4Y"] = ["experienceAverage", "perspectivaExito4Y"];

    // Calculations for Perspectiva Exito
    const secondArrOposicion0Data = getFirstObjectWithMinKeys(
        oposicionDataSlug0.sort((oposicionA, oposicionB) => oposicionB.year - oposicionA.year),
        minKeys1
    );
    const secondArrOposicion0YearEnd = secondArrOposicion0Data?.year ? secondArrOposicion0Data?.year - 2 : null;
    const secondArrOposicion0YearStart = secondArrOposicion0YearEnd ? secondArrOposicion0YearEnd - 4 : null;
    const perspectivaExito0 = generatePerspectivaExito(
        oposicionDataSlug0,
        secondArrOposicion0YearStart,
        secondArrOposicion0YearEnd
    )?.aprobar;

    const oposicion0SecondArr =
        secondArrOposicion0Data || perspectivaExito0
            ? {
                  ...secondArrOposicion0Data,
                  perspectivaExito4Y: perspectivaExito0,
              }
            : null;

    const secondArrOposicion1Data = oposicionDataSlug1
        ? getFirstObjectWithMinKeys(
              oposicionDataSlug1.sort((oposicionA, oposicionB) => oposicionB.year - oposicionA.year),
              minKeys1
          )
        : null;
    const secondArrOposicion1YearEnd = secondArrOposicion1Data?.year ? secondArrOposicion1Data?.year - 2 : null;
    const secondArrOposicion1YearStart = secondArrOposicion1YearEnd ? secondArrOposicion1YearEnd - 4 : null;

    const perspectivaExito1 = oposicionDataSlug1
        ? generatePerspectivaExito(oposicionDataSlug1, secondArrOposicion1YearStart, secondArrOposicion1YearEnd)
              ?.aprobar
        : null;

    const oposicion1SecondArr =
        secondArrOposicion1Data || perspectivaExito1
            ? {
                  ...secondArrOposicion1Data,
                  perspectivaExito4Y: perspectivaExito1,
              }
            : null;

    // Construct an array to structure data in a way that is easily mappable by a React tree
    return [
        {
            objectDataKeys: minKeys0,

            titleStr: "Plazas, Aspirantes, Aspirantes por Plaza",

            tableHeaders: ["Plazas", "Aspirantes", "Aspirantes/Plaza"],

            oposicion0LatestYear: getFirstObjectWithMinKeys(
                oposicionDataSlug0.sort((oposicionA, oposicionB) => oposicionB.year - oposicionA.year),
                minKeys0
            ),

            oposicion1LatestYear: oposicionDataSlug1
                ? getFirstObjectWithMinKeys(
                      oposicionDataSlug1.sort((oposicionA, oposicionB) => oposicionB.year - oposicionA.year),
                      minKeys0
                  )
                : null,

            graphsDataObject: graphsDataObject0,

            formattedTableData: Object.keys(graphsDataObject0).map((key) => {
                const objectKey = key as keyof typeof graphsDataObject0;
                return getFormatDataForTable(graphsDataObject0[objectKey].nivoData);
            }),
            isMoreBetter: {
                numPlazas: true,
                numPresentados: false,
                aspirantesPlaza: false,
            },
        },
        {
            objectDataKeys: minKeysPlusCustom1,

            titleStr: "Experiencia Media Aprobados y Perspectivas de Éxito",

            tableHeaders: ["Experiencia Media Aprobados", "Perspectiva de Éxito"],

            oposicion0LatestYear: oposicion0SecondArr,

            oposicion1LatestYear: oposicion1SecondArr,

            graphsDataObject: graphsDataObject1,

            formattedTableData: Object.keys(graphsDataObject1).map((key) => {
                const objectKey = key as keyof typeof graphsDataObject1;
                return getFormatDataForTable(graphsDataObject1[objectKey].nivoData);
            }),

            isMoreBetter: {
                experienceAverage: false,
                perspectivaExito4Y: false,
            },
        },
    ];
}
export type OposicionesDataBySlugReturnType = Awaited<ReturnType<typeof getOposicionesDataBySlugs>>;

export default async function Page({ params }: Props) {
    // You need better handling for this
    const slug = params.slug;

    // Dynamically determine if the slug is valid. If it is not, return 404
    const validSlugs = getValidSlugs();
    if (!validSlugs.includes(slug)) {
        return notFound();
    }

    const [oposicionesDataLatestYear, oposicionesDataBySlug] = await Promise.all([
        getOposicionesDataLatestYear(),
        getOposicionesDataBySlugs(slug),
    ]);

    return (
        <main>
            <Banner />
            <SelectorComparador slug={slug} oposicionesDataLatestYear={oposicionesDataLatestYear} />
            <OposicionStats slug={slug} dataStructureArr={oposicionesDataBySlug} />
        </main>
    );
}
