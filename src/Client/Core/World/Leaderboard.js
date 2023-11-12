import $ from 'jquery'

export class Leaderboard {
    static leaderboard = Object.create({
        type: null,
        items: null,
        canvas: document.createElement('canvas'),
        teams: ['#F33', '#3F3', '#33F']
    })
    
    static drawLeaderboard() {
        if (this.leaderboard.type === null) return this.leaderboard.visible = false
        const $lbDetail = $("#lb_detail")
        $lbDetail.html('')
        for (let i = 0, last = 1; i < this.leaderboard.items.length; i++, last++) {
            $lbDetail.append(
                `<div style="color:${this.leaderboard.items[i].me ? '#faa' : '#fff'}">${last}. ${this.leaderboard.items[i].name}</div>`
            )
        }
    }
}