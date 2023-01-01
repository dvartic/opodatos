import { GrupoOposicion } from "@prisma/client";
import { Banner } from "../components/home/banner";
import { CallToAction } from "../components/home/call-to-action";
import { Features } from "../components/home/features";
import { OposicionesPreview } from "../components/home/oposiciones-preview";
import { PlazasGraph } from "../components/home/plazas-graph";
import prisma from "../server/db/client";
import { getLongName } from "../server/utils/utils";

// Sets segment caching behavior to enable ISR
export const revalidate = 1800;

// Gets data for graph
async function getGraphData() {
    const groupPlazas = await prisma.oposicion.groupBy({
        by: ["year"],
        orderBy: { year: "asc" },
        _sum: {
            numPlazas: true,
        },
    });

    const nivoData = groupPlazas.map((el) => {
        return {
            x: el.year,
            y: el._sum.numPlazas,
        };
    });

    return [
        {
            id: "Total Plazas",
            color: "hsl(255, 70%, 50%)",
            data: nivoData,
        },
    ];
}

// Gets data for searchBox
async function getOposicionList() {
    const oposicionList = await prisma.oposicion.findMany({
        distinct: ["name"],
        select: {
            name: true,
            grupo: true,
        },
    });

    const oposicionListLong = oposicionList.map((el) => {
        const longName = getLongName(el.name);
        return {
            longName: longName,
            ...el,
        };
    });

    return oposicionListLong;
}

// Gets data for OposicionesPreview
async function getTablesData() {
    // Data for "ULTIMAS OPOSICIONES" Table
    const latestOposiciones = await prisma.oposicion.findMany({
        take: 4,
        orderBy: [{ year: "desc" }, { createdAt: "asc" }],
        select: {
            name: true,
            year: true,
            numPresentados: true,
            numPlazas: true,
            grupo: {
                select: {
                    grupo: true,
                }
            }
        },
    });

    const latestOposicionLong = latestOposiciones.map((el) => {
        const longName = getLongName(el.name);
        return {
            longName: longName,
            ...el,
        };
    });

    // Data for "MENOR COMPETENCIA" Table
    const oposicionCount = Object.keys(GrupoOposicion).length;

    const lastOposicionesWithNumPresentados = await prisma.oposicion.findMany({
        take: oposicionCount,
        where: {
            numPresentados: { gt: 0 },
        },
        select: {
            name: true,
            year: true,
            numPresentados: true,
            numPlazas: true,
            grupo: {
                select: {
                    grupo: true,
                }
            }
        },
        orderBy: { year: "desc" },
    });

    const addedLongName = lastOposicionesWithNumPresentados.map((el) => {
        const longName = getLongName(el.name);
        return {
            longName: longName,
            ...el,
        };
    });

    const leastCompetitionOposiciones = addedLongName.map((el) => {
        if (el.numPresentados) {
            return {
                presentadosPlaza: el.numPresentados / el.numPlazas,
                ...el,
            };
        } else {
            throw new Error(
                "Error. DB Query has resulted in a null numPresentados field"
            );
        }
    });

    const leastCompetitionOposicionesOrder = leastCompetitionOposiciones.sort(
        (a, b) => {
            if (a.presentadosPlaza > b.presentadosPlaza) {
                return 1;
            } else if (a.presentadosPlaza < b.presentadosPlaza) {
                return -1;
            } else {
                return 0;
            }
        }
    );

    return {
        latestOposicionLong,
        leastCompetitionOposicionesOrder,
    };
}

export default async function Page() {
    const graphDataPromise = getGraphData();
    const oposicionListPromise = getOposicionList();
    const tablesDataPromise = getTablesData();

    const [graphData, oposicionList, tablesData] = await Promise.all([
        graphDataPromise,
        oposicionListPromise,
        tablesDataPromise,
    ]);

    return (
        <main>
            <Banner oposicionList={oposicionList} />
            <OposicionesPreview tablesData={tablesData} />
            <PlazasGraph graphData={graphData} />
            <Features />
            <CallToAction />
        </main>
    );
}
