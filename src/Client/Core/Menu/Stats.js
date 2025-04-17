import $ from 'jquery'
import Settings from '../Settings'

export class Stats {
    static get = Object.create({
        fps: 0,
        supports: null,
        info: null,
        pingLoopId: NaN,
        pingLoopStamp: null,
        canvas: document.createElement('canvas'),
        visible: false,
        score: NaN
    })

    static drawStats() {
        const $stats = $("#div_score")
        const statsData = []

        if (Stats.get.score > 0) {
            statsData.push(`Score: ${Stats.get.score.toLocaleString()}`)
        }
        if (Stats.get.fps > 0 && Settings.list.showFPS) {
            statsData.push(`FPS: ${Math.floor(Stats.get.fps)}`)
        }

        if (statsData.length > 0) {
            $stats.show().html(statsData.join("&nbsp;&nbsp;&nbsp;"))
        } else {
            $stats.hide()
        }

        setTimeout(() => Stats.drawStats(), 500)
    }
}