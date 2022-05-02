import React, { useContext, useEffect, useState, useRef } from 'react';
import {apiContext, ApiContextProvider} from './apiData.js';
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";


export default function ThreeMinChart(props){

    const {chartData, apiStorage, chartOptions, colors, streamerKeys, cleanInitialData} = useContext(apiContext)
    let data = useRef(chartData['3T'])
    let chartRef = useRef(null)                         //ref tied to the lineChart dom object
    const [updater, setUpdater] = useState(false)
    let timeArr = useRef([])


    let chartDataRef = useRef({
        series:[],
        options: {
            chart: {
                type:'line',
                background: '#99b1bf', 
                animations: {
                    enabled:true,
                    animateGradually: {
                        enabled: false,
                    },
                }
            },
            stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'square',
                colors:undefined,
                width: 2,
            },
            markers:{
                size: 3,
                colors: undefined,
                strokeWidth: 0,
                hover: {
                    size: undefined,
                    sizeOffset: 5
                  }
            },
            legend: {
                show: true,
                fontSize: '10px',
                fontWeight: '500',
                onItemClick: {
                    toggleDataSeries: true
                },
                markers: {
                    radius: 4,
                }
            },
            grid: {
                borderColor: '#f1f1f1',
            },
            tooltip: {
                theme:'dark',
                onDatasetHover: {
                    highlightDataSeries: true,
                },
                display:'tooltip',
                x: {
                    show:false,
                },
                y: {
                    show:true,
                }
            },
            xaxis:{
              categories: timeArr.current
            },
            yaxis:{
                type:'numeric',
                tickAmount: 15,
            }
        },
    })

    
    useEffect(()=> {
        cleanInitialData(streamerKeys, data.current, chartDataRef.current.series, colors, timeArr.current)
        console.log(timeArr)
        console.log(chartDataRef.current.series)
        setUpdater(!updater)
    },[])

    // useEffect(()=>{
    //     console.log(chartRef)
    // })

    

    return (
        <>
        {updater && <Chart ref={chartRef} series={chartDataRef.current.series} options={chartDataRef.current.options}/>}
        </>
    )
}
