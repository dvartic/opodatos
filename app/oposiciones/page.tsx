import { NameOposicion } from "@prisma/client";
import { SelectorComparador } from "../../components/oposiciones/selector-comparador";
import { Banner } from "../../components/oposiciones/banner";
import {
    computeLongName,
    computeAspirantesPlaza,
    computeExperienceAverage,
} from "../../server/utils/utils";

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

    const oposicionesWithLongNameAspPlaza = oposicionesLongName.map(
        (oposicion) => {
            return computeAspirantesPlaza(oposicion);
        }
    );

    const oposicionesWithExp = computeExperienceAverage(
        oposicionesWithLongNameAspPlaza
    );

    // Find latest year for each oposicion and return it
    const oposicionNames = Object.keys(NameOposicion);
    return oposicionNames.map((name) => {
        // Loop over each year until latest year for all oposiciones is found. Rememeber that data is preordered by year already
        return oposicionesWithExp.find(
            (oposicion) => name === oposicion.name
        ) as typeof oposicionesWithExp[0];
    });
}

export default async function Page() {
    const oposicionesDataLatestYear = await getOposicionesDataLatestYear();
    return (
        <main>
            <Banner />
            <SelectorComparador
                slug={null}
                oposicionesDataLatestYear={oposicionesDataLatestYear}
            />
        </main>
    );
}
