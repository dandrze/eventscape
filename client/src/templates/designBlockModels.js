import { format } from "date-fns-tz";
import { isSameDay } from "date-fns";

export const logoHeaderModel = (logo) => {
  const logoUrl = logo
    ? logo
    : "https://eventscape-assets.s3.amazonaws.com/assets/Eventscape-your-logo-grey.png";
  return `  <div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div style="background-position: bottom;
    background-size: cover;
    box-shadow: rgba(255, 255, 255, 0) 0px 0px 0px 5000px inset;
    border-radius: 10px;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 12px calc(15px + 1.5vw);
    background: #ffffff;
    overflow: hidden" data-info="background image/color. Do not modify." >
    <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

        <div style="margin: 20px; display: block;">
            <img src="${logoUrl}" style="width: 150px;" class="fr-fic fr-dib fr-fil">
        </div>
        <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

    </div>
    </div>
    </div>
    `;
};

export const spacer = (height) => {
  return `<div style="
    opacity: 0;
    height: ${height}px;
    " >
    .
      </div>
      `;
};

export const logoTitleHeaderModel = (logo, eventTitle) => {
  const logoUrl = logo
    ? logo
    : "https://eventscape-assets.s3.amazonaws.com/assets/Eventscape-your-logo-grey.png";
  return `
  <div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div id="title-logo-banner" style="background-position: bottom;
    background-size: cover;
    box-shadow: rgb(255, 255, 255, 0) 0px 0px 0px 5000px inset;
    background: #ffffff;
    border-radius: 10px;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 12px calc(15px + 1.5vw);
    overflow: hidden" data-info="background image/color. Do not modify." >
    
    <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->
            <div style="flex-grow: 1;
            text-align: left;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            align-content: flex-start;
            justify-content: center;">
                <p style="font-weight: 400; font-size: 36px; margin: 0;">${eventTitle}</p>
            </div>
            <img class="fr-dib fr-fir" src="${logoUrl}" style="width: 150px;" >
    <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->
      </div>
      </div>
      </div>
      `;
};

export const logoHeaderRightModel = () => {
  return `div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div style="background-position: bottom;
    background-size: cover;
    box-shadow: rgb(255, 255, 255, 0) 0px 0px 0px 5000px inset;
    background: #ffffff;
    border-radius: 10px;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 12px calc(15px + 1.5vw);
    overflow: hidden" data-info="background image/color. Do not modify." >
    <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

        <div style="margin: 20px; display: block;">
            <img src="https://eventscape-assets.s3.amazonaws.com/logos/Eventscape-your-logo-bw-2.png" style="width: 150px;" class="fr-fic fr-dib fr-fir">
        </div>
        <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

    </div>
    <div>
    <div>
    `;
};

export const registrationFormDescription = (
  startTime,
  endTime,
  timeZone,
  description
) => {
  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);

  const endDifferentDay = isSameDay(startTimeParsed, endTimeParsed)
    ? ""
    : format(endTimeParsed, "MMMM dd, yyyy ", { timeZone: timeZone });

  const timeFormatted = endDifferentDay
    ? `${format(startTimeParsed, "MMMM dd, yyyy h:mm a", {
        timeZone: timeZone,
      })} - <br/>${format(endTimeParsed, "MMMM dd, yyyy h:mm a zzz", {
        timeZone: timeZone,
      })}`
    : `${format(startTimeParsed, "MMMM dd, yyyy", {
        timeZone: timeZone,
      })}<br/>${format(startTimeParsed, "h:mm a", {
        timeZone: timeZone,
      })} - ${format(endTimeParsed, "h:mm a zzz", { timeZone: timeZone })}`;

  const descriptionBody =
    description ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  return `<div style="margin: 0px auto;">
  <div>
  <div style="background-position: bottom;
    background-size: cover;
    box-shadow: rgb(255 255 255 0) 0px 0px 0px 5000px inset;
    background: #ffffff;
    border-radius: 10px;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: calc(15px + 1.5vw);
    overflow: hidden" data-info="background image/color. Do not modify." >
    <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->
    <div class="one" contenteditable="true">
    <p style="margin-top: 0; text-align: left;"><span style="font-size: 30px; text-align: left; font-weight: 300;">${timeFormatted}</span></p>
    <p style="text-align: left;">${descriptionBody}</p>
  </div> 
   <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->
  </div>
  </div>
  </div>`;
};

export const simpleTitle = (eventTitle = "default") => {
  return `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div style="background-position: bottom;
    background-size: cover;
    box-shadow: rgb(255 255 255 0) 0px 0px 0px 5000px inset;
    background: #ffffff;
    border-radius: 10px;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 12px calc(15px + 1.5vw);
    overflow: hidden" data-info="background image/color. Do not modify." >
    <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

                <div style="font-weight: 400; font-size: 36px; margin: 0;" contenteditable="true">${eventTitle}</div>
                <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

            </div>
        </div>
        </div>
    `;
};

