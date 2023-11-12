

import $ from 'jquery'

import Settings from '../Settings'
import Keysbind from './Hotkeys'


export class SetOptions {
    static setupOption() {
        const options = {
            showNames: {
                text: "Names",
                "default": true,
                handler: function (token) {
                    Settings.list.showNames = token
                }
            },
            showMass: {
                text: "Mass",
                "default": true,
                handler: function (token) {
                    Settings.list.showMass = token
                }
            },
            showChat: {
                text: "Chat",
                "default": true,
                handler: function (token) {
                    Settings.list.showChat = token
                }
            },
            fancyGrid: {
                text: 'Grids',
                "default": true,
                handler(token) {
                    Settings.list.fancyGrid = token
                }
            },
            showMinimap: {
                text: "Minimap",
                "default": true,
                handler: function (token) {
                    Settings.list.showMinimap = token
                }
            },
            showSkins: {
                text: "Skins",
                "default": true,
                handler: function (token) {
                    Settings.list.showSkins = token
                }
            },
            showFPS: {
                text: "FPS",
                "default": true,
                handler: function (token) {
                    Settings.list.showFPS = token
                }
            },
            eatAnimation: {
                text: "Eat Animations",
                "default": true,
                handler: function (token) {
                    Settings.list.eatAnimation = token
                }
            }
        }
        let row = []
        for (let i in options) {
            if (!options[i].disabled) {
                row.push(`
                    <div id="setting-container">
                        <p id="textSetting">${options[i]["text"]}</p>
                        <input id="${i}" type="checkbox">
                        <label id="setting" for="${i}"></label>
                    </div>
                `)
            }
        }
        let d = row.splice(0, 5)
        for (let j = 0; j < d.length; j++) {
            $(".firstSettings").append(d[j])
        }
        for (let j = 0; j < row.length; j++) {
            $(".secondSettings").append(row[j])
        }
        $("input:checkbox").on("change", function () {
            let firstRestricted = $(this).prop("checked")
            let type = $(this).prop("id")
            Settings._setStorage(type, firstRestricted)
            if (options[type]) {
                options[type].handler(firstRestricted)
            }
        })
        for (let i in options) {
            if (Settings._getStorage(i)) {
                if (options[i]["default"]) {
                    $("#" + i).click()
                }
            }
        }
    
        $("#AnimationDelay").append(`Animation Delay: <span id="anim_delay_txt">${Settings.list.animationDelay}</span></div><input oninput="$('#anim_delay_txt').text(this.value)" id="range-slider__range" style="width:100%" type="range" id="animDelay" name="animDelay" min="40" max="240" step="10" value="${Settings.list.animationDelay}"></input>`)
        $("#animDelay").onchange = function () {
            Settings.list.animationDelay = $("#animDelay").val()
            Settings._setStorage("animDelay", Settings.list.animationDelay)
        }
    
        $("#HatsCell").append(`Hats Opacity: <span id="hats_txt">${Settings.list.hatOpcity}</span></div><input oninput="$('#hats_txt').text(this.value)" id="range-slider__range" style="width:100%" type="range" id="HatsOpacty" name="HatsOpacty" min="0.5" max="1" step="0.05" value="${Settings.list.hatOpcity}"></input>`)
        $("#HatsOpacty").onchange = function () {
            Settings.list.hatOpcity = $("#HatsOpacty").val()
            Settings._setStorage("HatsOpacty", Settings.list.hatOpcity)
        }
    }

    static restoreSetting() {
        if (Settings._getStorage("animDelay")) {
            Settings.list.animationDelay = Settings._getStorage("animDelay")
            $("#animDelay").val(Settings.list.animationDelay)
            $("#anim_delay_txt").text(Settings.list.animationDelay)
        }
        if (Settings._getStorage("HatsOpacty")) {
            Settings.list.hatOpcity = Settings._getStorage("HatsOpacty")
            $("#HatsOpacty").val(Settings.list.hatOpcity)
            $("#hats_txt").text(Settings.list.hatOpcity)
        }
    
        if (Settings._getStorage("hotkeyMapping")) {
            Keysbind.hotkeyMapping = JSON.parse(Settings._getStorage("hotkeyMapping"))
        } else {
            for (const unlock in Keysbind.hotkeyConfig) {
                if (Keysbind.hotkeyConfig[unlock].defaultHotkey && Keysbind.hotkeyConfig[unlock].defaultHotkey !== "") {
                    Keysbind.hotkeyMapping[Keysbind.hotkeyConfig[unlock].defaultHotkey] = unlock
                }
            }
            Settings._setStorage("hotkeyMapping", Keysbind.hotkeyMapping)
        }
    }
    
}