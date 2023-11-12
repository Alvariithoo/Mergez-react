import React from 'react'
import $ from 'jquery'
import 'material-icons/iconfont/material-icons.css'
import Keysbind from '../../Core/Settings/Hotkeys'

function Keybinds() {

    function toggleKeys() {
        $('#KeysPanelbg').hide()
    }

    function reseting() {
        console.log("button reset")
        Keysbind.resetDefaultHotkey()
    }

    function save() {
        Keysbind.saveHotkeys()
    }
    
    return (
        <>
            <div id="KeysPanelbg">
                <div id="KeysPanel">
                    <div id="uiBody">
                        <div id="KeysClose" onClick={toggleKeys}>
                            <span className="material-icons">close</span>
                        </div>
                        <div id="KeysTitle">Heybinds panel</div>
                        <hr />
                        <div id="KeysContainer" style={{ height: 33 }}>
                            <div id="KeysContainerBinds" />
                            <div id="KeysContainerBinds">
                                <div id="modal-content">
                                    <div id="hotkey_modal_body">
                                        <center><h1>Keysbinds Setup</h1></center>
                                        <hr id="server-hr" />
                                        <p id="ins-text">Step 1: Click on the function item</p>
                                        <p id="ins-text">Step 2: Press wanted hotkey to modify</p>
                                        <p id="ins-text">Press [DEL] key to remove selected hotkey</p>
                                        <br /><hr id="server-hr" /><br />
                                        <p id="ins-text">Allowed hotkey combinations:</p>
                                        <p id="ins-text">[CTRL] + [ALT] + 0-9, a-z, [TAB], [ENTER]</p>
                                        <br /><hr id="server-hr" /><br />
                                        <div id="mouse-reqs">
                                            <span>Left Mouse</span>
                                            <select id="leftMouse mouse-select">
                                                <option disabled="">Left Mouse</option>
                                                <option id="leftMouseDefault">None</option>
                                                <option value="Feed">Macro Feed</option>
                                                <option value="Split16">Quad Split</option>
                                                <option value="Split8">Triple Split</option>
                                                <option value="Split4">Double Split</option>
                                                <option value="Split">Split</option>
                                            </select>
                                        </div>
                                        <div id="mouse-reqs">
                                            <span>Right Mouse</span>
                                            <select id="rightMouse mouse-select">
                                                <option disabled="">Right Mouse</option>
                                                <option id="rightMouseDefault">None</option>
                                                <option value="Feed">Macro Feed</option>
                                                <option value="Split16">Quad Split</option>
                                                <option value="Split8">Triple Split</option>
                                                <option value="Split4">Double Split</option>
                                                <option value="Split">Split</option>
                                            </select>
                                        </div>
                                        <button id="reset" onClick={reseting}>Reset</button>
                                        <button id="save" onClick={save}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Keybinds