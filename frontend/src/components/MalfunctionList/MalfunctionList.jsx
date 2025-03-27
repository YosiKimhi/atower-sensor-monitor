import React from 'react';
import styles from './MalfunctionList.module.css';

const MalfunctionList = ({ data }) => {
    if (!data?.length) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Malfunctioning Sensors</h2>
                <p className={styles.noData}>No malfunctioning sensors detected</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Malfunctioning Sensors</h2>
            <div className={styles.list}>
                {data.map((sensor) => (
                    <div key={sensor.id} className={styles.sensor}>
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
                ))}
            </div>
        </div>
    );
};

export default MalfunctionList;
