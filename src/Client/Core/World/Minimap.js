import { Graphics, Container } from 'pixi.js'

import { Mapp } from './Map'
import { Mergez } from '..'
import { Camera } from '../Player/Camera'

export class Minimap {

    static setSquare = new Container()
    static bgContainer = new Container()
    static cellContainer = new Container()

    static player = new Container()
    static drawpl = new Graphics()
    static square = new Graphics()

    static init() {
        this.setupContainers()
        this.drawSquare()
    }
    
    static clearSquare() {
        this.square.clear()
        while (this.setSquare.children[0]) {
            this.setSquare.removeChild(this.setSquare.children[0])
        }
        this.drawSquare()
    }

    static show() {
        this.square.alpha = 1
        this.player.alpha = 1
        this.setSquare.alpha = 1
    }

    static hide() {
        this.square.alpha = 0
        this.player.alpha = 0
        this.setSquare.alpha = 0
    }
    
    static drawSquare() {
        const targetSize = 200
        const borderAR = Mapp.border.width / Mapp.border.height // aspect ratio
        const width = targetSize * borderAR * Camera.get.viewportScale
        const height = targetSize / borderAR * Camera.get.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5

        this.square.clear()
        this.square.beginFill(0x000000)
        this.square.drawRect(beginX, beginY, width, height)
        this.square.alpha = 0.4
        this.setSquare.addChild(this.square)
    }

    static setupContainers() {
        this.bgContainer.sortableChildren = true
        this.cellContainer.sortableChildren = true

        Mergez.application.stage.addChild(this.bgContainer)
        Mergez.application.stage.addChild(this.cellContainer)
        Mergez.application.stage.addChild(this.setSquare)
        Mergez.application.stage.addChild(this.player)
    }
}