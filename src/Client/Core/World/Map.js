import { Container, TilingSprite, utils, Graphics } from 'pixi.js'
import { Minimap } from './Minimap'

export class Mapp {
    static border = {
        left: -2000,
        right: 2000,
        top: -2000,
        bottom: 2000,
        width: 4000,
        height: 4000,
        centerX: -1,
        centerY: -1
    }

    constructor(game) {
        this.game = game
        this.container = new Container()
        this.width = Mapp.border.width
        this.height = Mapp.border.height

        this.background = new TilingSprite(utils.TextureCache['Grid'], this.width, this.height)
        this.background.anchor.set(0.5)
        this.background.alpha = 0.2

        this.borderGraphics = new Graphics()
            .lineStyle(50, 0xf7f7f7)
            .drawRect(-this.width / 2, -this.height / 2, this.width, this.height)

        this.container.addChild(this.background)
        this.container.addChild(this.borderGraphics)
        Minimap.bgContainer.addChild(this.container)
    }
    
    redraw() {
        this.container.destroy({ children: true })
    }
}