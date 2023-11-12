import Settings from '../Settings/index.js'
import Functions from '../Game/Functions.js'
import Cell from '../Player/Cell.js'


fetch('skinList.txt')
    .then(resp => resp.text())
    .then(data => {
        const skins = data.split(',').filter(name => name.length > 0)
        if (skins.length === 0) return
        Functions.byId('profile-pic').style.display = ''
        const stamp = Date.now()
        for (const skin of skins) Cell.knownSkins.set(skin, stamp)
        for (const i of Cell.knownSkins.keys()) {
            if (Cell.knownSkins.get(i) !== stamp) Cell.knownSkins.delete(i)
        }
    })

export function buildGallery() {
    const sortedSkins = Array.from(Cell.knownSkins.keys()).sort()
    let c = ''
    for (const skin of sortedSkins) {
        c += `<li class="skin" onclick="${changeSkin('skin')}">`
        c += `<img class="circular" src="./skins/${skin}.png">`
        c += `<h4 class="skinName">${skin}</h4>`
        c += '</li>'
    }
    Functions.byId('gallery-body').innerHTML = `<ul id="skinsUL">${c}</ul>`
}


export function changeSkin(a) {
    Functions.byId('skin_url').value = a
    Settings.list.skin_url = a
    Functions.byId('gallery').hide()
}

export function openSkinsLis() {
    if (Functions.byId('gallery-body').innerHTML === '') buildGallery()
    Functions.byId('gallery').show(0.5)
}
