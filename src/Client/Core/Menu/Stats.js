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
        const string = []
        if (Stats.get.score > 0) {
            string.push(`Score: ${Stats.get.score.toLocaleString()}`)
        }
        if (Stats.get.fps > 0 && Settings.list.showFPS) {
            string.push(`FPS: ${~~Stats.get.fps}`)
        }
        if (string.length > 0) {
            $stats.show().html(string.join("&nbsp&nbsp&nbsp").trim())
        } else {
            $stats.hide()
        }
        setTimeout(Stats.drawStats, 500)
    }
}