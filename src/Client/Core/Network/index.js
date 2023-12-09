import $ from 'jquery'

import Functions from '../Game/Functions'

import Logger from './Logger'
import Settings from '../Settings'
import Reader from './Reader'

import { Player } from '../Player'

import Color from '../Player/Color'
import Cell from '../Player/Cell'

import { Camera } from '../Game/Camera'

import { drawMap } from '../World'

import { Chat } from '../Menu/Chat'
import { Stats } from '../Menu/Stats'
import { Leaderboard } from '../Menu/Leaderboard'

import { Mergez } from '..'

class Network {

    constructor() {
        this.USE_HTTPS = 'https:' === window.location.protocol
        this.WEBSOCKET_URL = null
        this.wsUrl = this.WEBSOCKET_URL
        this.ws = null
    }

    static UINT8_CACHE = {
        1: new Uint8Array([1]),
        17: new Uint8Array([17]), // Space bar
        18: new Uint8Array([18]), // Double
        19: new Uint8Array([19]), // Triple
        20: new Uint8Array([20]), // x16
        22: new Uint8Array([22]), // Feed
        254: new Uint8Array([254]),
    }
    
    static wsSend(data) {
        if (!this.ws) return
        if (this.ws.readyState !== 1) return
        if (data.build) this.ws.send(data.build())
        else this.ws.send(data)
    }

    static gameReset() {
        Functions.cleanupObject(Cell.get)
        Functions.cleanupObject(drawMap.border)
        Functions.cleanupObject(Leaderboard.get)
        Functions.cleanupObject(Chat.get)
        Functions.cleanupObject(Stats.stats)
        Chat.get.messages = []
        Leaderboard.get.items = []
        Cell.get.mine = []
        Cell.get.byId = new Map()
        Cell.get.list = []
        Camera.get.x = Camera.get.y = Camera.get.target.x = Camera.get.target.y = 0
        Camera.get.scale = Camera.get.target.scale = 1
        Settings.ingame.mapCenterSet = false
    }

    static wsCleanup() {
        if (!this.ws) return
        Functions.showESCOverlay()
        Logger.debug('WebSocket cleanup')
        this.ws.onopen = null
        this.ws.onmessage = null
        this.ws.close()
        this.ws = null
        while (Mergez.cellContainer.children[0]) {
            Mergez.cellContainer.removeChild(Mergez.cellContainer.children[0])
        }
    }

