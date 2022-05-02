import React from 'react';
import { useEffect, useState, useRef } from 'react';
import HomepageApp from './Home.js'
import ThreeMinChart from './ThreeMinChart.js';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reactDOM from 'react-dom/client';
import {apiContext, ApiContextProvider} from './apiData.js';
import '../../static/css/index.css';
// import {Line} from 'react-chartjs-2'
// import zoomPlugin from 'chartjs-plugin-zoom';
// import { Chart, registerables } from 'chart.js';
// Chart.register(zoomPlugin,...registerables);




export default function App(props){
    const [ourData, setOurData] = useState(null)
    const [apiData, setApiData] = useState({data: null})



    return (
        <>
            <h1>TESTING REACT CODEes WITH DJANGO</h1>
            <HomepageApp/>
            <p>{ourData}</p>
            <div className='w-6/12 h-4/12'>
            <ApiContextProvider >
                <ThreeMinChart />
            </ApiContextProvider>
            </div>
        </>
    )
}

let root = reactDOM.createRoot(document.getElementById('root'))
root.render(<App />)