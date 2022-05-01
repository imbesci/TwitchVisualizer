import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState} from 'react';
import {Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from "react-chartjs-2";
const { List, Map, OrderedMap } =  require('immutable')
var moment = require('moment');


export default function TestChart(){
    
    const [fetched, setFetched] = useState(false)          //initial fetch bool will trigger initial chart data load
    const [chartData, setChartData] = useState(null)      //initial state that generates page re-render after api fetch
    const apiStorage = useRef(null)                       //keeps track of all uptodate data
    let streamerKeys = useRef([])                        //keep track of all the streamers that has data available
    let colors = useRef({})                             // {streamerName:color,} to fetch colors on chart update
    let chartRef = useRef(null)                         //ref tied to the lineChart dom object
    

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

    const getDataFromServer = async() => {  //generic fetch api function 
        const response = await streamData.get('api/api/');
        apiStorage.current = response.data['3T']
        console.log(apiStorage.current)
    }                 

    function generateRandomColor() {  //random hexadecimal color gen
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function filterKeys(currentData){  //grab keys from fetched api object
        let allKeys = Object.keys(currentData).slice(0,15);
        let newKeyCount = 0
        if (allKeys.length){
            allKeys.map((key) => {
                if (!streamerKeys.current.includes(key)){
                    streamerKeys.current.push(key);
                    newKeyCount++;
                }
            })
            return newKeyCount.length;
        }
        return false;
    }
   
    const setColorMap = (numKeysToSet) => { //update colors.current dict with color mapping
        if (!colors.current.length){
            streamerKeys.current.forEach((key) => {
                colors.current[key] = generateRandomColor()
            })
        } else {
            len = (streamerKeys.current.length) - numKeysToSet
            streamerKeys.current.slice(len).forEach((key) => { 
                colors.current[key] = generateRandomColor()
            })
        }
    }

    const cleanDataObj = (dataObj) => { //rename viewers and viewers_date to x and y respectively, delete excess data
        const keyMap = ['channel_id', 'channel_name', 'id', 'viewers', 'viewers_date']
        delete dataObj[keyMap[0]]; delete dataObj[keyMap[1]]; delete dataObj[keyMap[2]];
        dataObj['x'] = moment(dataObj['viewers_date']).format('lll'); 
        dataObj['y'] = dataObj['viewers'];
        delete dataObj[keyMap[3]]; delete dataObj[keyMap[4]];
    }

    const setCleanedInitialData = (streamersArray) => {
        streamersArray.forEach((streamer)=> {
            apiStorage.current[streamer].forEach(obj => cleanDataObj(obj))
            threeMinChartData.datasets.push({
                label: streamer,
                data: apiStorage.current[streamer],
                backgroundColor: colors.current[streamer]
                })
            })
    }

    function organizeInitialData(currData){
        const keyMap = ['channel_id', 'channel_name', 'id', 'viewers', 'viewers_date']
        const numNewStreamers = filterKeys(currData)
        setColorMap(numNewStreamers)
        setCleanedInitialData(streamerKeys.current)
    }
    

    useEffect(() =>{ //Fetch on initial page load
        const awaitData = () => ( getDataFromServer())
        awaitData().then((res) => {
            let currData = apiStorage.current;
            if (apiStorage.current) {
                organizeInitialData(currData)
                setChartData(threeMinChartData)
                }
            })
    },[])


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