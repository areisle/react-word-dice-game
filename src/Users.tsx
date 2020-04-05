import './Users.scss';

import React, { useContext, useCallback } from 'react';

import { SocketContext } from './Socket';

interface UserPointerProps {
    x: number;
    y: number;
    username: string;
}

function UserPointer(props: UserPointerProps) {
    const {
        username,
        x,
        y,
    } = props;

    return (
        <div
            style={{
                left: x,
                top: y,
            }}
            className='users-container__pointer'
        >
            {username}
        </div>
    )
}


function Users() {
    const {
        userPositions,
        boardPosition,
        usernames,
    } = useContext(SocketContext);

    const translateX = useCallback((x) => {
        return (boardPosition.size * x) + boardPosition.left;
    }, [boardPosition]);

    const translateY = useCallback((y) => {
        return (boardPosition.size * y) + boardPosition.top;
    }, [boardPosition]);

    const users = Object.entries(usernames).map(([userId, username], index) => {
        const [x, y] = userPositions[userId] || [0, 0]
        return (
            <UserPointer
                x={translateX(x)}
                y={translateY(y)}
                username={username || `user ${index + 1}`}
                key={userId}
            />
        )
    })

    return (
        <div 
            className='users-container'
        >
            {users}
        </div>
    )
}

export {
    Users,
}