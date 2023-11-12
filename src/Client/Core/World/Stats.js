import $ from 'jquery'
import Settings from '../Settings'

export class Stats {
    static stats = Object.create({
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
        if (Stats.stats.score > 0) {
            string.push(`Score: ${Stats.stats.score.toLocaleString()}`)
        }
        if (Stats.stats.fps > 0 && Settings.list.showFPS) {
            string.push(`FPS: ${~~Stats.stats.fps}`)
        }
        if (string.length > 0) {
            $stats.show().html(string.join("&nbsp&nbsp&nbsp").trim())
        } else {
            $stats.hide()
        }
        setTimeout(Stats.drawStats, 500)
    }
}