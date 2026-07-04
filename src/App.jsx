import React, { useState } from 'react';
import ParticlesBG from 'particles-bg'
import Navigation from "./components/Navigation/Navigation.jsx";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import Signin from "./components/Signin/Signin.jsx";
import Register from "./components/Register/Register.jsx";
import './App.css'

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
  return personItems.map(person => {
    const clarifaiFace = createHuggingFaceBoundingBox(person.box, originalWidth, originalHeight);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  });
}

const initialUserState = {
  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: '',
}

function App() {
  const [input, setInput] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(initialUserState);

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    setBoxes([]);

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then(response => response.json())
            .then(count => {
              setUser({
                ...user,
                entries: count,
              })
            })
            .catch(console.log);
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch(console.log);
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setBoxes([]);
      setUser(initialUserState);
      setImageUrl('');
    } else if ( route === 'home' ) {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  }

  return (
    <div className="App">
      <ParticlesBG type="cobweb" bg={true} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      { route === 'home' ?
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm
            onInputChange={onInputChange}
            onSubmit={onButtonSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
        </> : (
          route === 'signin' ?
          <Signin loadUser={loadUser} onRouteChange={onRouteChange} /> :
          <Register onRouteChange={onRouteChange} loadUser={loadUser}/>
        )
      }
    </div>
  )
}

export default App;
