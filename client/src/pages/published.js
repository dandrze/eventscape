import React, { createElement, useEffect } from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from 'react-helmet'
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import StreamChat from "../components/pageReactSections/stream-chat";

const Published = (props) => {
	useEffect(() => {
		props.fetchLivePage(props.subdomain);
	}, []);

	const mapReactComponent = {
		StreamChat: StreamChat,
	};

	const renderPage = () => {
		if (props.settings.loaded && props.model.sections.length) {
			return (
				<div>
				<Helmet>
					<title>{props.event.title}</title>
				</Helmet>
				<div class="fr-view">
					<ul>
						{props.model.sections.map(function (section) {
							return section.is_react
								? createElement(
										mapReactComponent[section.react_component.name],
										section.react_component.props
								  )
								: ReactHtmlParser(section.html);
						})}
					</ul>
				</div>
				</div>
			);
		} else if (props.settings.loaded) {
			return <p>No Event Found</p>;
		} else {
			return <CircularProgress />;
		}
	};

	return <div>{renderPage()}</div>;
};

const mapStateToProps = (state) => {
	return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Published);
