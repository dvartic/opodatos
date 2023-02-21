"use client";

import { SelectorProvider } from "./oposicion-selector-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return <SelectorProvider>{children}</SelectorProvider>;
}
