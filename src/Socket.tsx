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
    const [roomCode, setRoomCode] = useState<string | null>((new URLSearchParams(window.location.search)).get('room'));
    const [board, setBoard] = useState<Board>(getNewLayout());
    
    const {
        time,
        restart,
    } = useTimer(180);

    const joinRoom = useCallback((roomToJoin: string | null) => {
        if (roomToJoin) {
            socket?.emit('join-room', roomToJoin);
        }
    }, [socket]);

    useEffect(() => {
        const nextSocket = io.connect(API);
        setSocket(nextSocket);

        const handleGameStarted = (nextBoard: Board) => {
            setBoard(nextBoard);
            restart();
        };

        nextSocket.on('start-game', handleGameStarted);
        
        return () => nextSocket.disconnect();
    }, [restart]);

    const createRoom = useCallback(() => {
        socket?.emit('create-room', (nextRoomCode: string) => {
            setRoomCode(nextRoomCode);
            const params = new URLSearchParams(window.location.search);
            params.append('room', nextRoomCode);
            window.location.search = params.toString();
        });
    }, [socket]);

    const leaveServerRoom = useCallback((roomToLeave: string | null) => {
        if (roomToLeave) {
            socket?.emit('leave-room', roomToLeave);
        }
    }, [socket]);

    const leaveRoom = useCallback(() => {
        setRoomCode(null);
        const params = new URLSearchParams(window.location.search);
        params.delete('room');
        window.location.search = params.toString();
    }, []);

    const startGame = useCallback(() => {
        const nextBoard = getNewLayout();
        if (roomCode) {
            socket?.emit('start-game', roomCode, nextBoard);
        } else {
            setBoard(nextBoard);
            restart();
        }
    }, [socket, roomCode, restart]);

    useEffect(() => {
        joinRoom(roomCode);
        return () => leaveServerRoom(roomCode);
    }, [joinRoom, leaveServerRoom, roomCode, socket]);

    return (
        <SocketContext.Provider
            value={{
                board,
                createRoom,
                joinRoom: setRoomCode,
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