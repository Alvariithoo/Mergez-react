import React, { useEffect } from 'react'

import { Mergez } from './Core'

import { Gallery, Welcome, Left, MainPanel, Right, Hat, Wager, Leaderboard, Keybinds, FooterButton, StatsHub, Connecting } from './Panels'

import $ from 'jquery'

import '../stylesheets/App.css'

function Hub() {

    const youtube_video = "7QGXm014K64"

    useEffect(() => {
        setTimeout(() => {
            Mergez.init()
            console.log('mergez start')
        }, 100);

        $("#featured-video iframe").attr("src", "https://www.youtube.com/embed/", youtube_video.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/))

        let element = [
            $(".ver-align"),
            $("#container")
        ]
        element[0].removeClass("opac0")
        $("#skip").on("click", () => {
            element[0].addClass("opac0")
            setTimeout(() => {
                element[1].removeClass("hided")
                setTimeout(() => {
                    element[0].remove()
                    element[1].removeClass("opac0")
                }, 300 / 2)
            }, 300)
        })
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