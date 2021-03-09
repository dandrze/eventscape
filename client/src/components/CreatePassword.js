import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default ({ password, onChange, helperText, onKeyPress }) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

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
          onKeyPress={onKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showPassword ? (
                  <Tooltip title="Hide password">
                    <VisibilityOffIcon
                      onClick={() => setShowPassword(false)}
                      style={{ marginLeft: "12px", cursor: "pointer" }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show password">
                    <VisibilityIcon
                      onClick={() => setShowPassword(true)}
                      style={{ marginLeft: "12px", cursor: "pointer" }}
                    />
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </FormGroup>
  );
};
