import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({ title, isRed, isOrange, active, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isOrange && "infoBox--orange"
      } ${isRed && "infoBox--red"}`}
    >
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary" style={{fontFamily:"Acme",fontSize:"20px"}}>
          {title}
        </Typography>

        {/* Number of Cases */}
        <h2
          className={`infoBox__cases ${isOrange && "infoBox__cases--orange"} ${!isOrange && "infoBox__cases--green"} ${
            isRed && "infoBox__cases--red"
          }`}
        >
          {cases} Today
        </h2>

        {/* Total Cases */}
        <Typography className="infoBox__total" color="textSecondary" style={{fontFamily:"Acme"}}>
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;