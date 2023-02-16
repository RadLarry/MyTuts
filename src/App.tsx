import React from 'react';
import logo from './logo.svg';
import {Newtext} from "./ColorCoder/AddText"
import './App.css';
import "./ColorCoder/ColorCoding.css"
import Irgendwas from "./ColorCoder/irgendwas";
import Api from "./dotaapi/dotaapi";
import MemePauschale from "./Memerino Pauschale/MemePauschale";
import {BrowserRouter as Router, Routes, Route, createBrowserRouter, Link} from "react-router-dom";

function App() {

  return (
    <div className="App" id="App">




      <Router>

        <Routes>
          <Route path={"/"} element={<>
            <Link to="/meme" > <button className="buttons" >meme</button> </Link>
            <Link to="/colorcoder" > <button className="buttons"> colorcoder</button> </Link>
            <Api/>
          </>}/>
          <Route path={"/colorcoder"} element={<>
            <Link to="/" > <button className="buttons">Back to main</button> </Link>
            <Irgendwas/></>}/>


          <Route path={"/meme"} element={<>
            <MemePauschale/>
          </>}/>
        </Routes>

      </Router>


    </div>
  );
}
      //kann ich den button in die "memepauschale" rein in diesem menü oder muss ich in memepauschale den setzen
export default App;
