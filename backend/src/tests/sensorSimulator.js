const axios = require('axios');

class SensorSimulator {
    constructor() {
        this.activeSensors = new Set();
        this.baseUrl = 'http://localhost:4000/api';
        this.faces = ['north', 'south', 'east', 'west'];
        this.malfunctioningSensors = new Set();
    }

    generateBaseTemperature(face) {
        // Base temperatures for each face
        const baseTemps = {
            north: 20,
            south: 25,
            east: 22,
            west: 23
        };
        // Add some random variation (±2°C)
        return baseTemps[face] + (Math.random() * 4 - 2);
    }

    generateMalfunctioningTemperature() {
        // Generate temperature that's 20-30% higher than normal
        return 30 + (Math.random() * 10);
    }

    async sendReading(sensorId, face) {
        try {
            let temperature = this.generateBaseTemperature(face);
            
            // If sensor is malfunctioning, override temperature
            if (this.malfunctioningSensors.has(sensorId)) {
                temperature = this.generateMalfunctioningTemperature();
            }

            const reading = {
                id: sensorId,
                face: face,
                temperature: temperature,
                timestamp: Math.floor(Date.now() / 1000)
            };
            
            await axios.post(`${this.baseUrl}/readings`, reading);
            console.log(`Sent reading for sensor ${sensorId}: ${temperature.toFixed(2)}°C (${face})`);
        } catch (error) {
            console.error(`Error sending reading for sensor ${sensorId}:`, error.message);
        }
    }

    addSensor() {
        const sensorId = Math.floor(Math.random() * 10000);
        const face = this.faces[Math.floor(Math.random() * this.faces.length)];
        this.activeSensors.add({ id: sensorId, face: face });
        console.log(`Added sensor ${sensorId} on ${face} face`);

        // 5% chance of sensor being malfunctioning
        if (Math.random() < 0.05) {
            this.malfunctioningSensors.add(sensorId);
            console.log(`Sensor ${sensorId} is malfunctioning`);
        }
    }

    removeSensor() {
        if (this.activeSensors.size > 0) {
            const sensorToRemove = Array.from(this.activeSensors)[Math.floor(Math.random() * this.activeSensors.size)];
            this.activeSensors.delete(sensorToRemove);
            this.malfunctioningSensors.delete(sensorToRemove.id);
            console.log(`Removed sensor ${sensorToRemove.id}`);
        }
    }

    async simulationTick() {
        // Randomly add or remove sensors (10% chance each)
        if (Math.random() < 0.1) this.addSensor();
        if (Math.random() < 0.1) this.removeSensor();

        // Send readings for all active sensors
        for (const sensor of this.activeSensors) {
            await this.sendReading(sensor.id, sensor.face);
        }
    }

    startSimulation() {
        // Add initial sensors
        for (let i = 0; i < 10; i++) {
            this.addSensor();
        }

        // Run simulation every second
        setInterval(() => this.simulationTick(), 1000);
        console.log('Simulation started...');
    }
}

// Start simulation
const simulator = new SensorSimulator();
simulator.startSimulation();
