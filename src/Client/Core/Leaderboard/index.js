import $ from 'jquery'
import Logger from '../Network/Logger'

export function getLeaderboard() {
    $('#lbPanel-bg').show()
    $('#lbMain').hide()
    $('.lbLoading').show()

    getLeaderBoardData('levels')
        .then(function (data) {
            Logger.info(data)
            $('.lb-data').html('')

            data.leaderboard.forEach((player, rank) => {
                const row = $('<div class="lb-row"></div>')

                row.append(`<div><img src="${player.avatar}" onError=this.src="./images/user.png"></div>`)
                row.append(`<div title="Rank: ${rank + 1}">${rank + 1}</div>`)
                row.append(`<div title="${player.username}">${player.username}</div>`)
                row.append(`<div title="Level: ${player.level}\nXP: ${player.xp}">${player.level} <i class="fa-regular fa-circle-star" style="color:#1ff0df"></div>`)
                
                $('#lbMain').show()
                $('.lbLoading').hide()
                $('.lb-data').append(row)
            })
        })
}

export async function getLeaderBoardData(type) {
    return new Promise((resolve, reject) => {
        $.getJSON("http://localhost/api/leaderboard/" + type, function (data) {
            resolve(data)
        }).fail(function (_, status, err) {
            leaderboardClose()
            Logger.error(status + ', ' + err)
            reject(err)
        })
    })
}

export const leaderboardClose = () => {
    $('#lbPanel-bg').hide()
}