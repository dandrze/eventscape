import React, { Component } from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";
import DesignBlockToolbar from "./designBlockToolbar";

class RegPageSectionEditor extends React.Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.state = {
		  isHovering: false,
		};
	}

	handleMouseEnter = () => {
		this.setState({
			isHovering: true,
		});
	}

	handleMouseLeave = () => {
		this.setState({
			isHovering: false,
		});
	}

	render() {
		return(
			<div>
				<div
          			onMouseEnter={this.handleMouseEnter}
          			onMouseLeave={this.handleMouseLeave}
        		>
					{this.state.isHovering && 
						<DesignBlockToolbar 
							showStreamSettings="true"
						/>
					}
					<Froala key={this.props.model} sectionIndex={this.props.sectionIndex} />
				</div>
				<NewSectionButton prevIndex={this.props.sectionIndex} />
			</div>
		);
	};
};

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(RegPageSectionEditor);
