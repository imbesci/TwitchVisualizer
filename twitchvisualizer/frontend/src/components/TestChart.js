import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState} from 'react';
import {Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from "react-chartjs-2";
var moment = require('moment');


export default function TestChart(){
    
    const [fetched, setFetched] = useState(false)          //initial fetch bool will trigger initial chart data load
    const [chartData, setChartData] = useState(null)      //initial state that generates page re-render after api fetch
    const apiStorage = useRef(null)                       //keeps track of all uptodate data
    let streamerKeys = useRef([])                        //keep track of all the streamers that has data available
    let colors = useRef({})                             // {streamerName:color,} to fetch colors on chart update
    let chartRef = useRef(null)                         //ref tied to the lineChart dom object
    let testRef = useRef(false)
    
    const streamData = axios.create({
        baseURL: 'http://localhost:8000/',
        timeout: '10000',
    })                               //axios base instance

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                text: '3 Minute Chart',
                position: 'top', 
                display: true,
                padding: 10, 
                },
            zoom: {
                limits:{
                    y: {min: -5000}
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    mode: 'y',
                },
                pan: {
                    enabled:true,
                    mode:'xy',
                },
            }
        },
        // parsing: {
        //     yAxisKey: 'viewers',
        //     xAxisKey: 'viewers_date',
        //     }, 
    }                               //chart options

    let threeMinChartData = {
        datasets: [],
    }                              //chart data is appended here
    

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    
    const getDataFromServer = async() => {
        const response = await streamData.get('api/api/');
        apiStorage.current = response.data['3T']
        console.log(apiStorage.current)
    }                                         //generic fetch api function 
    
    const initialFetch = async() => {
        await getDataFromServer()
        setFetched(!fetched)    
    }
    
    function organizeInitialData(currData){
        const keyMap = ['channel_id', 'channel_name', 'id', 'viewers', 'viewers_date']
        const streamKeys = Object.keys(currData).slice(0,30)
        if (!colors.current.length){
            for (let a=0; a<streamKeys.length;a++){
                colors.current[streamKeys[a]] = generateRandomColor()
            }
        }
        streamKeys.forEach((name, index) => {
            currData[name].forEach((obj) => {
                delete obj[keyMap[0]]; delete obj[keyMap[1]]; delete obj[keyMap[2]]; 
                obj['x'] = moment(obj['viewers_date']).format('lll');
                obj['y'] = obj['viewers'];
                delete obj[keyMap[3]]; delete obj[keyMap[4]];  //rename viewers and viewers_date to x and y respectively, delete excess data
            })
            threeMinChartData.datasets.push({
                label: name,
                data: currData[name],
                backgroundColor: colors.current[name]
            })
        })
    }
    
    function returnKeys(currentData){
        let allKeys = Object.keys(currentData);
        if (allKeys.length){
            allKeys.map((key) => {
                if (!streamerKeys.current.includes(key)){
                    streamerKeys.current.push(key)
                }
            })
            return true;
        }
        return false;
    }


    useEffect(() =>{ //Fetch on initial page load
        const awaitInitialFetch = () => ( initialFetch())
        awaitInitialFetch()
    },[])

    useEffect(() => {git 
        let currData = apiStorage.current
        if (apiStorage.current) {
            organizeInitialData(currData)
            setChartData(threeMinChartData)

        }
    }, [fetched])

    // useEffect(()=>{
    //     let refreshInterval = setInterval(() => {
    //         console.log('ran...')
    //         testRef.current = !testRef.current
    //     }, 1500);
    //     return () => clearInterval(refreshInterval)
    // }, [apiStorage.current])

    function updateChart(){
    //     DEVELOP updateChart function!!
        chartRef.current.update()
        chartRef.current.update()
    }

    return (
        <>
            <button className='text-black'>ADD DATA</button>
           {chartData && <Line ref={chartRef} datasetIdKey='id' options={chartOptions} data={chartData}/>}
        </>
    )


}