import prisma from "../server/db/client";
import { faker } from "@faker-js/faker";
import { GrupoOposicion, NameOposicion } from "@prisma/client";

// Generate an array of Oposiciones, that includes two oposiciones per year.
const numOEP = 10;
const startOEP = 2012;

function getRandomTHACValues() {
    const numPresentados = Math.floor(Math.random() * (7000 - 4000 + 1)) + 1;
    const numPlazas = Math.floor(Math.random() * (700 - 200 + 1)) + 1;
    const numAprobados = Math.floor(numPlazas * 0.95);
    const numAprobadosEj1 = Math.floor(numPresentados * 0.8);
    const numAprobadosEj2 = Math.floor(numPresentados * 0.6);
    const numAprobadosEj3 = numAprobados;

    return {
        numPresentados,
        numPlazas,
        numAprobados,
        numAprobadosEj1,
        numAprobadosEj2,
        numAprobadosEj3,
    };
}

function getRandomIHACValues() {
    const numPresentados = Math.floor(Math.random() * (4000 - 2000 + 1)) + 1;
    const numPlazas = Math.floor(Math.random() * (200 - 50 + 1)) + 1;
    const numAprobados = Math.floor(numPlazas * 0.95);
    const numAprobadosEj1 = Math.floor(numPresentados * 0.9);
    const numAprobadosEj2 = Math.floor(numPresentados * 0.8);
    const numAprobadosEj3 = Math.floor(numPresentados * 0.7);
    const numAprobadosEj4 = Math.floor(numPresentados * 0.6);
    const numAprobadosEj5 = numAprobados;

    return {
        numPresentados,
        numPlazas,
        numAprobados,
        numAprobadosEj1,
        numAprobadosEj2,
        numAprobadosEj3,
        numAprobadosEj4,
        numAprobadosEj5,
    };
}


const oposicionesTHAC = Array.from({ length: numOEP }).map((el, index) => {
    const randomTHACValues = getRandomTHACValues();
    return {
        data: {
            name: NameOposicion.THAC,
            year: startOEP + index,
            numPlazas: randomTHACValues.numPlazas,
            numPresentados: randomTHACValues.numPresentados,
            numAprobados: randomTHACValues.numAprobados,
            ejerciciosNum: {
                create: [
                    {
                        numEj: 1,
                        numAprobados: randomTHACValues.numAprobadosEj1,
                    },
                    {
                        numEj: 2,
                        numAprobados: randomTHACValues.numAprobadosEj2,
                    },
                    {
                        numEj: 3,
                        numAprobados: randomTHACValues.numAprobadosEj3,
                    },
                ],
            },
            grupo: {
                connect: {
                    grupo: GrupoOposicion.A2
                }
            }
        },
    };
});

const oposicionesIHAC = Array.from({ length: numOEP }).map((el, index) => {
    const randomIHACValues = getRandomIHACValues();
    return {
        data: {
            name: NameOposicion.IHAC,
            year: startOEP + index,
            numPlazas: randomIHACValues.numPlazas,
            numPresentados: randomIHACValues.numPresentados,
            numAprobados: randomIHACValues.numAprobados,
            ejerciciosNum: {
                create: [
                    {
                        numEj: 1,
                        numAprobados: randomIHACValues.numAprobadosEj1,
                    },
                    {
                        numEj: 2,
                        numAprobados: randomIHACValues.numAprobadosEj2,
                    },
                    {
                        numEj: 3,
                        numAprobados: randomIHACValues.numAprobadosEj3,
                    },
                    {
                        numEj: 4,
                        numAprobados: randomIHACValues.numAprobadosEj4,
                    },
                    {
                        numEj: 5,
                        numAprobados: randomIHACValues.numAprobadosEj5,
                    },
                ],
            },
            grupo: {
                connect: {
                    grupo: GrupoOposicion.A1
                }
            }
        },
    };
});

