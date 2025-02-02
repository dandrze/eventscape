export default (primaryColor) => {
  return `
   .MuiTab-root.Mui-selected {
     color: ${primaryColor};
   }

	 .theme-button {
		background:${primaryColor} !important;
    border-color: ${primaryColor} !important;;
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

      .schedule-table * {
  font-size: 0.9em;
}

.schedule-table {
  width: 80%;
  margin: auto;
  margin-bottom: 50px;
}

.schedule-table1 tbody tr td {
  border-left: none;
  border-right: none;
  border-bottom: none;
  padding: 12px 20px;
}

.schedule-table1 tbody tr:first-child td {
  border-left: none;
  border-right: none;
  border-top: none;
  padding: 12px 20px;
}

.schedule-table2 tbody tr td {
  border: none;
  padding: 12px 20px;
}

.schedule-table tbody tr td p {
  margin-bottom: 0px;
}

.schedule-table tbody tr td:first-child {
  text-align: right;
}

.schedule-table2 tbody tr td:first-child {
  vertical-align: top;
}

.schedule-table tbody tr td:first-child p {
  font-weight: 500;
  color: #404040;
}

.schedule-table tbody tr td:nth-child(2) {
  text-align: left;
}
  `;
};
