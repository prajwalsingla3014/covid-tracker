import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, beautifulStat } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import "./InfoBox.css";
import image from './images/image.png';
function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746,-40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
              name:country.country,
              value:country.countryInfo.iso2
            }));
          
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  },[]);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // setCountry(countryCode);
    const url = 
    countryCode === "worldwide" 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
      console.log(country)
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <img style={{width:"300px",marginTop:"20px"}} src={image} alt="COVID-19" />
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide" style={{fontFamily:"Acme"}}>Worldwide</MenuItem>
              {countries.map((country) => (
                  <MenuItem value={country.name} style={{fontFamily:"Acme"}}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
            isOrange
            active={casesType === "cases"}
            className="infoBox__cases"
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases" 
            cases={beautifulStat(countryInfo.todayCases)} 
            total={beautifulStat(countryInfo.cases)} 
          />
          <InfoBox 
            active={casesType === "recovered"}
            className="infoBox__recovered"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered" 
            cases={beautifulStat(countryInfo.todayRecovered)} 
            total={beautifulStat(countryInfo.recovered)} 
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            className="infoBox__deaths"
            onClick={(e) => setCasesType("deaths")}
            title="Deaths" 
            cases={beautifulStat(countryInfo.todayDeaths)} 
            total={beautifulStat(countryInfo.deaths)} 
          />
        </div>
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 style={{fontFamily:"Acme",fontSize:"20px"}}>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">{country} new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} country={country} />
        </CardContent>
      </Card >
    </div>
  );
}

export default App;
