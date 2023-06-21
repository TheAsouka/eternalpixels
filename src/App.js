import React, { useState } from 'react';
import logo from './logo.svg';
import Canvas from './Canvas';
import "./App.css"
import Toolbar from './Toolbar';

const App = () => {

  const [selectedColor, setSelectedColor] = useState('red');
  const colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };


  return (
    <div className='App'>
      <header className='App-header'>
        <h1 >
          <img src={logo} className="App-logo" alt="logo" />
          Eternal Pixels</h1>
      </header>
      <Toolbar colors={colors} selectedColor={selectedColor} handleColorSelection={handleColorSelection} />
      <Canvas selectedColor={selectedColor} />
    </div>
  );
};

export default App;