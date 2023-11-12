import $ from 'jquery'
import Logger from '../Network/Logger'
import Settings from '../Settings'
import Functions from '../Game/Functions'
import Network from '../Network'

export const wager = () => {
    $('#wagerPanel-bg').show()
    $('#wagerMain').hide()
    $('.wagerLoading').show()
    Settings.list.wagerWs = new Network('ws://localhost:9000')

    Settings.list.wagerWs.onopen = () => {
        $('.wagerLoading').hide()
        $('#wagerMain').show()
        Network.wsCleanup()
        Settings.list.wagerWs.sendData({ type: 'nickname', nickname: $('#username').text() || "Guest" })
    }

    Settings.list.wagerWs.onclose = () => {
        Settings.list.wagerWs = null
        Logger.info("Disconneted from Wager")
        $('#wagerPanel-bg').hide()
    }

    Settings.list.wagerWs.onmessage = (message) => {
        const data = JSON.parse(message.data)
        switch (data.type) {
            case "message": {
                const chatItem = document.createElement('div')
                chatItem.className = 'wagerChatItem'
                chatItem.innerHTML = `
                    <span class="sender" style="color:${data.color}">${Functions.escapeHtml(data.sender)}:</span>
                    <span class="message">${Functions.escapeHtml(data.message)}</span>
                `
                $('#wagerChatMessages').append(chatItem)
                break
            }
            case "update": {
                $('.wagerRoomsTableBody').html('')

                data.roomList.forEach(room => {
                    const roomEl = $('<div class="wagerRoomsTableRow"></div>')
                    roomEl.append('<div class="wagerRoomsTableCell"> - </div>')
                    roomEl.append('<div class="wagerRoomsTableCell">' + room.owner + '</div>')

                    const joinButtonCell = $('<div class="wagerRoomsTableCell"></div>')
                    const joinButtonEl = $('<button class="wagerRoomJoinButton">join</button>')
                    joinButtonEl.on('click', () => {
                        wagerJoinRoom(room.code)
                    })
                    joinButtonCell.append(joinButtonEl)
                    roomEl.append(joinButtonCell)

                    $('.wagerRoomsTableBody').append(roomEl)
                })

                $('.wagerPlayerCount').text(data.playerCount)
                break
            }
            case "created_room": {
                wagerOpenRoom(data.code)
                break
            }
            case "start_room": {
                wagerStart(data.ip)
                break
            }
            case "endgame": {
                $('#wagerPanel-bg').show()
                $('.wagerMain').show()
                break
            }
            case "error": {
                break
            }
            default: {
                break
            }
        }
    }

    Settings.list.wagerWs.sendData = (data) => {
        Settings.list.wagerWs.send(JSON.stringify(data))
    }
}

export const closeWager = () => {
    $('#wagerChatMessages').html('')
    $('#wagerPanel-bg').hide()
    if (Settings.list.wagerWs) {
        Settings.list.wagerWs.onclose = null
        Settings.list.wagerWs.close()
    }
    Settings.list.wagerWs = null
}

export const CreateWagerRoom = () => {
    Network.wsCleanup()
    Settings.list.wagerWs.sendData({ type: 'create_room' })
}

export const wagerCloseRoom = () => {
    $('#wagerRoom-bg').hide()
    if (Settings.list.wagerWs) Settings.list.wagerWs.sendData({ type: 'close_room' })
}

export const wagerOpenRoom = (code) => {
    $('#wagerRoom-bg').show()
    $('.wagerRoomCode').text(code)
}

export const wagerJoinRoom = (code) => {
    Settings.list.wagerWs.sendData({
        type: "join_room",
        code: code
    })
}

export async function wagerStart(address) {
    $('#wagerCodeInput').val('')
    Network.wsInit(address)
    $('#wagerPanel-bg').hide()
    $('#wagerRoom-bg').hide()
}