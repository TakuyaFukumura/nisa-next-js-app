import type {Metadata} from "next";
import "./globals.css";
import {DarkModeProvider} from "./components/DarkModeProvider";
import Header from "./components/Header";
import React from "react";
import {loadNisaData} from "../../lib/csvLoader";

export const metadata: Metadata = {
    title: "NISA利用状況",
    description: "NISAの利用状況をグラフで視覚的に表示するWebアプリケーション",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const records = loadNisaData();
    const latestYear = records.length > 0 ? Math.max(...records.map((r) => r.year)) : null;

    return (
        <html lang="ja">
        <body className="antialiased">
        <DarkModeProvider>
            <Header latestYear={latestYear}/>
            {children}
        </DarkModeProvider>
        </body>
        </html>
    );
}
