import { Container, Graphics } from "pixi.js"

class Constant {
    
    static cellContainer = null
    static bgContainer = null
    
    static chatBox = null
    static chatArea = null
    static chatRoom = null
    
    static drawMapInstance

    static mapsquare = new Container()
    static mapsector = new Container()
    static mapplayer = new Container()
    static drawpl = new Graphics()
    static square = new Graphics()
}

export default Constant