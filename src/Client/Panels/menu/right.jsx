import React from 'react'
import { wager } from '../../Core/Wager/wager'

import $ from 'jquery'
import Network from '../../Core/Network'
import 'material-icons/iconfont/material-icons.css'


function Right() {

    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === "server" || e.target.id === "server-label" || e.target.id === "number-label")) {
            try {
                Network.wsInit(Array.from(e.target.attributes).filter(e => { return e.name === 'data-ip' })[0].value)
            } catch (err) {
                throw err
            }
        }
    })

    const servers = []

    function addServer(ip, port, name) {
        servers.push({
            ip: ip,
            port: port,
            name: name
        })
    }

    function getServers() {
        let serversList = servers
        if (!serversList.length) return $("#server-container").html('<p style="text-align: center">Offline</p>')
        for (let i = 0; i < serversList.length; i++) {
            $("#server-container").append(`
                <div id="server" data-ip="${serversList[i].ip}:${serversList[i].port}">
                    <label id="server-label" data-ip="${serversList[i].ip}:${serversList[i].port}">${serversList[i].name}</label>
                    <label id="number-label" data-ip="${serversList[i].ip}:${serversList[i].port}">${i + 1}</label>
                </div>
            `)
        }
    }
    
    setTimeout(() => {
        addServer('127.0.0.1', 7251, "Ultrasplit")
        addServer('127.0.0.1', 7251, "Ultrafeed")
        addServer('127.0.0.1', 7251, "Dev Server")
        console.log("servers added")
        getServers()
    }, 1500)

    return (
        <>
            <div id="right-container" className="side-container right-side">
                <div className="side-container right-side">
                    <div className="UI-panel UI-side-panel UI-profiles">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <div className="bg-tab">
                                    <p>
                                        <span className="material-icons">network_wifi</span> Servers Online
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div id="server-container" className="servers-panel" />
                        <button className="btn" id="wager" onClick={wager}>Wager</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Right