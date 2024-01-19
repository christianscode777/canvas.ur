import React from 'react';
import ThreeScene from './components/threescene'; 


function App() {
  const appStyle = {
    backgroundColor: '#1a1a1a', // Dark grey background to match the ThreeScene
    color: 'white', // White text color
    textAlign: 'center', // Center align text
    padding: '20px', // Padding around the content
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle = {
    width: '50px', // Adjust as needed
    height: '50px', // Adjust as needed
    borderRadius: '50%', // Make the image circular
    marginRight: '10px', // Spacing between image and text
  };

  return (
    <div style={appStyle}>
      <div style={headerStyle}>
        <img src="public/images/Reflect.jpg" alt="Logo" style={imageStyle} />
        <h1>chat.ur</h1> 
        <h2>forest</h2>
      </div>
      <ThreeScene />
    </div>
  );
}

export default App;

