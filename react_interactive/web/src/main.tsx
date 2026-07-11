import ReactDOM from 'react-dom/client';
import App from '@fandommm/react-core/src/App';
import {type CalculatorInteface} from "@fandommm/react-core/src/Structs";

import buildUrl from 'build-url-ts'

import "@fandommm/react-core/src/setupLeaflet";
import '@fandommm/react-core/src/index.css';

const restUrl = import.meta.env.VITE_REST_CALCULATOR_ENDPOINT;

let calculator: CalculatorInteface = {
    getCalculationsForLeague: async (league:any, overrides:any) => {
    return fetch(buildUrl(restUrl, {
      queryParams: overrides
    }),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(league)
    }).then((res) => res.json())  
    },
    getStateForCoordinates: async (lat:number, lon:number) => {
      return fetch(restUrl + `?lat=${lat}&lon=${lon}`, { method: 'GET' }).then((res) => res.text())         
    }
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
    <App calculator = {calculator}/>
);
