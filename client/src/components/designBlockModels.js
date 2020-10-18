import { format } from 'date-fns-tz';
import { isSameDay } from 'date-fns';


export const heroBannerModel = (eventTitle = "default") => {
    return `
    <div contenteditable="false">
        <div style="position: relative; text-align: center; overflow: hidden;">
            <img src="https://i.ibb.co/Thbv0N9/Abstract-glowing-particle-wave-on-a-dark-background.jpg" style="width: 100%; margin: 0; padding: 0;" class="fr-fic fr-dib">
            <div style="position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);"
            >
            <div contenteditable="false">
                <span style="color: white; font-size: 8vw; line-height: 1;">${eventTitle}</span>
            </div>
        </div>
    </div>
`;
};

export const logoHeaderModel = () => {
	return `
    <div style="overflow: hidden;">
        <div style="margin: 20px; display: block;">
            <img src="https://i.ibb.co/vh8fGjZ/your-logo-1.png" style="width: 10%;" class="fr-fic fr-dib fr-fil">
        </div>
    </div>
    `;
};

export const logoHeaderRightModel = () => {
	return `
    <div style="overflow: hidden;">
        <div style="margin: 20px; display: block;">
            <img src="https://i.ibb.co/vh8fGjZ/your-logo-1.png" style="width: 10%;" class="fr-fic fr-dib fr-fir">
        </div>
    </div>
    `;
};

export const descriptionRegistrationModel = () => {
	return `
    <div style="overflow: hidden;">
        <section class="container">
            <div class="one">
                <p><strong><span style="font-size: 30px; text-align: left;">February 8, 2021 7:00 PM - 9:00 PM</span></strong></p>
                <p style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div class="two">
                <span>Register Now</span>
                <form contenteditable="true">
                    <br>
                    <label for="fname">First name:</label>
                    <input type="text" id="fname" name="fname"><br>
                    <label for="lname">Last name:</label>
                    <input type="text" id="lname" name="lname">
                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email">
                    <br></br>
                    <button id="button3">Register Now</button>
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
    
    #button3 {
        font-family: Helvetica, Arial, sans-serif;
        font-weight: bold;
        font-size: 20;
        color: white;
        background-color: #B0281C;
        padding: 16px;
        border-width: 2px;
        border-radius: 6px;
        border-color: #B0281C;
        border-style: solid;
    }
    
    #button3:hover {
        color: #B0281C;
        background-color: white;
    }
    </style>
    
    `;
};

export const titleTimeModel = (eventTitle = "default", startTime, endTime) => {
    const endDifferentDay = (isSameDay(startTime, endTime)) ? '' : format(endTime, 'MMMM dd, yyyy ');
    const timeFormatted = format(startTime, 'MMMM dd, yyyy h:mm a - ') + endDifferentDay + format(endTime, 'h:mm a zzz');

	return `
        <div style="overflow: hidden;" contenteditable="false">
            <div style="margin: 0 2% 0 2%;">
                <div class="title">${eventTitle}</div>
                <div class="time">${timeFormatted}</div>
            </div>
        </div>
        
        <style>
            .title {
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
                font-size: 4vw;
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
            <section class="container">
                <div class="one">
                    <div class="video-responsive">
                        <!--Adding ?modestbranding=1;showinfo=0;rel=0 at the end of the link removes the YouTube logo and suggested videos-->
                        <iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/MnrJzXM7a6o?modestbranding=1;showinfo=0;rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="two" contenteditable="false">
                    <ul>
                        <li class="messages-li">message 1</li><br></br>
                        <div class="name">Dan Hernden</div><br></br>
                        <li class="messages-li">message 2</li><br></br>
                        <li class="messages-li">message 3</li><br></br>
                    </ul>
                </div>
            </section>

        </div>

        <style>
            .container {
                padding: .5rem;
                margin: 0rem;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                box-sizing: border-box;
            }

            .one {
                margin: .5rem;
                text-align: justify;
                flex: 3 0 320px;
                max-width: 100%;
                overflow: hidden;
            }

            .two {
                margin: .5rem;
                border: 1px solid #EFEFEF;
                min-height: 200px;
                flex: 1 0 240px;
                max-width: 100%;
                overflow: hidden;
            }

            /*@media (min-width: 600px) {
                .container { 
                    grid-template-columns: repeat(3, 1fr); 
                }

                .one {
                    grid-column: auto / span 2;
                }
            }*/

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
            .name {
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
                font-size: 10px;
                color: grey;
                display: inline-block;
                padding: 0px 0px;
                position: relative;
                margin: 0 10px;
                max-width: 80%;
                float: left;
            }
            .messages-li {
                border-radius: 17px;
                background-color: blue;
                display: inline-block;
                padding: 10px 10px;
                position: relative;
                margin: 10px;
                max-width: 80%;
                background-color: #e6e5eb;
                float: left;
                font-family: "Helvetica Neue", Helvetica, Ariel, sans-serif;
                font-size: 14px;
                white-space: normal;
            }
        </style>

    `;
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