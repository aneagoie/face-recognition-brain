# SmartBrain - v1 
Final project for ZTM course

1. Clone this repo
2. Run `npm install`
3. Run `npm start`
4. You must add your own API key in the `src/App.js` file to connect to HuggingFace API (Clarifai API is no longer free). See below for how to set up HuggingFace account.

### Get your access token

- Go to [HuggingFace](https://huggingface.co/) and register for an account
- Go to [settings > access tokens](https://huggingface.co/settings/tokens) and create a new token
- Use a fine grained token and add "Make calls to Inference Providers" permission
- Create token and save somewhere you won't lose it. This token you will use inside `src/App.js`.

## Notes on the code

The HuggingFace api for this takes the image as a `Blob` type. So if you want to use an image url string, then you need to convert it. The first lines of the `sendImageToHuggingFace` do that:

```ts
const response = await fetch(imageUrl);
const imageBlob = await response.blob();
```

You will need to use the below code to modify the original Clarifai API request to the replacement HunngingFace API:
```jsx
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
```

And inside of onButtonSubmit():

```jsx
const sendImageToHuggingFaceWithFetch = async (imageUrl) => {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const contentType = response.headers.get("content-type");

      const apiResponse = await fetch("https://router.huggingface.co/hf-inference/models/facebook/detr-resnet-50",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${"YOUR_API_KEY"}`,
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
```


*visist https://zerotomastery.io/ for more*

