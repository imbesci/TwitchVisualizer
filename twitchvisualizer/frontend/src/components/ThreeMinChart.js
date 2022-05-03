import React, { useContext, useEffect, useState, useRef } from 'react';
import {apiContext, ApiContextProvider} from './apiData.js';
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";


export default function ThreeMinChart(props){

    const {chartData, apiStorage, chartOptions, colors, streamerKeys, cleanInitialData, updateData} = useContext(apiContext)
    let data = useRef([])
    let chartRef = useRef(null)                         //ref tied to the lineChart dom object
    const [updater, setUpdater] = useState(false)
    let timeArr = useRef([])


    let chartDataRef = useRef({
        series:[],
        options: {
            chart: {
                type:'line',
                id: '3min',
                background: '#212121', 
                animations: {
                    enabled:true,
                    easing: 'linear',
                    dynamicAnimation: {
                    speed: 300,
                    },
                    animateGradually: {
                        enabled: false,
                    },
                },
                zoom: {
                    enabled:true,
                    autoScaleYaxis:true, 
                    type: 'xy'
                }
            },
            title: {
                text: '3-Minute Twitch Viewership',
                align: 'center',
                style: {
                    fontSize: '30px',
                    fontWeight:'bold',
                    color: '#92abd1'
                }
            },
            stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'square',
                colors:undefined,
                width: 3,
            },
            markers:{
                size: 0,
                colors: undefined,
                strokeWidth: 0,
                hover: {
                    size: undefined,
                    sizeOffset: 5
                  }
            },
            legend: {
                show: true,
                fontSize: '11px',
                fontWeight: '500',
                onItemClick: {
                    toggleDataSeries: true
                },
                markers: {
                    radius: 4,
                },
                labels: {
                    colors: '#ffffff'
                }
            },
            grid: {
                borderColor: '#333538',
            },
            tooltip: {
                theme:'dark',
                onDatasetHover: {
                    highlightDataSeries: true,
                },
                display:'tooltip',
                x: {
                    show:true,
                    format: 'MMM dd, yyyy HH:mm'
                },
                y: {
                    show:true,
                }
            },
            xaxis:{
              categories: timeArr.current,
              type: 'datetime',
            //   min: (Date.now()-259200),
            //   max: Date.now()+ 4000
            },
            yaxis:{
                type:'numeric',
                tickAmount: 15,
                axisTicks:{
                    show:false
                },
                labels: {
                    show:true,
                    style: {
                        colors: ['#ffffff'],
                        fontSize: '12px',
                    }
                }
            }
        },
    })

    
    useEffect(()=> {
        if (updateData){ //if we are updating the data
            let updateArr = [] 
            cleanInitialData(streamerKeys, updateData['3T'], updateArr, colors, timeArr.current)
            ApexCharts.exec('3min', 'updateOptions', {
                series: updateArr,
                options: {xaxis:{categories: timeArr.current}} //update times
            })

        } else { //initial config
            cleanInitialData(streamerKeys, chartData['3T'], chartDataRef.current.series, colors, timeArr.current)
            setUpdater(!updater)
        }
    },[updateData])

    return (
        <>
        {updater && <Chart ref={chartRef} series={chartDataRef.current.series} options={chartDataRef.current.options}/>}
        </>
    )
}
