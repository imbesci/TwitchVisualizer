import React from 'react';
import { useEffect, useState, useRef } from 'react';
import reactDOM from 'react-dom/client';



export default function App(props){
    const [ourData, setOurData] = useState(null)

    useEffect(() =>{
        console.log('run')
        fetch('http://localhost:8000/api/streamdata',
        {   
            method: 'GET',
            mode: 'no-cors'
        })
        .then((res) => {return res.json()})
        .then((data)=> {return setOurData(data)})
    })

    return (
        <>
        <h1>TESTING REA CODE WITH DJANGO</h1>
        <button>TEST BUTTON</button>
        <p>{ourData}</p>
        </>
    )
}

let root = reactDOM.createRoot(document.getElementById('root'))
root.render(<App />)