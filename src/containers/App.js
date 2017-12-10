import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import SignInForm from '../components/SignIn/SignInForm.js';
import Registration from '../components/Registration/Registration.js';
import Navigation from '../components/Navigation/Navigation.js';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition.js';
import Logo from '../components/Logo/Logo.js';
import './App.css';
import 'tachyons';

// instantiate a new Clarifai app passing in your api key.
const app = new Clarifai.App({
 apiKey: 'e80301fd2e9743fe9576acb4a154a234'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    },
  }
}

class App extends Component {
  constructor() {
      super();
      this.state = {
        input: '',
        imageUrl: '',
        box: {},
        isSignedIn: false,
        route: 'signin'
      };
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("image");
    const width = Number(image.width)
    const height = Number(image.height);
    return {
        x: clarifaiFace.left_col * width,
        y: clarifaiFace.top_row * height,
        w: width - (clarifaiFace.right_col * width),
        h: height - (clarifaiFace.bottom_row * height)
    }
  }

  onDrop = () => {
    const { input } = this.state;
    this.setState({ imageUrl: input});
    // predict the contents of an image by passing in a url
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(error => console.log(error))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  onValueChange = (event) => {
    this.setState({ input: event.target.value})
  }

  render() {
    const { route, isSignedIn, box, imageUrl } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        <Particles
          className="particles"
          params={particlesOptions}
        />
        { isSignedIn || route === 'home'
          ? <div>
              <Logo />
              <ImageLinkForm onDrop={this.onDrop} onValueChange={this.onValueChange} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin' || route === 'signout'
             ? <SignInForm onRouteChange={this.onRouteChange}/>
             : <Registration onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
