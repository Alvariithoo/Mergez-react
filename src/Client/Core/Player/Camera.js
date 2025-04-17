import Cell from './Cell'
import { Stats } from '../Menu/Stats'
import { Minimap } from '../World'
import Utils from '../Utils'

export class Camera {

    static get = {
        x: 0,
        y: 0,
        nx: 0,
        ny: 0,
        target: {
            x: 0,
            y: 0,
            scale: 1
        },
        viewportScale: 1,
        userZoom: 1,
        sizeScale: 1,
        scale: 1,
        updated: 0,
        oldPos: {
            x: 0,
            y: 0
        }
    }

    static toCamera(obj) {
        obj.pivot.set(Camera.get.x, Camera.get.y)
        this.scaleForth(obj)
        obj.position.set(window.innerWidth / 2, window.innerHeight / 2)
    }

    static scaleForth(obj) {
        obj.scale.set(1 / Camera.get.scale)
    }

    static scaleBack(obj) {
        obj.scale.set(Camera.get.scale)
    }
    
    static fromCamera(obj) {
        obj.position.set(Camera.get.x, Camera.get.y)
        this.scaleBack(obj)
        obj.position.set(window.innerWidth / 2, window.innerHeight / 2)
    }

    static cameraUpdate() {
        const syncAppStamp = Date.now()
        const dt = Math.max(Math.min((syncAppStamp - Camera.get.updated) / 40, 1), 0)
        const myCells = []
        for (const id of Cell.get.mine) {
            const cell = Cell.get.byId[id]
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
            Camera.get.target.x = x / myCells.length
            Camera.get.target.y = y / myCells.length
            Camera.get.sizeScale = 1 // Math.pow(Math.min(64 / s, 1), 0.4)
            Camera.get.target.scale = Camera.get.sizeScale
            Camera.get.target.scale *= Camera.get.viewportScale * Camera.get.userZoom
            Camera.get.nx = (Camera.get.target.x + Camera.get.x) / 2
            Camera.get.ny = (Camera.get.target.y + Camera.get.y) / 2
            Stats.get.score = score
        } else {
            Stats.get.score = NaN
            Camera.get.nx += (Camera.get.target.x - Camera.get.x) / 20
            Camera.get.ny += (Camera.get.target.y - Camera.get.y) / 20
        }
        Camera.get.scale += (Camera.get.target.scale - Camera.get.scale) / 9
    
        Camera.get.x = Camera.get.oldPos.x + (Camera.get.nx - Camera.get.oldPos.x) * dt
        Camera.get.y = Camera.get.oldPos.y + (Camera.get.ny - Camera.get.oldPos.y) * dt
    
        Camera.get.oldPos.x = Camera.get.x
        Camera.get.oldPos.y = Camera.get.y
    
        this.toCamera(Minimap.cellContainer)
        this.fromCamera(Minimap.cellContainer)
        this.toCamera(Minimap.bgContainer)
        this.fromCamera(Minimap.bgContainer)
        Camera.get.updated = Date.now()
    }

    static handleScroll(event) {
        if (event.target !== Utils.byId('overlays2')) return
        Camera.get.userZoom *= event.deltaY > 0 ? 0.8 : 1.2
        Camera.get.userZoom = Math.max(Camera.get.userZoom, .01)
        Camera.get.userZoom = Math.min(Camera.get.userZoom, 4)
    }
}