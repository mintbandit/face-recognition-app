import React, { useState } from 'react';
import ParticlesBG from 'particles-bg'
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import './App.css'

const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

const createHuggingFaceBoundingBox = (pixelBox, imageWidth, imageHeight) => {
  return {
    left_col: pixelBox.xmin / imageWidth,
    top_row: pixelBox.ymin / imageHeight,
    right_col: pixelBox.xmax / imageWidth,
    bottom_row: pixelBox.ymax / imageHeight
  };
}

const calculateFaceLocation = (data) => {
  // Get ALL items labeled "person" instead of just the first one
  const personItems = data.filter(item => item.label === "person");

  // With HuggingFace API we need display width as well as original image width
  const image = document.getElementById('inputimage');
  const originalWidth = Number(image.naturalWidth);
  const originalHeight = Number(image.naturalHeight);
  const width = Number(image.width);
  const height = Number(image.height);

  // Loop through every person found and calculate their box
  const boundingBoxes = personItems.map(person => {
    const clarifaiFace = createHuggingFaceBoundingBox(person.box, originalWidth, originalHeight);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  });

  return boundingBoxes;
}

function App() {
  const [input, setInput] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [boxes, setBoxes] = useState([]);

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    setBoxes([]);

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
      // console.log(result); // Hugging Face result
      displayFaceBox(calculateFaceLocation(result));
    };

    // console.log('click');
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
      <FaceRecognition imageUrl={imageUrl} boxes={boxes}/>
    </div>
  )
}

export default App;
