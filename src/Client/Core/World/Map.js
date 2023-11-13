import { Container, TilingSprite, utils, Graphics } from 'pixi.js'
import { Mergez } from '..'
export class drawMap {
    static border = Object.create({
        left: -2000,
        right: 2000,
        top: -2000,
        bottom: 2000,
        width: 4000,
        height: 4000,
        centerX: -1,
        centerY: -1
    })
    constructor(game) {
        this.game = game
        this.container = new Container()
        this.width = drawMap.border.width
        this.height = drawMap.border.height

        this.background = new TilingSprite(utils.TextureCache['Grid'], this.width, this.height)
        this.background.anchor.set(0.5)
        this.background.alpha = 0.2

        this.borderGraphics = new Graphics()
            .lineStyle(50, 0xf7f7f7)
            .drawRect(-this.width / 2, -this.height / 2, this.width, this.height)

        this.initialize()
    }
    initialize() {
        if (drawMap.border.centerX !== 0 || drawMap.border.centerY !== 0) return
        this.container.addChild(this.background)
        this.container.addChild(this.borderGraphics)
        Mergez.bgContainer.addChild(this.container)
    }
    redraw() {
        if (drawMap.border.centerX !== 0 || drawMap.border.centerY !== 0) return
        this.container.destroy()
    }
}