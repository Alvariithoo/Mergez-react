import { Application, BitmapFont } from 'pixi.js'
import { Mergez } from '..'
import { Camera } from '../Player/Camera'
import { Minimap } from './Minimap'
import { Leaderboard } from '../Menu/Leaderboard'
import { Chat } from '../Menu/Chat'
import { Stats } from '../Menu/Stats'
import Cell from '../Player/Cell'
import Settings from '../Settings'
import { Player } from '../Player'
import { Mapp } from './Map'

export class App {

    static view = null
    static application = null

    static init() {
        this.Canvas()
        this.BitmapFont()
        this.gameReset()
        this.drawGame()
    }

    static Canvas() {
        Mergez.view = document.getElementById('canvas')
        Mergez.application = new Application({
            view: Mergez.view,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x111111,
            antialias: true,
            resolution: 1
        })
    }

    static BitmapFont() {
        BitmapFont.from("Ubuntu", {
            fontSize: 60,
            lineJoin: "round",
            fontFamily: "Ubuntu",
            fill: "white",
            stroke: "black",
            strokeThickness: 10
        })
    }

    static cleanupObject(object) {
        for (const i in object) delete object[i]
    }

    static drawGame() {
        const now = Date.now()
        const elapsed = now - Stats.get.lastFrameTime
        Stats.get.fps = 1000 / Math.max(elapsed, 1)
        Stats.get.lastFrameTime = now

        for (const cell of Cell.get.list) cell.update(now)
        Camera.cameraUpdate()
        for (const cell of Cell.get.list) cell.updatePlayerPosition()
        Player.clearPlayers()
        App.drawGrid()

        requestAnimationFrame(App.drawGame)
    }

    static drawGrid() {
        if (window.drawMapInstance) window.drawMapInstance.container.destroy()
        window.drawMapInstance = new Mapp(Mergez.application)
    }

    static gameReset() {
        App.cleanupObject(Cell.get)
        App.cleanupObject(Mapp.border)
        App.cleanupObject(Leaderboard.get)
        App.cleanupObject(Chat.get)
        App.cleanupObject(Stats.stats)
        Chat.get.messages = []
        Leaderboard.get.items = []
        Cell.get.mine = []
        Cell.get.byId = new Map()
        Cell.get.list = []
        Camera.get.x = Camera.get.y = Camera.get.target.x = Camera.get.target.y = 0
        Camera.get.scale = Camera.get.target.scale = 1
        Settings.ingame.mapCenterSet = false
    }

    static onresize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        Camera.get.viewportScale = Math.max(width / width, height / height)
        Mergez.application.renderer.resize(width, height)
        Minimap.clearSquare()
    }


}