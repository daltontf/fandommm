## fandomMM/jupyter

This is the Jupyter notebook project for the fandomMM application. This is the original project named "Sportwarzsim".

#### Running 

- Currently, the model is implemented as a Jupyter notebook served via Voila.

- You can also run it via Docker:

```
docker pull daltontf1212/fandommm_voila:latest
```
```
docker run -p 8866:8866 daltontf1212/fandommm_voila:latest
```

Navigate to http://localhost:8866/

It was deployed on an EC2. There was problems scaling the calculations so that work was rewritten in Rust and then moved to be done via an AWS Lambda. I still didn't like paying for an idling EC2 instance so the next step is to implement a React frontend that can call the Lambda function. However, the Jupyter notebooks have the ability to "script" changes whereas the React frontend is more of a manual "drag team to new market and recalculate" type of interface.  


