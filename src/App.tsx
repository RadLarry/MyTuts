import React from 'react';
import logo from './logo.svg';
import {Newtext} from "./ColorCoder/AddText"
import './App.css';
import "./ColorCoder/ColorCoding.css"
import Irgendwas from "./ColorCoder/irgendwas";
import Api from "./dotaapi/dotaapi";

function App() {
  return (
    <div className="App" id="App">
      <Irgendwas onDadidu={(e) => console.log(e)}/>
        <Api/>
    </div>
  );
}

export default App;
