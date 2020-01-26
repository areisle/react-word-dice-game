import React, { useState, useCallback, useContext } from 'react';
import { Di } from './Di';
import { Timer } from './Timer';
import './Board.css';
import { SocketContext } from './Socket';

function Board(props: any) {

    const [roomToJoin, setRoomToJoin] = useState('');

    const handleChange = ({ target: { value } }) => {
        setRoomToJoin(value);
    }

    const {
        joinRoom,
        createRoom,
        startGame,
        time,
        board,
        roomCode: currentRoomCode,
    } = useContext(SocketContext);

    const shake = () => {
        startGame();
    }

    const endGame = useCallback(() => {
        alert('GAME OVER');
    }, []);

    const dice = board.map((diProps, index) => {
        return (
            <Di
                key={index}
                {...diProps}
            />
        );
    });

    const handleJoinGroup = () => {
        joinRoom(roomToJoin);
        setRoomToJoin('');
    };

    return (
        <div className='game'>
            <div className={`game__board ${props.size}`}>
                {dice}
            </div>
            <div className='game__controls'>
                <Timer onTimeout={endGame} time={time} />
                <button
                    onClick={shake}
                    className='button'
                    style={{
                        fontSize: '4em',
                        padding: '5px 20px',
                    }}
                >
                    shuffle
                </button>
                <div>
                    <div className='game__room-code'>
                        <p>
                            Room Code: {currentRoomCode}
                        </p>
                    </div>
                    <button
                        className='button button--small'
                        onClick={createRoom}
                    >
                        create group
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        value={roomToJoin}
                        onChange={handleChange}
                    />
                    <button
                        className='button button--small'
                        onClick={handleJoinGroup}
                    >
                        join group
                    </button>
                </div>
            </div>

        </div>
    );
}

export { Board };