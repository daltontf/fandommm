import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";

import MapController from "./MapController";
import { type LeagueStats, type League, type Team } from "./Structs";

import "leaflet/dist/leaflet.css";
import "react-tabs/style/react-tabs.css";
import CalculationsComparision from "./CalculationsComparision";

type OverrideProperties = {
  outside_lower48_multiplier: number,
  not_nearest_multiplier: number,
  non_same_state_multiplier: number,
  distance_decay_numerator: number,
  competition_temperature_base: number,
}

export default function App({ calculator }: any) {
  const [teamFile, setTeamFile] = useState("");
  const [calculations, setCalculations] = useState<
    [LeagueStats | null, LeagueStats] | null
  >(null);
  const [league, setLeague] = useState<League | null>(null);
  const [isCalculating, setCalculating] = useState<boolean>(false);

  const [overrideProperties, setOverrideProperties] = useState<OverrideProperties>({
    outside_lower48_multiplier: 2.0,
    not_nearest_multiplier: 2.0,
    non_same_state_multiplier: 2.0,
    distance_decay_numerator: 0.025,
    competition_temperature_base: 1.0,
  });
  
  useEffect(() => {
    if (!teamFile) return;
    fetch(teamFile)
      .then((res) => res.text())
      .then((text) => {
        const league = JSON.parse(text);
        setLeague(league);
      });
  }, [teamFile]);


  async function calculate() {
    setCalculating(true);
    try {
    setCalculations([
      calculations ? calculations[1] : null,
        await calculator.getCalculationsForLeague(league, overrideProperties),
      ]);
    } finally {
      setCalculating(false);
    }
  }

  function updateTeams(teams: Team[]) {
    setLeague((prevLeague) => ({ ...prevLeague, teams }));
  }

  function updateWeight(weight: number) {
    setLeague((prevLeague) => ({ ...prevLeague, weight }));
  }
  
  const dialogRef = useRef<HTMLDialogElement>(null);

  const toggleNearButton = (e: React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
  
      const dlg = dialogRef.current!;

      if (dlg.open) {
        dlg.close();
      } else {
        dlg.style.position = "fixed";
        dlg.style.top = `${rect.top- 300}px`;
        dlg.style.left = `${rect.left + 8}px`;
        dlg.style.zIndex = "1000";
        dlg.show();
      }
    };

  const updateOverrideProperties = (data: FormData) => {
    setOverrideProperties({
      outside_lower48_multiplier: parseFloat(data.get("outside_lower48_multiplier") as string),
      not_nearest_multiplier: parseFloat(data.get("not_nearest_multiplier") as string),
      non_same_state_multiplier: parseFloat(data.get("non_same_state_multiplier") as string),
      distance_decay_numerator: parseFloat(data.get("distance_decay_numerator") as string),
      competition_temperature_base: parseFloat(data.get("competition_temperature_base") as string),
    });
    dialogRef.current?.close();
  };
  
  return (
    <Tabs>
      <TabList>
        <Tab>Map</Tab>
        <Tab>Reports</Tab>
      </TabList>
      <TabPanel>
        <div style={{ position: "relative", top: 0, left: 0, height: "100%", width: "100%" }}>
          <MapContainer
            center={[40, -95]}
            zoom={4}
            style={{ height: "92vh", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController
              calculator={calculator}
              calculations={calculations}
              league={league}
              updateTeams={updateTeams}
            />
          </MapContainer>
          <div className="button-bar">
            <label>League:</label>
            <select
              className="text-black"
              value={teamFile}
              onChange={(e) => {
                setTeamFile(e.target.value);
                setCalculations(null);
              }}
            >
              <option value="" disabled>
                -
              </option>
              <option value="teams_MLB.json">MLB</option>
              <option value="teams_MLS.json">MLS</option>
              <option value="teams_NBA.json">NBA</option>
              <option value="teams_NFL.json">NFL</option>
              <option value="teams_NHL.json">NHL</option>
            </select>
            <label>Weight:</label>
            <input
              className="text-1xl"
              disabled={league === null}
              type="number"
              value={league?.weight}
              onChange={(e) => updateWeight(parseFloat(e.target.value))}
              min=".1"
              max="1.0"
              step="0.05"
            />
            <input className="button-style"
              onClick={toggleNearButton}
              type="button" value="&#x2699;" />
            <button className="button-style" disabled={league === null || isCalculating} onClick={calculate}>
              Calculate
            </button>
          </div>
          <dialog id="dialog" ref={dialogRef}>
            <span className="close-button" onClick={() => dialogRef.current.close()}>X</span>
            <h2 className="text-lg font-bold">Override Properties</h2>
            <form onSubmit={(e) => { e.preventDefault(); updateOverrideProperties(new FormData(e.target as HTMLFormElement)); }}>
            <div style={{ display: "grid", width: "100%", gridTemplateColumns: "75% 25%", gap: "10px" }}>
                <label>Outside Lower 48:</label>
                <input type="number" name="outside_lower48_multiplier" defaultValue={overrideProperties.outside_lower48_multiplier} min="1.0" max="5.0" step="0.1"/>
                <label>Not Nearest:</label>
                <input type="number" name="not_nearest_multiplier" defaultValue={overrideProperties.not_nearest_multiplier} min="1.0" max="5.0" step="0.1"/>
                <label>Not Same State:</label>
                <input type="number" name="non_same_state_multiplier" defaultValue={overrideProperties.non_same_state_multiplier} min="1.0" max="5.0" step="0.1"/>
                <label>Distance Decay Numerator:</label>
                <input type="number" name="distance_decay_numerator" defaultValue={overrideProperties.distance_decay_numerator} min="0.001" max="0.1" step="0.001"/>
                <label>Competition Temperature Base:</label>
                <input type="number" name="competition_temperature_base" defaultValue={overrideProperties.competition_temperature_base} min="0.1" max="5.0" step="0.1"/>
                <button className="button-style" type="submit">Save</button>
              </div>
            </form>
          </dialog>
        </div>
      </TabPanel>
      <TabPanel>
        <CalculationsComparision calculations={calculations} />
      </TabPanel>
    </Tabs>
  );
}
