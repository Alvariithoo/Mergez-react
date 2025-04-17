import { Graphics, Loader, utils } from 'pixi.js'
import Logger from '../Network/Logger'
import { Stats } from '../Menu/Stats'
import { Mergez } from '..'

class Textures {
    static entity = {
        cell: null,
        food: null,
        pellet: null,
        virus: null
    }

    static init() {
        const spriteLoader = new Loader()
        spriteLoader.add([
            { name: 'Virus', url: './sprites/virus.png' },
            { name: 'Grid', url: './sprites/grid.png' },
            { name: 'Border', url: './sprites/border.png' }
        ])
        spriteLoader.load(() => {
            this.generateTextures()
            Stats.drawStats()
        })
        spriteLoader.onError.add(() => Logger.error('Error loading sprites'))
    }
    
    static get(name) {
        return Mergez.application.renderer.generateTexture(name)
    }

    static createCircleTexture(radius, fillColor, textureName) {
        const graphic = new Graphics()
            .beginFill(fillColor)
            .drawCircle(0, 0, radius)
            .endFill()
        Textures.entity[textureName] = Textures.get(graphic)
    }

    static generateTextures() {
        Textures.createCircleTexture(512, 0xFFFFFF, 'cell')
        Textures.createCircleTexture(64, 0xFFFFFF, 'food')
        Textures.createCircleTexture(64, 0xFFFFFF, 'pellet')

        const virusGraphic = new Graphics()
            .beginTextureFill({ texture: utils.TextureCache['Virus'] })
            .drawCircle(256, 256, 256)
            .endFill()
        Textures.entity.virus = Textures.get(virusGraphic)
    }
}

export default Textures