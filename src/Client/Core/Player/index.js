
import Constant from "../Game/Variable"
import { Cells, drawMap } from "../World"
import PlayerCamera from "./Camera"
import { Mergez } from ".."

export class Player {


    static clearPlayers() {
        Constant.drawpl.clear()
        Player.updatePlayers()
    }

    static updatePlayers() {
        if (drawMap.border.centerX !== 0 || drawMap.border.centerY !== 0) return
        const targetSize = 200
        const borderAR = drawMap.border.width / drawMap.border.height // aspect ratio
        const width = targetSize * borderAR * PlayerCamera.camera.viewportScale
        const height = targetSize / borderAR * PlayerCamera.camera.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5
        const xScaler = width / drawMap.border.width
        const yScaler = height / drawMap.border.height
        const halfWidth = drawMap.border.width / 2
        const halfHeight = drawMap.border.height / 2
        const myPosX = beginX + (PlayerCamera.camera.x + halfWidth) * xScaler
        const myPosY = beginY + (PlayerCamera.camera.y + halfHeight) * yScaler
        
        const PI_2 = Math.PI * 2
        if (Cells.cells.mine.length) {
            for (let i = 0; i < Cells.cells.mine.length; i++) {
                var cell = Cells.cells.byId[Cells.cells.mine[i]]
                if (cell) {
                    Constant.drawpl.beginFill(0xffffff)
                    Constant.drawpl.arc(myPosX, myPosY, 5, 0, PI_2) 
                    Constant.mapplayer.addChild(Constant.drawpl)
                }
            }
        } else {
            Constant.drawpl.beginFill(0xFAAFFF)
            Constant.drawpl.arc(myPosX, myPosY, 5, 0, PI_2)
            Constant.mapplayer.addChild(Constant.drawpl)
        }

        cell = null
        for (let i = 0, l = Cells.cells.mine.length; i < l; i++)
            if (Cells.cells.byId.hasOwnProperty(Cells.cells.mine[i])) {
                cell = Cells.cells.byId[Cells.cells.mine[i]]
                break
            }
    }
}