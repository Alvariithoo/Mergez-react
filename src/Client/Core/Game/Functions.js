
import $ from 'jquery'
import Writer from '../Network/Writer'
import Settings from '../Settings'
import Network from '../Network'
import { drawMap } from '../World'
import { Mergez } from '..'

class Functions {
    static hideESCOverlay() {
        Settings.ingame.escOverlayShown = false
        $('#overlays').hide()
    }

    static showESCOverlay() {
        Settings.ingame.escOverlayShown = true
        $('overlays').show()
        if (Settings.list.wagerWs) {
            $("#wagerPanel-bg").show()
            $("#wagerMain").show()
        }
    }

    static cleanupObject(object) {
        for (const i in object) delete object[i]
    }

    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp")
            .replace(/</g, "&lt")
            .replace(/>/g, "&gt")
            .replace(/"/g, "&quot")
            .replace(/'/g, "&#039")
    }

    static byId(id) {
        return document.getElementById(id)
    }

    static isValidHotKey(event) {
        return (
            (48 <= event.keyCode && event.keyCode <= 57) || // Numbers 0-9
            (65 <= event.keyCode && event.keyCode <= 90) || // Uppercase letters A-Z
            event.keyCode === 9 || // Tab key
            event.keyCode === 13 || // Enter key
            event.keyCode === 27 ||  // ESC key
            event.keyCode === 32 // SPACE
        )
    }

    static processKey(event) {
        let IE_KEYS = {}
        let key = this.isValidHotKey(event.code) || event.key.toLowerCase()
        if (Object.hasOwnProperty.call(IE_KEYS, key)) key = IE_KEYS[key] // IE fix
        return key
    }

    static sendMouseMove(x, y) {
        const writer = new Writer(true)
        writer.setUint8(0x10)
        writer.setUint32(x)
        writer.setUint32(y)
        writer._b.push(0, 0, 0, 0)
        Network.wsSend(writer)
    }

    static sendChat(text) {
        const writer = new Writer()
        writer.setUint8(0x63)
        writer.setUint8(0)
        writer.setStringUTF8(text)
        Network.wsSend(writer)
    }

    static drawGrid() {
        if (Settings.list.fancyGrid === true) return
        Settings.list.fancyGrid = true
        
        if (window.drawMapInstance) window.drawMapInstance.container.destroy()
        window.drawMapInstance = new drawMap(Mergez.application)
    }
}

export default Functions