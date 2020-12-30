export default (primary_color) => {
  return `
 	.fr-view button { 
		background: ${primary_color} !important;
		border-color: ${primary_color} !important;
	 } 
	 .fr-view h1 {
		 color: ${primary_color};
	 }
	 .infoBar {
		background: ${primary_color};
	 }

	 .theme-button {
		background:${primary_color} !important;
     }

     .theme-color {
         color: ${primary_color};
     }
     
     .form-control:focus {
        border-color: ${primary_color}  !important;
        box-shadow: 0 0 0 0rem rgba(255, 0, 162, 0.25); /* was 0.2rem */
      }
      
      .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected, .react-datepicker__close-icon::after {
        background-color: ${primary_color}  !important;
      }
      
      .custom-control-input:checked ~ .custom-control-label::before {
        background-color: ${primary_color} ;
        border-color: ${primary_color} ;
      }
	
  `;
};
