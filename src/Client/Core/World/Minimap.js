import { Graphics, Container } from 'pixi.js'

import { drawMap } from './Map'
import { Mergez } from '..'
import { Camera } from '../Game/Camera'

export class Minimap {

    static mapsquare = new Container()
    static mapsector = new Container()
    static mapplayer = new Container()
    static drawpl = new Graphics()
    static square = new Graphics()
    
    static clearSquare() {
        Minimap.square.clear()
        while (Minimap.mapsector.children[0]) {
            Minimap.mapsector.removeChild(Minimap.mapsector.children[0])
        }
        this.drawSquare()
    }
    
    static drawSquare() {
        const targetSize = 200
        const borderAR = drawMap.border.width / drawMap.border.height // aspect ratio
        const width = targetSize * borderAR * Camera.get.viewportScale
        const height = targetSize / borderAR * Camera.get.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5
    
        Minimap.square.beginFill(0x000000)
        Minimap.square.drawRect(beginX, beginY, width, height)
        Minimap.square.alpha = 0.4
        Minimap.mapsquare.addChild(Minimap.square)
    }
}