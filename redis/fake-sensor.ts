
export interface SensorData { sensor_id: string, timestamp: number, temperature: number }

export default class FakeSensor {
    sensor_id: string;

    constructor() {
        this.sensor_id = Math.floor(Math.random()*16777215).toString(16)
    }

    getMeasurement(): SensorData {
        return {
            sensor_id: this.sensor_id,
            timestamp: (new Date()).getTime(),
            temperature: Math.round(((Math.random() * 10) + 15) * 10) / 10
        }
    }
}