import DefaultTags from "./DefaultTags";

export default function Head() {
    return (
        <>
            <DefaultTags />
            <title>OpoDatos Estadísticas de Oposiciones</title>
            <meta
                name="description"
                content="OpoDatos es el portal de referencia para datos y estadísticas de oposiciones en España"
            />
            <meta
                property="og:title"
                content="OpoDatos Estadísticas de Oposiciones"
            />
            <meta
                property="og:description"
                content="OpoDatos es el portal de referencia para datos y estadísticas de oposiciones en España"
            />
        </>
    );
}
