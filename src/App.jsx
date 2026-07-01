import React, { useState } from 'react';
import ParticlesBG from 'particles-bg'
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import './App.css'

const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

function App() {
  const [input, setInput] = useState();
  const [imageUrl, setImageUrl] = useState();

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);

    const sendImageToHuggingFaceWithFetch = async (imageUrl) => {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const contentType = response.headers.get("content-type");

      const apiResponse = await fetch("https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": contentType,
          },
          body: imageBlob,
        },
      );

      const result = await apiResponse.json();
      console.log(result); // Hugging Face result
    };

    console.log('click');
    sendImageToHuggingFaceWithFetch(input);
  }

  return (
    <div className="App">
      <ParticlesBG type="cobweb" bg={true}/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onSubmit={onButtonSubmit}
      />
      <FaceRecognition imageUrl={imageUrl}/>
    </div>
  )
}

export default App;
