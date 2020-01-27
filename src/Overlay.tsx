import './Overlay.scss';

import React, { useState } from 'react';

function Overlay() {
    const [open, setOpen] = useState(true);
    return (
        <div
            className='overlay'
            style={{
                display: open ? 'flex' : 'none',
            }}
        >
            <p>Game Over!</p>
            <button
                onClick={() => setOpen(false)}
            >
                close
            </button>
        </div>
    )
}

export {
    Overlay,
}