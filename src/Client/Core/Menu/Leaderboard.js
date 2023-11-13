import $ from 'jquery'

export class Leaderboard {
    static get = Object.create({
        type: null,
        items: null,
        canvas: document.createElement('canvas'),
        teams: ['#F33', '#3F3', '#33F']
    })
    
    static drawLeaderboard() {
        if (Leaderboard.get.type === null) return Leaderboard.get.visible = false
        const $lbDetail = $("#lb_detail")
        $lbDetail.html('')
        for (let i = 0, last = 1; i < Leaderboard.get.items.length; i++, last++) {
            $lbDetail.append(
                `<div style="color:${Leaderboard.get.items[i].me ? '#faa' : '#fff'}">${last}. ${Leaderboard.get.items[i].name}</div>`
            )
        }
    }
}