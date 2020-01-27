import './Board.scss';

import React, { useContext } from 'react';

import { Di } from './Di';
import { SocketContext } from './Socket';

function Board(props: any) {
    const {
        board,
    } = useContext(SocketContext);

    const dice = board.map((diProps, index) => {
        return (
            <Di
                key={index}
                {...diProps}
            />
        );
    });

    return (
        <div className={`board ${props.size}`}>
            {dice}
        </div>
    );
}

export { Board };