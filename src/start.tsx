/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import "./index.css";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function init() {
    if (document.readyState === "complete") {
        createRoot(document.getElementById("react-root")!).render(
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>,
        );

        return true;
    }
}

if (!init()) {
    document.addEventListener("readystatechange", init);
}
