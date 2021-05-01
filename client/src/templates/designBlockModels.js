import { format } from "date-fns-tz";
import { isSameDay } from "date-fns";

export const heroBannerModel = (eventTitle = "default") => {
  return `<div style=" background-image: url(https://eventscape-assets.s3.amazonaws.com/free-images/abstract-5719523_1920.jpg);
  background-position: bottom;
  height: auto;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 150px 20px;
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
};

export const logoHeaderModel = (logo) => {
  const logoUrl = logo
    ? logo
    : "https://eventscape-assets.s3.amazonaws.com/assets/Eventscape-your-logo-grey.png";
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
        <div style="margin: 20px; display: block;">
            <img src="${logoUrl}" style="width: 150px;" class="fr-fic fr-dib fr-fil">
        </div>
    </div>
    `;
};

export const logoHeaderRightModel = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
        <div style="margin: 20px; display: block;">
            <img src="https://eventscape-assets.s3.amazonaws.com/logos/Eventscape-your-logo-bw-2.png" style="width: 150px;" class="fr-fic fr-dib fr-fir">
        </div>
    </div>
    `;
};

export const timeDescription = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div style="max-width: 1300px; margin: 0 auto; padding: 60px 20px;" contenteditable="true">
  <p style="margin-top: 0; text-align: left;"><strong><span style="font-size: 30px; text-align: left;">Register For Event</span></strong></p>
  <p style="text-align: left;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
</div>`;
};

/* export const descriptionRegistrationModel = (startTime, endTime) => {
  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);

  const endDifferentDay = isSameDay(startTimeParsed, endTimeParsed)
    ? ""
    : format(endTimeParsed, "MMMM dd, yyyy ");
  const timeFormatted =
    format(startTimeParsed, "MMMM dd, yyyy h:mm a - ") +
    endDifferentDay +
    format(endTimeParsed, "h:mm a zzz");

  return `<div style="overflow: hidden;" contenteditable="false">
        <section class="container">
            <div class="one" contenteditable="true">
                <p style="margin-top: 0;"><strong><span style="font-size: 30px; text-align: left;">${timeFormatted}</span></strong></p>
                <p style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div class="two">
                <span>Register Now</span>
                <form>
                    <br>
                    <label for="fname">First name:</label>
                    <input type="text" id="fname" name="fname"><br>
                    <label for="lname">Last name:</label>
                    <input type="text" id="lname" name="lname">
                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email">
                    <br></br>
                    <button class="button3 primary-color-background">Register Now</button>
                </form>
            </div>
        </section>
    </div>
    
    <style>
    .container {
        padding: 0;
        margin: 3%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        grid-gap: 1rem;

    }
    
    .one {
        margin: 5%;
        text-align: justify;
    }
    
    .two {
        padding: 8%;
        margin: 5%;
        background-color: #EFEFEF;
    }
    
    .button3 {
        font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
        font-weight: bold;
        font-size: 20;
        color: white;
        padding: 16px;
        border-width: 2px;
        border-radius: 6px;
        border-style: solid;
    }

    .button3:hover {
        opacity: 0.8;
    }
    
   
    </style>
    
    `;
};
*/

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

  return `<div class="one" contenteditable="true">
    <p style="margin-top: 0;"><span style="font-size: 30px; text-align: left; font-weight: 300;">${timeFormatted}</span></p>
    <p style="text-align: left;">${descriptionBody}</p>
  </div>`;
};

export const titleTimeModel = (eventTitle = "default", startTime, endTime) => {
  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);

  const endDifferentDay = isSameDay(startTimeParsed, endTimeParsed)
    ? ""
    : format(endTimeParsed, "MMMM dd, yyyy ");
  const timeFormatted =
    format(startTimeParsed, "MMMM dd, yyyy h:mm a - ") +
    endDifferentDay +
    format(endTimeParsed, "h:mm a zzz");

  return `<div style="overflow: hidden;" contenteditable="false">
            <div style="margin: 1rem 1rem 1rem 1rem;">
                <div class="title1" contenteditable="true">${eventTitle}</div>
            </div>
        </div>
        
        <style>
            .title1 {
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 36px;
                font-weight: 300;
                color: black;
                text-align: left;
                line-height: 1;
            }
            .time {
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 1.25vw;
                font-weight: bold;
                color: black;
                text-align: left;
                line-height: 1.5;
            }
        </style>
    `;
};

