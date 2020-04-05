import './Board.scss';

import React, { useContext } from 'react';
import ResizeObserver from 'react-resize-observer';

import { Di } from './Di';
import { SocketContext } from './Socket';

function Board(props: any) {
    const {
        board,
        updateBoardPosition,
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
            <ResizeObserver
                onReflow={(rect) => {
                    updateBoardPosition({
                        top: rect.top,
                        left: rect.left,
                        size: rect.width,
                    })
                }}
            />
        </div>
    );
}

export { Board };