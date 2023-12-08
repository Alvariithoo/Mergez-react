import React from 'react'
import $ from 'jquery'
import 'material-icons/iconfont/material-icons.css'

export function Left() {

    const showHats = () => {
        $('#hatsPanel-bg').show()
    }

    return (
        <>
            <div id="left-container" className="side-container left-side">
                <div className="UI-panel UI-side-panel UI-profiles">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <div className="bg-tab" id="userInfo">
                                <p>
                                    <span className="material-icons">account_circle</span> Guest
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className="profiles-panel">
                        <div id="profile-bg" className="UIProfiles" />
                        <div id="profile-bg2" className="UIProfiles" />
                        <div id="profile-bg3" className="UIProfiles" />
                        <div id="profile-bg4" className="UIProfiles" />
                        <div id="profile-bg5" className="UIProfiles" />
                    </div>
                    <button id="hats" className="btn" onClick={showHats}>Account</button>
                </div>
            </div>
        </>
    )
}