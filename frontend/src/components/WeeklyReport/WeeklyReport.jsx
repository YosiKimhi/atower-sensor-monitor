import React from 'react';
import styles from './WeeklyReport.module.css';

const WeeklyReport = ({ data }) => {
    if (!data?.length) {
        return (
            <div className={styles.container}>
                <p className={styles.noData}>No temperature data available</p>
            </div>
        );
    }

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Weekly Temperature Report</h2>
            <div className={styles.reportGrid}>
                {data.map((reading) => (
                    <div key={`${reading.timestamp}-${reading.face}`} className={styles.reading}>
                        <span className={styles.face}>{reading.face}</span>
                        <span className={styles.temperature}>
                            {reading.averageTemperature.toFixed(1)}°C
                        </span>
                        <span className={styles.timestamp}>
                            {formatDateTime(reading.timestamp)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyReport;
