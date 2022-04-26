import React from 'react';
import { useEffect, useState, useRef } from 'react';
import HomepageApp from './Home.js'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import reactDOM from 'react-dom/client';
import axios from 'axios';
import '../../static/css/index.css';



export default function App(props){
    const [ourData, setOurData] = useState(null)

    const streamdata = axios.create({
        baseURL: 'http://localhost:8000/',
        timeout: '10000',
    })

    useEffect(() =>{
        streamdata.get('api/api/')
        .then(res => {console.log(res.data)})
    },[])

    async function handleClick(){
        setOurData('data set')
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
          }
        await sleep(3000)
        console.log('this came after the set data')
    }

    return (
        <>
            <h1>TESTING REACT CODE WITH DJANGO</h1>
            <button onClick={handleClick}>TEST BUTTON</button>
            <p>{ourData}</p>
            <div className="my-40">
            <HomepageApp className=""/>
            </div>
        </>
    )
}

let root = reactDOM.createRoot(document.getElementById('root'))
root.render(<App />)