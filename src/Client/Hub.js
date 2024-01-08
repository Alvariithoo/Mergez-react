import React, { useEffect } from 'react'
import { Mergez } from './Core'
import { Gallery, Welcome, Left, MainPanel, Right, Hat, Wager, Leaderboard, Keybinds, FooterButton, StatsHub, Connecting } from './Panels'
import '../stylesheets/App.css'

function Hub() {

    useEffect(() => {
        setTimeout(() => {
            Mergez.init()
        }, 100) // give time to preload internal functions
    }, [])

    return (
        <>
            <Gallery />
            <div id="overlays">
                <Welcome />
                <div id="container" className="opac0 hided">
                    <div id="helloContainer">
                        <Left />
                        <MainPanel />
                        <Right />
                    </div>
                    <Hat />
                    <Wager />
                    <Leaderboard />
                    <Keybinds />
                    <FooterButton />
                </div>
            </div>
            <StatsHub />
            <Connecting />
        </>
    )
}

export default Hub