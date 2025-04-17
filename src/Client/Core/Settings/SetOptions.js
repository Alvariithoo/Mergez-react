import $ from 'jquery'
import Settings from '../Settings'
import Keysbind from './Hotkeys'
import { Minimap } from '../World'

export class SetOptions {
    static setupOption() {
        const options = {
            showNames: {
                text: "Names",
                default: true,
                handler: token => Settings.list.showNames = token
            },
            showMass: {
                text: "Mass",
                default: true,
                handler: token => Settings.list.showMass = token
            },
            showChat: {
                text: "Chat",
                default: true,
                handler: token => Settings.list.showChat = token
            },
            fancyGrid: {
                text: "Grids",
                default: true,
                disabled: true, handler: token => Settings.list.fancyGrid = token
            },
            showMinimap: {
                text: "Minimap",
                default: true,
                handler: token => token ? Minimap.show() : Minimap.hide()
            },
            showSkins: {
                text: "Skins",
                default: true,
                handler: token => Settings.list.showSkins = token
            },
            showFPS: {
                text: "FPS",
                default: true,
                handler: token => Settings.list.showFPS = token
            },
            eatAnimation: {
                text: "Eat Animations",
                default: true,
                handler: token => Settings.list.eatAnimation = token
            }
        }

        const rows = Object.entries(options).filter(([_, opt]) => !opt.disabled).map(([id, opt]) => `
            <div id="setting-container">
                <p id="textSetting">${opt.text}</p>
                <input id="${id}" type="checkbox">
                <label id="setting" for="${id}"></label>
            </div>
        `)

        $(".firstSettings").append(rows.slice(0, 5).join(''))
        $(".secondSettings").append(rows.slice(5).join(''))

        $("input:checkbox").on("change", function () {
            const id = $(this).prop("id")
            const checked = $(this).prop("checked")
            Settings._setStorage(id, checked)
            options[id]?.handler(checked)
        })

        Object.entries(options).forEach(([id, opt]) => {
            if (Settings._getStorage(id) && opt.default) $("#" + id).click()
        })

        $("#AnimationDelay").append(`
            Animation Delay: <span id="anim_delay_txt">${Settings.list.animationDelay}</span>
            <input oninput="$('#anim_delay_txt').text(this.value)" id="range-slider__range" style="width:100%" type="range" min="40" max="240" step="10" value="${Settings.list.animationDelay}">
        `).on("change", "#range-slider__range", function () {
            Settings.list.animationDelay = $(this).val()
            Settings._setStorage("animDelay", Settings.list.animationDelay)
        })

        /**$("#HatsCell").append(`
            Hats Opacity: <span id="hats_txt">${Settings.list.hatOpcity}</span>
            <input oninput="$('#hats_txt').text(this.value)" id="range-slider__range" style="width:100%" type="range" min="0.5" max="1" step="0.05" value="${Settings.list.hatOpcity}">
        `).on("change", "#range-slider__range", function () {
            Settings.list.hatOpcity = $(this).val()
            Settings._setStorage("HatsOpacty", Settings.list.hatOpcity)
        })*/
    }

    static restoreSetting() {
        const restore = (key, prop, elmId) => {
            const value = Settings._getStorage(key)
            if (value) {
                Settings.list[prop] = value
                $(`#${elmId}`).val(value)
                $(`#${elmId}_txt`).text(value)
            }
        }

        restore("animDelay", "animationDelay", "animDelay")
        restore("HatsOpacty", "hatOpcity", "HatsOpacty")

        if (Settings._getStorage("hotkeyMapping")) {
            Keysbind.hotkeyMapping = JSON.parse(Settings._getStorage("hotkeyMapping"))
        } else {
            Object.entries(Keysbind.hotkeyConfig).forEach(([key, config]) => {
                if (config.defaultHotkey) Keysbind.hotkeyMapping[config.defaultHotkey] = key
            })
            Settings._setStorage("hotkeyMapping", Keysbind.hotkeyMapping)
        }
    }
}