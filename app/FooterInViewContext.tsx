"use client";

import { createContext, useContext, useState } from "react";

const FooterIsInViewContext = createContext(false);
const UpdateFooterIsInViewContext = createContext((inView: boolean) => {});

export function useFooterIsInView() {
    if (FooterIsInViewContext === undefined) {
        throw new Error(
            "useFooterIsInView must be used within a FooterInViewProvider"
        );
    }
    return useContext(FooterIsInViewContext);
}

export function useFooterIsInViewUpdate() {
    if (UpdateFooterIsInViewContext === undefined) {
        throw new Error(
            "useFooterIsInViewUpdate must be used within a FooterInViewProvider"
        );
    }
    return useContext(UpdateFooterIsInViewContext);
}

export function FooterInViewProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [footerIsInView, setFooterIsInView] = useState(false);

    function toggleFooterIsInView(inView: boolean) {
        setFooterIsInView(inView);
    }

    return (
        <FooterIsInViewContext.Provider value={footerIsInView}>
            <UpdateFooterIsInViewContext.Provider value={toggleFooterIsInView}>
                {children}
            </UpdateFooterIsInViewContext.Provider>
        </FooterIsInViewContext.Provider>
    );
}