export const streamChatModel = () => {
  return `<div style="overflow: hidden;">
            <section class="container2">
                <div class="one2">
                    <div class="video-responsive">
                        <!--Adding ?modestbranding=1;showinfo=0;rel=0 at the end of the link removes the YouTube logo and suggested videos-->
                        <iframe class="video-responsive-iframe" src="https://www.youtube.com/embed/X9llog6QNVM??rel=0;&modestbranding=1&showinfo=0&autoplay=1&mute=1&loop=1” frameborder=“0" allowfullscreen include></iframe>
                    </div>
                </div>
                <div class="two2" contenteditable="false">
                    <div class="chat"> 
                        <div class="chatArea">
                            <ul id="messages">
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                                <li id="message">
                                    <span class="username">Kevin</span>
                                    <span class="messageBody">Test message</span>
                                    <span class="sendTime">2:51 pm</span>
                                </li>
                            </ul>
                        </div>
                        <div class="inputMessageContainer">
                            <input class="inputMessage" placeholder="Type a message..."/>
                        </div>
                    </div>
                </div>
            </section>

        </div>

        <style>
            .container2 {
                padding: .5rem;
                margin: 0rem;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                box-sizing: border-box;
            }

            .one2 {
                margin: .5rem;
                text-align: justify;
                flex: 3 0 320px;
                max-width: 100%;
                overflow: hidden;
            }

            .two2 {
                margin: .5rem;
                border: 1px solid #EFEFEF;
                min-height: 200px;
                flex: 1 0 240px;
                max-width: 100%;
                overflow: hidden;
                max-height: 500px;
            }

            .video-responsive{
                overflow:hidden;
                padding-bottom:56.25%;
                position:relative;
                height:0;
            }

            .video-responsive-iframe{
                left:0;
                top:0;
                height:100%;
                width:100%;
                position:absolute;
            }

            ul {
                list-style: none;
                word-wrap: break-word;
            }

            .chat {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .chatArea {
                height: 100%;
                padding-bottom: 54px;
            }

            #messages { 
                margin: 0;
                height: 100%;
                overflow-y: scroll; 
                padding: 10px 20px 10px 20px;
                flex-wrap: nowrap;
                flex-direction: column;
                display: flex;
            }

            #message {
                margin-top: 0px;
                flex-wrap: wrap;
                flex-direction: column;
                display: flex;
                margin-right: auto;
            }

            .messageBody {
                border-radius: 17px;
                padding: 8px;
                position: relative;
                background-color: #EFEFEF;
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 14px;
                white-space: normal;
                text-align: left;
            }

            .inputMessageContainer {
                background-color: #EFEFEF;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 10px 10px 10px 10px;
                flex-wrap: wrap;
                flex-direction: column;
                display: flex;
            }

            .inputMessage {
                border: none;
                border-radius: 17px;
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 14px;
                padding: 10px;
                width: 100%;
                white-space: normal;
                margin: 0;
                position: relative;
                text-align: left;
            }

            .message.typing .messageBody {
                color: gray;
            }
              
            .username {
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 10px;
                color: grey;
                padding: 0 0 1px 0;
                position: relative;
                margin: 0 0;
                text-align: left;
            }

            .sendTime {
                font-family: Roboto, "Helvetica Neue", Ariel, sans-serif;
                font-size: 10px;
                color: grey;
                padding: 0 0 1px 0;
                position: relative;
                margin: 0 0;
                text-align: right;
            }
              
        </style>

        <script>
            var divHeight = $('.one').height(); 
            console.log('divheight: ' + divHeight);
            $('.style_left_side_content').css('max-height', divHeight+'0px');
        </script>

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
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div class="block-container" style="overflow: hidden;">
  <h2 class="theme-color">Agenda</h2>
    <table class="schedule-table schedule-table1">
    <tbody>
      <tr>
        <td style="width: 35%;" >
        <p>9:00AM - 11:00AM</p>
        </td>
        <td style="width: 65%;">
        <h4>Introduction</h4>
        <p>Speakers introduce themselves.</p>
        </td>
      </tr>
      <tr>
        <td style="width: 35%;" >
        <p>11:00AM - 2:00PM</p>
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
        <p>2:00PM - 3:00PM</p>
        </td>
        <td style="width: 65%;">
        <h4>Live Q&A Panel</h4>
        <p>Enter your questions into the questions tab, and our panel of experts will answer them live!</p>
        </td>
        </tr>
    </tbody>
  </table>
      </div>
      </div>
      `;
};

