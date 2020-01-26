import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';
import * as io from 'socket.io-client';
import { useTimer } from './Timer';
import { configurations } from './config';

function getRandIndex(length: number) {
    return Math.floor(Math.random() * Math.floor(length))
}

function getOrientation() {
    const start = [0, 90, 180, 270][getRandIndex(4)];
    const offset = getRandIndex(8) - 4;
    return start + offset;
}

function getLetter(letters: string[]) {
    return letters[getRandIndex(6)];
}

function shuffle(array: any[]): any[] {
    const copy = [...array];

    let currentIndex = copy.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = copy[currentIndex];
      copy[currentIndex] = copy[randomIndex];
      copy[randomIndex] = temporaryValue;
    }
  
    return copy;
}

function getLayout(config) {
    return shuffle(config).map((letters) => {
        const letter = getLetter(letters);
        const angle = getOrientation();
        return { 
            letter,
            angle,
        }
    });
}

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

export const SocketContext = React.createContext<SocketContextState>({
    joinRoom: (code: string) => {},
    createRoom: () => {},
    startGame: () => {},
    time: 0,
    board: [],
    roomCode: null,
});

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState<any>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [board, setBoard] = useState<Board>([]);

    const {
        time,
        restart,
    } = useTimer(180);

    useEffect(() => {
        const nextSocket = io.connect('http://localhost:8080');
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
        const nextBoard = getLayout(configurations['en']);
        if (roomCode) {
            socket.emit('start-game', roomCode, nextBoard);
        } else {
            setBoard(nextBoard);
            restart();
        }
    }, [socket, roomCode]);

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