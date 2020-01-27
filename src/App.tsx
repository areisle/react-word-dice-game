import './App.scss';

import React from 'react';

import { SocketProvider } from './Socket';
import { Game } from './Game';

function App() {
    return (
        <SocketProvider>
            <div className="App">
                <Game />
            </div>
        </SocketProvider>
    );
}

export default App;
