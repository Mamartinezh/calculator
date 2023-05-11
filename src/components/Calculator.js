
import { useState, useReducer, useEffect, useRef } from "react"
import { create, all } from 'mathjs'

const config = {}
const math = create(all, config)

const keys = {
	"CE": "ce",
	"°": "deg",
	"(": "(",
	")": ")",
	"%": "%",
	"AC": "ac",
	"sin": "sin",
	"π": "pi",
	"_7": "7",
	"_8": "8",
	"_9": "9",
	"÷": "/",
	"cos": "cos",
	"log": "log",
	"_4": "4",
	"_5": "5",
	"_6": "6",
	"x": "*",
	"tan": "tan",
	"sqrt": "sqrt",
	"_1": "1",
	"_2": "2",
	"_3": "3",
	"-": "-",
	"e": "e",
	"^": "^",
	"_0": "0",
	".": ".",
	"=": "=",
	"+": "+"
}

const inputReducer = (state, action) => {
	switch (action.type) {
		case "CE": 
			return state.slice(0,-1)
		case "AC": return []
		case "=": return action.payload
		default: return [...state, action.type]
	}	
}

export default function Calculator() {

	const [ input, dispatch ] = useReducer(inputReducer, [])
	let inputRef = useRef(input)

	function addInput(val) {
		if (inputRef.current.at(0) === "Syntax Error") dispatch({type:"AC"})
		if (val === "=") evalInput()
		else dispatch({type:val})
	}

	function evalInput() {
		let res
		let exp = inputRef.current
		try {
			res = math.evaluate(exp.map(inp => keys[inp]).join(""))
			res = Math.round(res * 100) / 100
			res = res.toString().split("")
					 .map(val => val === "." ? val : "_".concat(val))
		}
		catch (e) {
			res = ["Syntax Error"]
		}
		dispatch({type:"=", payload: res})
	}

	useEffect(()=> {

		const listenKeys = (e) => {
			if (e.key === "Enter") addInput("=")
			if (e.key === "/") addInput("÷")
			if (e.key === "*") addInput("x")
			if (e.key === "Backspace") addInput("CE")
			if (['(', ')', '+', '-', '%'].includes(e.key)) {
				addInput(e.key)
			}
			if ([...Array(10).keys()].includes(parseInt(e.key))) {
				addInput("_"+e.key)
			}		
		}

		addEventListener("keydown", listenKeys)

		return () => {
			removeEventListener("keydown", listenKeys)
		}
		
	}, [])

	inputRef.current = input

	return (
		<div className="calculator">
			<input 
				className="display" 
				disabled
				value={input.map(val => val.split("_").at(-1)).join("")}
				 />
			<div className="keys">
				{Object.keys(keys).map(key => (
					<p 
						key={key}
						onClick={e => addInput(key)}>
						{key.split("_").at(-1)}
					</p>
					)
				)}
			</div>
		</div>
	)
}

