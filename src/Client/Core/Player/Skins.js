import Settings from '../Settings/index.js'
import Utils from '../Utils/index.js'
import Cell from './Cell.js'

fetch('skinList.txt')
    .then(resp => resp.text())
    .then(data => {
        const skins = data.split(',').filter(Boolean)
        if (!skins.length) return

        Utils.byId('profile-pic').style.display = ''
        const stamp = Date.now()

        skins.forEach(skin => Cell.knownSkins.set(skin, stamp))
        for (const [key, value] of Cell.knownSkins.entries()) {
            if (value !== stamp) Cell.knownSkins.delete(key)
        }
    })
    .catch(err => console.error("Failed to fetch skin list:", err))

export function buildGallery() {
    const sortedSkins = Array.from(Cell.knownSkins.keys()).sort()
    const galleryHTML = sortedSkins.map(skin => `
        <li class="skin" onclick="${changeSkin('${skin')}')">
            <img class="circular" src="./skins/${skin}.png" alt="${skin}">
            <h4 class="skinName">${skin}</h4>
        </li>
    `).join('')

    Utils.byId('gallery-body').innerHTML = `<ul id="skinsUL">${galleryHTML}</ul>`
}

export function changeSkin(skin) {
    Utils.byId('skin_url').value = skin
    Settings.list.skin_url = skin
    Utils.byId('gallery').hide()
}

export function openSkinsLis() {
    if (!Utils.byId('gallery-body').innerHTML) buildGallery()
    Utils.byId('gallery').show(0.5)
}
