import React from 'react';
import styles from './MalfunctioningSensor.module.css';

const MalfunctioningSensor = ({ sensor }) => {
    return (
        <div className={styles.sensor}>
            <div className={styles.sensorHeader}>
                <span className={styles.sensorId}>Sensor ID: {sensor.id}</span>
                <span className={styles.face}>{sensor.face}</span>
            </div>
            <div className={styles.sensorData}>
                <div className={styles.dataItem}>
                    <span>Current Temperature:</span>
                    <span>{sensor.currentTemperature.toFixed(1)}°C</span>
                </div>
                <div className={styles.dataItem}>
                    <span>Average Temperature:</span>
                    <span>{sensor.averageTemperature.toFixed(1)}°C</span>
                </div>
                <div className={styles.deviation}>
                    Deviation: {sensor.deviationPercentage.toFixed(1)}%
                </div>
            </div>
        </div>
    );
};

export default MalfunctioningSensor;