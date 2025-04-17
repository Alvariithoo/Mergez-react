
import { Minimap } from './World'
import { Chat } from './Menu/Chat'
import Textures from './Player/Textures'
import Settings from './Settings'
import Utils from './Utils'
import { App } from './World'
import Network from './Network'

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function (a) {
    const i = this.indexOf(a)
    return i !== -1 && this.splice(i, 1)
}

export class Mergez {
    static init() {
        Utils.showESCOverlay()
        Utils.mainLoader()
        
        Network.startGameLoop()
        
        App.init()
        Settings.init()
        Textures.init()
        
        Chat.init()
        Minimap.init()
    }
}

window.mergez = Mergez