import { Application, Container, BitmapFont } from 'pixi.js'
import $ from 'jquery'

import { Minimap } from './World'

import { Chat } from './Menu/Chat'

import Logger from './Network/Logger'
import Network from './Network'

import Textures from './Player/Textures'

import Settings from './Settings'
import Keysbind from './Settings/Hotkeys'

import Cell from './Player/Cell'
import { Camera } from './Game/Camera'
import Functions from './Game/Functions'

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function (a) {
    const i = this.indexOf(a)
    return i !== -1 && this.splice(i, 1)
}

Element.prototype.hide = function () {
    this.style.display = 'none'
    if (this.style.opacity === 1) this.style.opacity = 0
}

Element.prototype.show = function (seconds) {
    this.style.display = ''
    if (!seconds) return
    this.style.transition = `opacity ${seconds}s ease 0s`
    this.style.opacity = 1
}

export class Mergez {

    static LOAD_START = Date.now()
    static view = null
    static application = null

    static chatBox = null
    static chatArea = null
    static chatRoom = null

    static bgContainer = null
    static cellContainer = null

    static init() {
        Mergez.view = document.getElementById('canvas')
        Mergez.application = new Application({
            view: Mergez.view,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x111111,
            antialias: true,
            resolution: 1
        })

        Mergez.bgContainer = new Container()
        Mergez.bgContainer.sortableChildren = true
        Mergez.cellContainer = new Container()
        Mergez.cellContainer.sortableChildren = true

        Mergez.application.stage.addChild(Mergez.bgContainer)
        Mergez.application.stage.addChild(Mergez.cellContainer)
        Mergez.application.stage.addChild(Minimap.mapsquare)
        Mergez.application.stage.addChild(Minimap.mapsector)
        Mergez.application.stage.addChild(Minimap.mapplayer)

        Mergez.chatRoom = Functions.byId('chatroom')
        Mergez.chatArea = Functions.byId('chatboxArea2')
        Mergez.chatBox = Functions.byId('input_box2')

        Settings.afterGameLogicLoaded()
        Settings.loadSettings()
        
        window.addEventListener('beforeunload', Settings.storeSettings)
        document.addEventListener('wheel', Camera.handleScroll, {
            passive: true
        })
        
        window.onkeydown = Keysbind.keydown
        window.onkeyup = Keysbind.keyup
        
        $("#overlays2").on("mousemove", (event) => {
            Settings.ingame.mouseX = event.clientX
            Settings.ingame.mouseY = event.clientY
        })

        Mergez.chatBox.onblur = () => {
            Settings.ingame.isTyping = false
            Chat.drawChat()
        }
        Mergez.chatBox.onfocus = () => {
            Settings.ingame.isTyping = true
            Chat.drawChat()
        }

        setInterval(() => {
            let myCells = []
            let x = 0
            let y = 0
            for (let i = 0; i < Cell.get.mine.length; i++) {
                if (Cell.get.byId.hasOwnProperty(Cell.get.mine[i])) {
                    myCells.push(Cell.get.byId[Cell.get.mine[i]])
                }
            }

            for (let i = 0; i < myCells.length; i++) {
                x += myCells[i].x
                y += myCells[i].y
            }

            // eslint-disable-next-line no-unused-vars
            x /= myCells.length
            // eslint-disable-next-line no-unused-vars
            y /= myCells.length

            Functions.sendMouseMove(
                (Settings.ingame.mouseX - window.innerWidth / 2) / Camera.get.scale + Camera.get.x,
                (Settings.ingame.mouseY - window.innerHeight / 2) / Camera.get.scale + Camera.get.y
            )
        }, 40)
        
        Mergez.onresize()
        Mergez.mainLoader()

        Network.gameReset()
        Functions.showESCOverlay()

        Logger.warn(`Init done in ${Date.now() - Mergez.LOAD_START}ms`)
        Textures.preloadSprites()

        BitmapFont.from("Ubuntu", {
            fontSize: 60,
            lineJoin: "round",
            fontFamily: "Ubuntu",
            fill: "white",
            stroke: "black",
            strokeThickness: 10
        })
            
        Network.drawGame()
        Minimap.drawSquare()
    }

    static onresize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        Camera.get.viewportScale = Math.max(width / width, height / height)
        Mergez.application.renderer.resize(width, height)
        Minimap.clearSquare()
    }

    static mainLoader() {
        $("#input_box2").attr("placeholder", "Enter chat message...")
    
        $("#profile-main").prependTo("#home")
        $("#preview-img").attr("src", $("#skin_url").val())
        $("#skin_url").on("change", (function () {
            $("#preview-img").attr("src", this.value)
        }))
    
        $(".btn-green").insertBefore(".btn-blue")
        $(".btn-red").insertAfter(".btn-green")
    }
}

window.mergez = Mergez