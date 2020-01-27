import './Controls.scss';

import React, { useState, useCallback, useContext } from 'react';

import { Timer } from './Timer';
import { SocketContext } from './Socket';

function Controls() {
    const [roomToJoin, setRoomToJoin] = useState('');

    const handleChange = ({ target: { value } }) => {
        setRoomToJoin(value);
    }

    const {
        joinRoom,
        createRoom,
        startGame,
        time,
        roomCode: currentRoomCode,
    } = useContext(SocketContext);

    const shake = () => {
        startGame();
    }

    const endGame = useCallback(() => {
        alert('GAME OVER');
    }, []);

    const handleJoinGroup = () => {
        joinRoom(roomToJoin);
        setRoomToJoin('');
    };

    return (
        <div className='controls'>
            <div>
                <Timer 
                    onTimeout={endGame} 
                    time={time} 
                />
                <button
                    onClick={shake}
                >
                    shuffle
                </button>
            </div>
            <div>
                {
                    currentRoomCode && (
                        <p>
                            Room Code: {currentRoomCode}
                        </p>
                    )
                }
                <button
                    onClick={createRoom}
                >
                    create group
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
                    onClick={handleJoinGroup}
                >
                    join group
                </button>
            </div>
        </div>

    );
}

export { Controls };