import React, { useState } from "react";
import { CSVReader } from "react-papaparse";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "600px",
  },
  dropArea: {
    height: "300px",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  content: {
    minHeight: "350px",
    padding: "20px",
    textAlign: "center",
  },
  dropDown: {
    width: "100%",
  },

  verifyTable: {
    height: "100%",
  },
}));

const getSteps = () => {
  return ["Upload CSV", "Verify Columns", "Create an ad"];
};

const ImportFile = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [stepHasError, setStepHasError] = useState(null);
  const [columnMap, setColumnMap] = useState({
    emailAddress: null,
    firstName: null,
    lastName: null,
  });
  const steps = getSteps();

  const isStepFailed = (step) => {
    return step === stepHasError;
  };

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (!data) {
          setStepHasError(0);
          setAlertMessage("Please upload a CSV file");
          //exit the function
          return;
        }
        break;
      case 1:
        return console.log(columnMap);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const clearErrors = () => {
    setStepHasError(null);
    setAlertMessage("");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleOnDrop = (data) => {
    clearErrors();
    console.log(data);
    setData(data);
  };

  console.log(columnMap);

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const updateMap = (column, index) => {
    const newColumnMap = columnMap;
    columnMap[column] = index;

    setColumnMap(newColumnMap);
  };

  const MappingRow = ({ colName, index, updateMap }) => {
    const [column, setColumn] = useState("");

    const handleChangeColumn = (event) => {
      setColumn(event.target.value);
      updateMap(event.target.value, index);
    };

    return (
      <Grid container spacing={3}>
        <Grid
          item
          xs={6}
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {colName}
        </Grid>
        <Grid item xs={6}>
          <Select
            variant="outlined"
            value={column}
            onChange={handleChangeColumn}
            label="Age"
            className={classes.dropDown}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="emailAddress">Email Address</MenuItem>
            <MenuItem value="firstName">First Name</MenuItem>
            <MenuItem value="lastName">Last Name</MenuItem>
          </Select>
        </Grid>
      </Grid>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.dropArea}>
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              addRemoveButton
              onRemoveFile={handleOnRemoveFile}
              style={{
                removeButton: {
                  color: "#b0281c",
                },
                dropFile: {
                  width: "350px",
                  background: "#f8f8f8",
                  border: "1px solid #e2e2e2",
                },
              }}
            >
              <span>Drop CSV file here or click to upload.</span>
            </CSVReader>
          </div>
        );
      case 1:
        return (
          <div style={{ height: "100%" }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                Your Column
              </Grid>
              <Grid item xs={6}>
                Our Column
              </Grid>
            </Grid>
            <div className={classes.verifyTable}>
              {data[0].data.map((colName, index) => {
                return (
                  <MappingRow
                    colName={colName}
                    index={index}
                    updateMap={updateMap}
                  />
                );
              })}
            </div>
          </div>
        );
      case 2:
        return "This is the bit I really care about!";
      default:
        return "Unknown step";
    }
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.error = true;
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {alertMessage}
              </Typography>
            );
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <div className={classes.content}>{getStepContent(activeStep)}</div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportFile;
