import { useState, useEffect } from 'react';
import { apiEndpoints } from '../settings';

const useFlightSummary = () => {
    const [flightSummary, setFlightSummary] = useState({});

    const getFlightSummary = () => {
        fetch(apiEndpoints.flightsummary)
            .then(response => response.json())
            .then(data => setFlightSummary(data))
            .catch(e=>{
                console.log("Error fetching flight summary", e);
            })
    }

    useEffect(() => {
        getFlightSummary();
        const interval = setInterval(getFlightSummary, 15000)
        return () => clearInterval(interval)
    }, []);

    return flightSummary;
}

export { useFlightSummary }