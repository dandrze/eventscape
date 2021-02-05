import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default ({ password, onChange, helperText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  const handleChangeShowPassword = (event) => {
    setShowPassword(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          type={showPassword ? "text" : "password"}
          id="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={onChange}
          helperText={helperText}
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={showPassword}
            onChange={handleChangeShowPassword}
            name="showPw"
            color="primary"
          />
        }
        label="Show Password"
      />
    </FormGroup>
  );
};
