import $ from 'jquery'
import Utils from '../Utils'
import Network from '../Network'
import Settings from '.'
import { Chat } from '../Menu/Chat'

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
            const macroCooldown = 0
            if (feed !== undefined) Network.wsSend(feed)
            if (!Keysbind.macroIntervalID) Keysbind.macroIntervalID = setInterval(() => Network.wsSend(feed), macroCooldown)
        } else {
            clearInterval(Keysbind.macroIntervalID)
            Keysbind.macroIntervalID = null
        }
    }

    static processKey(event) {
        const IE_KEYS = {}
        let key = this.isValidHotKey(event.code) || event.key.toLowerCase()
        if (IE_KEYS[key]) key = IE_KEYS[key]
        return key
    }

    static getPressedKey(event) {
        let optsData = ""

        if (event.ctrlKey) optsData += "CTRL_"
        if (event.altKey) optsData += "ALT_"

        switch (event.keyCode) {
            case 9: optsData += "TAB"; break
            case 13: optsData += "ENTER"; break
            case 27: optsData += "ESC"; break
            case 32: optsData += "SPACE"; break
            default: optsData += String.fromCharCode(event.keyCode)
        }

        return optsData
    }

    static isValidHotKey(event) {
        return (
            (48 <= event.keyCode && event.keyCode <= 57) || // Numbers 0-9
            (65 <= event.keyCode && event.keyCode <= 90) || // Uppercase letters A-Z
            [9, 13, 27, 32].includes(event.keyCode) // Tab, Enter, ESC, SPACE
        )
    }

    static keydown(event) {
        if (!["input", "textarea"].includes(event.target.tagName.toLowerCase())) {
            let username = ""
            if (Keysbind.isValidHotKey(event) && (username = Keysbind.getPressedKey(event)) && event.keyCode === 18 && event.preventDefault() && Keysbind.selectedHotkeyRow) {
                if (event.keyCode === 46) {
                    event.preventDefault()
                    Keysbind.selectedHotkeyRow.find(".hotkey").val(username)
                } else if (username) {
                    event.preventDefault()
                    const codeSegments = $(".hotkey")
                    for (let i = 0; i < codeSegments.length; i++) {
                        if ($(codeSegments[i]).val() === username) return
                    }
                    Keysbind.selectedHotkeyRow.find(".hotkey").val(username)
                    Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
                    Keysbind.selectedHotkeyRow = null
                }
            }
            if (username && Keysbind.hotkeyMapping[username]) {
                event.preventDefault()
                const hotkeyConfig = Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[username]]
                if (hotkeyConfig?.keyDown) hotkeyConfig.keyDown()
            }
        }
        const key = Keysbind.processKey(event)
        if (Keysbind.pressed[key]) return
        if (Keysbind.pressed.hasOwnProperty(key)) Keysbind.pressed[key] = true
        if (key === 'enter') {
            Keysbind.getWagerPanel(event)
            if (Settings.ingame.escOverlayShown || !Settings.list.showChat) return
            if (Settings.ingame.isTyping) {
                Chat.chatBox.blur()
                if (Chat.chatBox.value.length > 0) Network.sendChat(Chat.chatBox.value)
                Chat.chatBox.value = ''
            } else {
                Chat.chatBox.focus()
            }
        }
    }

    static keyup(event) {
        if (Settings.overlayActive) return; // Ignore key events if the menu is active
        if (!["input", "textarea"].includes(event.target.tagName.toLowerCase()) || event.keyCode === 13) {
            let pressed = ""
            if (Keysbind.isValidHotKey(event)) pressed = Keysbind.getPressedKey(event)
            if (pressed) {
                event.preventDefault()
                const hotkeyConfig = Keysbind.hotkeyConfig[Keysbind.hotkeyMapping[pressed]]
                if (hotkeyConfig?.keyUp) hotkeyConfig.keyUp()
            }
        }
        const key = Keysbind.processKey(event)
        if (Keysbind.pressed.hasOwnProperty(key)) Keysbind.pressed[key] = false
    }

    static getWagerPanel(event) {
        if ($("#wagerPanel-bg").css("display") === "block" && Settings.list.wagerWs && Utils.showESCOverlay()) {
            if (event.target.id === "wagerChatInput") {
                Settings.list.wagerWs.sendData({ type: "message", message: $("#wagerChatInput").val() })
                $("#wagerChatInput").val("")
            } else if (event.target.id === "wagerCodeInput") {
                $("#wagerCodeButton").click()
                $("#wagerCodeInput").blur()
            } else {
                $("#wagerChatInput").focus()
            }
        }
    }

    static getHotkeyById(keepData) {
        for (const unlock in Keysbind.hotkeyMapping) {
            if (Keysbind.hotkeyMapping[unlock] === keepData) return unlock
        }
        return ""
    }

    static setupHotKey() {
        Keysbind.hotkeyConfig = {
            hk_menu: {
                defaultHotkey: "ESC",
                name: "Menu",
                keyDown: () => {
                    Settings.list.showChat ? $('#overlays').show() : $('#overlays').hide()
                },
                type: "NORMAL"
            },
            hk_feed: {
                defaultHotkey: "W",
                name: "Feed",
                keyDown: () => Keysbind.setFeed(true),
                keyUp: () => Keysbind.setFeed(false),
                type: "NORMAL"
            },
            hk_Split: {
                defaultHotkey: "SPACE",
                name: "Split",
                keyDown: () => Network.wsSend(Network.UINT8_CACHE[17]),
                type: "NORMAL"
            },
            hk_double_Split: {
                defaultHotkey: "Q",
                name: "Double Split",
                keyDown: () => Network.wsSend(Network.UINT8_CACHE[18]),
                type: "NORMAL"
            },
            hk_triple_Split: {
                defaultHotkey: "G",
                name: "Triple Split",
                keyDown: () => Network.wsSend(Network.UINT8_CACHE[19]),
                type: "NORMAL"
            },
            hk_quad_Split: {
                defaultHotkey: "T",
                name: "16 Split",
                keyDown: () => Network.wsSend(Network.UINT8_CACHE[20]),
                type: "NORMAL"
            },
            hk_skin: {
                defaultHotkey: "V",
                name: "Skins",
                keyDown: () => $("#showSkins").click(),
                type: "NORMAL"
            },
            hk_name: {
                defaultHotkey: "N",
                name: "Names",
                keyDown: () => $("#showNames").click(),
                type: "NORMAL"
            },
            hk_mass: {
                defaultHotkey: "M",
                name: "Mass",
                keyDown: () => $("#showMass").click(),
                type: "NORMAL"
            },
        }
    }

    static refreshHotkeySettingPage() {
        $(".hotkey").val(" ")
        for (let version in Keysbind.hotkeyMapping) {
            $("[data-hotkeyid=" + Keysbind.hotkeyMapping[version] + "]").val(version)
        }
    }

    static setUpHotKeyConfigPage() {
        const body = $('<div id="hotkeys_setting" class="modal fade" role="dialog"/>').append(Keysbind.getHotkeyDivHtml())
        $("#KeysContainerBinds").append(body)
        $("#hotkey_setting").insertAfter("#modal-content")
        $(document).on("hide.bs.modal", "#hotkeys_setting", () => {
            if (Keysbind.selectedHotkeyRow) Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
            Keysbind.selectedHotkeyRow = null
            Keysbind.refreshHotkeySettingPage()
        })
        $("#hotkey_table .row").not(".header").on("click", function () {
            if (Keysbind.selectedHotkeyRow) Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
            Keysbind.selectedHotkeyRow = $(this)
            Keysbind.selectedHotkeyRow.addClass("table-row-selected")
        })
    }

    static getHotkeyDivHtml() {
        const fragment = $("<div id='hotkey_setting'></div>")
        const rendered = $("<div id='hotkey_table'></div>")
        let $message = $("<div class='row'></div>")
        $message.append($(`<div class='cell cell1' style='background:rgba(137, 24, 24, 0.69)'>Hotkey</div>`))
        $message.append($(`<div class='cell cell2' style='background:rgba(137, 24, 24, 0.69)'>Function</div>`))
        rendered.append($message)
        $message = null
        for (let type in Keysbind.hotkeyConfig) {
            $message = $("<div class='row'></div>")
            const hotkeyInput = $(`<input type='text' data-hotkeyId='${type}' class='cell1 hotkey' readonly/>`)
            hotkeyInput.val(Keysbind.getHotkeyById(type))
            $message.append(hotkeyInput)
            $message.append($(`<div class='cell cell2'>${Keysbind.hotkeyConfig[type].name}</div>`))
            rendered.append($message)
            hotkeyInput.on('keydown', (event) => event.preventDefault())
            hotkeyInput.on('keyup', (event) => {
                if (Keysbind.isValidHotKey(event)) {
                    const pressedKey = Keysbind.getPressedKey(event)
                    hotkeyInput.val(pressedKey)
                    Keysbind.saveHotkeys()
                }
            })
        }
        return fragment.append(rendered)
    }

    static saveHotkeys() {
        const codeSegments = $(".hotkey")
        Keysbind.hotkeyMapping = {}
        for (let i = 0; i < codeSegments.length; i++) {
            const $codeSegment = $(codeSegments[i])
            const hotkeyValue = $codeSegment.val()
            Keysbind.hotkeyMapping[hotkeyValue] = $codeSegment.attr("data-hotkeyid")
        }
        Settings._setStorage("hotkeyMapping", Keysbind.hotkeyMapping)
        if (Keysbind.selectedHotkeyRow) Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
    }

    static resetDefaultHotkey() {
        const currentMapping = Keysbind.hotkeyMapping
        Keysbind.defaultHotkeyMapping = {}
        for (const unlock in Keysbind.hotkeyConfig) {
            const defaultHotkey = Keysbind.hotkeyConfig[unlock].defaultHotkey
            if (defaultHotkey) Keysbind.defaultHotkeyMapping[defaultHotkey] = unlock
        }

        $(".hotkey").each(function () {
            const hotkeyId = $(this).attr("data-hotkeyid")
            const defaultHotkey = Keysbind.hotkeyConfig[hotkeyId].defaultHotkey
            $(this).val(defaultHotkey)
        })

        Keysbind.saveHotkeys()
        Keysbind.hotkeyMapping = Keysbind.defaultHotkeyMapping
        Keysbind.refreshHotkeySettingPage()
        Keysbind.hotkeyMapping = currentMapping
        Keysbind.defaultHotkeyMapping = null

        if (Keysbind.selectedHotkeyRow) Keysbind.selectedHotkeyRow.removeClass("table-row-selected")
    }
}

export default Keysbind