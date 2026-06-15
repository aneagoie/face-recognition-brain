import React, { Component } from 'react';
// import Particles from 'react-particles-js'; 
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

//Old way of doing it with an API Key:
// const app = new Clarifai.App({
//  apiKey: 'YOUR API KEY HERE'
// });

// Change thus to whatever model want to use:
const MODEL_ID = 'face-detection';

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in Clarifai's Account Security section
  const PAT = 'YOUR_PAT_HERE';
  // You can keep the 'clarifai'/'main' without changing it to your own unless you want to. 
  // This will use the public Clarifai model so you dont need to create an app:
  const USER_ID = 'clarifai';       
  const APP_ID = 'main';

  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  return {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
}

// No Longer need this. Updated to particles-bg
// const particlesOptions = {
//   particles: {
//     number: {
//       value: 30,
//       density: {
//         enable: true,
//         value_area: 800
//       }
//     }
//   }
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // Convert HuggingFace API data to mimic Clarifai API data
  createClarifaiBoundingBox = (pixelBox, imageWidth, imageHeight) => {
    return {
      left_col: pixelBox.xmin / imageWidth,
      top_row: pixelBox.ymin / imageHeight,
      right_col: pixelBox.xmax / imageWidth,
      bottom_row: pixelBox.ymax / imageHeight
    };
  }

  calculateFaceLocation = (data) => {
    // Get ALL items labeled "person" instead of just the first one
    const personItems = data.filter(item => item.label === "person");
    
    // With new HuggingFace API we need display width as well as original image width
    const image = document.getElementById('inputimage');
    const originalWidth = Number(image.naturalWidth);
    const originalHeight = Number(image.naturalHeight);
    const width = Number(image.width);
    const height = Number(image.height);

    // Loop through every person found and calculate their box
    const boundingBoxes = personItems.map(person => {
      const clarifaiFace = this.createClarifaiBoundingBox(person.box, originalWidth, originalHeight);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });

    return boundingBoxes;
  }

  // Old Code for Clarifai API:
  // calculateFaceLocation = (data) => {
  //   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  //   const image = document.getElementById('inputimage');
  //   const width = Number(image.width);
  //   const height = Number(image.height);
  //   return {
  //     leftCol: clarifaiFace.left_col * width,
  //     topRow: clarifaiFace.top_row * height,
  //     rightCol: width - (clarifaiFace.right_col * width),
  //     bottomRow: height - (clarifaiFace.bottom_row * height)
  //   }
  // }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const sendImageToHuggingFaceWithFetch = async (imageUrl) => {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const contentType = response.headers.get("content-type");

      const apiResponse = await fetch("https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${"YOUR_API_KEY_HERE"}`,
            "Content-Type": contentType,
          },
          body: imageBlob,
        },
      );

      const result = await apiResponse.json();
      console.log(result) // try to experiment and see what the image detects!
      this.displayFaceBox(this.calculateFaceLocation(result))
    };
    
    sendImageToHuggingFaceWithFetch(this.state.input)
  }
   
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection

    // OLD WAY: 
    // app.models.predict('face-detection', this.state.input)
    // NEW WAY:
    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log('hi', response)
    //     if (response) {
    //       fetch('http://localhost:3000/image', {
    //         method: 'put',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //           id: this.state.user.id
    //         })
    //       })
    //         .then(response => response.json())
    //         .then(count => {
    //           this.setState(Object.assign(this.state.user, { entries: count}))
    //         })

    //     }
    //     this.displayFaceBox(this.calculateFaceLocation(response))
    //   })
    //   .catch(err => console.log(err));
  

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="fountain" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
