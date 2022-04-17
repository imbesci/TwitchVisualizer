import React from 'react';
import { useEffect, useState, useRef } from 'react';
import reactDOM from 'react-dom/client';



export default function App(props){

    return (
        <>
        <h1>TESTING REACT CODE WITH DJANGO</h1>
        <button>TEST BUTTON</button>
        </>
    )
}

root = reactDOM.createRoot(document.getElementById('root'))
root.render(<App />)