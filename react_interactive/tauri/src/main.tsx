import ReactDOM from 'react-dom/client';

import App from '@fandommm/react-core/src/App';
import {type CalculatorInteface} from "@fandommm/react-core/src/Structs";
import { invoke } from '@tauri-apps/api/core';
import "@fandommm/react-core/src/setupLeaflet";
import '@fandommm/react-core/src/index.css';

let calculator: CalculatorInteface = {
    getCalculationsForLeague: async (league:any, overrides:any) => {
      // return invoke('load_league', { league })
    return invoke('load_league_with_overrides', { league, overrides })
    },
    getStateForCoordinates: async (lat:number, lon:number) => {
      return invoke('lookup_state_name_by_coordinates', { lat, lon })
    }
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(<App calculator = {calculator}/>);
