import './App.scss';

import React from 'react';

import { SocketProvider } from './Socket';
import { Game } from './Game';
import { Users } from './Users';

function App() {
    return (
        <SocketProvider>
            <div className="App">
                <Game />
                <Users />
            </div>
        </SocketProvider>
    );
}

export default App;
