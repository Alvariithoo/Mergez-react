import React from 'react'
import $ from 'jquery'

import 'material-icons/iconfont/material-icons.css'

import Settings from '../../Core/Settings'

import Writer from '../../Core/Network/Writer'
import Network from '../../Core/Network'

import Functions from '../../Core/Game/Functions'
import noSkin from '../../../img/noskin.png'

function MainPanel() {

    function defaultSkin(event) {
        event.target.src = noSkin
    }

    function sendPlay(rawName) {
        const writer = new Writer(true)
        writer.setUint8(0x00)
        writer.setStringUTF8(JSON.stringify(rawName))
        Network.wsSend(writer)
    }

    function play() {
        let rawName = {
            name: Settings.list.nick,
            skin: Settings.list.skin_url
        }
        sendPlay(rawName)
        Functions.hideESCOverlay()

    }
    
    function setSpectate() {
        Network.wsSend(Network.UINT8_CACHE[1])
        Functions.hideESCOverlay()
    }

    const ShowKeySettings = () => {
        $('#KeysPanelbg').show()
    }

    const addTab = (event) => {
        $(".tab").removeClass("active")
        $("#" + event.currentTarget.getAttribute('href')).addClass("active")
    }

    return (
        <>
            <div id="mainPanel">
                <center className="nav-center">
                    <div href="home" className="icon-container" onClick={addTab}>
                        <span className="material-icons">home</span>
                    </div>
                    <div href="settings" className="icon-container" onClick={addTab}>
                        <span className="material-icons">settings</span>
                    </div>
                    <div href="sliders" className="icon-container" onClick={addTab}>
                        <span className="material-icons">linear_scale</span>
                    </div>
                    <div id="KeySettings" className="icon-botton" onClick={ShowKeySettings}>
                        <span className="material-icons">keyboard</span>
                    </div>
                </center>
                <div className="tab active" href="home" id="home">
                    <div id="profile-main">
                        <div id="profile-pic" className="picker-container clearfix">
                            <div className="nav2 arrow-left" />
                            <div id="preview-img-area">
                                <img id="preview-img" onError={defaultSkin} alt="" />
                            </div>
                            <div className="nav2 arrow-right" />
                        </div>
                    </div>
                    <div id="profile-container">
                        <div id="teamNameContainer" className="input-group">
                            <input
                                type="text"
                                id="team_name"
                                className="form-control"
                                placeholder="Team"
                                spellCheck="false"
                                maxLength={10}
                            />
                        </div>
                        <div id="nickContainer">
                            <input
                                id="nick"
                                type="text"
                                className="form-control"
                                placeholder="Nickname"
                                spellCheck="false"
                                maxLength={15}
                            />
                        </div>
                        <input
                            type="text"
                            id="skin_url"
                            className="form-control"
                            spellCheck="false"
                            placeholder="Skin URL ( Imgur Link )"
                        />
                    </div>
                    <button id="play" onClick={() => play()} className="btn btn-play">
                        <span id="icon" className="material-icons">play_arrow</span>
                    </button>
                    <button id="spectate" onClick={setSpectate} className="btn btn-spectate">
                        <span id="icon" className="material-icons">visibility</span>
                    </button>
                </div>
                <div className="tab" href="settings" id="settings">
                    <div id="radio-container"></div>
                    <div className="container">
                        <div id="Options" className="settingsRow">
                            <div className="col-xs-6 firstSettings" />
                            <div className="col-xs-6 secondSettings" />
                        </div>
                    </div>
                </div>
                <div className="tab" href="sliders" id="sliders">
                    <hr id="server-hr" />
                    <div className="toggles">
                        <div>
                            <p className="picker-text">Cell Text Position</p>
                            <select className="select-theming" onChange="">
                                <option disabled="">Cell Text Position</option>
                                <option>Top</option>
                                <option defaultValue="selected">Middle</option>
                                <option>Bottom</option>
                            </select>
                        </div>
                        <hr id="server-hr" />
                        <div className="range-container">
                            <div id="AnimationDelay" />
                            <div id="HatsCell" />
                        </div>
                    </div>
                </div>
                <div className="tab" href="keybinds" id="keybinds">yes yes yes yess!</div>
            </div>
        </>
    )
}

export default MainPanel