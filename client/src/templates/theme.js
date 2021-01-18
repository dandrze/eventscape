export default (primaryColor) => {
  return `
 	.fr-view button { 
		background: ${primaryColor} !important;
		border-color: ${primaryColor} !important;
	 } 
	 .fr-view h1 {
		 color: ${primaryColor};
	 }
	 .infoBar {
		background: ${primaryColor};
	 }

	 .theme-button {
		background:${primaryColor} !important;
     }

     .theme-color {
         color: ${primaryColor};
     }
     
     .form-control:focus {
        border-color: ${primaryColor}  !important;
        box-shadow: 0 0 0 0rem rgba(255, 0, 162, 0.25); /* was 0.2rem */
      }
      
      .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected, .react-datepicker__close-icon::after {
        background-color: ${primaryColor}  !important;
      }
      
      .custom-control-input:checked ~ .custom-control-label::before {
        background-color: ${primaryColor} ;
        border-color: ${primaryColor} ;
      }
	
  `;
};
