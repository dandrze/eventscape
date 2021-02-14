import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  verifyTable: {
    height: "100%",
  },
  verifyTableHeader: {
    backgroundColor: "#e3e3e3",
    marginBottom: theme.spacing(1),
  },
  verifyTableHeaderHighlight: {
    backgroundColor: "#b0281c",
    color: "#ffffff",
  },
  dropDown: {
    width: "100%",
  },
}));

const ColumnMapping = ({ data, columnMap, handleUpdateColumnMap }) => {
  const classes = useStyles();

  const handleChangeColumn = (event, column) => {
    const newColumnMap = { ...columnMap };
    newColumnMap[column] = event.target.value;

    handleUpdateColumnMap(newColumnMap);
  };

  return (
    <div style={{ height: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={6} className={classes.verifyTableHeaderHighlight}>
          Our Column
        </Grid>
        <Grid item xs={6} className={classes.verifyTableHeaderHighlight}>
          Your Column
        </Grid>
        <Grid item xs={6}>
          Email Address <em>(Required)</em>
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            value={columnMap.emailAddress}
            onChange={(event) => handleChangeColumn(event, "emailAddress")}
            className={classes.dropDown}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {data[0].data.map((colName, index) => {
              return <MenuItem value={index}>{colName}</MenuItem>;
            })}
          </Select>
        </Grid>
        <Grid item xs={6}>
          First Name
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            value={columnMap.firstName}
            onChange={(event) => handleChangeColumn(event, "firstName")}
            className={classes.dropDown}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {data[0].data.map((colName, index) => {
              return <MenuItem value={index}>{colName}</MenuItem>;
            })}
          </Select>
        </Grid>
        <Grid item xs={6}>
          Last Name
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            value={columnMap.lastName}
            onChange={(event) => handleChangeColumn(event, "lastName")}
            className={classes.dropDown}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {data[0].data.map((colName, index) => {
              return <MenuItem value={index}>{colName}</MenuItem>;
            })}
          </Select>
        </Grid>
      </Grid>
    </div>
  );
};

export default ColumnMapping;
