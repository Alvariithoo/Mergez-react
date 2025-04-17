import $ from 'jquery'
import Settings from '../Settings'
import Utils from '../Utils'

export class Chat {
    static get = Object.create({
        messages: [],
        waitUntil: 0,
        canvas: document.createElement('canvas'),
        visible: false,
    })

    static chatBox = null
    static chatArea = null
    static chatRoom = null
    
    static init() {
        Chat.chatRoom = Utils.byId('chatroom')
        Chat.chatArea = Utils.byId('chatboxArea2')
        Chat.chatBox = Utils.byId('input_box2')

        Chat.chatBox.onblur = () => {
            Settings.ingame.isTyping = false
            Chat.drawChat()
        }
        Chat.chatBox.onfocus = () => {
            Settings.ingame.isTyping = true
            Chat.drawChat()
        }
    }

    static drawChat(time, name, message, color) {
        if (color?.r !== undefined && color?.g !== undefined && color?.b !== undefined) {
            $("#chatroom").append(`
                <div class="chat-message">
                    <span class="time">${time}&nbsp;</span>
                    <span class="sender" style="color: rgb(${color.r}, ${color.g}, ${color.b})">${name}</span>:&nbsp;
                    <span class="message">${message}</span>
                </div>
            `)
        }
        Chat.update()
    }

    static update() {
        const $chatroom = $("#chatroom")
        if ($chatroom.height() >= 150) {
            $chatroom.css('overflow-y', 'auto').animate({ scrollTop: $chatroom.prop("scrollHeight") }, 2000)
        } else {
            $chatroom.css('overflow-y', 'hidden')
        }
    }
}