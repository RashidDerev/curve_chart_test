import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Triangle from './svgElements/Triangle';
import {select, line} from "d3" 

function App() {
  //data
  const svgRef = useRef()
  const getData = localStorage.getItem("values")==null?[]:JSON.parse(localStorage.getItem("values"));
  const [leftSide, setLeftSide] = useState({border:'openLeftBorder', button:'buttonLeftOpened', left:true})
  const [rightSide, setRightSide] = useState({border:'openRightBorder', button:'buttonRightOpened', right:true})
  const [values, setValues] = useState(getData)
  const [num, setNum] = useState()
  const minutes = new Date().getMinutes()
  const seconds = new Date().getSeconds()
  const milliseconds = new Date().getMilliseconds()
  const timeFormat = `${minutes}:${seconds}:${milliseconds}`
  const lineData = values.map(function(el){ return parseInt(el.value, 10)})
  //act
  useEffect(()=>{
    const svg = select(svgRef.current)
    const lineUp = line()
       .x((value, index)=>index*50)
       .y(value => 150-value)
    svg.selectAll("path")
       .data([lineData])
       .join("path")       
       .attr("d", value=>lineUp(value))
       .attr("fill", "none")
       .attr("stroke", "#407FC2")
       .attr("stroke-width", "1px")
    svg.selectAll("text")
       .data(lineData)
       .join(
         enter => enter.append("text").text(d=>d),
         update => update.attr("class", "updated").text(d=>d),
         exit => exit.remove()
       )
       .attr("class","new")
       .attr("x", (value, index)=>index*50)
       .attr("y", value => 150-value)
       .attr("font-size", "12px")
  },[lineData])
  //functions
  const openLeft = () =>{
    setLeftSide(leftSide.left?{border:'closeLeftBorder', button:'buttonLeftClosed', left:false}:{border:'openLeftBorder', button:'buttonLeftOpened', left:true})
  } 
  const openRight = () =>{
    setRightSide(rightSide.right?{border:'closeRightBorder', button:'buttonRightClosed', right:false}:{border:'openRightBorder', button:'buttonRightOpened', right:true})
  }
  const addValue = (data) => {
    setNum('')
    if(!data.value) data.value=0
    values.push(data)
    localStorage.setItem("values", JSON.stringify(values))
    setValues([...values])
  }
  const removeElement = (index) =>{
    let arr = values.filter(function(el){ return el !== values[index] })
    setValues([...arr])
    localStorage.setItem("values", JSON.stringify(arr))
  }
  return (
    <React.Fragment>
    <div className="App">    
      <div className="container">
          <div className={`content ${leftSide.border} ${rightSide.border}`} >
            <div className={`buttons ${leftSide.button}`} onClick={()=>openLeft()}>
              <Triangle/>
            </div>
            <div className="curveArea">
              <svg ref={svgRef} viewBox="0 0 450 450"></svg>
            </div>
            <div className="dataArea">
              <div className="dataInput">
                  <label htmlFor="number"><strong>Data</strong></label><br/>
                  <input type="text" id="number" name="number"
                  value={num} onChange={event => setNum(event.target.value)}></input>
                  <button className="addButton" onClick={()=>addValue({date:timeFormat, value:num})}>Add</button><br/>
                  <label for="values">List of values:</label><br/>
                  <div className="dataList">
                    {values.map((elem, index)=>{ return <div key={index} className="dataValue">
                      &nbsp; {elem.date}
                      <strong>{elem.value}</strong>
                      <button onClick={()=>removeElement(index)}>Remove</button>
                      </div>})}
                  </div>
              </div>
            </div>
            <div className={`buttons ${rightSide.button}`} onClick={()=>openRight()}>
              <Triangle/>
            </div>
          </div>
      </div>
    </div>
    </React.Fragment>
  )
}

export default App;