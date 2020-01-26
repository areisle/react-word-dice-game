import React from 'react';

function Di(props: any) {
    const { angle, letter } = props;
    const style = {
        transform: `rotate(${angle}deg)`,
    }
    return (
        <div
            className={
                'board__di ' + (letter.length > 1 ? 'board__di--multi' : '')
            }
            style={style}
        >
            {letter}
        </div>
    );
}

export { Di };