export const blankModel = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
        <div style="margin: 1rem; display: block;">
            <div contenteditable="true" style="text-align: left;"></div>
        </div>
    </div>
    `;
};

export const scheduleTable1 = () => {
  return `
  <div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">


  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

  <!-- Header on top of line -->

			<table style="width: 100%; line-height: 1px; margin: 20px 0px;">
				<tbody>
					<tr>
						<td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
							<br>
						</td>
						<td rowspan="2" style="padding: 0px calc(15px + 1.5vw); white-space: nowrap; border: none; width: auto;">

							<h2 style="font-weight: 500; color: #9b9b9b; margin: 0; font-size: 1.3rem;">AGENDA</h2>
						</td>
						<td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
							<br>
						</td>
					</tr>
					<tr>
						<td style="border: none;">
							<br>
						</td>
						<td style="border: none;">
							<br>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- End of header  -->

    <table class="schedule-table schedule-table1">
    <tbody>
      <tr>
        <td style="width: 35%;" >
        9:00AM - 11:00AM
        </td>
        <td style="width: 65%;">
        <h4>Introduction</h4>
        <p>Speakers introduce themselves.</p>
        </td>
      </tr>
      <tr>
        <td style="width: 35%;" >
        11:00AM - 2:00PM
        </td>
        <td style="width: 65%;">
        <h4>Workshop: How to build your own livestreaming website</h4>
        <p>Learn how to build a website for your live stream event! 
        <br> Speakers: 
            <br>- Karen Johnson - EVP
            <br>- Mike Chin - SVP</p>
        </td>
        </tr>
    <tr>
        <td style="width: 35%;" >
        2:00PM - 3:00PM
        </td>
        <td style="width: 65%;">
        <h4>Live Q&A Panel</h4>
        <p>Enter your questions into the questions tab, and our panel of experts will answer them live!</p>
        </td>
        </tr>
    </tbody>
  </table>
  <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

      </div>
      </div>
      </div>
      `;
};

export const scheduleTable2 = () => {
  return `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">
  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

  <!-- Header on top of line -->

  <table style="width: 100%; line-height: 1px; margin: 20px 0px;">
    <tbody>
      <tr>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
        <td rowspan="2" style="padding: 0px calc(15px + 1.5vw); white-space: nowrap; border: none; width: auto;">

          <h2 style="font-weight: 500; color: #9b9b9b; margin: 0; font-size: 1.3rem;">AGENDA</h2>
        </td>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
      </tr>
      <tr>
        <td style="border: none;">
          <br>
        </td>
        <td style="border: none;">
          <br>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- End of header  -->      <table class="schedule-table schedule-table2">
      <tbody>
        <tr>
          <td style="width: 35%;" >
          9:00AM - 11:00AM
          </td>
          <td style="width: 65%;">
          <h4>Introduction</h4>
          <p>Speakers introduce themselves.</p>
          </td>
        </tr>
        <tr>
          <td style="width: 35%;" >
          11:00AM - 2:00PM
          </td>
          <td style="width: 65%;">
          <h4>Workshop: How to build your own livestreaming website</h4>
          <p>Learn how to build a website for your live stream event! 
          <br> Speakers: 
              <br>- Karen Johnson - EVP
              <br>- Mike Chin - SVP</p>
          </td>
          </tr>
      <tr>
          <td style="width: 35%;" >
          2:00PM - 3:00PM
          </td>
          <td style="width: 65%;">
          <h4>Live Q&A Panel</h4>
          <p>Enter your questions into the questions tab, and our panel of experts will answer them live!</p>
          </td>
          </tr>
      </tbody>
    </table>

    <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

        </div>
        </div>
        </div>
        </div>
        `;
};

export const paragraph1 = () => {
  return `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." 
  style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">
  <div class="col">
  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

     <p>
     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
     </p>
     <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

     </div>
          </div>
          </div>
          </div>
          </div>
          `;
};

export const paragraph2 = () => {
  return `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." 
  style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">

  <div class="row">
  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->

    <div class="col-md-6 col-mobile-margin">

     <p>
     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
     </p>
     </div>
     <div class="col-md-6 col-mobile-margin">
     <p>
     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
     </p>

     </div>
     <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->

     </div>
          </div>
          </div>
          `;
};

export const sponsorGrid = (columns, rows, box) => {
  let column = 0;
  let row = 0;
  let html = `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">
  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->
  <div class="block-container">
  <div>
  <!-- Header on top of line -->

  <table style="width: 100%; line-height: 1px; margin: 20px 0px;">
    <tbody>
      <tr>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
        <td rowspan="2" style="padding: 0px calc(15px + 1.5vw); white-space: nowrap; border: none; width: auto;">

          <h2 style="font-weight: 500; color: #9b9b9b; margin: 0; font-size: 1.3rem;">THANK YOU TO OUR SPONSORS</h2>
        </td>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
      </tr>
      <tr>
        <td style="border: none;">
          <br>
        </td>
        <td style="border: none;">
          <br>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- End of header  -->
