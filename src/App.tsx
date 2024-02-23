/*
 * SPDX-FileCopyrightText: 2024 Ryc O'Chet <rycochet@rycochet.com>
 *
 * SPDX-License-Identifier: MIT
 */

import { Report, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    OutlinedInput,
    TextField,
    Typography,
} from "@mui/material";
import { useEventListener, useIntervalEffect, useRerender } from "@react-hookz/web";
import React, { createContext, useRef, type FunctionComponent } from "react";

import style from "./App.module.css";
import { Earth } from "./Earth";
import { Memory } from "./Memory";
import { Processor } from "./Processor";
import { Quantum } from "./Quantum";
import { Time } from "./Time";

export interface IAppContext {
    /**
     * Number between -1 to +1, denotes user interaction.
     */
    trend: number;
}

export const AppContext = createContext<IAppContext>({ trend: -1 });

export const App: FunctionComponent = () => {
    const timeRef = useRef(Date.now());
    const trendRef = useRef(-1);
    const rerender = useRerender();
    const [showPassword, setShowPassword] = React.useState(false);
    const [attempt, setAttempt] = React.useState(0);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = () => {
        if (username && password) {
            setAttempt((old) => old + 1);
            setUsername("");
            setPassword("");
        }
    };

    useEventListener(
        document.body,
        "mousemove",
        (): void => {
            if (Date.now() - timeRef.current > 100) {
                trendRef.current = Math.min(1, trendRef.current + 0.1);
                timeRef.current = Date.now();
                rerender();
            }
        },
        { capture: true, passive: true },
    );

    useEventListener(
        document.body,
        "mousedown",
        (): void => {
            trendRef.current = 1;
            rerender();
        },
        { capture: true, passive: true },
    );

    useIntervalEffect(() => {
        trendRef.current = Math.max(-1, trendRef.current - (trendRef.current > 0.1 ? 0.1 : 0.01));
        rerender();
    }, 1000);

    return (
        <AppContext.Provider value={{ trend: trendRef.current }}>
            {attempt >= 4 ? (
                <Container sx={{ height: "100%" }}>
                    <Alert icon={<Report fontSize="large" sx={{ pt: 1 }} />} severity="error">
                        <Typography variant="h3">
                            This invalid access attempt has been logged
                            <Divider />
                            Please wait for Support to arrive
                        </Typography>
                    </Alert>
                </Container>
            ) : (
                <Grid container spacing={2} className={style.base}>
                    <Grid item xs={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader
                                title="System Status"
                                subheader="System integrity compromised"
                                subheaderTypographyProps={{ sx: { color: "red" } }}
                            />
                            <CardHeader subheader="Time" />
                            <CardContent>
                                <Time />
                            </CardContent>
                            <Divider />
                            <CardHeader subheader="Processor" />
                            <CardContent>
                                <Processor />
                            </CardContent>
                            <Divider />
                            <CardHeader subheader="Memory" />
                            <CardContent>
                                <Memory />
                            </CardContent>
                            <Divider />
                            <CardHeader subheader="Quantum" />
                            <CardContent>
                                <Quantum />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader title="Authority Access" subheader="Please login to continue" />
                            <Container sx={{ height: "100%" }}>
                                <Container>
                                    <TextField
                                        label="Enter Security Identity"
                                        value={username}
                                        onChange={(e) => setUsername(e.currentTarget.value)}
                                        sx={{ m: 1, width: "25ch" }}
                                    />
                                </Container>
                                <Container>
                                    <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                </Container>
                                <Container>
                                    {!!attempt && (
                                        <>
                                            <Typography variant="h6" sx={{ color: "red" }}>
                                                Identity or Password incorrect
                                            </Typography>
                                            <Typography>
                                                {4 - attempt} attempt{attempt === 3 ? "" : "s"} remaining
                                            </Typography>
                                        </>
                                    )}
                                    <Button
                                        variant="contained"
                                        sx={{ margin: 1 }}
                                        disabled={!username || !password}
                                        onClick={handleSubmit}
                                    >
                                        Login
                                    </Button>
                                </Container>
                            </Container>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader
                                title="World Scan"
                                subheader="Uplink unstable"
                                subheaderTypographyProps={{ sx: { color: "red" } }}
                            />
                            <CardHeader subheader="Electrical activity" />
                            <Earth />
                            <Divider />
                            <CardHeader
                                title="Maintenance"
                                subheader="Due in NaN days"
                                subheaderTypographyProps={{ sx: { color: "red" } }}
                            />
                            <List>
                                <ListItem>Power systems failing</ListItem>
                                <ListItem>Radiation damage</ListItem>
                                <ListItem>Redundant systems operational</ListItem>
                                <ListItem>Satellite uplink unstable</ListItem>
                                <ListItem>Security systems disabled</ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </AppContext.Provider>
    );
};
