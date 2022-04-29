import React from 'react';
import { useEffect, useState, useRef } from 'react';
import HomepageApp from './Home.js'
import TestChart from './TestChart.js';
import {Line} from 'react-chartjs-2'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reactDOM from 'react-dom/client';
import '../../static/css/index.css';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);



export default function App(props){
    const [ourData, setOurData] = useState(null)
    const [apiData, setApiData] = useState({data: null})



    async function handleClick(){
        setOurData('data set')
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
          }
        await sleep(3000)
        console.log('this came after the set data')
    }

    return (
        <>
            <h1>TESTING REACT CODEes WITH DJANGO</h1>
            <button onClick={handleClick}>TEST BUTTON</button>
            <p>{ourData}</p>
            <HomepageApp/>

            <div className='w-9/12 h-9/12'>
            <TestChart/>
            </div>
        </>
    )
}

let root = reactDOM.createRoot(document.getElementById('root'))
root.render(<App />)