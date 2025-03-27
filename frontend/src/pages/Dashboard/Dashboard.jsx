import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Header from '../../components/Header/Header';
import WeeklyReport from '../../components/WeeklyReport/WeeklyReport';
import MalfunctionList from '../../components/MalfunctionList/MalfunctionList';
import api from '../../services/api';

const Dashboard = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [malfunctions, setMalfunctions] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async (isInitial = false) => {
            try {
                if (isInitial) setIsInitialLoading(true);
                
                const [weeklyResponse, malfunctionsResponse] = await Promise.all([
                    api.getWeeklyReport(),
                    api.getMalfunctioningSensors()
                ]);

                if (isMounted) {
                    console.log(weeklyResponse.data);
                    setWeeklyData(weeklyResponse.data || []);
                    setMalfunctions(malfunctionsResponse.sensors || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch sensor data');
                    console.error('Error fetching data:', err);
                }
            } finally {
                if (isMounted && isInitial) {
                    setIsInitialLoading(false);
                }
            }
        };

        fetchData(true);

        const interval = setInterval(() => fetchData(false), 60000);
        
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    if (isInitialLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.dashboard}>
            <Header />
            <main className={styles.main}>
                <div className={styles.grid}>
                    <section className={styles.weeklyReport}>
                        <WeeklyReport data={weeklyData} />
                    </section>
                    <section className={styles.malfunctions}>
                        <MalfunctionList data={malfunctions} />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
