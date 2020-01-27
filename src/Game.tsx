import './Game.scss';

import React, { useContext, useState } from 'react';

import { Board } from './Board';
import { Controls } from './Controls';
import { Overlay } from './Overlay';
import { SocketContext } from './Socket';

function Game() {
    const { time } = useContext(SocketContext);
    
    const [theme, setTheme] = useState('light');

    const handleToggleTheme = () => {
        setTheme((state) => state === 'light' ? 'dark' : 'light')
    }
    
    return (
        <div className='game'  data-theme={theme}>
            <Board />
            <Controls />
            <button
                className='button--fixed'
                onClick={handleToggleTheme}
            >
                toggle theme
            </button>
            {!time && (
                <Overlay/>
            )}
        </div>
    );
}

export {
    Game,
};
