import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';
import * as io from 'socket.io-client';

import { useTimer } from './Timer';
import { getNewLayout } from './config';

const API = process.env.REACT_APP_API;

type Board = {
    letter: string;
    angle: number;
}[];

interface SocketContextState {
    joinRoom: (code: string) => void;
    createRoom: () => void;
    startGame: () => void;
    time: number;
    board: Board;
    roomCode: string | null;
}

const SocketContext = React.createContext<SocketContextState>({
    joinRoom: (code: string) => {},
    createRoom: () => {},
    startGame: () => {},
    time: 0,
    board: [],
    roomCode: null,
});

function SocketProvider({ children }) {
    const [socket, setSocket] = useState<any>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [board, setBoard] = useState<Board>(getNewLayout());

    const {
        time,
        restart,
    } = useTimer(180);

    useEffect(() => {
        const nextSocket = io.connect(API);
        setSocket(nextSocket);

        const handleGameStarted = (nextBoard) => {
            setBoard(nextBoard);
            restart();
        };

        nextSocket.on('start-game', handleGameStarted);

        return () => nextSocket.disconnect();
    }, [restart]);

    const joinRoom = useCallback((roomToJoin) => {
        socket.emit('join-group', roomToJoin);
        setRoomCode(roomToJoin);
    }, [socket]);

    const createRoom = useCallback(() => {
        socket.emit('create-group', (nextRoomCode) => {
            setRoomCode(nextRoomCode);
        });
    }, [socket]);

    const startGame = useCallback(() => {
        const nextBoard = getNewLayout();
        if (roomCode) {
            socket.emit('start-game', roomCode, nextBoard);
        } else {
            setBoard(nextBoard);
            restart();
        }
    }, [socket, roomCode, restart]);

    return (
        <SocketContext.Provider
            value={{
                joinRoom,
                createRoom,
                startGame,
                time,
                board,
                roomCode,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export {
    SocketContext,
    SocketProvider,
}