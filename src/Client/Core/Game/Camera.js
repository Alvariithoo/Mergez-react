import { Cells, Stats } from "../World"
import PlayerCamera from '../Player/Camera'
import Constant from "./Variable"
import Functions from "./Functions"


export class Camera {
    static toCamera(obj) {
        obj.pivot.set(PlayerCamera.camera.x, PlayerCamera.camera.y)
        this.scaleForth(obj)
        obj.position.set(window.innerWidth / 2, window.innerHeight / 2)
    }

    static scaleForth(obj) {
        obj.scale.set(1 / PlayerCamera.camera.scale)
    }

    static scaleBack(obj) {
        obj.scale.set(PlayerCamera.camera.scale)
    }
    
    static fromCamera(obj) {
        obj.position.set(PlayerCamera.camera.x, PlayerCamera.camera.y)
        this.scaleBack(obj)
        obj.position.set(window.innerWidth / 2, window.innerHeight / 2)
    }

    static cameraUpdate() {
        const syncAppStamp = Date.now()
        const dt = Math.max(Math.min((syncAppStamp - PlayerCamera.camera.updated) / 40, 1), 0)
        const myCells = []
        for (const id of Cells.cells.mine) {
            const cell = Cells.cells.byId[id]
            if (cell) myCells.push(cell)
        }
        if (myCells.length > 0) {
            let x = 0
            let y = 0
            let s = 0
            let score = 0
            for (const cell of myCells) {
                score += ~~(cell.ns * cell.ns / 100)
                x += cell.x
                y += cell.y
                // eslint-disable-next-line no-unused-vars
                s += cell.s
            }
            PlayerCamera.camera.target.x = x / myCells.length
            PlayerCamera.camera.target.y = y / myCells.length
            PlayerCamera.camera.sizeScale = 1 // Math.pow(Math.min(64 / s, 1), 0.4)
            PlayerCamera.camera.target.scale = PlayerCamera.camera.sizeScale
            PlayerCamera.camera.target.scale *= PlayerCamera.camera.viewportScale * PlayerCamera.camera.userZoom
            PlayerCamera.camera.nx = (PlayerCamera.camera.target.x + PlayerCamera.camera.x) / 2
            PlayerCamera.camera.ny = (PlayerCamera.camera.target.y + PlayerCamera.camera.y) / 2
            Stats.stats.score = score
        } else {
            Stats.stats.score = NaN
            PlayerCamera.camera.nx += (PlayerCamera.camera.target.x - PlayerCamera.camera.x) / 20
            PlayerCamera.camera.ny += (PlayerCamera.camera.target.y - PlayerCamera.camera.y) / 20
        }
        PlayerCamera.camera.scale += (PlayerCamera.camera.target.scale - PlayerCamera.camera.scale) / 9
    
        PlayerCamera.camera.x = PlayerCamera.camera.oldPos.x + (PlayerCamera.camera.nx - PlayerCamera.camera.oldPos.x) * dt
        PlayerCamera.camera.y = PlayerCamera.camera.oldPos.y + (PlayerCamera.camera.ny - PlayerCamera.camera.oldPos.y) * dt
    
        PlayerCamera.camera.oldPos.x = PlayerCamera.camera.x
        PlayerCamera.camera.oldPos.y = PlayerCamera.camera.y
    
        this.toCamera(Constant.cellContainer)
        this.fromCamera(Constant.cellContainer)
        this.toCamera(Constant.bgContainer)
        this.fromCamera(Constant.bgContainer)
        PlayerCamera.camera.updated = Date.now()
    }

    static handleScroll(event) {
        if (event.target !== Functions.byId('overlays2')) return
        PlayerCamera.camera.userZoom *= event.deltaY > 0 ? 0.8 : 1.2
        PlayerCamera.camera.userZoom = Math.max(PlayerCamera.camera.userZoom, .01)
        PlayerCamera.camera.userZoom = Math.min(PlayerCamera.camera.userZoom, 4)
    }
}