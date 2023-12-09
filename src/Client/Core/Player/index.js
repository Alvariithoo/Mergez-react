
import { Mergez } from ".."
import { Camera } from "../Game/Camera"
import { drawMap, Minimap } from "../World"
import Cell from "./Cell"

export class Player {

    static clearPlayers() {
        Minimap.drawpl.clear()
        Player.updatePlayers()
    }

    static updatePlayers() {
        if (drawMap.border.centerX !== 0 || drawMap.border.centerY !== 0) return
        const targetSize = 200
        const borderAR = drawMap.border.width / drawMap.border.height // aspect ratio
        const width = targetSize * borderAR * Camera.get.viewportScale
        const height = targetSize / borderAR * Camera.get.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5
        const xScaler = width / drawMap.border.width
        const yScaler = height / drawMap.border.height
        const halfWidth = drawMap.border.width / 2
        const halfHeight = drawMap.border.height / 2
        const myPosX = beginX + (Camera.get.x + halfWidth) * xScaler
        const myPosY = beginY + (Camera.get.y + halfHeight) * yScaler
        
        const PI_2 = Math.PI * 2
        if (Cell.get.mine.length) {
            for (let i = 0; i < Cell.get.mine.length; i++) {
                var cell = Cell.get.byId[Cell.get.mine[i]]
                if (cell) {
                    Minimap.drawpl.beginFill(0xffffff)
                    Minimap.drawpl.arc(myPosX, myPosY, 5, 0, PI_2) 
                    Minimap.player.addChild(Minimap.drawpl)
                }
            }
        } else {
            Minimap.drawpl.beginFill(0xFAAFFF)
            Minimap.drawpl.arc(myPosX, myPosY, 5, 0, PI_2)
            Minimap.player.addChild(Minimap.drawpl)
        }

        cell = null
        for (let i = 0, l = Cell.get.mine.length; i < l; i++)
            if (Cell.get.byId.hasOwnProperty(Cell.get.mine[i])) {
                cell = Cell.get.byId[Cell.get.mine[i]]
                break
            }
    }
}