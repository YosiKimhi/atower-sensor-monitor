import React from 'react';
import styles from './MalfunctionList.module.css';
import MalfunctioningSensor from './MalfunctioningSensor/MalfunctioningSensor';

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
                    <MalfunctioningSensor 
                        key={sensor.id} 
                        sensor={sensor} 
                    />
                ))}
            </div>
        </div>
    );
};

export default MalfunctionList;