    static wsInit(url) {
        if (this.ws) {
            Logger.debug('WebSocket init on existing connection')
            Network.wsCleanup()
        }
        $('#connecting').show()
        this.wsUrl = url
        this.ws = new WebSocket(`ws${this.USE_HTTPS ? 's' : ''}://${url}`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = this.wsOpen
        this.ws.onmessage = this.wsMessage
        this.ws.onerror = this.wsError
        this.ws.onclose = this.wsClose
    }

    static wsOpen() {
        $('#connecting').hide()
        Network.wsSend(new Uint8Array([254, 6, 0, 0, 0]))
        Network.wsSend(new Uint8Array([255, 1, 0, 0, 0]))
        if (Settings.list.wagerWs) {
            Functions.hideESCOverlay()
            $("#wagerPanel-bg").hide()
            setTimeout(this.sendPlay, 1e3)
        } else Logger.info("Connected to the Server")
    }

    static wsError(error) {
        Logger.warn(error)
    }

    static wsClose(e) {
        if (e.currentTarget !== this.ws) return
        Logger.debug(`WebSocket disconnected ${e.code} (${e.reason})`)
        Network.wsCleanup()
        Network.gameReset()
        Leaderboard.drawLeaderboard()
        if (Settings.list.wagerWs) {
            $("#wagerPanel-bg").show()
            $("#wagerMain").show()
        }
    }

    static wsMessage(data) {
        const syncUpdStamp = Date.now()
        const reader = new Reader(new DataView(data.data), 0, true)
        const packetId = reader.getUint8()
        switch (packetId) {
            case 0x10: { // update nodes
                // consume records
                let killed, killer, count
                count = reader.getUint16()
                for (let i = 0; i < count; i++) {
                    killer = reader.getUint32()
                    killed = reader.getUint32()
                    if (!Cell.get.byId.hasOwnProperty(killer) || !Cell.get.byId.hasOwnProperty(killed))
                        continue
                    Cell.get.byId[killed].destroy(killer)
                }
                // update records
                while (true) {
                    const id = reader.getUint32()
                    if (id === 0) break
    
                    const x = reader.getInt32()
                    const y = reader.getInt32()
                    const s = reader.getUint16()
    
                    const flagMask = reader.getUint8()
                    const flags = {
                        updColor: !!(flagMask & 0x02),
                        updSkin: !!(flagMask & 0x04),
                        updName: !!(flagMask & 0x08),
                        jagged: !!(flagMask & 0x01) || !!(flagMask & 0x10),
                        ejected: !!(flagMask & 0x20),
                    }
    
                    const color = flags.updColor ? new Color(reader.getUint8(), reader.getUint8(), reader.getUint8()) : null
                    const skin = flags.updSkin ? reader.getStringUTF8() : null
                    const name = flags.updName ? reader.getStringUTF8() : null
    
                    if (Cell.get.byId.hasOwnProperty(id)) {
                        const cell = Cell.get.byId[id]
                        cell.update(syncUpdStamp)
                        cell.updated = syncUpdStamp
                        cell.ox = cell.x
                        cell.oy = cell.y
                        cell.os = cell.s
                        cell.nx = x
                        cell.ny = y
                        cell.ns = s
                        if (color) cell.setColor(color)
                        if (name) cell.setName(name)
                        if (skin) cell.setSkin(skin)
                    } else {
                        const cell = new Cell(id, x, y, s, name, color, skin, flags)
                        Cell.get.byId[id] = cell
                        Cell.get.list.push(cell)
                    }
                }
                // dissapear records
                count = reader.getUint16()
                for (let i = 0; i < count; i++) {
                    killed = reader.getUint32()
                    if (Cell.get.byId.hasOwnProperty(killed) && !Cell.get.byId[killed].destroyed)
                        Cell.get.byId[killed].destroy(null)
                }
                break
            }
            case 0x11: { // update pos
                Camera.get.target.x = reader.getFloat32()
                Camera.get.target.y = reader.getFloat32()
                Camera.get.target.scale = reader.getFloat32()
                Camera.get.target.scale *= Camera.get.viewportScale
                Camera.get.target.scale *= Camera.get.userZoom
                break
            }
            case 0x12: { // clear all
                for (let i in Cell.get.byId)
                    Cell.get.byId[i].destroy(null)
                break
            }
            case 0x14: { // clear my cells
                Cell.get.mine = []
                break
            }
            case 0x15: { // draw line
                Logger.warn('got packet 0x15 (draw line) which is unsupported')
                break
            }
            case 0x20: { // new cell
                Cell.get.mine.push(reader.getUint32())
                break
            }
            case 0x30: { // text list
                Leaderboard.get.items = []
                Leaderboard.get.type = 'text'
    
                const lbCount = reader.getUint32()
                for (let i = 0; i < lbCount; ++i) {
                    Leaderboard.get.items.push(reader.getStringUTF8())
                }
                Leaderboard.drawLeaderboard()
                break
            }
            case 0x31: { // ffa list
                Leaderboard.get.items = []
                Leaderboard.get.type = 'ffa'
    
                const count = reader.getUint32()
                for (let i = 0; i < count; ++i) {
                    const isMe = !!reader.getUint32()
                    const lbName = reader.getStringUTF8()
                    Leaderboard.get.items.push({
                        me: isMe,
                        name: Cell.parseName(lbName).name || Cell.EMPTY_NAME
                    })
                }
                Leaderboard.drawLeaderboard()
                break
            }
            case 0x32: { // pie chart
                Leaderboard.get.items = []
                Leaderboard.get.type = 'pie'
    
                const teamsCount = reader.getUint32()
                for (let i = 0; i < teamsCount; ++i) {
                    Leaderboard.get.items.push(reader.getFloat32())
                }
                Leaderboard.drawLeaderboard()
                break
            }
            case 0x40: { // set border
                drawMap.border.left = reader.getFloat64()
                drawMap.border.top = reader.getFloat64()
                drawMap.border.right = reader.getFloat64()
                drawMap.border.bottom = reader.getFloat64()
                drawMap.border.width = drawMap.border.right - drawMap.border.left
                drawMap.border.height = drawMap.border.bottom - drawMap.border.top
                drawMap.border.centerX = (drawMap.border.left + drawMap.border.right) / 2
                drawMap.border.centerY = (drawMap.border.top + drawMap.border.bottom) / 2

                if (data.data.byteLength === 33) break
                if (!Settings.ingame.mapCenterSet) {
                    Settings.ingame.mapCenterSet = true
                    Camera.get.x = Camera.get.target.x = drawMap.border.centerX
                    Camera.get.y = Camera.get.target.y = drawMap.border.centerY
                    Camera.get.scale = Camera.get.target.scale = 1
                }
                // reader.getUint32() // game type
                // if (!/MultiOgar|OgarII/.test(reader.getStringUTF8()) || Stats.get.pingLoopId) break
                Stats.get.pingLoopId = setInterval(() => {
                    Network.wsSend(Network.UINT8_CACHE[254])
                    Stats.get.pingLoopStamp = Date.now()
                }, 2000)
                break
            }
            case 0x63: { // chat message
                const flagMask = reader.getUint8()
                const flags = {
                    server: !!(flagMask & 0x80),
                    admin: !!(flagMask & 0x40),
                    mod: !!(flagMask & 0x20),
                }
                const color = new Color(reader.getUint8(), reader.getUint8(), reader.getUint8())
                const rawName = reader.getStringUTF8()
                const rawMessage = reader.getStringUTF8()
    
                let rawXSS = Functions.escapeHtml(rawMessage)
                let message = rawXSS
                let name = Cell.parseName(rawName).name || Cell.EMPTY_NAME
    
                let isServer = "https://i.imgur.com/9rEMwTi.png"
                let isAdmin = "https://c.tenor.com/yRDp5iDM0DwAAAAC/pepe-pepeking.gif"
                let isMod = "https://i.imgur.com/CRPMI4Z.png"
    
                if (flags.server) name = `<img src="${isServer}" class="chatIcon" /> ${name}`
                if (flags.admin) name = `<img src="${isAdmin}" class="chatIcon" /> ${name}`
                if (flags.mod) name = `<img src="${isMod}" class="chatIcon" /> ${name}`
    
                const date = new Date(syncUpdStamp)
                const hours = date.getHours().toString().padStart(2, '0')
                const minutes = date.getMinutes().toString().padStart(2, '0')
                const seconds = date.getSeconds().toString().padStart(2, '0')
                const time = `${hours}:${minutes}:${seconds}`
    
                Chat.get.messages.push({
                    time: time,
                    name,
                    message,
                    color,
                    server: flags.server,
                    admin: flags.admin,
                    mod: flags.mod,
                })
                Chat.drawChat(time, name, message, color)
                break
            }
            default: { // invalid packet
                break
            }
        }
    }

    static drawGame() {
        const now = Date.now();
        const elapsed = now - Stats.get.lastFrameTime
        Stats.get.fps = 1000 / Math.max(elapsed, 1)
        Stats.get.lastFrameTime = now

        for (const cell of Cell.get.list) cell.update(now)
        Camera.cameraUpdate()
        for (const cell of Cell.get.list) cell.updatePlayerPosition()
        Player.clearPlayers()
        Functions.drawGrid()
        
        requestAnimationFrame(Network.drawGame)
    }
}

export default Network