export const scheduleTable2 = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div class="block-container" style="overflow: hidden;">
    <h2 class="theme-color">Agenda</h2>
      <table class="schedule-table schedule-table2">
      <tbody>
        <tr>
          <td style="width: 35%;" >
          <p>9:00AM - 11:00AM</p>
          </td>
          <td style="width: 65%;">
          <h4>Introduction</h4>
          <p>Speakers introduce themselves.</p>
          </td>
        </tr>
        <tr>
          <td style="width: 35%;" >
          <p>11:00AM - 2:00PM</p>
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
          <p>2:00PM - 3:00PM</p>
          </td>
          <td style="width: 65%;">
          <h4>Live Q&A Panel</h4>
          <p>Enter your questions into the questions tab, and our panel of experts will answer them live!</p>
          </td>
          </tr>
      </tbody>
    </table>
        </div>
        </div>
        `;
};

export const paragraph1 = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." ><div class="container block-container" style="overflow: hidden;">
  <div class="col">
     <p>
     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
     </p>
     </div>
          </div>
          </div>
          `;
};

export const paragraph2 = () => {
  return `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <div class="container block-container" style="overflow: hidden;">
  <div class="row">
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
     </div>
          </div>
          </div>
          `;
};

export const sponsorGrid = (columns, rows, box) => {
  let column = 0;
  let row = 0;
  let html = `<div style="background-position: bottom;
  background-size: cover;
  overflow: hidden" data-info="background image/color. Do not modify." >
  <h1 style="font-size: 30px;">Thank you to our sponsors</h1>
  <div class="container block-container">`;
  const columnClass = box ? "sponsor-box-border" : "sponsor-box-no-border";
  while (row < rows) {
    html += `<div class="row">`;
    while (column < columns) {
      html += `<div class="col-lg ${columnClass}">
                <img src="https://eventscape-assets.s3.amazonaws.com/Sponsor+Logo.png">
            </div>`;
      column += 1;
    }
    html += `</div>`;
    row += 1;
    // reset column counter back to 0 for the next row
    column = 0;
  }
  html += `</div></div>`;

  return html;
};

export const streamChatReact = {
  name: "StreamChat",
  props: {
    content: "youtube-live",
    link: "https://www.youtube.com/embed/KMDQR9V1Pso",
    html: "",
    chatRoom: null,
  },
};

export const registrationFormReact = {
  name: "RegistrationForm",
  props: {},
};

/*<iframe 
width="100%" 
height= 640px; 
src="https://www.youtube.com/embed/MnrJzXM7a6o?modestbranding=1;showinfo=0;rel=0" 
frameborder="0" 
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen
>
</iframe>*/

/*<div style="overflow: hidden;">
            <section class="container">
                <div class="one">
                    <div class="video-responsive">
                        <!--Adding ?modestbranding=1;showinfo=0;rel=0 at the end of the link removes the YouTube logo and suggested videos-->
                        <iframe class="video-responsive-iframe" src="https://www.youtube.com/embed/MnrJzXM7a6o?modestbranding=1;showinfo=0;rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="two">
                    <span>Chat</span>
                </div>
            </section>

        </div>

        <style>
            .container {
                padding: 0;
                margin: 1rem;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                grid-gap: 0%;
            }

            .one {
                margin: 1rem;
                text-align: justify;
                grid-column: auto / span 2;
                box-sizing: border-box;
            }

            .two {
                margin: 1rem;
                background-color: #EFEFEF;
                min-height: 350px;
            }



            .video-responsive{
                overflow:hidden;
                padding-bottom:56.25%;
                position:relative;
                height:0;
            }
            .video-responsive-iframe{
                left:0;
                top:0;
                height:100%;
                width:100%;
                position:absolute;
            }
        </style>*/
