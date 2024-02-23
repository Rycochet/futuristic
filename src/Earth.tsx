/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { CardContent } from "@mui/material";
import { useIntervalEffect, useResizeObserver } from "@react-hookz/web";
import React, { useContext, useEffect, useRef, useState, type FunctionComponent } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";

import { AppContext } from "./App";

interface IRing {
    lat: number;
    lng: number;
    altitude: number;
    color: string;
    maxRadius: number;
    propagationSpeed: number;
    repeatPeriod: number;
}

const COUNT = 10;

export const Earth: FunctionComponent = () => {
    const globeRef = useRef<GlobeMethods>();
    const sizeRef = useRef<HTMLDivElement>(null);
    const colorCount = useRef(0);
    const { trend } = useContext(AppContext);
    const trendRef = useRef(trend);
    const [width, setWidth] = useState(100);

    trendRef.current = trend;

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 1;
        }
    }, []);

    useResizeObserver(sizeRef, (size) => {
        setWidth(size.contentRect.width);
    });

    const lat = () => (Math.random() - 0.5) * 160;
    const lng = () => (Math.random() - 0.5) * 360;
    const color = () =>
        `#${Math.round(100 + Math.random() * 155).toString(16)}${Math.round(100 + Math.random() * 155).toString(16)}${Math.round(100 + Math.random() * 155).toString(16)}`;
    const maxRadius = () => 10 + Math.random() * 5;
    const propagationSpeed = () => 10 + Math.random() * 5;
    const repeatPeriod = () => 200 + Math.random() * 400;
    const makeRing = (): IRing => ({
        lat: lat(),
        lng: lng(),
        altitude: 0,
        color: color(),
        maxRadius: maxRadius(),
        propagationSpeed: propagationSpeed(),
        repeatPeriod: repeatPeriod(),
    });

    const [data, setData] = useState<IRing[]>([
        {
            lat: 90,
            lng: 0,
            altitude: 0.25,
            color: "lightblue",
            maxRadius: 180,
            propagationSpeed: 20,
            repeatPeriod: 2250,
        },
        ...[...Array(COUNT - 1).keys()].map(makeRing),
    ]);

    useIntervalEffect(() => {
        if (Math.random() > 0.5) {
            setData((old) => {
                const newData = [...old];
                const index = Math.floor(Math.random() * COUNT);

                newData[0] = { ...old[0] };
                if (colorCount.current++ > 10) {
                    newData[0].color = newData[0].color === "orange" ? "red" : "orange";
                }
                if (index && newData[0].color !== "red") {
                    newData[index] = makeRing();
                } else {
                    const delta = Math.random() - 0.5;
                    const range = (min: number, num: number, max: number) => Math.min(max, Math.max(num, min));

                    switch (Math.floor(Math.random() * 5)) {
                        case 0:
                            newData[0].altitude = range(0.1, newData[0].altitude + delta / 5, 0.5);
                            break;
                        case 1:
                            newData[0].propagationSpeed = range(
                                10,
                                newData[0].propagationSpeed + trendRef.current + delta * 3,
                                30,
                            );
                            break;
                        case 2:
                            newData[0].repeatPeriod = range(1250, newData[0].repeatPeriod + delta * 20, 2750);
                            break;
                        default:
                            newData[0].color = "lightblue";
                            colorCount.current = 0;
                            break;
                    }
                }
                return newData;
            });
        }
    }, 1000);

    return (
        <CardContent ref={sizeRef}>
            <Globe
                ref={globeRef}
                width={width}
                height={width}
                animateIn={false}
                globeImageUrl="./earth-blue-marble.jpg"
                backgroundImageUrl="./pexels-francesco-ungaro-998641.jpg"
                bumpImageUrl="./earth-topology.png"
                showGraticules
                // Ring
                ringsData={data}
                ringAltitude="altitude"
                ringColor="color"
                ringMaxRadius="maxRadius"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
            />
        </CardContent>
    );
};
