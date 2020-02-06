import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import socketIOClient from "socket.io-client";
import './index.css'
// const endpoint = 'http://localhost:3000/'
const endpoint = 'https://pressthebuttongame.herokuapp.com/'

const TheButton = (props) => {
    return (
      <div >
        <button className='button' onClick={props.onClick}>
            CLICK
        </button>
      </div>
    )
}

const ScoreCounter = (props) => {
    return (
        <div className='scores'>
            <p>Current Score:</p>
            <p>{props.counter}</p>
        </div>
    )
}

const DistanceCounter = (props) => {
    return (
        <div className='scores'>
            <p>Distance to next reward:</p>
            <p>{props.counter}</p>
        </div>
    )
}

const App = () => {
    const [ scoreCounter, setScoreCounter ] = useState(0)
    const [ distanceCounter, setDistanceCounter ] = useState(0)
    const [ showReset, setShowReset ] = useState(false)
    const setDistanceToValue = (value) => setDistanceCounter(value)
    const setScoreToValue = (value) => setScoreCounter(value)
    const socket = socketIOClient(endpoint)
    
    useEffect(() => {  

        socket.on('clicked', function(score) {
            setDistanceToValue(score)
        })      
        fetch(endpoint + 'start', { 
            credentials: 'include',
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'               
                }           
            })          
            .then(r => r.json())
            .then(function (d) {
                setDistanceToValue(d.distance)
                setScoreToValue(d.score)
                
            });

    },)
    
    const handleClick = () => {
        
        fetch(endpoint + 'click', {
            credentials: 'include',
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'              
                }          
            })   
            .then(r => r.json())
            .then(function (d) {
            if(!d.msg) {
                if (scoreCounter < d.score) {
                    let victory = d.score - scoreCounter + 1
                    alert('You won a price: '+ victory + ' points!')
                }
                setScoreToValue(d.score)

                socket.emit('click', 'one')
            } else {

                setShowReset(true)
                
            }                         
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className='app'>
            <DistanceCounter counter={distanceCounter}/>
            <ScoreCounter counter={scoreCounter}/>
            <TheButton onClick={() => handleClick()}/> 
            <ResetField  showReset={showReset} setScoreToValue={setScoreToValue} setShowReset={setShowReset} />       
        </div>
    )
}





const ResetField = (props) => {

    const handleReset = () => {

        fetch(endpoint + 'reset', { 
            credentials: 'include',
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'              
                }          
            })   
            .then(r => r.json())
            .then(function (d) {
                props.setScoreToValue(d.score)
                props.setShowReset(false)
                
            })

    }

    return (
        <div style={{display: props.showReset ? 'block' : 'none'  }}>
            <p>You don't have enough points to click the button. Reset your score and start over?</p>
            <button onClick={handleReset}>
                Reset
            </button>
        </div>
    )
}



/*const requestReset = (setScoreToValue) => {

    ReactDOM.render(<ResetField onClick={() => {
       
        fetch('http://localhost:3001/reset', { 
            credentials: 'include',
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'              
                }          
            })   
            .then(r => r.json())
            .then(function (d) {
                setScoreToValue(d.score)
                ReactDOM.unmountComponentAtNode(document.getElementById('reset'))
            })
    }}/>, document.getElementById('reset'))  
}*/



ReactDOM.render(<App />, document.getElementById('root'))