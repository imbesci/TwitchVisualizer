import React, { useContext, useEffect, useState, useRef } from 'react';
import {apiContext, ApiContextProvider} from './apiData.js';
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";


export default function ThreeMinChart(props){

    const {chartData, globalTimeArray, colors, streamerKeys, cleanInitialData, updateData} = useContext(apiContext)                       
    const [updater, setUpdater] = useState(false)
    let timeArr = useRef(globalTimeArray['3T'])
    let plottedStreamers = useRef([])


    let chartDataRef = useRef({
        series:[],
        options: {
            chart: {
                type:'line',
                id: '3min',
                background: '#212121', 
                animations: {
                    enabled: false,
                    easing: 'linear',
                    dynamicAnimation: {
                    speed: 1000,
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
                    fontSize: '40px',
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
            let currentData  = JSON.parse(JSON.stringify(chartDataRef.current.series)) //deepcopy
            plottedStreamers.current = JSON.parse(JSON.stringify(streamerKeys))
            ApexCharts.exec('3min', 'updateOptions', {
                series: updateArr,
                options: {xaxis:{categories: timeArr.current}} //update times
            })

        } else { //initial config
            let seriesArr = []
            streamerKeys.forEach((name)=> {
                let cleanedChartData = cleanInitialData(name, chartData['3T'], colors, timeArr.current)
                seriesArr.push(cleanedChartData)
            })
            chartDataRef.current.series = seriesArr
            setUpdater(!updater)
        }
    },[])

    return (
        <>
        {updater && <Chart series={chartDataRef.current.series} options={chartDataRef.current.options}/>}
        </>
    )
}
