export const hero = (eventTitle = "default") => {
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

export const banner = () => {
	return `
    <div style="overflow: hidden;">
        <div style="margin: 20px; display: block;">
            <img src="https://i.ibb.co/vh8fGjZ/your-logo-1.png" style="width: 10%;" class="fr-fic fr-dib fr-fil">
        </div>
    </div>
    `;
};

export const body = () => {
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
