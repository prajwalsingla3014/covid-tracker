import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColors = {
    cases: {
      hex: "#F46117",
      rgb: "rgb(250, 169, 142)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7DD71D",
      rgb: "rgb(172, 251, 88)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#CC1034",
      rgb: "rgb(251, 105, 133)",
      multiplier: 2000,
    },
  };

const buildChartData = (data, casesType,country) => {
  let chartData = [];
  let lastDataPoint;
  if(country === "worldwide")
  {
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
  }
  else
  {
    for (let date in data.timeline.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data.timeline[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data.timeline[casesType][date];
    }
  }
  return chartData;
};

function LineGraph({country, casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let url = country === "worldwide" ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120" : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`;
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType,country);
          setData(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [country,casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: casesTypeColors[casesType].rgb,
                borderColor: casesTypeColors[casesType].hex,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;