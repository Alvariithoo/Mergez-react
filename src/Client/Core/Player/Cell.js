import { Container, Graphics, Texture, Sprite, BitmapText, Text, BaseTexture } from 'pixi.js'
import Logger from '../Network/Logger'
import Settings from '../Settings'
import Functions from '../Game/Functions'
import Textures from './Textures'
import { Mergez } from '..'
import { Camera } from '../Game/Camera'

class Cell {

    static get = {
        mine: [],
        byId: new Map(),
        list: [],
    }

    static parseName(value) { // static method
        let [, skin, name ] = /^(?:<([^}]*)>)?([^]*)/.exec(value || '')
        name = name.trim()
        return {
            name: name,
            skin: (skin || '').trim(),
        }
    }
    static EMPTY_NAME = 'Mergez'
    static SKIN_URL = './skins/'
    static NICK_CACHE = new Map()
    static SKIN_CACHE = {}
    static MASS_CACHE = []

    static knownSkins = new Map()
    static loadedSkins = new Map()

    constructor(id, x, y, s, name, color, skin, flags) {
        this.destroyed = false
        this.diedBy = 0
        this.nameSize = 0
        this.updated = null
        this.dead = null
        this.id = id
        this.ox = x
        this.x = x
        this.nx = x
        this.oy = y
        this.y = y
        this.ny = y
        this.os = s
        this.s = s
        this.ns = s

        this.bitmapPool = []
        this.syncUpdStamp = Date.now()

        this.setColor(color)
        this.setName(name)
        this.setSkin(skin)

        this.jagged = flags.jagged
        this.ejected = flags.ejected
        this.born = this.syncUpdStamp

        this.drawSprite()
    }
    destroy(killerId) {
        delete Cell.get.byId[this.id]
        if (Cell.get.mine.remove(this.id) && Cell.get.mine.length === 0) ( Functions.showESCOverlay() && console.log("death") )
        this.destroyed = true
        this.dead = this.syncUpdStamp
        if (killerId && !this.diedBy) {
            this.diedBy = killerId
            this.updated = this.syncUpdStamp
        }
    }
    update(relativeTime) {
        if (Cell.get.mine.length !== 0)
        var dt = Math.max(Math.min((relativeTime - this.updated) / Settings.list.animationDelay, 1), 0)
        if (this.destroyed && Date.now() > this.dead + 240) {
            Cell.get.list.remove(this)
            if (this.massContainer) {
                this.entity.destroy()
                this.massContainer.destroy()
            } else {
                this.entity.destroy()
            }
        } else if (this.diedBy && Cell.get.byId.hasOwnProperty(this.diedBy)) {
            const { x, y } = Cell.get.byId[this.diedBy]
            this.nx = x
            this.ny = y
        }
        const { nx, ox, ny, oy, ns, os } = this
        this.x = ox + (nx - ox) * dt
        this.y = oy + (ny - oy) * dt
        this.s = os + (ns - os) * dt

        if (this.destroyed) {
            this.entity.alpha = Settings.list.eatAnimation ? Math.max(140 - Date.now() + this.dead, 0) / 140 : 0
            this.outContainer && (this.outContainer.alpha = Settings.list.eatAnimation ? Math.max(120 - Date.now() + this.dead, 0) / 120 : 0)
        }
    }
    updatePlayerPosition() {
        if (this.skinSprite) Settings.list.showSkins ? this.reDraw() : this.reDraw()
        if (this.nameSprite) {
            this.nameSprite.scale.set(this.s / 200, this.s / 200)
            this.nameSprite.alpha = Settings.list.showNames && (this.s * Camera.get.scale > 30 && this.jagged !== true) ? 1 : 0
        }
        if (this.massSprite) {
            if (Settings.list.showMass) {
                this.entity.removeChild(this.massSprite)
                this.massSprite = this.drawMass()
                let y = Math.max(this.s / 2.4, this.nameSize / 1)
                this.massSprite.scale.set(this.s / 200, this.s / 200)
                this.massSprite.y = y
                this.massSprite.alpha = (this.s * Camera.get.scale > 30 && this.jagged !== true) ? 1 : 0
                this.entity.addChild(this.massSprite)
            } else {
                this.massSprite.scale.set(this.s / 200, this.s / 200)
                this.massSprite.alpha = 0
            }
        }
        if (this.entity) {
            this.entity.x = this.x
            this.entity.y = this.y
            this.entity.zIndex = this.os
        }
        if (this.skinSprite) {
            this.skinSprite.width = this.skinSprite.height = this.s * 2
        }
        if (this.cellSprite) {
            this.cellSprite.width = this.cellSprite.height = this.s * 2
        }
    }
    setName(rawName) {
        const { name } = Cell.parseName(rawName)
        this.name = name
    }
    setSkin(value) {
        this.skin = (value && value[0] === '%' ? value.slice(1) : value) || this.skin
        if (this.skin === null || !Cell.knownSkins.has(this.skin) || Cell.loadedSkins.has(this.skin)) {
            return
        }
    }
    setColor(value) {
        if (!value) {
            Logger.warn('Got no color')
            return
        }
        this.color = value
    }
    drawSprite() {
        this.skinSprite = this.drawSkin()
        this.cellSprite = this.drawCell()
        this.entity = new Container()
        this.entity.addChild(this.cellSprite)
        if (this.skin && Settings.list.showSkins) this.entity.addChild(this.skinSprite)
        if (this.name && Settings.list.showNames) {
            this.nameSprite = this.drawName()
            this.nameSprite.scale.set(this.s / 200, this.s / 200)
            this.entity.addChild(this.nameSprite)
        }
        if (this.name && Settings.list.showMass) {
            this.massSprite = this.drawMass()
            this.massSprite.scale.set(this.s / 200, this.s / 200)
            this.entity.addChild(this.massSprite)
        }
        this.entity.position.x = this.x
        this.entity.position.y = this.y
        Mergez.cellContainer.addChild(this.entity)
    }
    drawCell() {
        let texture
        if (this.jagged === true) {
            texture = Textures.entity.virus
        } else if (this.ejected) {
            texture = Textures.entity.food
        } else {
            texture = Textures.entity.cell
        }
        let drawSprite = new Sprite(texture)
        drawSprite.texture.baseTexture.mipmap = true
        drawSprite.anchor.set(0.5)
        drawSprite.width = drawSprite.height = this.s * 2
        drawSprite.tint = this.color.toHex()
        return drawSprite
    }
    reDraw() {
        if (this.destroyed) return
        this.entity.destroy()
        this.drawSprite()
    }
    drawSkin() {
        let texture = this.drawSkinTexture(`${Cell.SKIN_URL}${this.skin}.png`)
        let isNonSkin = false

        if (texture.then || texture === "not_loaded") {
            texture = Textures.entity.cell
            isNonSkin = true
        }

        let skinSprite = new Sprite(texture)
        skinSprite.texture.baseTexture.mipmap = true
        skinSprite.anchor.set(.5)
        skinSprite.width = skinSprite.height = this.s * 2
        if (isNonSkin) skinSprite.tint = true ? (this.color ? this.color.toHex() : '0xFFFFFF') : '0xFFFFFF'
        return skinSprite
    }
    drawSkinTexture(image) {
        if (Cell.SKIN_CACHE[image]) {
            return Cell.SKIN_CACHE[image]
        } else {
            return new Promise(resolve => {
                const SKIN_IMAGE = new Image()
                SKIN_IMAGE.crossOrigin = "Anonymous"
                SKIN_IMAGE.onload = () => {
                    let pixels = 512
                    if (SKIN_IMAGE.width !== pixels || SKIN_IMAGE.height !== pixels) {
                        const resizedImage = this.resizeToWidth(SKIN_IMAGE, pixels, pixels)
                        SKIN_IMAGE.src = resizedImage.toDataURL()
                    }

                    let loadedTexture = new Texture(new BaseTexture(SKIN_IMAGE))

                    let skinGraphics = new Graphics()
                        .beginTextureFill({ texture: loadedTexture })
                        .drawCircle(pixels / 2, pixels / 2, pixels / 2)
                        .endFill()
                    let texture = Textures.get(skinGraphics)
                    Cell.SKIN_CACHE[image] = texture
                    this.reDraw()
                    resolve(texture)
                }
                SKIN_IMAGE.onerror = function () {
                    Cell.SKIN_CACHE[image] = "not_loaded"
                }
                SKIN_IMAGE.src = image
            })
        }
    }
    resizeToWidth(image, maxWidth, maxHeight) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
    
        // Scaling factors
        const scaleX = maxWidth / image.width
        const scaleY = maxHeight / image.height
        
        // Choose the appropriate scaling factor to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY)
        
        // New dimensions
        const newWidth = image.width * scale
        const newHeight = image.height * scale
        
        // Position to center the image
        const x = (maxWidth - newWidth) / 2
        const y = (maxHeight - newHeight) / 2
        
        canvas.width = maxWidth
        canvas.height = maxHeight
        ctx.drawImage(image, x, y, newWidth, newHeight)
        
        return canvas
    }
    drawName() {
        if (Cell.NICK_CACHE[this.name]) {
            this.nameSprite = new Sprite(Cell.NICK_CACHE[this.name])
            this.nameSprite.anchor.set(.5)
            return this.nameSprite
        }
        this.style = {
            fontSize: 60,
            lineJoin: "round",
            fontFamily: "Ubuntu",
            fill: "white",
            stroke: "black",
            strokeThickness: 10
        }
        let text = new Text(this.name, this.style)
        let cache = Textures.get(text)
        this.nameSprite = new Sprite(cache)
        this.nameSprite.texture.baseTexture.mipmap = true
        this.nameSprite.anchor.set(.5)

        Cell.NICK_CACHE[this.name] = cache
        return this.nameSprite
    }
    shortMass(mass) {
        if (mass >= 1000) {
            return (mass / 1000).toFixed(1) + "k"
        } else {
            return (Math.round(mass / 6) * 6).toString()
        }
    }
    _getMassInstance() {
        let mass = this.bitmapPool.shift()
        if (mass) { return mass }
        mass = new BitmapText("", {
            fontName: "Ubuntu",
        })
        return mass
    }
    drawMass() {
        const mass = (~~(this.s * this.s / 100))
        if (Cell.MASS_CACHE[mass]) {
            this.massSprite = new Sprite(Cell.MASS_CACHE[mass])
            this.massSprite.anchor.set(.5)
            return this.massSprite
        }

        let _mass = this._getMassInstance()
        _mass.text = mass
    
        let cache = Textures.get(_mass)
        this.massSprite = new Sprite(cache)
        this.massSprite.anchor.set(.5)

        Cell.MASS_CACHE[mass] = cache
        return this.massSprite
    }
}

export default Cell