</div>
  `;
  const boxStyle = box
    ? `margin: 15px;
    padding: 15px 5px;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background: #ffffff;`
    : `margin: 0px;
    background: #ffffff;`;
  while (row < rows) {
    html += `<div class="row">`;
    while (column < columns) {
      html += `<div class="col-sm" style="display: flex;
      align-content: center;
      justify-content: center; ${boxStyle}">
                <img style="object-fit: contain;" src="https://eventscape-assets.s3.amazonaws.com/Sponsor+Logo.png">
            </div>`;
      column += 1;
    }
    html += `</div>`;
    row += 1;
    // reset column counter back to 0 for the next row
    column = 0;
  }
  html += `</div>
  <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->
  </div></div></div>`;

  return html;
};

export const speakerGrid = (columns, box) => {
  let column = 0;
  let row = 0;
  let headshotIndex = 0;
  let html = `<div style="padding: 0 10px; margin: 0px auto; max-width: 1400px;">
  <div style="padding: 10px;">
  <div data-info="background image/color. Do not modify." style="background-position: bottom;
  background-size: cover;
  border-radius: 10px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 5000px inset;
  padding: calc(15px + 1.5vw);
  overflow: hidden;">
  <!-- ************************* ONLY EDIT CODE BELOW THIS LINE ************************* -->
  <div class="block-container">
  <div>
  <!-- Header on top of line -->

  <table style="width: 100%; line-height: 1px; margin: 20px 0px;">
    <tbody>
      <tr>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
        <td rowspan="2" style="padding: 0px calc(15px + 1.5vw); white-space: nowrap; border: none; width: auto;">

          <h2 style="font-weight: 500; color: #9b9b9b; margin: 0; font-size: 1.3rem;">SPEAKERS</h2>
        </td>
        <td style="width: 50%; border-top: none; border-right: none; border-bottom: 1px solid #9b9b9b; border-left: none;">
          <br>
        </td>
      </tr>
      <tr>
        <td style="border: none;">
          <br>
        </td>
        <td style="border: none;">
          <br>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- End of header  -->
</div>
  `;

  html += `<div style="display: flex; flex-wrap: wrap">`;
  while (column < columns) {
    html += `<div  style="display: flex;
      align-content: center;
      justify-content: flex-start; 
      flex-direction: column;
      width: 300px;
      margin: 50px auto;">
                <img style="object-fit: cover; border-radius: 50%; width: 150px; height: 150px; margin: 0px auto 20px;" src="https://eventscape-assets.s3.amazonaws.com/assets/headshots/headshot-${headshotIndex}.jpg">
                <div style="text-align: center; font-weight: 500; font-size: 20px; color: rgb(33, 37, 41)">Speaker Name</div>
                <div style="text-align: center; font-weight: 300; font-size: 20px; color: rgb(33, 37, 41)">Speaker Title</div>
            </div>`;
    column += 1;
    if (headshotIndex === 7) {
      headshotIndex = 0;
    } else {
      headshotIndex += 1;
    }
  }
  html += `</div>`;

  html += `</div>
  <!-- ************************* ONLY EDIT CODE ABOVE THIS LINE ************************* -->
  </div></div></div>`;

  return html;
};

// React models

export const streamChatReact = {
  name: "StreamChat",
  props: {
    content: null,
    link: "",
    html: "",
    chatRoom: null,
  },
};

export const registrationFormReact = {
  name: "RegistrationForm",
  props: {},
};

export const spacerSm = () => {
  return ``;
};

// Old models

/* export const heroBannerModel = (eventTitle = "default") => {
  return `<div style=" background-image: url(https://eventscape-assets.s3.amazonaws.com/free-images/abstract-5719523_1920.jpg);
  background-position: bottom;
  height: auto;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 150px 20px;
  width: 100%
  box-shadow: rgba(255, 255, 255, 0.667) 0px 0px 0px 5000px inset;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div>
  <span class="hero-banner">
  <h1 class="title">${eventTitle}</h1>
  </span>
  </div>
  </div>

    <style>
        .title {
            padding: 0;
            font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
            font-weight: 300;
            font-size: 96px;
            color: #ffffff;
        }
     
    </style>
`;
}; */

/* export const heroBannerModelNarrow = (eventTitle = "default") => {
  return `<div style=" background-image: url(https://eventscape-assets.s3.amazonaws.com/free-images/abstract-5719523_1920.jpg);
    background-position: bottom;
    height: auto;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 50px 20px;
    box-shadow: rgba(35, 35, 35, 0.667) 0px 0px 0px 5000px inset;
    overflow: hidden" data-info="background image/color. Do not modify." >
    <div>
    <span class="hero-banner">
    <h1 class="title">${eventTitle}</h1>
    </span>
    </div>
    </div>
  
      <style>
          .title {
              padding: 0;
              font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
              font-weight: 300;
              font-size: 96px;
              color: #ffffff;
          }
       
      </style>
  `;
}; */

/* export const timeDescription = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div style="max-width: 1300px; margin: 0 auto; padding: 60px 20px;" contenteditable="true">
  <p style="margin-top: 0; text-align: left;"><strong><span style="font-size: 30px; text-align: left;">Register For Event</span></strong></p>
  <p style="text-align: left;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
</div>`;
};

 */
