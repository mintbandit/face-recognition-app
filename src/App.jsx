import React from 'react';
import ParticlesBG from 'particles-bg'
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
// import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import './App.css'

function App() {
  return (
    <div className="App">
      <ParticlesBG type="cobweb" bg={true}/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*<FaceRecognition />*/}
    </div>
  )
}

export default App;
