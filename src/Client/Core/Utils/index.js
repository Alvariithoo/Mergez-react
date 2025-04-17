import $ from 'jquery'
import Settings from '../Settings'

class Utils {
    static mainLoader() {
        $("#input_box2").attr("placeholder", "Enter chat message...")
        $("#profile-main").prependTo("#home")
        $("#preview-img").attr("src", $("#skin_url").val())
        $("#skin_url").on("change", function () {
            $("#preview-img").attr("src", this.value)
        })

        $(".btn-green").insertBefore(".btn-blue")
        $(".btn-red").insertAfter(".btn-green")
    }

    static hideESCOverlay() {
        Settings.ingame.escOverlayShown = false
        $('#overlays').hide()
    }

    static showESCOverlay() {
        Settings.ingame.escOverlayShown = true
        $('overlays').show()
        if (Settings.list.wagerWs) {
            $("#wagerPanel-bg").show()
            $("#wagerMain").show()
        }
    }

    static byId(id) {
        return document.getElementById(id)
    }

}

export default Utils