/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { ChartContainer, LinePlot } from "@mui/x-charts";
import { useIntervalEffect, useResizeObserver } from "@react-hookz/web";
import React, { useContext, useRef, useState, type FunctionComponent } from "react";

import { AppContext } from "./App";

const COUNT = 50;

export const Processor: FunctionComponent = () => {
    const { trend } = useContext(AppContext);
    const sizeRef = useRef(null);
    const [width, setWidth] = useState(300);
    const next = (current: number) => Math.max(0.1, Math.min(current + (Math.random() - 0.5 + trend * 0.1) / 2, 1));
    const makeData = () => [...Array(COUNT).keys()].map(() => Math.max(0, Math.random() - 0.7));
    const [data, setData] = useState<number[][]>([makeData(), makeData(), makeData(), makeData()]);
    const [xData] = useState<number[]>([...Array(COUNT).keys()]);

    useResizeObserver(sizeRef, (size) => setWidth(size.target.parentElement!.clientWidth - 32));

    useIntervalEffect(() => {
        setData((arr) => {
            return [
                [...arr[0].slice(1, COUNT), next(arr[0][COUNT - 1])],
                [...arr[1].slice(1, COUNT), next(arr[1][COUNT - 1])],
                [...arr[2].slice(1, COUNT), next(arr[2][COUNT - 1])],
                [...arr[3].slice(1, COUNT), next(arr[3][COUNT - 1])],
            ];
        });
    }, 1000);

    return (
        <ChartContainer
            ref={sizeRef}
            height={50}
            width={width}
            series={[
                { type: "line", data: data[0] },
                { type: "line", data: data[1] },
                { type: "line", data: data[2] },
                { type: "line", data: data[3] },
            ]}
            xAxis={[
                { scaleType: "point", data: xData },
                { scaleType: "point", data: xData },
                { scaleType: "point", data: xData },
                { scaleType: "point", data: xData },
            ]}
            yAxis={[{ scaleType: "linear", min: 0, max: 1 }]}
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