async function initializeDb() {
    // Exit function immediately if executed by mistake on production environment
    if (process.env.NODE_ENV === "production") {
        return;
    }

    // Delete all content from database.
    const deleteGrupoOposicionModel = prisma.grupoOposicionModel.deleteMany();
    const deleteOpositorOnOposicion = prisma.opositorOnOposicion.deleteMany();
    const deleteEjerciciosInd = prisma.ejercicioInd.deleteMany();
    const deleteEjerciciosNum = prisma.ejercicioNum.deleteMany();
    const deleteResults = prisma.result.deleteMany();
    const deleteOpositor = prisma.opositor.deleteMany();
    const deleteOposicion = prisma.oposicion.deleteMany();
    await prisma.$transaction([
        deleteGrupoOposicionModel,
        deleteOpositorOnOposicion,
        deleteEjerciciosInd,
        deleteEjerciciosNum,
        deleteResults,
        deleteOpositor,
        deleteOposicion,
    ]);

    // Create GrupoOposicion to link them to Oposicion
    await prisma.grupoOposicionModel.createMany({
        data: [
            {grupo: GrupoOposicion.A1},
            {grupo: GrupoOposicion.A2}
        ]   
    })

    // Loop THAC Oposiciones to create entries
    const createOposicionesTHACPromise = oposicionesTHAC.map(async (el) => {
        return await prisma.oposicion.create(el);
    });
    const createOposicionesTHAC = await Promise.all(
        createOposicionesTHACPromise
    );

    // Loop IHAC Oposiciones to create entries
    const createOposicionesIHACPromise = oposicionesIHAC.map(async (el) => {
        return await prisma.oposicion.create(el);
    });
    const createOposicionesIHAC = await Promise.all(
        createOposicionesIHACPromise
    );

    // Create random data for Opositores going for THAC
    const opositoresTHAC = Array.from({ length: numOEP }).map(
        (el, oepIndex) => {
            return Array.from({
                length: oposicionesTHAC[oepIndex].data.numPresentados,
            }).map((el, index) => {
                let aprobado = false;
                let aprobadoEj1 = false;
                let aprobadoEj2 = false;
                let aprobadoEj3 = false;
                if (index < oposicionesTHAC[oepIndex].data.numAprobados) {
                    aprobado = true;
                }
                if (
                    index <
                    oposicionesTHAC[oepIndex].data.ejerciciosNum.create[0]
                        .numAprobados
                ) {
                    aprobadoEj1 = true;
                }
                if (
                    index <
                    oposicionesTHAC[oepIndex].data.ejerciciosNum.create[1]
                        .numAprobados
                ) {
                    aprobadoEj2 = true;
                }
                if (
                    index <
                    oposicionesTHAC[oepIndex].data.ejerciciosNum.create[2]
                        .numAprobados
                ) {
                    aprobadoEj3 = true;
                }

                return {
                    data: {
                        name: faker.name.fullName(),
                        nif: faker.datatype.uuid(),
                        oposiciones: {
                            create: {
                                oposicion: {
                                    connect: {
                                        id: createOposicionesTHAC[oepIndex].id,
                                    },
                                },
                            },
                        },
                        results: {
                            create: [
                                {
                                    presentado: true,
                                    aprobado: aprobado,
                                    oposicion: {
                                        connect: {
                                            id: createOposicionesTHAC[oepIndex]
                                                .id,
                                        },
                                    },
                                    ejerciciosInd: {
                                        create: [
                                            {
                                                aprobado: aprobadoEj1,
                                                numEj: 1,
                                            },
                                            {
                                                aprobado: aprobadoEj2,
                                                numEj: 2,
                                            },
                                            {
                                                aprobado: aprobadoEj3,
                                                numEj: 3,
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                };
            });
        }
    );

    // Loop THAC Opositores to create new entries
    opositoresTHAC.forEach((oepEl) => {
        oepEl.forEach(async (el) => {
            await prisma.opositor.create(el);
        });
    });
}

// Execute function using catch statement
initializeDb()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });