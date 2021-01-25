import React, { useState, useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./event-details.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";

import { HexColorPicker, HexColorInput } from "react-colorful";
import "react-colorful/dist/index.css";
import * as actions from "../actions";
import momentTZ from "moment-timezone";
import AlertModal from "../components/AlertModal";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Event_Details(props) {
  const classes = useStyles();
  const defaultTimeZone = momentTZ.tz.guess();

  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const [eventCat, setEventCat] = React.useState(
    props.eventCat ? props.eventCat : ""
  );
  const [eventTitle, setEventTitle] = React.useState(
    props.eventTitle ? props.eventTitle : ""
  );
  const [eventLink, setEventLink] = React.useState(
    props.eventLink ? props.eventLink : ""
  );

  const [linkUnavailable, setLinkUnavailable] = React.useState(false);

  const [linkHelperText, setLinkHelperText] = React.useState("");

  const [selectedStartDate, setSelectedStartDate] = React.useState(
    props.selectedStartDate ? props.selectedStartDate : new Date()
  );
  const [selectedEndDate, setSelectedEndDate] = React.useState(
    props.selectedEndDate ? props.selectedEndDate : new Date()
  );
  const [eventTimeZone, setEventTimeZone] = React.useState(
    props.eventTimeZone ? props.eventTimeZone : defaultTimeZone
  );
  const [color, setColor] = useState(props.color ? props.color : "#B0281C");
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (!props.selectedStartDate) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      startDate.setHours(18);
      startDate.setMinutes(0);
      setSelectedStartDate(startDate);
    }

    if (!props.selectedEndDate) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(21);
      endDate.setMinutes(0);
      setSelectedEndDate(endDate);
    }
  }, []);

  const closeModal = () => setOpenModal(false);

  const handleChangeEventCat = (event) => {
    setEventCat(event.target.value);
  };
  const handleChangeEventTitle = (event) => {
    setEventTitle(event.target.value);
  };
  const handleChangeEventLink = (event) => {
    setEventLink(
      event.target.value
        .toLowerCase()
        .trim()
        .replace(/[\[\](){}?*+\^\/$\\.|]/g, "")
    );
  };

  const handleChangeEventLinkBlur = async (event) => {
    const res = await props.isLinkAvailable(eventLink);

    if (res) {
      setLinkUnavailable(false);
      setLinkHelperText("");
    } else {
      setLinkUnavailable(true);
      setLinkHelperText(
        "This link is already in use. Please choose another one."
      );
    }
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };
  const handleChangeTimeZone = (event) => {
    setEventTimeZone(event.target.value);

    console.log("event start time in UTC: ");
    console.log(
      momentTZ.tz(new Date(selectedStartDate), "UTC").format("YYYYMMDD HH:mm z")
    );
  };

  const handleSubmit = async () => {
    if (linkUnavailable) {
      setModalText(
        "The link you've chosen is currently in use. Please choose another one."
      );
      setOpenModal(true);
      return null;
    }
    if (!eventTitle) {
      setModalText("Please enter a title.");
      setOpenModal(true);
      return null;
    }
    if (!eventLink) {
      setModalText("Please enter a link name.");
      setOpenModal(true);
      return null;
    }
    if (!eventCat) {
      setModalText("Please select a category.");
      setOpenModal(true);
      return null;
    }

    if (selectedEndDate < selectedStartDate) {
      setModalText("End Date must be after Start Date.");
      setOpenModal(true);
      return null;
    }
    // If the date is not changed by material UI. It's still formatted as a string so we need to convert it to a date object
    const startDate =
      typeof selectedStartDate === "string"
        ? new Date(selectedStartDate)
        : selectedStartDate;
    const endDate =
      typeof selectedEndDate === "string"
        ? new Date(selectedEndDate)
        : selectedEndDate;

    setIsloading(true);
    let response = false;

    if (props.isEventUpdate) {
      response = await props.updateEvent(
        eventTitle,
        eventLink,
        eventCat,
        startDate,
        endDate,
        eventTimeZone,
        color
      );
    } else {
      response = await props.createEvent(
        eventTitle,
        eventLink,
        eventCat,
        startDate,
        endDate,
        eventTimeZone,
        color
      );
    }
    setIsloading(false);

    if (response) props.history.push("/design/event");
  };

  if (isLoading && !props.isEventUpdate) {
    return (
      <div className="form-box shadow-border">
        <p>Hang tight! We are building your event.</p>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <AlertModal
        open={openModal}
        onClose={closeModal}
        onContinue={closeModal}
        text={modalText}
        closeText="Cancel"
        continueText="OK"
      />
      <h1 className="title">My Event Details</h1>
      <div className="form-box shadow-border event-details-box">
        <FormControl variant="outlined" className={classes.formControl}>
          {/* Event Title */}
          <TextField
            id="title"
            label="Event Title"
            variant="outlined"
            value={eventTitle}
            onChange={handleChangeEventTitle}
          />
        </FormControl>
        <Tooltip title="Please note. This link can not be changed once it's created.">
          <FormControl variant="outlined" className={classes.formControl}>
            {/* Event Link */}
            <TextField
              id="event-link"
              label="Event Link"
              variant="outlined"
              placeholder="myevent"
              value={eventLink}
              onChange={handleChangeEventLink}
              onBlur={handleChangeEventLinkBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">.eventscape.io</InputAdornment>
                ),
              }}
              error={linkUnavailable}
              helperText={linkHelperText}
              disabled={props.isEventUpdate}
            />
          </FormControl>
        </Tooltip>

        <FormControl variant="outlined" className={classes.formControl}>
          {/* Category */}
          <InputLabel id="event-cat" className="mui-select-css-fix">
            Category
          </InputLabel>
          <Select
            labelId="event-cat"
            id="event-cat-select"
            required="true"
            value={eventCat}
            onChange={handleChangeEventCat}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            <MenuItem value={"business_professional"}>
              Business & Professional
            </MenuItem>
            <MenuItem value={"charity_causes"}>Charity & Causes</MenuItem>
            <MenuItem value={"education"}>Education</MenuItem>
            <MenuItem value={"fashion"}>Fashion</MenuItem>
            <MenuItem value={"government_politics"}>
              Government & Politics
            </MenuItem>
            <MenuItem value={"music"}>Music</MenuItem>
            <MenuItem value={"performing_visual_arts"}>
              Performing & Visual Arts
            </MenuItem>
            <MenuItem value={"religion_spirituality"}>
              Religion & Spirituality
            </MenuItem>
            <MenuItem value={"other"}>Other</MenuItem>
          </Select>
        </FormControl>
        <br></br>
        <br></br>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {/* Start Date & Time */}
          <Grid container spacing={0}>
            <Grid item xs={6} id="date-time-container">
              <div id="date-left">
                <FormControl variant="outlined" className={classes.formControl}>
                  <KeyboardDatePicker
                    label="Start Date"
                    disableToolbar
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    margin="none"
                    id="event-start-date"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6} id="date-time-container">
              <div id="date-right">
                <FormControl variant="outlined" className={classes.formControl}>
                  <KeyboardTimePicker
                    label="Start Time"
                    margin="none"
                    id="event-start-time"
                    inputVariant="outlined"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </FormControl>
              </div>
            </Grid>
          </Grid>

          {/* End Date & Time */}
          <Grid container spacing={0}>
            <Grid item xs={6} id="date-time-container">
              <div id="date-left">
                <FormControl variant="outlined" className={classes.formControl}>
                  <KeyboardDatePicker
                    label="End Date"
                    disableToolbar
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    margin="none"
                    id="event-end-date"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6} id="date-time-container">
              <div id="date-right">
                <FormControl variant="outlined" className={classes.formControl}>
                  <KeyboardTimePicker
                    label="End Time"
                    margin="none"
                    id="event-end-time"
                    inputVariant="outlined"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </FormControl>
              </div>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>

        <FormControl variant="outlined" className={classes.formControl}>
          {/* Time Zone */}
          <InputLabel id="event-time-zone" className="mui-select-css-fix">
            Time Zone
          </InputLabel>
          <Select
            labelId="event-time-zone"
            id="event-time-zone-select"
            required="true"
            value={eventTimeZone}
            onChange={handleChangeTimeZone}
          >
            <MenuItem value={"Africa/Abidjan"}>Africa/Abidjan</MenuItem>
            <MenuItem value={"Africa/Accra"}>Africa/Accra</MenuItem>
            <MenuItem value={"Africa/Addis_Ababa"}>Africa/Addis_Ababa</MenuItem>
            <MenuItem value={"Africa/Algiers"}>Africa/Algiers</MenuItem>
            <MenuItem value={"Africa/Asmara"}>Africa/Asmara</MenuItem>
            <MenuItem value={"Africa/Bamako"}>Africa/Bamako</MenuItem>
            <MenuItem value={"Africa/Bangui"}>Africa/Bangui</MenuItem>
            <MenuItem value={"Africa/Banjul"}>Africa/Banjul</MenuItem>
            <MenuItem value={"Africa/Bissau"}>Africa/Bissau</MenuItem>
            <MenuItem value={"Africa/Blantyre"}>Africa/Blantyre</MenuItem>
            <MenuItem value={"Africa/Brazzaville"}>Africa/Brazzaville</MenuItem>
            <MenuItem value={"Africa/Bujumbura"}>Africa/Bujumbura</MenuItem>
            <MenuItem value={"Africa/Cairo"}>Africa/Cairo</MenuItem>
            <MenuItem value={"Africa/Casablanca"}>Africa/Casablanca</MenuItem>
            <MenuItem value={"Africa/Ceuta"}>Africa/Ceuta</MenuItem>
            <MenuItem value={"Africa/Conakry"}>Africa/Conakry</MenuItem>
            <MenuItem value={"Africa/Dakar"}>Africa/Dakar</MenuItem>
            <MenuItem value={"Africa/Dar_es_Salaam"}>
              Africa/Dar_es_Salaam
            </MenuItem>
            <MenuItem value={"Africa/Djibouti"}>Africa/Djibouti</MenuItem>
            <MenuItem value={"Africa/Douala"}>Africa/Douala</MenuItem>
            <MenuItem value={"Africa/El_Aaiun"}>Africa/El_Aaiun</MenuItem>
            <MenuItem value={"Africa/Freetown"}>Africa/Freetown</MenuItem>
            <MenuItem value={"Africa/Gaborone"}>Africa/Gaborone</MenuItem>
            <MenuItem value={"Africa/Harare"}>Africa/Harare</MenuItem>
            <MenuItem value={"Africa/Johannesburg"}>
              Africa/Johannesburg
            </MenuItem>
            <MenuItem value={"Africa/Juba"}>Africa/Juba</MenuItem>
            <MenuItem value={"Africa/Kampala"}>Africa/Kampala</MenuItem>
            <MenuItem value={"Africa/Khartoum"}>Africa/Khartoum</MenuItem>
            <MenuItem value={"Africa/Kigali"}>Africa/Kigali</MenuItem>
            <MenuItem value={"Africa/Kinshasa"}>Africa/Kinshasa</MenuItem>
            <MenuItem value={"Africa/Lagos"}>Africa/Lagos</MenuItem>
            <MenuItem value={"Africa/Libreville"}>Africa/Libreville</MenuItem>
            <MenuItem value={"Africa/Lome"}>Africa/Lome</MenuItem>
            <MenuItem value={"Africa/Luanda"}>Africa/Luanda</MenuItem>
            <MenuItem value={"Africa/Lubumbashi"}>Africa/Lubumbashi</MenuItem>
            <MenuItem value={"Africa/Lusaka"}>Africa/Lusaka</MenuItem>
            <MenuItem value={"Africa/Malabo"}>Africa/Malabo</MenuItem>
            <MenuItem value={"Africa/Maputo"}>Africa/Maputo</MenuItem>
            <MenuItem value={"Africa/Maseru"}>Africa/Maseru</MenuItem>
            <MenuItem value={"Africa/Mbabane"}>Africa/Mbabane</MenuItem>
            <MenuItem value={"Africa/Mogadishu"}>Africa/Mogadishu</MenuItem>
            <MenuItem value={"Africa/Monrovia"}>Africa/Monrovia</MenuItem>
            <MenuItem value={"Africa/Nairobi"}>Africa/Nairobi</MenuItem>
            <MenuItem value={"Africa/Ndjamena"}>Africa/Ndjamena</MenuItem>
            <MenuItem value={"Africa/Niamey"}>Africa/Niamey</MenuItem>
            <MenuItem value={"Africa/Nouakchott"}>Africa/Nouakchott</MenuItem>
            <MenuItem value={"Africa/Ouagadougou"}>Africa/Ouagadougou</MenuItem>
            <MenuItem value={"Africa/Porto-Novo"}>Africa/Porto-Novo</MenuItem>
            <MenuItem value={"Africa/Sao_Tome"}>Africa/Sao_Tome</MenuItem>
            <MenuItem value={"Africa/Tripoli"}>Africa/Tripoli</MenuItem>
            <MenuItem value={"Africa/Tunis"}>Africa/Tunis</MenuItem>
            <MenuItem value={"Africa/Windhoek"}>Africa/Windhoek</MenuItem>
            <MenuItem value={"America/Adak"}>America/Adak</MenuItem>
            <MenuItem value={"America/Anchorage"}>America/Anchorage</MenuItem>
            <MenuItem value={"America/Anguilla"}>America/Anguilla</MenuItem>
            <MenuItem value={"America/Antigua"}>America/Antigua</MenuItem>
            <MenuItem value={"America/Araguaina"}>America/Araguaina</MenuItem>
            <MenuItem value={"America/Argentina/Catamarca"}>
              America/Argentina/Catamarca
            </MenuItem>
            <MenuItem value={"America/Argentina/ComodRivadavia"}>
              America/Argentina/ComodRivadavia
            </MenuItem>
            <MenuItem value={"America/Argentina/Cordoba"}>
              America/Argentina/Cordoba
            </MenuItem>
            <MenuItem value={"America/Argentina/Jujuy"}>
              America/Argentina/Jujuy
            </MenuItem>
            <MenuItem value={"America/Argentina/La_Rioja"}>
              America/Argentina/La_Rioja
            </MenuItem>
            <MenuItem value={"America/Argentina/Mendoza"}>
              America/Argentina/Mendoza
            </MenuItem>
            <MenuItem value={"America/Argentina/Rio_Gallegos"}>
              America/Argentina/Rio_Gallegos
            </MenuItem>
            <MenuItem value={"America/Argentina/Salta"}>
              America/Argentina/Salta
            </MenuItem>
            <MenuItem value={"America/Argentina/San_Juan"}>
              America/Argentina/San_Juan
            </MenuItem>
            <MenuItem value={"America/Argentina/San_Luis"}>
              America/Argentina/San_Luis
            </MenuItem>
            <MenuItem value={"America/Argentina/Tucuman"}>
              America/Argentina/Tucuman
            </MenuItem>
            <MenuItem value={"America/Argentina/Ushuaia"}>
              America/Argentina/Ushuaia
            </MenuItem>
            <MenuItem value={"America/Aruba"}>America/Aruba</MenuItem>
            <MenuItem value={"America/Asuncion"}>America/Asuncion</MenuItem>
            <MenuItem value={"America/Atikokan"}>Canada/Atikokan</MenuItem>
            <MenuItem value={"America/Bahia"}>America/Bahia</MenuItem>
            <MenuItem value={"America/Bahia_Banderas"}>
              America/Bahia_Banderas
            </MenuItem>
            <MenuItem value={"America/Barbados"}>America/Barbados</MenuItem>
            <MenuItem value={"America/Belem"}>America/Belem</MenuItem>
            <MenuItem value={"America/Belize"}>America/Belize</MenuItem>
            <MenuItem value={"America/Blanc-Sablon"}>
              Canada/Blanc-Sablon
            </MenuItem>
            <MenuItem value={"America/Boa_Vista"}>America/Boa_Vista</MenuItem>
            <MenuItem value={"America/Bogota"}>America/Bogota</MenuItem>
            <MenuItem value={"America/Boise"}>America/Boise</MenuItem>
            <MenuItem value={"America/Cambridge_Bay"}>
              Canada/Cambridge_Bay
            </MenuItem>
            <MenuItem value={"America/Campo_Grande"}>
              America/Campo_Grande
            </MenuItem>
            <MenuItem value={"America/Cancun"}>America/Cancun</MenuItem>
            <MenuItem value={"America/Caracas"}>America/Caracas</MenuItem>
            <MenuItem value={"America/Cayenne"}>America/Cayenne</MenuItem>
            <MenuItem value={"America/Cayman"}>America/Cayman</MenuItem>
            <MenuItem value={"America/Chicago"}>America/Chicago</MenuItem>
            <MenuItem value={"America/Chihuahua"}>America/Chihuahua</MenuItem>
            <MenuItem value={"America/Costa_Rica"}>America/Costa_Rica</MenuItem>
            <MenuItem value={"America/Creston"}>Canada/Creston</MenuItem>
            <MenuItem value={"America/Cuiaba"}>America/Cuiaba</MenuItem>
            <MenuItem value={"America/Curacao"}>America/Curacao</MenuItem>
            <MenuItem value={"America/Danmarkshavn"}>
              America/Danmarkshavn
            </MenuItem>
            <MenuItem value={"America/Dawson"}>Canada/Dawson</MenuItem>
            <MenuItem value={"America/Dawson_Creek"}>
              Canada/Dawson_Creek
            </MenuItem>
            <MenuItem value={"America/Denver"}>America/Denver</MenuItem>
            <MenuItem value={"America/Detroit"}>America/Detroit</MenuItem>
            <MenuItem value={"America/Dominica"}>America/Dominica</MenuItem>
            <MenuItem value={"America/Edmonton"}>Canada/Edmonton</MenuItem>
            <MenuItem value={"America/Eirunepe"}>America/Eirunepe</MenuItem>
            <MenuItem value={"America/El_Salvador"}>
              America/El_Salvador
            </MenuItem>
            <MenuItem value={"America/Fort_Nelson"}>
              Canada/Fort_Nelson
            </MenuItem>
            <MenuItem value={"America/Fortaleza"}>America/Fortaleza</MenuItem>
            <MenuItem value={"America/Glace_Bay"}>Canada/Glace_Bay</MenuItem>
            <MenuItem value={"America/Goose_Bay"}>Canada/Goose_Bay</MenuItem>
            <MenuItem value={"America/Grand_Turk"}>America/Grand_Turk</MenuItem>
            <MenuItem value={"America/Grenada"}>America/Grenada</MenuItem>
            <MenuItem value={"America/Guadeloupe"}>America/Guadeloupe</MenuItem>
            <MenuItem value={"America/Guatemala"}>America/Guatemala</MenuItem>
            <MenuItem value={"America/Guayaquil"}>America/Guayaquil</MenuItem>
            <MenuItem value={"America/Guyana"}>America/Guyana</MenuItem>
            <MenuItem value={"America/Halifax"}>Canada/Halifax</MenuItem>
            <MenuItem value={"America/Havana"}>America/Havana</MenuItem>
            <MenuItem value={"America/Hermosillo"}>America/Hermosillo</MenuItem>
            <MenuItem value={"America/Indiana/Knox"}>
              America/Indiana/Knox
            </MenuItem>
            <MenuItem value={"America/Indiana/Marengo"}>
              America/Indiana/Marengo
            </MenuItem>
            <MenuItem value={"America/Indiana/Petersburg"}>
              America/Indiana/Petersburg
            </MenuItem>
            <MenuItem value={"America/Indiana/Tell_City"}>
              America/Indiana/Tell_City
            </MenuItem>
            <MenuItem value={"America/Indiana/Vevay"}>
              America/Indiana/Vevay
            </MenuItem>
            <MenuItem value={"America/Indiana/Vincennes"}>
              America/Indiana/Vincennes
            </MenuItem>
            <MenuItem value={"America/Indiana/Winamac"}>
              America/Indiana/Winamac
            </MenuItem>
            <MenuItem value={"America/Indianapolis"}>
              America/Indianapolis
            </MenuItem>
            <MenuItem value={"America/Inuvik"}>Canada/Inuvik</MenuItem>
            <MenuItem value={"America/Iqaluit"}>America/Iqaluit</MenuItem>
            <MenuItem value={"America/Jamaica"}>America/Jamaica</MenuItem>
            <MenuItem value={"America/Juneau"}>America/Juneau</MenuItem>
            <MenuItem value={"America/Kentucky/Louisville"}>
              America/Kentucky/Louisville
            </MenuItem>
            <MenuItem value={"America/Kentucky/Monticello"}>
              America/Kentucky/Monticello
            </MenuItem>
            <MenuItem value={"America/Kralendijk"}>America/Kralendijk</MenuItem>
            <MenuItem value={"America/La_Paz"}>America/La_Paz</MenuItem>
            <MenuItem value={"America/Lima"}>America/Lima</MenuItem>
            <MenuItem value={"America/Los_Angeles"}>
              America/Los_Angeles
            </MenuItem>
            <MenuItem value={"America/Lower_Princes"}>
              America/Lower_Princes
            </MenuItem>
            <MenuItem value={"America/Maceio"}>America/Maceio</MenuItem>
            <MenuItem value={"America/Managua"}>America/Managua</MenuItem>
            <MenuItem value={"America/Manaus"}>America/Manaus</MenuItem>
            <MenuItem value={"America/Marigot"}>America/Marigot</MenuItem>
            <MenuItem value={"America/Martinique"}>America/Martinique</MenuItem>
            <MenuItem value={"America/Matamoros"}>America/Matamoros</MenuItem>
            <MenuItem value={"America/Mazatlan"}>America/Mazatlan</MenuItem>
            <MenuItem value={"America/Menominee"}>America/Menominee</MenuItem>
            <MenuItem value={"America/Merida"}>America/Merida</MenuItem>
            <MenuItem value={"America/Metlakatla"}>America/Metlakatla</MenuItem>
            <MenuItem value={"America/Mexico_City"}>
              America/Mexico_City
            </MenuItem>
            <MenuItem value={"America/Miquelon"}>America/Miquelon</MenuItem>
            <MenuItem value={"America/Moncton"}>Canada/Moncton</MenuItem>
            <MenuItem value={"America/Monterrey"}>America/Monterrey</MenuItem>
            <MenuItem value={"America/Montevideo"}>America/Montevideo</MenuItem>
            <MenuItem value={"America/Montserrat"}>America/Montserrat</MenuItem>
            <MenuItem value={"America/Nassau"}>America/Nassau</MenuItem>
            <MenuItem value={"America/New_York"}>America/New_York</MenuItem>
            <MenuItem value={"America/Nipigon"}>Canada/Nipigon</MenuItem>
            <MenuItem value={"America/Nome"}>America/Nome</MenuItem>
            <MenuItem value={"America/Noronha"}>America/Noronha</MenuItem>
            <MenuItem value={"America/North_Dakota/Beulah"}>
              America/North_Dakota/Beulah
            </MenuItem>
            <MenuItem value={"America/North_Dakota/Center"}>
              America/North_Dakota/Center
            </MenuItem>
            <MenuItem value={"America/North_Dakota/New_Salem"}>
              America/North_Dakota/New_Salem
            </MenuItem>
            <MenuItem value={"America/Nuuk"}>America/Nuuk</MenuItem>
            <MenuItem value={"America/Ojinaga"}>America/Ojinaga</MenuItem>
            <MenuItem value={"America/Panama"}>America/Panama</MenuItem>
            <MenuItem value={"America/Pangnirtung"}>
              Canada/Pangnirtung
            </MenuItem>
            <MenuItem value={"America/Paramaribo"}>America/Paramaribo</MenuItem>
            <MenuItem value={"America/Phoenix"}>America/Phoenix</MenuItem>
            <MenuItem value={"America/Port-au-Prince"}>
              America/Port-au-Prince
            </MenuItem>
            <MenuItem value={"America/Port_of_Spain"}>
              America/Port_of_Spain
            </MenuItem>
            <MenuItem value={"America/Porto_Velho"}>
              America/Porto_Velho
            </MenuItem>
            <MenuItem value={"America/Puerto_Rico"}>
              America/Puerto_Rico
            </MenuItem>
            <MenuItem value={"America/Punta_Arenas"}>
              America/Punta_Arenas
            </MenuItem>
            <MenuItem value={"America/Rainy_River"}>
              Canada/Rainy_River
            </MenuItem>
            <MenuItem value={"America/Rankin_Inlet"}>
              Canada/Rankin_Inlet
            </MenuItem>
            <MenuItem value={"America/Recife"}>America/Recife</MenuItem>
            <MenuItem value={"America/Regina"}>Canada/Regina</MenuItem>
            <MenuItem value={"America/Resolute"}>Canada/Resolute</MenuItem>
            <MenuItem value={"America/Rio_Branco"}>America/Rio_Branco</MenuItem>
            <MenuItem value={"America/Santarem"}>America/Santarem</MenuItem>
            <MenuItem value={"America/Santiago"}>America/Santiago</MenuItem>
            <MenuItem value={"America/Santo_Domingo"}>
              America/Santo_Domingo
            </MenuItem>
            <MenuItem value={"America/Sao_Paulo"}>America/Sao_Paulo</MenuItem>
            <MenuItem value={"America/Scoresbysund"}>
              America/Scoresbysund
            </MenuItem>
            <MenuItem value={"America/Sitka"}>America/Sitka</MenuItem>
            <MenuItem value={"America/St_Barthelemy"}>
              America/St_Barthelemy
            </MenuItem>
            <MenuItem value={"America/St_Johns"}>Canada/St_Johns</MenuItem>
            <MenuItem value={"America/St_Kitts"}>America/St_Kitts</MenuItem>
            <MenuItem value={"America/St_Lucia"}>America/St_Lucia</MenuItem>
            <MenuItem value={"America/St_Thomas"}>America/St_Thomas</MenuItem>
            <MenuItem value={"America/St_Vincent"}>America/St_Vincent</MenuItem>
            <MenuItem value={"America/Swift_Current"}>
              Canada/Swift_Current
            </MenuItem>
            <MenuItem value={"America/Tegucigalpa"}>
              America/Tegucigalpa
            </MenuItem>
            <MenuItem value={"America/Thule"}>America/Thule</MenuItem>
            <MenuItem value={"America/Thunder_Bay"}>
              Canada/Thunder_Bay
            </MenuItem>
            <MenuItem value={"America/Tijuana"}>America/Tijuana</MenuItem>
            <MenuItem value={"America/Toronto"}>Canada/Toronto</MenuItem>
            <MenuItem value={"America/Tortola"}>America/Tortola</MenuItem>
            <MenuItem value={"America/Vancouver"}>Canada/Vancouver</MenuItem>
            <MenuItem value={"America/Whitehorse"}>Canada/Whitehorse</MenuItem>
            <MenuItem value={"America/Winnipeg"}>Canada/Winnipeg</MenuItem>
            <MenuItem value={"America/Yakutat"}>America/Yakutat</MenuItem>
            <MenuItem value={"America/Yellowknife"}>
              Canada/Yellowknife
            </MenuItem>
            <MenuItem value={"Antarctica/Casey"}>Antarctica/Casey</MenuItem>
            <MenuItem value={"Antarctica/Davis"}>Antarctica/Davis</MenuItem>
            <MenuItem value={"Antarctica/DumontDUrville"}>
              Antarctica/DumontDUrville
            </MenuItem>
            <MenuItem value={"Antarctica/Macquarie"}>
              Antarctica/Macquarie
            </MenuItem>
            <MenuItem value={"Antarctica/Mawson"}>Antarctica/Mawson</MenuItem>
            <MenuItem value={"Antarctica/McMurdo"}>Antarctica/McMurdo</MenuItem>
            <MenuItem value={"Antarctica/Palmer"}>Antarctica/Palmer</MenuItem>
            <MenuItem value={"Antarctica/Rothera"}>Antarctica/Rothera</MenuItem>
            <MenuItem value={"Antarctica/Syowa"}>Antarctica/Syowa</MenuItem>
            <MenuItem value={"Antarctica/Troll"}>Antarctica/Troll</MenuItem>
            <MenuItem value={"Antarctica/Vostok"}>Antarctica/Vostok</MenuItem>
            <MenuItem value={"Arctic/Longyearbyen"}>
              Arctic/Longyearbyen
            </MenuItem>
            <MenuItem value={"Asia/Aden"}>Asia/Aden</MenuItem>
            <MenuItem value={"Asia/Almaty"}>Asia/Almaty</MenuItem>
            <MenuItem value={"Asia/Amman"}>Asia/Amman</MenuItem>
            <MenuItem value={"Asia/Anadyr"}>Asia/Anadyr</MenuItem>
            <MenuItem value={"Asia/Aqtau"}>Asia/Aqtau</MenuItem>
            <MenuItem value={"Asia/Aqtobe"}>Asia/Aqtobe</MenuItem>
            <MenuItem value={"Asia/Ashgabat"}>Asia/Ashgabat</MenuItem>
            <MenuItem value={"Asia/Atyrau"}>Asia/Atyrau</MenuItem>
            <MenuItem value={"Asia/Baghdad"}>Asia/Baghdad</MenuItem>
            <MenuItem value={"Asia/Bahrain"}>Asia/Bahrain</MenuItem>
            <MenuItem value={"Asia/Baku"}>Asia/Baku</MenuItem>
            <MenuItem value={"Asia/Bangkok"}>Asia/Bangkok</MenuItem>
            <MenuItem value={"Asia/Barnaul"}>Asia/Barnaul</MenuItem>
            <MenuItem value={"Asia/Beirut"}>Asia/Beirut</MenuItem>
            <MenuItem value={"Asia/Bishkek"}>Asia/Bishkek</MenuItem>
            <MenuItem value={"Asia/Brunei"}>Asia/Brunei</MenuItem>
            <MenuItem value={"Asia/Chita"}>Asia/Chita</MenuItem>
            <MenuItem value={"Asia/Choibalsan"}>Asia/Choibalsan</MenuItem>
            <MenuItem value={"Asia/Colombo"}>Asia/Colombo</MenuItem>
            <MenuItem value={"Asia/Damascus"}>Asia/Damascus</MenuItem>
            <MenuItem value={"Asia/Dhaka"}>Asia/Dhaka</MenuItem>
            <MenuItem value={"Asia/Dili"}>Asia/Dili</MenuItem>
            <MenuItem value={"Asia/Dubai"}>Asia/Dubai</MenuItem>
            <MenuItem value={"Asia/Dushanbe"}>Asia/Dushanbe</MenuItem>
            <MenuItem value={"Asia/Famagusta"}>Asia/Famagusta</MenuItem>
            <MenuItem value={"Asia/Gaza"}>Asia/Gaza</MenuItem>
            <MenuItem value={"Asia/Hebron"}>Asia/Hebron</MenuItem>
            <MenuItem value={"Asia/Ho_Chi_Minh"}>Asia/Ho_Chi_Minh</MenuItem>
            <MenuItem value={"Asia/Hong_Kong"}>Asia/Hong_Kong</MenuItem>
            <MenuItem value={"Asia/Hovd"}>Asia/Hovd</MenuItem>
            <MenuItem value={"Asia/Irkutsk"}>Asia/Irkutsk</MenuItem>
            <MenuItem value={"Asia/Istanbul"}>Asia/Istanbul</MenuItem>
            <MenuItem value={"Asia/Jakarta"}>Asia/Jakarta</MenuItem>
            <MenuItem value={"Asia/Jayapura"}>Asia/Jayapura</MenuItem>
            <MenuItem value={"Asia/Jerusalem"}>Asia/Jerusalem</MenuItem>
            <MenuItem value={"Asia/Kabul"}>Asia/Kabul</MenuItem>
            <MenuItem value={"Asia/Kamchatka"}>Asia/Kamchatka</MenuItem>
            <MenuItem value={"Asia/Karachi"}>Asia/Karachi</MenuItem>
            <MenuItem value={"Asia/Kathmandu"}>Asia/Kathmandu</MenuItem>
            <MenuItem value={"Asia/Khandyga"}>Asia/Khandyga</MenuItem>
            <MenuItem value={"Asia/Kolkata"}>Asia/Kolkata</MenuItem>
            <MenuItem value={"Asia/Krasnoyarsk"}>Asia/Krasnoyarsk</MenuItem>
            <MenuItem value={"Asia/Kuala_Lumpur"}>Asia/Kuala_Lumpur</MenuItem>
            <MenuItem value={"Asia/Kuching"}>Asia/Kuching</MenuItem>
            <MenuItem value={"Asia/Kuwait"}>Asia/Kuwait</MenuItem>
            <MenuItem value={"Asia/Macau"}>Asia/Macau</MenuItem>
            <MenuItem value={"Asia/Magadan"}>Asia/Magadan</MenuItem>
            <MenuItem value={"Asia/Makassar"}>Asia/Makassar</MenuItem>
            <MenuItem value={"Asia/Manila"}>Asia/Manila</MenuItem>
            <MenuItem value={"Asia/Muscat"}>Asia/Muscat</MenuItem>
            <MenuItem value={"Asia/Nicosia"}>Asia/Nicosia</MenuItem>
            <MenuItem value={"Asia/Novokuznetsk"}>Asia/Novokuznetsk</MenuItem>
            <MenuItem value={"Asia/Novosibirsk"}>Asia/Novosibirsk</MenuItem>
            <MenuItem value={"Asia/Omsk"}>Asia/Omsk</MenuItem>
            <MenuItem value={"Asia/Oral"}>Asia/Oral</MenuItem>
            <MenuItem value={"Asia/Phnom_Penh"}>Asia/Phnom_Penh</MenuItem>
            <MenuItem value={"Asia/Pontianak"}>Asia/Pontianak</MenuItem>
            <MenuItem value={"Asia/Pyongyang"}>Asia/Pyongyang</MenuItem>
            <MenuItem value={"Asia/Qatar"}>Asia/Qatar</MenuItem>
            <MenuItem value={"Asia/Qostanay"}>Asia/Qostanay</MenuItem>
            <MenuItem value={"Asia/Qyzylorda"}>Asia/Qyzylorda</MenuItem>
            <MenuItem value={"Asia/Riyadh"}>Asia/Riyadh</MenuItem>
            <MenuItem value={"Asia/Sakhalin"}>Asia/Sakhalin</MenuItem>
            <MenuItem value={"Asia/Samarkand"}>Asia/Samarkand</MenuItem>
            <MenuItem value={"Asia/Seoul"}>Asia/Seoul</MenuItem>
            <MenuItem value={"Asia/Shanghai"}>Asia/Shanghai</MenuItem>
            <MenuItem value={"Asia/Singapore"}>Asia/Singapore</MenuItem>
            <MenuItem value={"Asia/Srednekolymsk"}>Asia/Srednekolymsk</MenuItem>
            <MenuItem value={"Asia/Taipei"}>Asia/Taipei</MenuItem>
            <MenuItem value={"Asia/Tashkent"}>Asia/Tashkent</MenuItem>
            <MenuItem value={"Asia/Tbilisi"}>Asia/Tbilisi</MenuItem>
            <MenuItem value={"Asia/Tehran"}>Asia/Tehran</MenuItem>
            <MenuItem value={"Asia/Thimphu"}>Asia/Thimphu</MenuItem>
            <MenuItem value={"Asia/Tokyo"}>Asia/Tokyo</MenuItem>
            <MenuItem value={"Asia/Tomsk"}>Asia/Tomsk</MenuItem>
            <MenuItem value={"Asia/Ulaanbaatar"}>Asia/Ulaanbaatar</MenuItem>
            <MenuItem value={"Asia/Urumqi"}>Asia/Urumqi</MenuItem>
            <MenuItem value={"Asia/Ust-Nera"}>Asia/Ust-Nera</MenuItem>
            <MenuItem value={"Asia/Vientiane"}>Asia/Vientiane</MenuItem>
            <MenuItem value={"Asia/Vladivostok"}>Asia/Vladivostok</MenuItem>
            <MenuItem value={"Asia/Yakutsk"}>Asia/Yakutsk</MenuItem>
            <MenuItem value={"Asia/Yangon"}>Asia/Yangon</MenuItem>
            <MenuItem value={"Asia/Yekaterinburg"}>Asia/Yekaterinburg</MenuItem>
            <MenuItem value={"Asia/Yerevan"}>Asia/Yerevan</MenuItem>
            <MenuItem value={"Atlantic/Azores"}>Atlantic/Azores</MenuItem>
            <MenuItem value={"Atlantic/Bermuda"}>Atlantic/Bermuda</MenuItem>
            <MenuItem value={"Atlantic/Canary"}>Atlantic/Canary</MenuItem>
            <MenuItem value={"Atlantic/Cape_Verde"}>
              Atlantic/Cape_Verde
            </MenuItem>
            <MenuItem value={"Atlantic/Faroe"}>Atlantic/Faroe</MenuItem>
            <MenuItem value={"Atlantic/Madeira"}>Atlantic/Madeira</MenuItem>
            <MenuItem value={"Atlantic/Reykjavik"}>Atlantic/Reykjavik</MenuItem>
            <MenuItem value={"Atlantic/South_Georgia"}>
              Atlantic/South_Georgia
            </MenuItem>
            <MenuItem value={"Atlantic/St_Helena"}>Atlantic/St_Helena</MenuItem>
            <MenuItem value={"Atlantic/Stanley"}>Atlantic/Stanley</MenuItem>
            <MenuItem value={"Australia/Adelaide"}>Australia/Adelaide</MenuItem>
            <MenuItem value={"Australia/Brisbane"}>Australia/Brisbane</MenuItem>
            <MenuItem value={"Australia/Broken_Hill"}>
              Australia/Broken_Hill
            </MenuItem>
            <MenuItem value={"Australia/Currie"}>Australia/Currie</MenuItem>
            <MenuItem value={"Australia/Darwin"}>Australia/Darwin</MenuItem>
            <MenuItem value={"Australia/Eucla"}>Australia/Eucla</MenuItem>
            <MenuItem value={"Australia/Hobart"}>Australia/Hobart</MenuItem>
            <MenuItem value={"Australia/Lindeman"}>Australia/Lindeman</MenuItem>
            <MenuItem value={"Australia/Lord_Howe"}>
              Australia/Lord_Howe
            </MenuItem>
            <MenuItem value={"Australia/Melbourne"}>
              Australia/Melbourne
            </MenuItem>
            <MenuItem value={"Australia/Perth"}>Australia/Perth</MenuItem>
            <MenuItem value={"Australia/Sydney"}>Australia/Sydney</MenuItem>
            <MenuItem value={"Etc/GMT"}>Etc/GMT</MenuItem>
            <MenuItem value={"Etc/GMT+0"}>Etc/GMT+0</MenuItem>
            <MenuItem value={"Etc/GMT+1"}>Etc/GMT+1</MenuItem>
            <MenuItem value={"Etc/GMT+10"}>Etc/GMT+10</MenuItem>
            <MenuItem value={"Etc/GMT+11"}>Etc/GMT+11</MenuItem>
            <MenuItem value={"Etc/GMT+12"}>Etc/GMT+12</MenuItem>
            <MenuItem value={"Etc/GMT+2"}>Etc/GMT+2</MenuItem>
            <MenuItem value={"Etc/GMT+3"}>Etc/GMT+3</MenuItem>
            <MenuItem value={"Etc/GMT+4"}>Etc/GMT+4</MenuItem>
            <MenuItem value={"Etc/GMT+5"}>Etc/GMT+5</MenuItem>
            <MenuItem value={"Etc/GMT+6"}>Etc/GMT+6</MenuItem>
            <MenuItem value={"Etc/GMT+7"}>Etc/GMT+7</MenuItem>
            <MenuItem value={"Etc/GMT+8"}>Etc/GMT+8</MenuItem>
            <MenuItem value={"Etc/GMT+9"}>Etc/GMT+9</MenuItem>
            <MenuItem value={"Etc/GMT-0"}>Etc/GMT-0</MenuItem>
            <MenuItem value={"Etc/GMT-1"}>Etc/GMT-1</MenuItem>
            <MenuItem value={"Etc/GMT-10"}>Etc/GMT-10</MenuItem>
            <MenuItem value={"Etc/GMT-11"}>Etc/GMT-11</MenuItem>
            <MenuItem value={"Etc/GMT-12"}>Etc/GMT-12</MenuItem>
            <MenuItem value={"Etc/GMT-13"}>Etc/GMT-13</MenuItem>
            <MenuItem value={"Etc/GMT-14"}>Etc/GMT-14</MenuItem>
            <MenuItem value={"Etc/GMT-2"}>Etc/GMT-2</MenuItem>
            <MenuItem value={"Etc/GMT-3"}>Etc/GMT-3</MenuItem>
            <MenuItem value={"Etc/GMT-4"}>Etc/GMT-4</MenuItem>
            <MenuItem value={"Etc/GMT-5"}>Etc/GMT-5</MenuItem>
            <MenuItem value={"Etc/GMT-6"}>Etc/GMT-6</MenuItem>
            <MenuItem value={"Etc/GMT-7"}>Etc/GMT-7</MenuItem>
            <MenuItem value={"Etc/GMT-8"}>Etc/GMT-8</MenuItem>
            <MenuItem value={"Etc/GMT-9"}>Etc/GMT-9</MenuItem>
            <MenuItem value={"Etc/GMT0"}>Etc/GMT0</MenuItem>
            <MenuItem value={"Etc/UCT"}>Etc/UCT</MenuItem>
            <MenuItem value={"Europe/Amsterdam"}>Europe/Amsterdam</MenuItem>
            <MenuItem value={"Europe/Andorra"}>Europe/Andorra</MenuItem>
            <MenuItem value={"Europe/Astrakhan"}>Europe/Astrakhan</MenuItem>
            <MenuItem value={"Europe/Athens"}>Europe/Athens</MenuItem>
            <MenuItem value={"Europe/Belgrade"}>Europe/Belgrade</MenuItem>
            <MenuItem value={"Europe/Berlin"}>Europe/Berlin</MenuItem>
            <MenuItem value={"Europe/Bratislava"}>Europe/Bratislava</MenuItem>
            <MenuItem value={"Europe/Brussels"}>Europe/Brussels</MenuItem>
            <MenuItem value={"Europe/Bucharest"}>Europe/Bucharest</MenuItem>
            <MenuItem value={"Europe/Budapest"}>Europe/Budapest</MenuItem>
            <MenuItem value={"Europe/Busingen"}>Europe/Busingen</MenuItem>
            <MenuItem value={"Europe/Chisinau"}>Europe/Chisinau</MenuItem>
            <MenuItem value={"Europe/Copenhagen"}>Europe/Copenhagen</MenuItem>
            <MenuItem value={"Europe/Dublin"}>Europe/Dublin</MenuItem>
            <MenuItem value={"Europe/Gibraltar"}>Europe/Gibraltar</MenuItem>
            <MenuItem value={"Europe/Guernsey"}>Europe/Guernsey</MenuItem>
            <MenuItem value={"Europe/Helsinki"}>Europe/Helsinki</MenuItem>
            <MenuItem value={"Europe/Isle_of_Man"}>Europe/Isle_of_Man</MenuItem>
            <MenuItem value={"Europe/Istanbul"}>Europe/Istanbul</MenuItem>
            <MenuItem value={"Europe/Jersey"}>Europe/Jersey</MenuItem>
            <MenuItem value={"Europe/Kaliningrad"}>Europe/Kaliningrad</MenuItem>
            <MenuItem value={"Europe/Kiev"}>Europe/Kiev</MenuItem>
            <MenuItem value={"Europe/Kirov"}>Europe/Kirov</MenuItem>
            <MenuItem value={"Europe/Lisbon"}>Europe/Lisbon</MenuItem>
            <MenuItem value={"Europe/Ljubljana"}>Europe/Ljubljana</MenuItem>
            <MenuItem value={"Europe/London"}>Europe/London</MenuItem>
            <MenuItem value={"Europe/Luxembourg"}>Europe/Luxembourg</MenuItem>
            <MenuItem value={"Europe/Madrid"}>Europe/Madrid</MenuItem>
            <MenuItem value={"Europe/Malta"}>Europe/Malta</MenuItem>
            <MenuItem value={"Europe/Mariehamn"}>Europe/Mariehamn</MenuItem>
            <MenuItem value={"Europe/Minsk"}>Europe/Minsk</MenuItem>
            <MenuItem value={"Europe/Monaco"}>Europe/Monaco</MenuItem>
            <MenuItem value={"Europe/Moscow"}>Europe/Moscow</MenuItem>
            <MenuItem value={"Europe/Nicosia"}>Europe/Nicosia</MenuItem>
            <MenuItem value={"Europe/Oslo"}>Europe/Oslo</MenuItem>
            <MenuItem value={"Europe/Paris"}>Europe/Paris</MenuItem>
            <MenuItem value={"Europe/Podgorica"}>Europe/Podgorica</MenuItem>
            <MenuItem value={"Europe/Prague"}>Europe/Prague</MenuItem>
            <MenuItem value={"Europe/Riga"}>Europe/Riga</MenuItem>
            <MenuItem value={"Europe/Rome"}>Europe/Rome</MenuItem>
            <MenuItem value={"Europe/Samara"}>Europe/Samara</MenuItem>
            <MenuItem value={"Europe/San_Marino"}>Europe/San_Marino</MenuItem>
            <MenuItem value={"Europe/Sarajevo"}>Europe/Sarajevo</MenuItem>
            <MenuItem value={"Europe/Saratov"}>Europe/Saratov</MenuItem>
            <MenuItem value={"Europe/Simferopol"}>Europe/Simferopol</MenuItem>
            <MenuItem value={"Europe/Skopje"}>Europe/Skopje</MenuItem>
            <MenuItem value={"Europe/Sofia"}>Europe/Sofia</MenuItem>
            <MenuItem value={"Europe/Stockholm"}>Europe/Stockholm</MenuItem>
            <MenuItem value={"Europe/Tallinn"}>Europe/Tallinn</MenuItem>
            <MenuItem value={"Europe/Tirane"}>Europe/Tirane</MenuItem>
            <MenuItem value={"Europe/Ulyanovsk"}>Europe/Ulyanovsk</MenuItem>
            <MenuItem value={"Europe/Uzhgorod"}>Europe/Uzhgorod</MenuItem>
            <MenuItem value={"Europe/Vaduz"}>Europe/Vaduz</MenuItem>
            <MenuItem value={"Europe/Vatican"}>Europe/Vatican</MenuItem>
            <MenuItem value={"Europe/Vienna"}>Europe/Vienna</MenuItem>
            <MenuItem value={"Europe/Vilnius"}>Europe/Vilnius</MenuItem>
            <MenuItem value={"Europe/Volgograd"}>Europe/Volgograd</MenuItem>
            <MenuItem value={"Europe/Warsaw"}>Europe/Warsaw</MenuItem>
            <MenuItem value={"Europe/Zagreb"}>Europe/Zagreb</MenuItem>
            <MenuItem value={"Europe/Zaporozhye"}>Europe/Zaporozhye</MenuItem>
            <MenuItem value={"Europe/Zurich"}>Europe/Zurich</MenuItem>
            <MenuItem value={"GMT"}>GMT</MenuItem>
            <MenuItem value={"Indian/Antananarivo"}>
              Indian/Antananarivo
            </MenuItem>
            <MenuItem value={"Indian/Chagos"}>Indian/Chagos</MenuItem>
            <MenuItem value={"Indian/Christmas"}>Indian/Christmas</MenuItem>
            <MenuItem value={"Indian/Cocos"}>Indian/Cocos</MenuItem>
            <MenuItem value={"Indian/Comoro"}>Indian/Comoro</MenuItem>
            <MenuItem value={"Indian/Kerguelen"}>Indian/Kerguelen</MenuItem>
            <MenuItem value={"Indian/Mahe"}>Indian/Mahe</MenuItem>
            <MenuItem value={"Indian/Maldives"}>Indian/Maldives</MenuItem>
            <MenuItem value={"Indian/Mauritius"}>Indian/Mauritius</MenuItem>
            <MenuItem value={"Indian/Mayotte"}>Indian/Mayotte</MenuItem>
            <MenuItem value={"Indian/Reunion"}>Indian/Reunion</MenuItem>
            <MenuItem value={"Pacific/Apia"}>Pacific/Apia</MenuItem>
            <MenuItem value={"Pacific/Auckland"}>Pacific/Auckland</MenuItem>
            <MenuItem value={"Pacific/Bougainville"}>
              Pacific/Bougainville
            </MenuItem>
            <MenuItem value={"Pacific/Chatham"}>Pacific/Chatham</MenuItem>
            <MenuItem value={"Pacific/Chuuk"}>Pacific/Chuuk</MenuItem>
            <MenuItem value={"Pacific/Easter"}>Pacific/Easter</MenuItem>
            <MenuItem value={"Pacific/Efate"}>Pacific/Efate</MenuItem>
            <MenuItem value={"Pacific/Enderbury"}>Pacific/Enderbury</MenuItem>
            <MenuItem value={"Pacific/Fakaofo"}>Pacific/Fakaofo</MenuItem>
            <MenuItem value={"Pacific/Fiji"}>Pacific/Fiji</MenuItem>
            <MenuItem value={"Pacific/Funafuti"}>Pacific/Funafuti</MenuItem>
            <MenuItem value={"Pacific/Galapagos"}>Pacific/Galapagos</MenuItem>
            <MenuItem value={"Pacific/Gambier"}>Pacific/Gambier</MenuItem>
            <MenuItem value={"Pacific/Guadalcanal"}>
              Pacific/Guadalcanal
            </MenuItem>
            <MenuItem value={"Pacific/Guam"}>Pacific/Guam</MenuItem>
            <MenuItem value={"Pacific/Honolulu"}>Pacific/Honolulu</MenuItem>
            <MenuItem value={"Pacific/Kiritimati"}>Pacific/Kiritimati</MenuItem>
            <MenuItem value={"Pacific/Kosrae"}>Pacific/Kosrae</MenuItem>
            <MenuItem value={"Pacific/Kwajalein"}>Pacific/Kwajalein</MenuItem>
            <MenuItem value={"Pacific/Majuro"}>Pacific/Majuro</MenuItem>
            <MenuItem value={"Pacific/Marquesas"}>Pacific/Marquesas</MenuItem>
            <MenuItem value={"Pacific/Midway"}>Pacific/Midway</MenuItem>
            <MenuItem value={"Pacific/Nauru"}>Pacific/Nauru</MenuItem>
            <MenuItem value={"Pacific/Niue"}>Pacific/Niue</MenuItem>
            <MenuItem value={"Pacific/Norfolk"}>Pacific/Norfolk</MenuItem>
            <MenuItem value={"Pacific/Noumea"}>Pacific/Noumea</MenuItem>
            <MenuItem value={"Pacific/Pago_Pago"}>Pacific/Pago_Pago</MenuItem>
            <MenuItem value={"Pacific/Palau"}>Pacific/Palau</MenuItem>
            <MenuItem value={"Pacific/Pitcairn"}>Pacific/Pitcairn</MenuItem>
            <MenuItem value={"Pacific/Pohnpei"}>Pacific/Pohnpei</MenuItem>
            <MenuItem value={"Pacific/Port_Moresby"}>
              Pacific/Port_Moresby
            </MenuItem>
            <MenuItem value={"Pacific/Rarotonga"}>Pacific/Rarotonga</MenuItem>
            <MenuItem value={"Pacific/Saipan"}>Pacific/Saipan</MenuItem>
            <MenuItem value={"Pacific/Tahiti"}>Pacific/Tahiti</MenuItem>
            <MenuItem value={"Pacific/Tarawa"}>Pacific/Tarawa</MenuItem>
            <MenuItem value={"Pacific/Tongatapu"}>Pacific/Tongatapu</MenuItem>
            <MenuItem value={"Pacific/Wake"}>Pacific/Wake</MenuItem>
            <MenuItem value={"Pacific/Wallis"}>Pacific/Wallis</MenuItem>
            <MenuItem value={"US/Pacific-New"}>US/Pacific-New</MenuItem>
            <MenuItem value={"UTC"}>UTC</MenuItem>
          </Select>
        </FormControl>
        <br></br>
        <br></br>

        {/* Primary Color */}
        <label htmlFor="primary-color">Primary Color</label>
        <br></br>
        <label htmlFor="primary-color">
          Tip: picking a darker color will help buttons stand out.
        </label>
        <HexColorPicker color={color} onChange={setColor} id="event-color" />
        <HexColorInput color={color} onChange={setColor} id="hex-input" />
        <br></br>
        <br></br>

        {/* Submit */}
        {/* remove link and replace with onSubmit */}
        <button className="Button1" onClick={handleSubmit}>
          {props.isEventUpdate ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
}

export default connect(null, actions)(withRouter(Event_Details));

// Below used to produce time zone list
// Has Canadian cities listed under America by default "ie. America/Toronto". Export, then correct.
/*const timeZonesList = momentTZ.tz.names();
var timezoneMenuItems = "<MenuItem value={'test'}>test</MenuItem>";
var i;
for (i = 0; i < timeZonesList.length; i++) { 
	timezoneMenuItems += "<MenuItem value={'" + timeZonesList[i] + "'}>" + timeZonesList[i] + "</MenuItem>"
}
console.log(timezoneMenuItems); */
