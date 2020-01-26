import React, { useState, useEffect, useCallback } from 'react';

function Timer(props: any) {
    const { time, onTimeout } = props;
    const minute = Math.floor(time /60);
    const sec = time % 60;
    const tenSec = (sec - sec % 10) / 10;
    const smallSec = sec - tenSec * 10;
    
    useEffect(() => {
        if (time === 0 && onTimeout) {
            onTimeout();
        }
    }, [time, onTimeout]);

    return (
        <div className='timer'>
            {minute}:{tenSec}{smallSec}
        </div>
    );
}

function useTimer(duration: number) {
    const [time, setTime] = useState(duration);
    const [running, setRunning] = useState(false);

    const restart = useCallback(() => {
        setTime(duration);
        setRunning(true);
    }, [duration]);

    const stop = useCallback(() => {
        setRunning(false);
    }, []);

    const start = useCallback(() => {
        setRunning(true);
    }, []);

    useEffect(() => {
        let timer;
        if (!time || !running) { return; }
        timer = setTimeout(() => {
            setTime((state) => state - 1);
        }, 1000);

        return () => {
            clearTimeout(timer)
        };
    }, [time, running]);

    return {
        restart,
        start,
        stop,
        time,
    };
}

export { Timer, useTimer };