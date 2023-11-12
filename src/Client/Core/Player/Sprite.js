import { Graphics, Loader, utils } from 'pixi.js'
import Logger from '../Network/Logger'
import { Stats } from '../World'
import { Mergez } from '..'

class Textures {

    static entity = {
        cell: null,
        food: null,
        pellet: null,
        virus: null
    }

    static generateTextures() {    
        let Cell = new Graphics()
        Cell.beginFill(0xFFFFFF)
        Cell.drawCircle(0, 0, 512)
        Cell.endFill()
        Textures.entity.cell = Mergez.application.renderer.generateTexture(Cell)
    
        let Food = new Graphics()
        Food.beginFill(0xFFFFFF)
        Food.drawCircle(0, 0, 64)
        Food.endFill()
        Textures.entity.food = Mergez.application.renderer.generateTexture(Food)
    
        let Pellet = new Graphics()
        Pellet.beginFill(0xFFFFFF)
        Pellet.drawCircle(0, 0, 64)
        Pellet.endFill()
        Textures.entity.pellet = Mergez.application.renderer.generateTexture(Pellet)

        let Virus = new Graphics()
        Virus.beginTextureFill({ texture: utils.TextureCache['Virus'] })
        Virus.drawCircle(256, 256, 256)
        Virus.endFill()
        Textures.entity.virus = Mergez.application.renderer.generateTexture(Virus)
    }

    static preloadSprites(){
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