import React from 'react'
import logo from '../../../logo.svg'
import 'material-icons/iconfont/material-icons.css'

function StatsHub() {
    return (
        <>
            <div id="overlays2">
                <div id="div_lb">
                    <div className="header">Mergez.eu</div>
                    <div id="lb_detail" />
                </div>
                <div id="div_score" />
                <div id="chatroom"></div>
                <div id="chatboxArea2">
                    <div id="emoji-menu" />
                    <div id="emoji-suggester" />
                    <div className="emoji-hover">
                        <img alt="" />
                    </div>
                    <input id="input_box2" type="text" maxLength={64} />
                </div>
                <div id="admin">
                    <div>
                        <img id="avatar_pic" src={logo} alt="" />
                        <span className="discord">Unnamed</span>
                        <span className="randomID">#0000</span>
                    </div>
                    <hr />
                    Player ID: <span className="playerId">... </span>
                    <hr />
                    Target
                    <br />
                    <ul className="adminHotkeys">
                        <li>
                            Name: <span className="targetName">... </span>
                        </li>
                        <li>
                            ID: <span className="targetId">... </span>
                        </li>
                        <li>
                            Type ID: 
                            <input
                                id="SelectPlayerID"
                                type="number"
                                placeholder="Type Player ID Here"
                                spellCheck="false"
                                maxLength={3}
                            />
                        </li>
                    </ul>
                    <hr />
                    Roles: 
                    <span className="status">
                        <span className="account-badge verified" title="Verified">
                            <i className="fa-regular fa-badge-check" />
                        </span>
                        <span className="account-badge mod" title="Moderator">
                            <i className="fa-regular fa-planet-ringed" />
                        </span>
                        <span className="account-badge developer" title="Admin">
                            <i className="fa-solid fa-code" />
                        </span>
                    </span>
                    <br />
                    <br />
                    Hotkeys:
                    <ul className="adminHotkeys">
                        <li>1 - Get everyone ID's</li>
                        <li>2 - Teleport player</li>
                        <li>3 - Set player mass 30k</li>
                        <li>4 - Spawn virus</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default StatsHub