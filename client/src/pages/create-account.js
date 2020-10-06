import React from "react";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';


export default class Create_Account extends React.Component {
    render() {
        return(
            <div className="form-box">
                <h1>Create your<br></br>free account to<br></br>continue.</h1>
                <EmailPassword />
                <br></br>
                <a href="/Event_Details">
                    <button className='Button1'>Create My Account</button>
                </a>
            </div>
        )
    }
}

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: "20px 0px",
      minWidth: "100%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function EmailPassword() {
    const classes = useStyles();

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <TextField type="email" id="email" label="Email" variant="outlined" />
                <br></br>
                <TextField type="password" id="password" label="Password" variant="outlined" />
            </FormControl>
        </div>
    )
}
