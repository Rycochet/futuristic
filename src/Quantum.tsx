/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { ChartContainer, LinePlot } from "@mui/x-charts";
import { useIntervalEffect, useResizeObserver } from "@react-hookz/web";
import React, { useContext, useRef, useState, type FunctionComponent } from "react";

import { AppContext } from "./App";

const POINT_COUNT = 50;
const LINE_COUNT = 10;

export const Quantum: FunctionComponent = () => {
    const { trend } = useContext(AppContext);
    const trendRef = useRef(trend);
    const sizeRef = useRef(null);
    const [width, setWidth] = useState(300);
    const makeData = () => [...Array(POINT_COUNT).keys()].map(() => 0);
    const [data, setData] = useState<number[][]>([...Array(LINE_COUNT).keys()].map(() => makeData()));
    const [xData] = useState<number[]>([...Array(POINT_COUNT).keys()]);

    trendRef.current = trend;

    useResizeObserver(sizeRef, (size) => setWidth(size.target.parentElement!.clientWidth - 32));

    useIntervalEffect(() => {
        setData((arr) => {
            return [...Array(LINE_COUNT).keys()].map((i) => {
                return i
                    ? arr[i - 1].map((_, i, a) => (i ? a[i - 1] : a[POINT_COUNT - 1]) + 0.1)
                    : arr[0].map((v) =>
                          Math.max(0, Math.min(v + Math.random() / 10 - 0.05 + trendRef.current * 0.01, 0.3)),
                      );
            });

            [
                arr[0].map((v) => Math.max(0, Math.min(v + Math.random() / 10 - 0.05 + trend * 0.01, 0.3))),
                arr[0].map((_, i, a) => (i ? a[i - 1] : a[POINT_COUNT - 1]) + 0.1),
                arr[1].map((_, i, a) => (i ? a[i - 1] : a[POINT_COUNT - 1]) + 0.1),
                arr[2].map((_, i, a) => (i ? a[i - 1] : a[POINT_COUNT - 1]) + 0.1),
                arr[3].map((_, i, a) => (i ? a[i - 1] : a[POINT_COUNT - 1]) + 0.1),
            ];
        });
    }, 100);

    // { type: "line", data: data[9], color: "#f00" },
    // { type: "line", data: data[8], color: "#f60" },
    // { type: "line", data: data[7], color: "#fb0" },
    // { type: "line", data: data[6], color: "#fd0" },
    // { type: "line", data: data[5], color: "#fe0" },
    // { type: "line", data: data[4], color: "#ef0" },
    // { type: "line", data: data[3], color: "#df0" },
    // { type: "line", data: data[2], color: "#bf0" },
    // { type: "line", data: data[1], color: "#6f0" },
    // { type: "line", data: data[0], color: "#0f0" },
    return (
        <ChartContainer
            ref={sizeRef}
            height={50}
            width={width}
            series={
                [
                    { type: "line", data: data[9], color: "#f00" },
                    { type: "line", data: data[8], color: "#f60" },
                    { type: "line", data: data[7], color: "#fb0" },
                    { type: "line", data: data[6], color: "#fd0" },
                    { type: "line", data: data[5], color: "#fe0" },
                    { type: "line", data: data[4], color: "#ef0" },
                    { type: "line", data: data[3], color: "#df0" },
                    { type: "line", data: data[2], color: "#bf0" },
                    { type: "line", data: data[1], color: "#6f0" },
                    { type: "line", data: data[0], color: "#0f0" },
                ]
                // [
                // ...Array(LINE_COUNT).keys()].map((i) => ({
                // type: "line",
                // data: data[LINE_COUNT - i - 1],
                // color: `#${Math.min(15, Math.floor((LINE_COUNT / (LINE_COUNT - i)) * 15)).toString(16)}${Math.min(15, Math.floor((LINE_COUNT / (LINE_COUNT - i)) * 15)).toString(16)}0`,
                // }))
            }
            xAxis={[...Array(LINE_COUNT).keys()].map(() => ({ scaleType: "point", data: xData }))}
            yAxis={[{ scaleType: "linear", min: 0, max: LINE_COUNT * 0.1 + 0.5 }]}
            margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }}
            disableAxisListener
        >
            <LinePlot />
        </ChartContainer>
    );
};
