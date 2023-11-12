

import $ from 'jquery'
import Constant from '../Game/Variable'
import Functions from '../Game/Functions'
import Network from '../Network'
import Settings from '.'

$("#overlays2").on("mousedown", (event) => {
    if (event.button === 0) {
        switch ($("#leftMouse").val()) {
            case "Feed":
                this.isPressed = true
                break
            case "Split16":
                this.isPressed = true
                break
            case "Split8":
                this.isPressed = true
                break
            case "Split4":
                this.isPressed = true
                break
            case "Split":
                this.isPressed = true
                break
            default:
                break
        }
    } else if (event.button === 2) {
        switch ($("#rightMouse").val()) {
            case "Feed":
                this.isPressed = true
                break
            case "Split16":
                this.isPressed = true
                break
            case "Split8":
                this.isPressed = true
                break
            case "Split4":
                this.isPressed = true
                break
            case "Split":
                this.isPressed = true
                break
            default:
                break
        }
    }
})

$("#overlays2").on("mouseup", (event) => {
    if (event.button === 0) {
        switch ($("#leftMouse").val()) {
            case "Feed":
                this.isPressed = false
                break
            case "Split16":
                this.isPressed = false
                break
            case "Split8":
                this.isPressed = false
                break
            case "Split4":
                this.isPressed = false
                break
            case "Split":
                this.isPressed = false
                break
            default:
                break
        }
    } else if (event.button === 2) {
        switch ($("#rightMouse").val()) {
            case "Feed":
                this.isPressed = false
                break
            case "Split16":
                this.isPressed = false
                break
            case "tripleSplit":
                this.isPressed = false
                break
            case "Split4":
                this.isPressed = false
                break
            case "Split":
                this.isPressed = false
                break
            default:
                break
        }
    }
})

function refreshHotkeySettingPage() {
    console.log("restoring")
    let codeSegments = $(".hotkey")
    for (let i = 0; i < codeSegments.length; i++) {
        $(codeSegments[i]).text(" ")
    }
    for (let version in Keysbind.hotkeyMapping) {
        $("[data-hotkeyid=" + Keysbind.hotkeyMapping[version] + "]").text(version)
    }
}

class Keysbind {

    static macroIntervalID

    static selectedHotkeyRow
    static hotkeyConfig = new Map()
    static hotkeyMapping = new Map()
    static defaultHotkeyMapping = new Map()

    static pressed = {
        enter: false,
    }


    static setFeed(isFeed) {
        if (isFeed) {
            if (Settings.ingame.isTyping || Settings.ingame.escOverlayShown) return
            const feed = Network.UINT8_CACHE[22]
            const macroCooldown = 0//1000 / 7
            if (feed !== undefined) Network.wsSend(feed)
            if (!Keysbind.macroIntervalID) Keysbind.macroIntervalID = setInterval(() => Network.wsSend(feed), macroCooldown)
        } else {
            clearInterval(Keysbind.macroIntervalID)
            Keysbind.macroIntervalID = null
        }
    }

    static getPressedKey(event) {
        let optsData = ""
    
        if (event.ctrlKey) {
            optsData += "CTRL_"
        }
        if (event.altKey) {
            optsData += "ALT_"
        }
    
        if (event.keyCode === 9) {
            optsData += "TAB"
        } else if (event.keyCode === 13) {
            optsData += "ENTER"
        } else if (event.keyCode === 27) {
            optsData += "ESC"
        } else if (event.keyCode === 32) {
            optsData += "SPACE"
        } else {
            optsData += String.fromCharCode(event.keyCode)
        }
    
        return optsData
    }

