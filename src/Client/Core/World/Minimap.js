
import Constant from '../Game/Variable'
import { drawMap } from './Map'
import PlayerCamera from '../Player/Camera'
import { Mergez } from '..'

export class Minimap {

    static clearSquare() {
        Constant.square.clear()
        while (Constant.mapsector.children[0]) {
            Constant.mapsector.removeChild(Constant.mapsector.children[0])
        }
        this.drawSquare()
    }
    
    static drawSquare() {
        const targetSize = 200
        const borderAR = drawMap.border.width / drawMap.border.height // aspect ratio
        const width = targetSize * borderAR * PlayerCamera.camera.viewportScale
        const height = targetSize / borderAR * PlayerCamera.camera.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5
    
        Constant.square.beginFill(0x000000)
        Constant.square.drawRect(beginX, beginY, width, height)
        Constant.square.alpha = 0.4
        Constant.mapsquare.addChild(Constant.square)
    }
}