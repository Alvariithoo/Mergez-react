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

    static get(name) {
        return Mergez.application.renderer.generateTexture(name)
    }

    static generateTextures() { 
        let Cell = new Graphics()
            .beginFill(0xFFFFFF)
            .drawCircle(0, 0, 512)
            .endFill()
        Textures.entity.cell = Textures.get(Cell)
    
        let Food = new Graphics()
            .beginFill(0xFFFFFF)
            .drawCircle(0, 0, 64)
            .endFill()
        Textures.entity.food = Textures.get(Food)
    
        let Pellet = new Graphics()
            .beginFill(0xFFFFFF)
            .drawCircle(0, 0, 64)
            .endFill()
        Textures.entity.pellet = Textures.get(Pellet)

        let Virus = new Graphics()
            .beginTextureFill({ texture: utils.TextureCache['Virus'] })
            .drawCircle(256, 256, 256)
            .endFill()
        Textures.entity.virus = Textures.get(Virus)
    }

    static preloadSprites() {
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
        spriteLoader.onError.add(() => {
            Logger.error("error")
        })
    }
}

export default Textures