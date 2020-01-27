import './Controls.scss';

import React, { useState, useContext } from 'react';

import { Timer } from './Timer';
import { SocketContext } from './Socket';

function Controls() {
    const [roomToJoin, setRoomToJoin] = useState('');

    const handleChange = ({ target: { value } }) => {
        setRoomToJoin(value);
    }

    const {
        createRoom,
        joinRoom,
        leaveRoom,
        roomCode: currentRoomCode,
        startGame,
        time,
    } = useContext(SocketContext);

    const shake = () => {
        startGame();
    }

    const handleJoinRoom = () => {
        joinRoom(roomToJoin);
        setRoomToJoin('');
    };

    return (
        <div className='controls'>
            <div>
                <Timer 
                    time={time} 
                />
                <button
                    onClick={shake}
                >
                    shuffle
                </button>
            </div>
            {currentRoomCode && (
                <div>
                    <p>
                        Room Code: {currentRoomCode}
                    </p>
                    <button
                        onClick={leaveRoom}
                    >
                        leave room
                    </button>
                </div>
            )}
            {!currentRoomCode && (
                <>
                    <div>
                        <button
                            onClick={createRoom}
                        >
                            create room
                        </button>
                    </div>
                    <div>
                        <label htmlFor="room-code-input">
                            enter room code:
                        </label>
                        <input
                            id='room-code-input'
                            type="text"
                            value={roomToJoin}
                            onChange={handleChange}
                        />
                        <button
                            onClick={handleJoinRoom}
                        >
                            join room
                        </button>
                    </div>
                </>
            )}
        </div>

    );
}

export { Controls };