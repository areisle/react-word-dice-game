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
    board: Board;
    createRoom: () => void;
    joinRoom: (code: string) => void;
    leaveRoom: () => void;
    roomCode: string | null;
    startGame: () => void;
    time: number;
}

const SocketContext = React.createContext<SocketContextState>({
    board: [],
    createRoom: () => {},
    joinRoom: (code: string) => {},
    leaveRoom: () => {},
    roomCode: null,
    startGame: () => {},
    time: 0,
});

function SocketProvider({ children }) {
    const [socket, setSocket] = useState<any>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [board, setBoard] = useState<Board>(getNewLayout());

    const {
        time,
        restart,
    } = useTimer(10);

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
        socket.emit('join-room', roomToJoin);
        setRoomCode(roomToJoin);
    }, [socket]);

    const createRoom = useCallback(() => {
        socket.emit('create-room', (nextRoomCode) => {
            setRoomCode(nextRoomCode);
        });
    }, [socket]);

    const leaveRoom = useCallback(() => {
        socket.emit('leave-room', roomCode);
        setRoomCode(null);
    }, [roomCode, socket]);

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
                board,
                createRoom,
                joinRoom,
                leaveRoom,
                roomCode,
                startGame,
                time,
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