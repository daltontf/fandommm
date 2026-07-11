## fandomMM/react_interactive

This directory contains a React application that implements the jupyter Interactive*.ipynb notebooks. 
The advantage of this is that it can be run in a browser without the need for a Jupyter (or Voila) server. The backend can an AWS Lambda function which is preferrable to needing an idling server in the cloud.

The ```/web``` is the directory for the web application. In development, you can run the application with the following command:

```bash
cd web
npm install
npm run dev
```

The ```.env``` file is configured to use the the default endpoint for the ```../axum``` server. 