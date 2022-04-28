import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState} from 'react';
import {Chart as ChartJS, registerables } from 'chart.js';
import { Line} from 'react-chartjs-2';
import { Chart } from "react-chartjs-2";
ChartJS.register(...registerables);
var moment = require('moment');


export default function TestChart(){
    
    const [testState, setTestState] = useState(null)
    const options = {
        responsive: true,
        plugins: {
            title: {
                text: '3 Minute Chart',
                position: 'top', 
                display: true,
                padding: 50, 
                }
            },
        parsing: {
            yAxisKey: 'viewers',
            xAxisKey: 'viewers_date',
            }, 
    }

    const streamdata = axios.create({
        baseURL: 'http://localhost:8000/',
        timeout: '10000',
    })

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    useEffect(() =>{
        streamdata.get('api/api/')
        .then(res => {
            let threeMinute = res.data['3T']
            let threeMinKeys = Object.keys(threeMinute).slice(0,10)
            let chartData ={
                datasets: [],
                }
            
            threeMinKeys.forEach((streamer, i) => {
                threeMinute[streamer].forEach((data) => {data['viewers_date'] = moment(data['viewers_date']).format('MMMM Do YYYY, h:mm a')})
                const gameData = {
                    label: streamer,
                    data: threeMinute[streamer],
                    backgroundColor: [generateRandomColor(),],
                    }
                chartData.datasets.push(gameData)
                })
            console.log(chartData)
            setTestState(chartData)
        })
    },[])

    return (
        <>
           {testState && <Line datasetIdKey='id' options={options} data={testState}/>}
        </>
    )


}