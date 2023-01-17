import { NameOposicion } from "@prisma/client";
import { notFound } from "next/navigation";
import { Banner } from "../../../components/oposiciones/banner";
import { SelectorComparador } from "../../../components/oposiciones/selector-comparador";
import {
    computeLongName,
    computeAspirantesPlaza,
    computeExperienceAverage,
    computeReorderObjectByYearAndName,
} from "../../../server/utils/utils";

export const revalidate = 1800;

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    // Get all slugs
    const slugsObject = NameOposicion;
    const slugsArr = Object.keys(slugsObject);
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

export type OposicionesDataLatestYearReturnType = Awaited<
    ReturnType<typeof getOposicionesDataLatestYear>
>;

export default async function Page({ params }: Props) {
    const slug = params.slug;

    // You need to determine if oposicion exists or not and if not return 404
    

    const oposicionesDataLatestYear = await getOposicionesDataLatestYear();
    return (
        <main>
            <Banner />
            <SelectorComparador
                slug={slug}
                oposicionesDataLatestYear={oposicionesDataLatestYear}
            />
        </main>
    );
}


/* async function getOposicionDataLatestYearBySlug(slug: NameOposicion) {
    // You need to find a unique oposicion by slug and last year.
    const oposicion = await prisma.oposicion.findFirst({
        where: {
            name: slug,
        },
        orderBy: { year: "desc" },
        select: {
            name: true,
            grupo: true,
            year: true,
            numPlazas: true,
            numPresentados: true,
        },
    });

    if (oposicion) {
        const oposicionWithLongName = computeLongName(oposicion);
        const oposicionWithLongNameAspPlaza = computeAspirantesPlaza(
            oposicionWithLongName
        );
        return oposicionWithLongNameAspPlaza;
    } else {
        return notFound();
    }
} */