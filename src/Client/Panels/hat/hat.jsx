import React from 'react'
import $ from 'jquery'
import logo from '../../../logo.svg'
import 'material-icons/iconfont/material-icons.css'

import { getLeaderboard } from '../../Core/Leaderboard'

function Hat() {

    const closeHats = () => {
        $('#hatsPanel-bg').hide()
    }

    const openLeaderboard = () =>{
        getLeaderboard()
    }

    return (
        <>
            <div id="hatsPanel-bg">
                <div id="hatsPanel">
                    <div id="uiBody">
                        <div id="hatsClose" onClick={closeHats}>
                            <span className="material-icons">close</span>
                        </div>
                        <div id="hatsTitle">Account info</div>
                        <hr
                            style={{
                                borderTop: "1px solid #fff",
                                borderBottom: "1px solid #fff"
                            }}
                        />
                        <div id="hat" style={{ height: 33 }}>
                            <div id="hats-container">
                                <h1>Hat code: </h1>
                                <input
                                    placeholder="Hat's code"
                                    defaultValue="No hat!"
                                    type="text"
                                />
                                <br />
                                <a
                                    className="App-link"
                                    style={{ textAlign: "center" }}
                                    href="/codes"
                                >
                                    Hats Codes
                                </a>
                            </div>
                            <div id="account-info">
                                <div id="profile-user">
                                    <img id="panel-avatar" alt="" src={logo} />
                                    <div id="username">Unnamed</div>
                                    <div className="account-badges-container">
                                        <div className="account-badge verified" title="Verified">
                                            <i className="fa-regular fa-badge-check" />
                                        </div>
                                        <div className="account-badge mod" title="Moderator">
                                            <i className="fa-regular fa-planet-ringed" />
                                        </div>
                                        <div className="account-badge developer" title="Admin">
                                            <i className="fa-solid fa-code" />
                                        </div>
                                        <div className="account-badge" title="Owner">
                                            <img src="./images/badges/owner_badge.png" alt="" />
                                        </div>
                                        <div className="account-badge" title="Youtuber">
                                            <img src="./images/badges/yt_badge.png" alt="" />
                                        </div>
                                        <div className="account-badge" title="Booster">
                                            <img src="./images/badges/booster_badge.png" alt="" />
                                        </div>
                                        <div className="account-badge" title="Supporter">
                                            <img src="./images/badges/donator_badge.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="resources-container">
                                    <span id="level">
                                        Level: <span>10 <i
                                            className="fa-regular fa-circle-star"
                                            style={{ color: "#1ff0df" }}
                                        />
                                        </span>
                                    </span>
                                    <span id="xp">
                                        XP: <span>0/5000 0%</span>
                                    </span>
                                    <span id="coins">
                                        Coins: <span>0 <i
                                            className="fa-regular fa-coins"
                                            style={{ color: "#f0bf1f" }}
                                        />
                                        </span>
                                    </span>
                                    <div className="xp-progressbar">
                                        <div className="xp-progress" id="xp-progress-bar" />
                                    </div>
                                    <span id="id">
                                        ID: <span>1234567890</span>
                                    </span>
                                    <span id="leaderboard-button" onClick={openLeaderboard}>
                                        Leaderboard:
                                        <i
                                            className="fa-solid fa-trophy-star"
                                            style={{ color: "#fdde26" }}
                                        />
                                    </span>
                                </div>
                                <div id="admin-settings">
                                    <div id="setting-container">
                                        <p id="textSetting">Verify</p>
                                        <input id="opt_verify" type="checkbox" />
                                        <label className="setting" htmlFor="opt_zoom" />
                                    </div>
                                    <div id="setting-container">
                                        <p id="textSetting">Admin Panel</p>
                                        <input
                                            id="opt_admin_panel"
                                            type="checkbox"
                                            defaultChecked=""
                                        />
                                        <label id="setting" htmlFor="opt_admin_panel" />
                                    </div>
                                    <div id="setting-container">
                                        <p id="textSetting">Admin Login</p>
                                        <input
                                            id="opt_admin"
                                            type="checkbox"
                                            defaultChecked=""
                                        />
                                        <label className="setting" htmlFor="opt_admin" />
                                    </div>
                                </div>
                            </div>
                            <button className="btn" onClick="window.location=`/'" id="login">
                                LOGIN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hat