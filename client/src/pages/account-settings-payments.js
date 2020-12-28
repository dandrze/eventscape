import React from "react";

import NavBar3 from "../components/navBar3.js";
import { connect } from "react-redux";
import BillingHistoryTable from "../components/billing-history-table.js"


class AccountSettingsPayments extends React.Component {
	render() {
		return (
			<div>
				<NavBar3
					displaySideNav="false"
					displaySideNavAccount="true"
					highlight="payments"
					content={
						<div className="boxes-main-container container-width">
							<div className="form-box shadow-border form-width">
								<h3>Payment Details</h3>
								<br></br>
								<p>Credit Card: **** **** **** 2747</p>
								<button className="Button2" type="submit">
									Update Payment Details
								</button>
							</div>

							<div className="form-box shadow-border table-box">
								<h3>Billing History</h3>
								<BillingHistoryTable />
							</div>
						</div>
					}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps, null)(AccountSettingsPayments);
