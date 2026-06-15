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


*visist https://zerotomastery.io/ for more*

