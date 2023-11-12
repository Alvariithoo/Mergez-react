import React from 'react'
import 'material-icons/iconfont/material-icons.css'

import { leaderboardClose } from '../../Core/Leaderboard'

function Leaderboard() {
    return (
        <>
            <div id="lbPanel-bg">
                <div id="lbPanel">
                    <div id="uiBody">
                        <div className="lbLoading">
                            <span>Loading...</span>
                            <div className="lbLoadingAnim" />
                        </div>
                        <div id="lbMain">
                            <div id="lbClose" onClick={leaderboardClose}>
                                <span className="material-icons">close</span>
                            </div>
                            <h1 id="lb-title">Leaderboard</h1>
                            <div id="lb-leadeboard">
                                <div className="lb-header">
                                    <span />
                                    <span>Rank</span>
                                    <span>Player</span>
                                    <span>Level</span>
                                </div>
                                <div className="lb-data" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard