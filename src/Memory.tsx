/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { Container } from "@mui/material";
import { useIntervalEffect } from "@react-hookz/web";
import React, { useContext, useRef, useState, type FunctionComponent } from "react";

import { AppContext } from "./App";
import style from "./Memory.module.css";

const MIN_BORDER = 0;
const MAX_BORDER = 4;

const Cell: FunctionComponent = () => {
    const { trend } = useContext(AppContext);
    const trendRef = useRef(trend);
    const [size, setSize] = useState(Math.round(Math.random() * 5));
    const broken = useRef(Math.random() > 0.9);
    const isBroken = broken.current;
    const hex = Math.floor(255 - size * (isBroken ? 60 : 40)).toString(16);

    trendRef.current = trend;

    if (size <= 0.1 && !broken.current) {
        broken.current = true;
    } else if (size >= 3.8 && broken.current) {
        broken.current = false;
    }

    useIntervalEffect(() => {
        if (Math.random() > 0.9) {
            setSize((current) =>
                Math.max(MIN_BORDER, Math.min(current + (Math.random() - 0.5) - 0.2 * trendRef.current, MAX_BORDER)),
            );
        }
    }, 100);

    return (
        <span
            className={style.base}
            style={{
                borderWidth: Math.round(size) + "px",
                backgroundColor: isBroken ? `#ff${hex}${hex}` : `#${hex}ff${hex}`,
            }}
        />
    );
};

export const Memory: FunctionComponent = () => {
    const [cells] = useState([...Array(500).keys()].map((_, i) => <Cell key={i} />));

    return <Container sx={{ lineHeight: "0" }}>{cells}</Container>;
};
