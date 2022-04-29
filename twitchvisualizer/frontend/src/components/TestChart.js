import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState} from 'react';
import {Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from "react-chartjs-2";
ChartJS.register(...registerables);
var moment = require('moment');


export default function TestChart(){
    
    const [fetched, setFetched] = useState(false)
    const [chartData, setChartData] = useState(null)
    const apiStorage = useRef(null)
    let colors = useRef([])
    let chartRef = useRef(null)

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

    let threeMinChartData = {
        datasets: [],

    }
    

    const streamData = axios.create({
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
    
    const getDataFromServer  = async() => {
        const response = await streamData.get('api/api/');
        apiStorage.current = response.data['3T']
        console.log(apiStorage.current)
        setFetched(!fetched)
    }

    useEffect(() =>{
        const useEffectFetch = async() => (await getDataFromServer())
        useEffectFetch()
        console.log(fetched)
    },[])

    useEffect(() => {
        let currData = apiStorage.current
        console.log(currData)
        if (currData) {
            const unneededKeys = ['channel_id', 'channel_name', 'id',]
            const streamKeys = Object.keys(currData).slice(0,15)
            if (!colors.current.length){
                for (let a=0; a<streamKeys.length;a++){
                    colors.current.push(generateRandomColor())
                }
            }

            streamKeys.forEach((name, index) => {
                currData[name].forEach((obj) => {
                    delete obj[unneededKeys[0]]
                    delete obj[unneededKeys[1]]
                    delete obj[unneededKeys[2]]
                    obj['viewers_date'] = moment(obj['viewers_date']).format('lll')})
                threeMinChartData.datasets.push({
                    label: name,
                    data: currData[name],
                    backgroundColor: colors.current[index]
                })
            })
            console.log(threeMinChartData)
            setChartData(threeMinChartData)
        }
    }, [fetched])

    // function updateChart(){
    //     DEVELOP updateChart function!!

    //     chartRef.current.update()
    //     chartRef.current.update()
    // }

    return (
        <>
            <button className='text-black' onClick={updateChart}>ADD DATA</button>
           {chartData && <Line ref={chartRef} datasetIdKey='id' options={options} data={chartData}/>}
        </>
    )


}