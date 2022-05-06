import React, { useContext, useEffect, useState, useRef } from 'react';
import {apiContext, ApiContextProvider} from './apiData.js';
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
var moment = require('moment');


export default function ThreeMinChart(props){

    const {chartData, globalTimeArray, colors, streamerKeys, cleanInitialData, updateData, gatherGlobalData} = useContext(apiContext)                       
    const [loadInitialChart, setLoadInitialChart] = useState(false)
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

            //Validate the current order of the dataset
            let currentData  = JSON.parse(JSON.stringify(chartDataRef.current.series)) //deepcopy
            let lenUpdatedStreamers = streamerKeys['3T'].length
            let lenCurrentStreamers = plottedStreamers.current.length 

            let incrementCount = 0
            while (incrementCount < lenUpdatedStreamers){
                const currentKey = streamerKeys['3T'][incrementCount]
                if (incrementCount > lenCurrentStreamers) {
                    console.log('added')
                    currentData.push(cleanInitialData(currentKey, updateData['3T'], colors, timeArr))
                    incrementCount++

                } else if(streamerKeys['3T'][incrementCount] === plottedStreamers.current[incrementCount]){
                    console.log('seen')
                    incrementCount++
                    continue
                } else { //new array order has a deletion since the previous order, so delete the data at the current index
                    console.log('deleted')
                    currentData.splice(incrementCount, 1)
                    incrementCount++
                    continue
                }
            }

            console.log({currentData})
            // If current time is less than 3 minutes of the previous timeArray input, we only need to update the last value for existing data, not append a new value
            let currentTime = JSON.parse(JSON.stringify(timeArr.current))
            let lenTime = currentTime.length
            let isNewTime = ((Date.now() - currentTime[(lenTime -1)]) < 180000) ? false : true
            if (isNewTime) currentTime.push(currentTime[lenTime-1]+180000); //push a new time increment if time>3min

            plottedStreamers.current.forEach((streamer, ind)=> {
                const recentDataPt = updateData['3T'][streamer].slice(-1)[0]
                if (!isNewTime) {
                    currentData[ind][data][lenTime-1] = recentDataPt['viewers']
                } else {
                    if (moment(recentDataPt['viewers_date']).valueOf() === currentTime[lenTime]){ //can use lenTime here since we pushed a new pt already
                        currentData[ind][data].push(recentDataPt['viewers'])
                    } else {
                        currentData[ind]['data'].push(null)
                    }
                }
            })

            timeArr.current = currentTime

            plottedStreamers.current = JSON.parse(JSON.stringify(streamerKeys['3T']))
            console.log(plottedStreamers)
            ApexCharts.exec('3min', 'updateOptions', {
                series: currentData,
                options: {xaxis:{categories: timeArr.current}} //update times
            })

        } else { //initial config
            let seriesArr = []
            streamerKeys['3T'].forEach((name)=> {
                let cleanedChartData = cleanInitialData(name, chartData['3T'], colors, timeArr.current)
                seriesArr.push(cleanedChartData)
            })
            chartDataRef.current.series = seriesArr
            plottedStreamers.current = streamerKeys['3T']
            setLoadInitialChart(!loadInitialChart)
        }
    },[updateData])

    return (
        <>
        {loadInitialChart && <Chart series={chartDataRef.current.series} options={chartDataRef.current.options}/>}
        </>
    )
}
