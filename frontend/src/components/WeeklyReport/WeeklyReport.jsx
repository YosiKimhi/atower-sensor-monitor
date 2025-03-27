import React from 'react';
import styles from './WeeklyReport.module.css';
import TemperatureReading from './TemperatureReading/TemperatureReading';

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

    // Group readings by hour
    const groupedByHour = data.reduce((acc, reading) => {
        const hour = Math.floor(reading.timestamp / 3600) * 3600;
        if (!acc[hour]) {
            acc[hour] = [];
        }
        acc[hour].push(reading);
        return acc;
    }, {});

    // Sort hours in descending order (newest first)
    const sortedHours = Object.keys(groupedByHour).sort((a, b) => b - a);
    const mostRecentHour = sortedHours[0];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Weekly Temperature Report</h2>
            {sortedHours.map(hour => (
                <div key={hour} className={styles.hourGroup}>
                    <h3 className={styles.hourHeader}>
                        {formatDateTime(parseInt(hour))}
                    </h3>
                    <div className={styles.reportGrid}>
                        {groupedByHour[hour].map((reading) => (
                            <TemperatureReading
                                key={`${reading.timestamp}-${reading.face}`}
                                face={reading.face}
                                temperature={reading.averageTemperature}
                                isRecent={hour === mostRecentHour}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeeklyReport;
