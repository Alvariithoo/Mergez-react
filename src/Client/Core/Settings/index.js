import $ from 'jquery'

import Logger from '../Network/Logger'
import Functions from '../Game/Functions'
import Keybind from './Hotkeys'
import { SetOptions } from './SetOptions'

class Settings {
    static list = {
        nick: '',
        skin_url: '',
        gamemode: '',
        wagerWs: null,
        showSkins: true,
        showNames: true,
        fancyGrid: true,
        showMass: true,
        eatAnimation: true,
        showFPS: true,
        showMinimap: true,

        

        showChat: true,
    
        animationDelay: 120,
        hatOpcity: 1,
    }

    static ingame = {
        escOverlayShown: false,
        mapCenterSet: false,
        isTyping: false,

        mouseX: NaN,
        mouseY: NaN
    }
    
    static initSetting(id, elm) {
        function simpleAssignListen(id, elm, prop) {
            if (Settings.list[id] !== '') elm[prop] = Settings.list[id]
            elm.addEventListener('change', () => {
                Settings.list[id] = elm[prop]
            })
        }
        switch (elm.tagName.toLowerCase()) {
            case 'input':
                switch (elm.type.toLowerCase()) {
                    case 'range':
                    case 'text':
                        simpleAssignListen(id, elm, 'value')
                        break
                    case 'checkbox':
                        simpleAssignListen(id, elm, 'checked')
                        break
                    default:
                        break
                }
                break
            case 'select':
                simpleAssignListen(id, elm, 'value')
                break
            default:
                break
        }
    }
    
    static loadSettings() {
        const text = localStorage.getItem('Options')
        const obj = text ? JSON.parse(text) : Settings.list
        for (const prop in Settings.list) {
            const elm = Functions.byId(prop.charAt(0) === '_' ? prop.slice(1) : prop)
            if (elm) {
                if (Object.hasOwnProperty.call(obj, prop)) Settings.list[prop] = obj[prop]
                this.initSetting(prop, elm)
            } else Logger.info(`setting ${prop} not loaded because there is no element for it.`)
        }
    }
    
    static storeSettings() {
        localStorage.setItem('Options', JSON.stringify(Settings.list))
    }
    
    static afterGameLogicLoaded() {
        SetOptions.setupOption()
        Keybind.setupHotKey()
        SetOptions.restoreSetting()
        Keybind.setUpHotKeyConfigPage()
    }
    
    static _setStorage(key, value){
        if ("string" == typeof value) {
            localStorage.setItem(key, value)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }
    
    static _getStorage(storageKey) {
        return localStorage.getItem(storageKey)
    }
}


export default Settings