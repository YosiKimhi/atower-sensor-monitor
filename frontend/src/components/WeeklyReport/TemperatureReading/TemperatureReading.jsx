import React from 'react';
import styles from './TemperatureReading.module.css';

const TemperatureReading = ({ face, temperature, isRecent }) => {
    return (
        <div className={`${styles.reading} ${isRecent ? styles.recent : ''}`}>
            <span className={styles.face}>{face}</span>
            <span className={styles.temperature}>
                {temperature.toFixed(1)}°C
            </span>
        </div>
    );
};

export default TemperatureReading;