import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState, createContext} from 'react';
var moment = require('moment');



const apiContext = createContext()
    
function ApiContextProvider({children}){
    
    const [chartData, setChartData] = useState(null)      //initial state that generates page re-render after api fetch
    const [updateData, setUpdateData] = useState(false)
    const timeArray = useRef(null)                       //keeps track of all uptodate data
    let streamerKeys = useRef({})                        //keep track of all the streamers that has data available
    let colors = useRef({})                             // {streamerName:color,} to fetch colors on chart update

    const streamData = axios.create({  //axios base instance
        baseURL: 'http://localhost:8000/',
        timeout: '10000',
    })                               


    const getDataFromServer = async() => {
    /* Fetches current api data from server using Axios */ 
        const response = await streamData.get('api/api/');
        return response.data
    }                 

    function filterKeys(data){
    /* Takes raw api data. Returns object {index:streamer} that will
    be used as a reference in the chart data order */
        let allStreamers = []
        let indToName = {};
        Object.keys(data).map((timeframe) => {
            indToName[timeframe] =  []
            let allTimeframeKeys = Object.keys(data[timeframe]).slice(0,15);
            if (allTimeframeKeys.length){
                allTimeframeKeys.map((key) => {
                    indToName[timeframe].push(key)
                    if (!allStreamers.includes(key)){
                        allStreamers.push(key)
                    }
                })
            }
        })
        streamerKeys.current = indToName
        return allStreamers;
    }

    function generateRandomColor() {
    /* Hexadecimal color generator */
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
   
    const updateColorMap = (streamerMap) => {
    /* Updates colors.current dict with streamer:color pairs*/
        Object.keys(streamerMap).map((timeframe)=>{
            streamerMap[timeframe].forEach((streamer) => {
                if (!Object.hasOwn(colors.current, streamer)){
                    colors.current[streamer] = generateRandomColor()
                }
            })
        })
    }

    function gatherGlobalData(data){
        /* Updates the streamers and colors array */
        const arrStreamers = filterKeys(data)
        updateColorMap(streamerKeys.current)
        console.log(streamerKeys.current)
        console.log(colors.current)
        return arrStreamers
    }

    const cleanInitialData = (streamerName, dataFromApi, colorsObject, timeArray) => {
        let viewerDataArr = []
        let timeArrPointer = 0
        let streamerDataPointer = 0
        while (timeArrPointer<timeArray.length){
            let streamUnix;
            try {streamUnix = moment(dataFromApi[streamerName][streamerDataPointer]['viewers_date']).unix()*1000}
            catch {streamUnix = null}
            const timeArrUnix = timeArray[timeArrPointer]
            if (streamUnix === null){
                viewerDataArr.push(null)
                timeArrPointer++
            } else if (timeArrUnix < streamUnix){
                viewerDataArr.push(null)
                timeArrPointer++
            } else {
                viewerDataArr.push(dataFromApi[streamerName][streamerDataPointer]['viewers'])
                streamerDataPointer++
                timeArrPointer++
            }
        }
        return {
            name: streamerName,
            data: viewerDataArr,
            color: colorsObject[streamerName]
        }
    }
    
    const generateTimeArray = (response, streamers) =>{
        /* gather all unique times found in the data, sorted in ascending order */
        let dict = {}
        const keys = Object.keys(response)
        keys.forEach((timeframe)=> {
            dict[timeframe] = []
            Object.values(streamers).forEach((streamer) => {
                response[timeframe][streamer].forEach((obj)=> {
                    let date = (moment(obj['viewers_date']).valueOf())
                    if (!dict[timeframe].includes(date)){
                        dict[timeframe].push(date)
                    }
                })
            })
            dict[timeframe].sort((a,b) => {
                return a-b
            })
        })

        timeArray.current = dict
        console.log(dict)
    }

    useEffect(() =>{ //Fetch on initial page load
        const awaitData = () => ( getDataFromServer())
        awaitData()
            .then((response) => {
            let keys = gatherGlobalData(response)
            generateTimeArray(response, keys)
            setChartData(response);
        })
    },[])

    useEffect(()=> { 
        let interval = setInterval(()=> {
            getDataFromServer()//fetch data
                .then((response)=> {
                    gatherGlobalData(response)
                    setUpdateData(response)
                })
        }, 2000)
        return () => clearInterval(interval)
    })


    return (
        <>
            {chartData && <apiContext.Provider value = {
                {chartData:chartData, 
                colors: colors.current,
                globalTimeArray: timeArray.current,
                streamerKeys: streamerKeys.current,
                updateData:updateData,
                gatherGlobalData: gatherGlobalData,
                cleanInitialData: cleanInitialData,
                }
            }>
                {children}
            </apiContext.Provider>}
        </>
    )


}

export {apiContext, ApiContextProvider}