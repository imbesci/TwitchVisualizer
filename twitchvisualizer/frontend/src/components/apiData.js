import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState, createContext} from 'react';
var moment = require('moment');



const apiContext = createContext()
    
function ApiContextProvider({children}){
    
    const [fetched, setFetched] = useState(false)          //initial fetch bool will trigger initial chart data load
    const [chartData, setChartData] = useState(null)      //initial state that generates page re-render after api fetch
    const apiStorage = useRef(null)                       //keeps track of all uptodate data
    let streamerKeys = useRef([])                        //keep track of all the streamers that has data available
    let colors = useRef({})                             // {streamerName:color,} to fetch colors on chart update
    let testRef = useRef('test') 

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
            }
        },
    }                               //chart options


    const getDataFromServer = async() => {  //generic fetch api function 
        const response = await streamData.get('api/api/');
        apiStorage.current = response.data
        setFetched(!fetched)
    }                 

    function filterKeys(data){  //grab keys from fetched api object
        let allKeys = Object.keys(data).slice(0,15);
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

    function generateRandomColor() {  //random hexadecimal color gen
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
   
    const updateColorMap = (numKeysToSet) => { //update colors.current dict with color mapping
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

    const cleanDataObj = (dataObj, timeArray, viewerArr) => { //rename viewers and viewers_date to x and y respectively, delete excess data
        const date = moment(dataObj['viewers_date']).format('lll');
        if (!timeArray.includes(date)){
            timeArray.push(date)
        } 
        viewerArr.push(dataObj['viewers']);
    }

    const cleanInitialData = (streamersArray, dataStorage, chartDataset, colorsObject, timeArray) => {
        streamersArray.forEach((streamer)=> {
            let viewerDataArr = []
            dataStorage[streamer].forEach(obj => cleanDataObj(obj, timeArray, viewerDataArr))
            chartDataset.push({
                name: streamer,
                data: viewerDataArr,
                color: colorsObject[streamer]
            })
        })
    }

    function gatherGlobalData(data){
        const keyMap = ['channel_id', 'channel_name', 'id', 'viewers', 'viewers_date']
        const numNewStreamers = filterKeys(data['D'])
        updateColorMap(numNewStreamers)
    }
    

    useEffect(() =>{ //Fetch on initial page load
        const awaitData = () => ( getDataFromServer())
        awaitData().then((res) => {
            let currData = apiStorage.current;
            if (apiStorage.current) {
                gatherGlobalData(currData)
                setChartData(currData)
                }
            })
    },[])


    return (
        <>
            {chartData && <apiContext.Provider value = {
                {chartData:chartData, 
                apiStorage: apiStorage.current, 
                chartOptions: chartOptions,
                colors: colors.current,
                streamerKeys: streamerKeys.current,
                cleanInitialData: cleanInitialData,
                }
            }>
                {children}
            </apiContext.Provider>}
        </>
    )


}

export {apiContext, ApiContextProvider}