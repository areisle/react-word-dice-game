import React, { useState } from 'react';
import { Board } from './Board';
import { SocketProvider } from './Socket';

function App() {

    const [theme, setTheme] = useState('light');

    const handleToggleTheme = () => {
        setTheme((state) => state === 'light' ? 'dark' : 'light')
    }

    return (
        <SocketProvider>
            <div className="App" data-theme={theme}>
                <Board />
                <button
                    onClick={handleToggleTheme}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}
                >
                    toggle theme
                </button>
            </div>
        </SocketProvider>
    );
}

export default App;
