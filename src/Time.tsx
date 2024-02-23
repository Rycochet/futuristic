/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { Typography } from "@mui/material";
import { useIntervalEffect } from "@react-hookz/web";
import { format } from "date-fns";
import React, { useRef, type FunctionComponent } from "react";

export const Time: FunctionComponent = () => {
    const ref = useRef<HTMLDivElement>(null);
    const getTime = () => {
        return format(new Date(), "kk:mm:ss");
    };

    useIntervalEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = getTime();
        }
    }, 1000);

    return (
        <Typography
            ref={ref}
            noWrap
            align="center"
            sx={{
                fontFamily: "monospace",
                fontSize: "3rem",
            }}
        >
            {getTime()}
        </Typography>
    );
};
