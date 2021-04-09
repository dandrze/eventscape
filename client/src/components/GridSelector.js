import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Button } from "@material-ui/core";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import { sponsorGrid } from "../templates/designBlockModels";

const useStyles = makeStyles((theme) => ({
  gridSelectors: {
    margin: "0px 1% 20px",
    minWidth: "30%",
  },
}));

export default ({ addSection }) => {
  const classes = useStyles();

  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [boxStyle, setBoxStyle] = useState("box");

  const htmlOutput = sponsorGrid(columns, rows, boxStyle === "box");

  const handleChangeColumns = (event) => {
    setColumns(event.target.value);
  };

  const handleChangeRows = (event) => {
    setRows(event.target.value);
  };

  const handleChangeStyle = (event) => {
    setBoxStyle(event.target.value);
  };

  const handleSubmit = () => {
    addSection(htmlOutput);
  };

  return (
    <div>
      <div>
        <FormControl
          variant="outlined"
          className={classes.gridSelectors}
          style={{ width: "30%" }}
        >
          <InputLabel id="columns-select-label" className="mui-select-css-fix">
            Columns
          </InputLabel>

          <Select
            labelId="columns-select-label"
            variant="outlined"
            value={columns}
            onChange={handleChangeColumns}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => {
              return <MenuItem value={index}>{index}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          className={classes.gridSelectors}
          style={{ width: "30%" }}
        >
          <InputLabel id="rows-select-label" className="mui-select-css-fix">
            Rows
          </InputLabel>
          <Select
            labelId="rows-select-label"
            variant="outlined"
            value={rows}
            onChange={handleChangeRows}
          >
            {[1, 2, 3, 4, 5].map((index) => {
              return <MenuItem value={index}>{index}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={classes.gridSelectors}
          style={{ width: "30%" }}
        >
          <InputLabel id="rows-select-label" className="mui-select-css-fix">
            Border
          </InputLabel>
          <Select
            labelId="rows-select-label"
            variant="outlined"
            value={boxStyle}
            onChange={handleChangeStyle}
          >
            <MenuItem value="box">Box</MenuItem>;
            <MenuItem value="none">None</MenuItem>;
          </Select>
        </FormControl>
      </div>
      <div>
        <div>Preview</div>
        <FroalaEditorView
          model={htmlOutput.replace(
            `contenteditable="true"`,
            `contenteditable="false"`
          )}
        />
      </div>
      <div
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          display: "flex",
        }}
      >
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          className="Button1"
        >
          Add Block
        </Button>
      </div>
    </div>
  );
};
