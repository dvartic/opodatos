import { NameOposicion } from "@prisma/client";
import { createContext, useContext, useState } from "react";

interface SelectorTypes {
    selectedOposicion: NameOposicion | null;
    secondOposicion: NameOposicion | null;
}

const SelectorContext = createContext<SelectorTypes>({
    selectedOposicion: null,
    secondOposicion: null,
});
const UpdateSelectorContext = createContext(
    (
        oposicionName: NameOposicion | null,
        selectorName: "selectedOposicion" | "secondOposicion"
    ) => {}
);

export function useSelectorContext() {
    if (SelectorContext === undefined) {
        throw new Error(
            "useSelectorContext must be used within a SelectorProvider"
        );
    }
    return useContext(SelectorContext);
}

export function useUpdateSelectorContext() {
    if (UpdateSelectorContext === undefined) {
        throw new Error(
            "useUpdateSelectorContext must be used within a SelectorProvider"
        );
    }
    return useContext(UpdateSelectorContext);
}

export function SelectorProvider({ children }: { children: React.ReactNode }) {
    const [selectorState, setSelectorState] = useState<SelectorTypes>({
        selectedOposicion: null,
        secondOposicion: null,
    });

    function updateSelectorState(
        oposicionName: NameOposicion | null,
        selectorName: "selectedOposicion" | "secondOposicion"
    ) {
        setSelectorState((prevState) => {
            return { ...prevState, [selectorName]: oposicionName };
        });
    }

    return (
        <SelectorContext.Provider value={selectorState}>
            <UpdateSelectorContext.Provider value={updateSelectorState}>
                {children}
            </UpdateSelectorContext.Provider>
        </SelectorContext.Provider>
    );
}
