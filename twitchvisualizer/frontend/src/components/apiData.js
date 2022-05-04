import React from 'react'
import axios from 'axios';
import {useRef, useEffect, useState, createContext} from 'react';
var moment = require('moment');



const apiContext = createContext()
    
function ApiContextProvider({children}){
    
    const [chartData, setChartData] = useState(null)      //initial state that generates page re-render after api fetch
    const timeArray = useRef(null)                       //keeps track of all uptodate data
    let streamerKeys = useRef([])                        //keep track of all the streamers that has data available
    let colors = useRef({})                             // {streamerName:color,} to fetch colors on chart update
    const [updateData, setUpdateData] = useState(false)

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
         /* Grab keys from fetched api object. Returns the number of new
            keys added to be used as the params for updateColorMap() */
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

    function generateRandomColor() {
        /* Hexadecimal color generator */
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
   
    const updateColorMap = (numKeysToSet) => {
        /* Updates colors.current dict with streamer:color pairs*/
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

    function gatherGlobalData(data){
        /* Updates the streamers and colors array */
        const numNewStreamers = filterKeys(data['D'])
        updateColorMap(numNewStreamers)
    }

    const cleanDataObj = (dataObj, timeArray, viewerArr) => { //create data array for each streamer
        const objUnix = moment(dataObj['viewers_date']).format('lll');


        if (!timeArray.includes(date)){
            timeArray.push(date)
        } 
        viewerArr.push(dataObj['viewers']);
    }

    const cleanInitialData = (streamerName, dataFromApi, colorsObject, timeArray) => {
        let viewerDataArr = []
        let timeArrPointer = 0
        let streamerDataPointer = 0
        while (timeArrPointer<timeArray.length){
            let streamUnix;
            try {streamUnix = moment(dataFromApi[streamerName][streamerDataPointer]['viewers_date']).unix()}
            catch {streamUnix = null}
            const timeArrUnix = moment(timeArray[timeArrPointer]).unix()
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
            streamers.forEach((streamer) => {
                response[timeframe][streamer].forEach((obj)=> {
                    let date = obj['viewers_date']
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
    }

    useEffect(() =>{ //Fetch on initial page load
        const awaitData = () => ( getDataFromServer())
        awaitData()
            .then((response) => {
            let currData = response;
            gatherGlobalData(currData);
            generateTimeArray(response, streamerKeys.current)
            setChartData(currData);
        })
    },[])

    useEffect(()=> { 
        let interval = setInterval(()=> {
            getDataFromServer()//fetch data
                .then((response)=> {
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
                cleanInitialData: cleanInitialData,
                }
            }>
                {children}
            </apiContext.Provider>}
        </>
    )


}

export {apiContext, ApiContextProvider}