    static keydown(event) {
        if ("input" !== event.target.tagName.toLowerCase() && "textarea" !== event.target.tagName.toLowerCase()) {
            let username = ""
            if (Functions.isValidHotKey(event) && (username = Keysbind.getPressedKey(event)) && 18 === event.keyCode && event.preventDefault() && Keysbind.selectedHotkeyRow) {
                if (46 === event.keyCode) {
                    event.preventDefault()
                    Keysbind.selectedHotkeyRow.find(".hotkey").text(username)
                } else {
                    if ("" !== username) {
                        event.preventDefault()
                        let codeSegments = $(".hotkey")
                        for (let i = 0; i < codeSegments.length; i++) {
                            if ($(codeSegments[i]).text() === username) {
                                return
                            }
                        }
                        Keysbind.selectedHotkeyRow.find(".hotkey").text(username)
                        Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
                        Keysbind.selectedHotkeyRow = null
                    }
                }
            }
            if ("" !== username) {
                if (Keysbind.hotkeyMapping[username]) {
                    event.preventDefault()
                    if (Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[username]]) {
                        if (Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[username]].keyDown) {
                            Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[username]].keyDown()
                        }
                    }
                }
            }
        }
        const key = Functions.processKey(event)
        if (Keysbind.pressed[key]) return
        if (Object.hasOwnProperty.call(Keysbind.pressed, key)) Keysbind.pressed[key] = true
        if (key === 'enter') {
            Keysbind.getWagerPanel(event)
            if (Settings.ingame.escOverlayShown || !Settings.list.showChat) return
            if (Settings.ingame.isTyping) {
                Constant.chatBox.blur()
                if (Constant.chatBox.value.length > 0) Functions.sendChat(Constant.chatBox.value)
                Constant.chatBox.value = ''
            } else {
                Constant.chatBox.focus()
            }
        }
    }

    static keyup(event) {
        if ("input" !== event.target.tagName.toLowerCase() || "textarea" !== event.target.tagName.toLowerCase() || 13 === event.keyCode) {
            var rt = ""
            if (Functions.isValidHotKey(event)) {
                rt = Keysbind.getPressedKey(event)
            }
            if ("" !== rt) {
                event.preventDefault()
                if (Keysbind.hotkeyMapping[rt]) {
                    if (Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[rt]]) {
                        if (Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[rt]].keyUp) {
                            Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[rt]].keyUp()
                        }
                    }
                }
            }
        }
        const key = Functions.processKey(event)
        if (Object.hasOwnProperty.call(Keysbind.pressed, key)) Keysbind.pressed[key] = false
    }

    static getWagerPanel(event) {
        if ($("#wagerPanel-bg").css("display") === "block" && !!Settings.list.wagerWs && Functions.showESCOverlay()) {
            if (event.target.id === "wagerChatInput") {
                Settings.list.wagerWs.sendData({ type: "message", message: $("#wagerChatInput").val() })
                $("#wagerChatInput").val("")
            } else if (event.target.id === "wagerCodeInput") {
                $("#wagerCodeButton").click()
                $("#wagerCodeInput").blur()
            }
            else $("#wagerChatInput").focus()
        }
    }

    static getHotkeyById(keepData) {
        for (const unlock in Keysbind.hotkeyMapping) {
            if (Keysbind.hotkeyMapping[unlock] === keepData) {
                return unlock
            }
        }
        return ""
    }

    static setupHotKey() {
        Keysbind.hotkeyConfig = {
            hk_menu: {
                defaultHotkey: "ESC",
                name: "Menu",
                keyDown: function () {
                    Settings.list.showChat ? $('#overlays').show() : $('#overlays').hide()
                    // if (Settings.ingame.escOverlayShown) {
                    //     Functions.hideESCOverlay()
                    // } else {
                    //     Functions.showESCOverlay()
                    // }
                },
                type: "NORMAL"
            },
            hk_feed: {
                defaultHotkey: "W",
                name: "Feed",
                keyDown: function () {
                    Keysbind.setFeed(true)
                },
                keyUp: function () {
                    Keysbind.setFeed(false)
                },
                type: "NORMAL"
            },
            hk_Split: {
                defaultHotkey: "SPACE",
                name: "Split",
                keyDown: function () {
                    Network.wsSend(Network.UINT8_CACHE[17])
                },
                type: "NORMAL"
            },
            hk_double_Split: {
                defaultHotkey: "Q",
                name: "Double Split",
                keyDown: function () {
                    Network.wsSend(Network.UINT8_CACHE[18])
                },
                type: "NORMAL"
            },
            hk_triple_Split: {
                defaultHotkey: "G",
                name: "Triple Split",
                keyDown: function () {
                    Network.wsSend(Network.UINT8_CACHE[19])
                },
                type: "NORMAL"
            },
            hk_quad_Split: {
                defaultHotkey: "T",
                name: "16 Split",
                keyDown: function () {
                    Network.wsSend(Network.UINT8_CACHE[20])
                },
                type: "NORMAL"
            },
            hk_skin: {
                defaultHotkey: "V",
                name: "Skins",
                keyDown: function () {
                    $("#showSkins").click()
                },
                type: "NORMAL"
            },
            hk_name: {
                defaultHotkey: "N",
                name: "Names",
                keyDown: function () {
                    $("#showNames").click()
                },
                type: "NORMAL"
            },
            hk_mass: {
                defaultHotkey: "M",
                name: "Mass",
                keyDown: function () {
                    $("#showMass").click()
                },
                type: "NORMAL"
            },
        }
    }

    static setUpHotKeyConfigPage() {
        var body
        body = $('<div id="hotkeys_setting" class="modal fade" role="dialog"/>').append(Keysbind.getHotkeyDivHtml())
        $("#KeysContainerBinds").append(body)
        $("#hotkey_setting").insertAfter("#modal-content")
        $(document).on("hide.bs.modal", "#hotkeys_setting", function () {
            if (Keysbind.selectedHotkeyRow) {
                Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
            }
            Keysbind.selectedHotkeyRow = null
            console.log("reset setUpHotKeyConfigPage?")
            refreshHotkeySettingPage()
        })
        $("#hotkey_table .row").not(".header").on("click", function () {
            if (Keysbind.selectedHotkeyRow) {
                Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
            }
            Keysbind.selectedHotkeyRow = $(this)
            Keysbind.selectedHotkeyRow.addClass("table-row-selected")
        })
    }

    static getHotkeyDivHtml() {
        var fragment = $("<div id='hotkey_setting'></div>")
        var rendered = $("<div id='hotkey_table'></div>")
        var $message = $("<div class='row'></div>")
        $message.append($(`<div class='cell cell1' style='background:rgba(137, 24, 24, 0.69)'>Hotkey</div>`))
        $message.append($(`<div class='cell cell2' style='background:rgba(137, 24, 24, 0.69)'>Function</div>`))
        $message.append($(`<div class='cell cell3' style='background:rgba(137, 24, 24, 0.69)'>Message</div>`))
        rendered.append($message)
        $message = null
        for (let type in Keysbind.hotkeyConfig) {
            $message = $("<div class='row'></div>")
            $message.append($(`<div data-hotkeyId='${type}' class='cell1 hotkey'>${Keysbind.getHotkeyById(type)}</div>`))
            $message.append($(`<div class='cell cell2'>${Keysbind.hotkeyConfig[type].name}</div>`))
            $message.append($(`<div class='cell cell3'> / </div>`))
            rendered.append($message)
        }
        return fragment.append(rendered)
    }

    static saveHotkeys() {
        let codeSegments = $(".hotkey")
        Keysbind.hotkeyMapping = {}
        for (let i = 0; i < codeSegments.length; i++) {
            Keysbind.hotkeyMapping[$(codeSegments[i]).text()] = $(codeSegments[i]).attr("data-hotkeyid")
        }
        Settings._setStorage("hotkeyMapping", Keysbind.hotkeyMapping)
    
        localStorage.setItem("RightMouse", $("#rightMouse").val())
        localStorage.setItem("LeftMouse", $("#leftMouse").val())
    
        if (Keysbind.selectedHotkeyRow) {
            Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
        }

        $("#KeysPanelbg").hide()
    }
    
    static resetDefaultHotkey() {
        console.log("click reset")
        var e = Keysbind.hotkeyMapping
        Keysbind.defaultHotkeyMapping = {}
        for (const unlock in Keysbind.hotkeyConfig) {
            if (Keysbind.hotkeyConfig[unlock].defaultHotkey) {
                if ("" !== Keysbind.hotkeyConfig[unlock].defaultHotkey) {
                    Keysbind.defaultHotkeyMapping[Keysbind.hotkeyConfig[unlock].defaultHotkey] = unlock
                }
            }
        }
        Keysbind.hotkeyMapping = Keysbind.defaultHotkeyMapping
        refreshHotkeySettingPage()
        Keysbind.hotkeyMapping = e

        Keysbind.defaultHotkeyMapping = null
    
        if (Keysbind.selectedHotkeyRow) {
            Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
        }
    }
}

export default Keysbind