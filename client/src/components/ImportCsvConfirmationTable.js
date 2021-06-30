import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { green, red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  heading: {
    textAlign: "left",
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
  },
  paragraph: {
    textAlign: "left",
    marginBottom: theme.spacing(3),
  },
  link: {
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#b0281c",
  },
}));

export default ({ output, errors, startOver }) => {
  const classes = useStyles();

  const columns = [
    {
      title: "Email",
      field: "emailAddress",
    },
    {
      title: "First Name",
      field: "firstName",
    },
    {
      title: "Last Name",
      field: "lastName",
    },
    {
      title: "Errors",
      field: "rowErrors",
    },
  ];

  const options = {
    search: false,
    showFirstLastPageButtons: false,
    paging: false,
    toolbar: false,
  };
  console.log(errors);

  return (
    <div>
      <div className={classes.heading} style={{ color: green[500] }}>
        <CheckCircleIcon style={{ color: green[500], marginRight: "12px" }} />
        {output.length} contacts ready for upload
      </div>
      <div className={classes.heading} style={{ color: red[500] }}>
        <ErrorIcon style={{ color: red[500], marginRight: "12px" }} />
        {errors.length} contacts causing errors
      </div>
      <div className={classes.paragraph}>
        Contacts causing errors will not be uploaded. See below for more
        information. Finish the import by pressing Finish below, or fix the
        errors and{" "}
        <span onClick={startOver} className={classes.link}>
          start over
        </span>
        .
      </div>
      <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
        <MaterialTable
          columns={columns}
          data={errors}
          options={options}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
        />
      </div>
    </div>
  );
};
