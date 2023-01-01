import { NameOposicion } from "@prisma/client";

export function getLongName(shortName: string) {
    if (shortName === NameOposicion.THAC) {
        return "Técnico de Hacienda";
    } else if (shortName === NameOposicion.IHAC) {
        return "Inspector de Hacienda";
    } else {
        throw new TypeError("Error. longName has not been provided");
    }
}

export function normalizeStr(str: string) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}
