import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
    const INITIAL_TIME = 36 * 60; // 36분을 초로 변환

    const calculateRemainingTime = () => {
        const now = new Date();
        const totalSecondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        
        // 36분 단위로 경과한 시간
        const elapsedCycles = Math.floor(totalSecondsSinceMidnight / (INITIAL_TIME));
        const elapsedTime = elapsedCycles * INITIAL_TIME; // 경과한 시간 (초)
        
        // 남은 시간 계산
        const remainingTime = INITIAL_TIME - (totalSecondsSinceMidnight - elapsedTime);
        
        return remainingTime >= 0 ? remainingTime : 0; // 남은 시간이 0보다 작으면 0으로 설정
    };

    const [time, setTime] = useState(calculateRemainingTime());

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTime(prevTime => {
                if(prevTime <= 0) {
                    return INITIAL_TIME;
                }
                return prevTime - 1;
            });
        }, 1000); // 1초마다 실행

        return () => clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    // 시간을 시:분 형식으로 변환
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `리셋까지 - ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div style={{ fontSize: '1.5rem', marginTop: '10px' }}>
            {formatTime(time)}
        </div>
    );
};

export default CountdownTimer;
