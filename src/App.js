import React from 'react';
import { DBRJS } from './DynamsoftSDK.js';
import logo from './logo.svg';
import DBRLogo from './icon-dbr.svg';
import DynamsoftLogo from './logo-dynamsoft-white-159X39.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="https://www.dynamsoft.com/Products/barcode-recognition-javascript.aspx" target="_blank" rel="noopener noreferrer" >
          <img src={DBRLogo} className="dbr-logo" alt="Dynamsoft Barcode Reader Logo" />
        </a>
        <div style={{ width: "10px" }}></div>
        <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" >
          <img src={logo} className="App-logo" alt="logo" />
        </a>
        <div style={{ width: "50vw" }}></div>
        <a href="https://www.dynamsoft.com" target="_blank" rel="noopener noreferrer" >
          <img src={DynamsoftLogo} className="ds-logo" alt="Dynamsoft Logo" />
        </a>
      </header>
      <section className="App-content">
        <div style={{ height: "90vh" }}>
          <DBRJS />
        </div>
      </section>
    </div >
  );
}

export default App;
