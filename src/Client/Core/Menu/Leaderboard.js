import $ from 'jquery'

export class Leaderboard {
    static get = Object.create({
        type: null,
        items: [],
        canvas: document.createElement('canvas'),
        teams: ['#F33', '#3F3', '#33F']
    })

    static drawLeaderboard() {
        if (!Leaderboard.get.type) {
            Leaderboard.get.visible = false
            return
        }

        const $lbDetail = $("#lb_detail")
        $lbDetail.empty()

        Leaderboard.get.items.forEach((item, index) => {
            const color = item.me ? '#faa' : '#fff'
            $lbDetail.append(
                `<div style="color:${color}">${index + 1}. ${item.name}</div>`
            )
        })
    }
}