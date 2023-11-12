import $ from 'jquery'

export class Chat {
    static chat = Object.create({
        messages: [],
        waitUntil: 0,
        canvas: document.createElement('canvas'),
        visible: false,
    })

    static drawChat(time, name, message, color) {
        if (color && color.r !== undefined && color.g !== undefined && color.b !== undefined)
        $("#chatroom").append(`
            <div id="player123">
                <span id="time">${time}\x20
                <span style="color: rgb(${color.r}, ${color.g}, ${color.b})" class='sender'>${name}</span>:\x20
                <span id="msg">${message}</span>
            </div>
        `)
        Chat.update()
    }

    static update() {
        if (parseInt($("#chatroom").css('height')) >= 150) {
            $("#chatroom").css('overflow-y', 'auto').animate({
                scrollTop: 100000 * 100000
            }, 2000)
        } else return $("#chatroom").css('overflow-y', 'none')
    }
}