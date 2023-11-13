import React from 'react'
import $ from 'jquery'
import 'material-icons/iconfont/material-icons.css'

import { CreateWagerRoom, closeWager, wagerCloseRoom, wagerJoinRoom } from '../../Core/Game/wager'


function Wager() {

    const joinWager = () => {
        wagerJoinRoom($('#wagerCodeInput').val())
    }

    return (
        <>
            <div id="wagerPanel-bg">
                <div id="wagerPanel">
                    <div id="uiBody">
                        <div id="wagerBody">
                            <div className="wagerLoading">
                                <span>Connecting...</span>
                                <div className="wagerLoadingAnim" />
                            </div>
                            <div id="wagerMain">
                                <div id="wagerContainer">
                                    <div className="wagerRooms">
                                        <h1 className="wagerRoomsTitle">
                                            Wager
                                            <p className="wagerRoomsSubtitle">
                                                <span className="wagerPlayerCount" /> online
                                            </p>
                                        </h1>
                                        <div className="wagerRoomsList">
                                            <div className="wagerRoomsTable">
                                                <div className="wagerRoomsTableHeader">
                                                    <div className="wagerRoomsTableCell">ID</div>
                                                    <div className="wagerRoomsTableCell">Username</div>
                                                    <div className="wagerRoomsTableCell">Join</div>
                                                </div>
                                                <div className="wagerRoomsTableBody" />
                                            </div>
                                        </div>
                                        <button className="btn" id="wagerCreateRoom" onClick={CreateWagerRoom}>
                                            Create Room
                                        </button>
                                    </div>
                                    <div className="wagerChat">
                                        <div className="wagerCode">
                                            <input
                                                type="text"
                                                id="wagerCodeInput"
                                                placeholder="Room Code..." />
                                            <button id="wagerCodeButton" onClick={joinWager}>🔑</button>
                                            <div id="wagerClose" onClick={closeWager}>
                                                <span className="material-icons">close</span>
                                            </div>
                                        </div>
                                        <div id="wagerChatMessages" />
                                        <input
                                            type="text"
                                            id="wagerChatInput"
                                            placeholder="Press Enter to type..."
                                            maxLength={64} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="wagerRoom-bg">
                <div id="wagerRoom">
                    <div id="uiBody">
                        <div id="wagerRoomClose" onClick={wagerCloseRoom}>
                            <span className="material-icons">close</span>
                        </div>
                        <div id="wagerRoomBody">
                            <div>
                                <h1>Waiting for an opponent...</h1>
                                <p>
                                    Code: <span className="wagerRoomCode">-</span>
                                </p>
                            </div>
                            <div className="wagerLoadingAnim" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wager