import { format } from "date-fns-tz";
import { isSameDay } from "date-fns";

/*export const heroBannerModelV1 = (eventTitle = "default") => {
    return `
    <div contenteditable="false">
        <div contenteditable="true" style="position: relative; text-align: center; overflow: hidden;">
            <img src="https://i.ibb.co/Thbv0N9/Abstract-glowing-particle-wave-on-a-dark-background.jpg" style="width: 100%; margin: 0; padding: 0;" class="fr-fic fr-dib">
            <div style="position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);"
            >
            <div>
                <span contenteditable="true" style="color: white; font-size: 8vw; line-height: 1;">${eventTitle}</span>
            </div>
        </div>
    </div>
`;
};*/

/*export const heroBannerModelV2 = (eventTitle = "default", primaryColor) => {

    function hexToRGBA(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
    
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }    
    
    return `
    <div contenteditable="false">
            <div class="hero-image">
                <span contenteditable="true" style="color: white; font-size: 8vw; line-height: 1; margin: 300px auto 300px auto" >${eventTitle}</span>
            </div>
        </div>
    </div>

    <style>
        .hero-image {
            background-image: 
                linear-gradient(
                    ${hexToRGBA('#521256', 0.45)}, 
                    ${hexToRGBA('#521256', 0.45)}
                ),
                url("https://i.ibb.co/Thbv0N9/Abstract-glowing-particle-wave-on-a-dark-background.jpg");
            background-color: #cccccc; /* Used if the image is unavailable */
/*background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            width: 100%;
            padding-top: 8vw;
            padding-bottom: 8vw;
            padding-right: 3%;
            padding-left: 3%;
        }
    </style>
`;
};*/

export const heroBannerModel = (eventTitle = "default") => {
  return `
    <div style="overflow: hidden;">
        <h1 class="title" >${eventTitle}</h1>
    </div>

    <style>
        .title {
            padding: 0;
            font-size: 96px;
            line-height: 1;
            margin-left: 5%;
            margin-right: 5%;
            margin-top: 3%;
            margin-bottom: 3%;
            text-align: center;
        }
    </style>
`;
};

export const logoHeaderModel = () => {
  return `
    <div style="overflow: hidden;">
        <div style="margin: 20px; display: block;">
            <img src="https://i.ibb.co/vh8fGjZ/your-logo-1.png" style="width: 150px;" class="fr-fic fr-dib fr-fil">
        </div>
    </div>
    `;
};

export const logoHeaderRightModel = () => {
  return `
    <div style="overflow: hidden;">
        <div style="margin: 20px; display: block;">
            <img src="https://i.ibb.co/vh8fGjZ/your-logo-1.png" style="width: 150px;" class="fr-fic fr-dib fr-fir">
        </div>
    </div>
    `;
};

export const descriptionRegistrationModel = (startTime, endTime) => {
  const startTimeParsed = Date.parse(startTime);
  const endTimeParsed = Date.parse(endTime);

  const endDifferentDay = isSameDay(startTimeParsed, endTimeParsed)
    ? ""
    : format(endTimeParsed, "MMMM dd, yyyy ");
  const timeFormatted =
    format(startTimeParsed, "MMMM dd, yyyy h:mm a - ") +
    endDifferentDay +
    format(endTimeParsed, "h:mm a zzz");

  return `
    <div style="overflow: hidden;" contenteditable="false">
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
        font-family: Helvetica, Arial, sans-serif;
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

  return `
        <div style="overflow: hidden;" contenteditable="false">
            <div style="margin: 0 1rem 0 1rem;">
                <div class="title1">${eventTitle}</div>
            </div>
        </div>
        
        <style>
            .title1 {
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
                font-size: 36px;
                color: black;
                text-align: left;
                line-height: 1.5;
            }
            .time {
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
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
  return `
        <div style="overflow: hidden;">
            <section class="container2">
                <div class="one2">
                    <div class="video-responsive">
                        <!--Adding ?modestbranding=1;showinfo=0;rel=0 at the end of the link removes the YouTube logo and suggested videos-->
                        <iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/X9llog6QNVM??rel=0;&modestbranding=1&showinfo=0&autoplay=1&mute=1&loop=1” frameborder=“0" allowfullscreen include></iframe>
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

            #video-responsive-iframe{
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
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
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
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
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
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
                font-size: 10px;
                color: grey;
                padding: 0 0 1px 0;
                position: relative;
                margin: 0 0;
                text-align: left;
            }

            .sendTime {
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
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
  return `
    <div style="overflow: hidden;" contenteditable="false">
        <div style="margin: 1rem; display: block;">
            <div contenteditable="true" style="text-align: left;"></div>
        </div>
    </div>
    `;
};

export const streamChatReact = {
  name: "StreamChat",
  props: {
    content: "youtube-live",
    link: "https://www.youtube.com/embed/X9llog6QNVM",
    html: "",
  },
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
                        <iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/MnrJzXM7a6o?modestbranding=1;showinfo=0;rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
            #video-responsive-iframe{
                left:0;
                top:0;
                height:100%;
                width:100%;
                position:absolute;
            }
        </style>*/
