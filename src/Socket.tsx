import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';
import * as io from 'socket.io-client';

import { useTimer } from './Timer';
import { getNewLayout } from './config';
import { v1 as uuid } from 'uuid';

const API = process.env.REACT_APP_API;

type Board = {
    letter: string;
    angle: number;
}[];

interface BoardPosition {
    top: number;
    left: number;
    // width / height of board
    size: number;
}

interface SocketContextState {
    board: Board;
    createRoom: () => void;
    joinRoom: (code: string) => void;
    leaveRoom: () => void;
    roomCode: string | null;
    startGame: () => void;
    updateBoardPosition: (params: BoardPosition) => void;
    time: number;
    userCode: string | null;
    userPositions: Record<string, [number, number]>;
    boardPosition: BoardPosition;
    usernames: Record<string, string | null>;
}

const SocketContext = React.createContext<SocketContextState>({
    board: [],
    createRoom: () => {},
    joinRoom: (code: string) => {},
    leaveRoom: () => {},
    roomCode: null,
    startGame: () => {},
    updateBoardPosition: () => {},
    time: 0,
    userCode: null,
    userPositions: {},
    boardPosition: {
        top: 0,
        left: 0,
        size: 1,
    },
    usernames: {},
});

const bound = (number: number) => Math.min(1 ,Math.max(0, number));

const getUsername = () => {
    let username = localStorage.getItem('username');
    if (!username) {
        username = window.prompt('what would you like your username to be?') || '';
        localStorage.setItem('username', username);
    }
    return username;
}

function SocketProvider({ children }) {
    const [socket, setSocket] = useState<any>(null);
    const [roomCode, setRoomCode] = useState<string | null>((new URLSearchParams(window.location.search)).get('room'));
    const [userCode] = useState<string | null>(localStorage.getItem('userCode') || `user-${uuid()}`);
    const [username] = useState<string | null>(getUsername);
    const [board, setBoard] = useState<Board>(getNewLayout());
    const [boardPosition, setBoardPosition] = useState<BoardPosition>({
        top: 0,
        left: 0,
        size: 1,
    });

    const [usernames, setUsernames] = useState<SocketContextState['usernames']>({});

    const [
        userPositions, 
        setUserPositions,
    ] = useState<SocketContextState['userPositions']>({});

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
        
        nextSocket.on('users-changed', (users) => {
            setUsernames(users);
        });

        nextSocket.on('mouse-position-updated', (userCode, position) => {
            setUserPositions((state) => ({
                ...state,
                [userCode]: position
            }));
        });

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
        if (roomCode && userCode) {
            socket?.emit('set-user-code', userCode);
            localStorage.setItem('userCode', userCode);
            joinRoom(roomCode);
        }
        return () => leaveServerRoom(roomCode);
    }, [joinRoom, leaveServerRoom, roomCode, socket, userCode]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = bound((e.clientX - boardPosition.left) /boardPosition.size);
            const y = bound((e.clientY - boardPosition.top) /boardPosition.size);
            socket?.emit('update-mouse-position', roomCode, [x, y]);
        }
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [boardPosition, roomCode, socket]);

    useEffect(() => {
        if (userCode && username && roomCode) {
            socket?.emit('update-username', roomCode, username)
        }
    }, [roomCode, socket, userCode, username]);

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
                userCode,
                userPositions,
                updateBoardPosition: setBoardPosition,
                boardPosition,
                usernames,
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