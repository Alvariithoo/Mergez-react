import { Mergez } from '..'
import { Camera } from './Camera'
import { Mapp, Minimap } from '../World'
import Cell from './Cell'

export class Player {
    static clearPlayers() {
        Minimap.drawpl.clear()
        Player.updatePlayers()
    }

    static updatePlayers() {
        if (Mapp.border.centerX !== 0 || Mapp.border.centerY !== 0) return

        const { beginX, beginY, xScaler, yScaler } = Player.calculateMinimapDimensions()
        const { myPosX, myPosY } = Player.calculatePlayerPosition(beginX, beginY, xScaler, yScaler)

        Player.drawPlayerOnMinimap(myPosX, myPosY)
        Player.updateCellReferences()
    }

    static calculateMinimapDimensions() {
        const targetSize = 200
        const borderAR = Mapp.border.width / Mapp.border.height
        const width = targetSize * borderAR * Camera.get.viewportScale
        const height = targetSize / borderAR * Camera.get.viewportScale
        const beginX = Mergez.view.width - width - 5
        const beginY = Mergez.view.height - height - 5
        const xScaler = width / Mapp.border.width
        const yScaler = height / Mapp.border.height

        return { beginX, beginY, xScaler, yScaler }
    }

    static calculatePlayerPosition(beginX, beginY, xScaler, yScaler) {
        const halfWidth = Mapp.border.width / 2
        const halfHeight = Mapp.border.height / 2
        const myPosX = beginX + (Camera.get.x + halfWidth) * xScaler
        const myPosY = beginY + (Camera.get.y + halfHeight) * yScaler

        return { myPosX, myPosY }
    }

    static drawPlayerOnMinimap(myPosX, myPosY) {
        const PI_2 = Math.PI * 2
        const fillColor = Cell.get.mine.length ? 0xffffff : 0xFAAFFF

        Minimap.drawpl.beginFill(fillColor)
        Minimap.drawpl.arc(myPosX, myPosY, 5, 0, PI_2)
        Minimap.player.addChild(Minimap.drawpl)
    }

    static updateCellReferences() {
        for (let i = 0, l = Cell.get.mine.length; i < l; i++) {
            const cell = Cell.get.byId[Cell.get.mine[i]]
            if (cell) break
        }
    }
}