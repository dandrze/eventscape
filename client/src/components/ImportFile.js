import React, { useState } from "react";
import { connect } from "react-redux";
import { CSVReader } from "react-papaparse";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import ColumnMapping from "./ColumnMapping";
import { validateEmailFormat } from "../utils/validationFunctions";
import ImportCsvConfirmationTable from "./ImportCsvConfirmationTable";
import api from "../api/server";
import { CircularProgress } from "@material-ui/core";

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
  postUpload: {
    textAlign: "center",
  },
}));

const getSteps = () => {
  return ["Upload CSV", "Verify Columns", "Review", "Confirm"];
};

const ImportFile = ({
  handleClose,
  triggerUpdate,
  event,
  registrationData,
}) => {
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
  const [errors, setErrors] = useState([]);
  const [output, setOutput] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [shouldSendEmail, setShouldSendEmail] = useState(true);

  const steps = getSteps();

  const existingEmailAddresses = registrationData.data.map(
    (reg) => reg.emailAddress
  );

  const isStepFailed = (step) => {
    return step === stepHasError;
  };

  const handleNext = async () => {
    switch (activeStep) {
      case 0:
        // logic to handle going from first importing the csv to mapping columns
        if (!data) {
          setStepHasError(0);
          setAlertMessage("Please upload a CSV file");
          //exit the function
          return;
        }
        break;
      case 1:
        // logic to handle going from mapping columns to viewing result (including errors)
        if (columnMap.emailAddress === null) {
          setStepHasError(1);
          setAlertMessage("Please select your Email Address column");
          //exit the function
          return;
        }

        const _output = [];
        const _errors = [];

        data.slice(1).map((row) => {
          // extract the email address using the columnMap.emailAddress index location
          const emailAddress = row.data[columnMap.emailAddress];
          // if there is a firstName mapping, extract the first name. Otherwise leave it black
          const firstName =
            columnMap.firstName != null ? row.data[columnMap.firstName] : "";
          // if there is a lastName mapping, extract the last name. Otherwise leave it black
          const lastName =
            columnMap.lastName != null ? row.data[columnMap.lastName] : "";
          var rowErrors = "";

          console.log({ emailAddress, existingEmailAddresses });

          // flag any errors that could cause problems in our code in the future
          if (!emailAddress) {
            rowErrors += "Email Address missing\n";
          } else if (_output.find((row) => row.emailAddress === emailAddress)) {
            rowErrors += "Duplicate email address\n";
          } else if (existingEmailAddresses.includes(emailAddress)) {
            rowErrors += "Email already registered\n";
          } else if (!validateEmailFormat(emailAddress)) {
            rowErrors += "Invalid email format\n";
          }

          // if there are any errors, push them to the errors array including all row information
          if (rowErrors) {
            _errors.push({
              emailAddress,
              firstName,
              lastName,
              rowErrors,
            });
          } else {
            // if no errors, then push the row to our output
            _output.push({
              emailAddress,
              firstName,
              lastName,
            });
          }
        });

        setErrors(_errors);
        setOutput(_output);
        break;
      case 2:
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        return;
      case 3:
        setUploadComplete(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        const response = await api.post("/api/registration/bulk", {
          registrations: output,
          eventId: event.id,
          shouldSendEmail,
        });

        triggerUpdate();
        setUploadComplete(true);
        return;
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
    setData(data);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const handleUpdateColumnMap = (updatedColumnMap) => {
    clearErrors();
    setColumnMap(updatedColumnMap);
  };

  const handleChangeShouldSendEmail = (event) => {
    setShouldSendEmail(event.target.value);
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
          <ColumnMapping
            data={data}
            columnMap={columnMap}
            handleUpdateColumnMap={handleUpdateColumnMap}
          />
        );
      case 2:
        return (
          <ImportCsvConfirmationTable
            output={output}
            errors={errors}
            startOver={handleReset}
          />
        );
      case 3:
        return (
          <div style={{ paddingTop: "50px" }}>
            <p>You're all set!</p>

            <FormControlLabel
              control={
                <Checkbox
                  checked={shouldSendEmail}
                  onChange={handleChangeShouldSendEmail}
                  color="primary"
                />
              }
              label="Send registration email to newly imported attendees"
            />
          </div>
        );
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
            {uploadComplete ? (
              <div className={classes.postUpload}>
                <p>Upload successfully completed.</p>
                <Button onClick={handleClose} className={classes.button}>
                  Close
                </Button>
              </div>
            ) : (
              <div className={classes.postUpload}>
                <Typography className={classes.instructions}>
                  Uploading registrations...
                </Typography>
                <CircularProgress />
              </div>
            )}
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

const mapStateToProps = (state) => {
  return {
    event: state.event,
    registrationData: state.registration,
  };
};

export default connect(mapStateToProps)(ImportFile);
