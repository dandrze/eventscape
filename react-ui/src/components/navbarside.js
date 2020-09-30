import React from "react";
import { Link } from "react-router-dom";

/*
const navbarside = props => (
    <nav className='navbarside_nav'>
        <ul className="navbarside_ul">
            <li className="navbarside_item"><Link to="/">Design</Link></li>
            <li className="navbarside_item"><Link to="/">Communicate</Link></li>
            <li className="navbarside_item"><Link to="/">Registrations</Link></li>
            <li className="navbarside_item"><Link to="/">Analytics</Link></li>
            <li className="navbarside_item"><Link to="/">Messaging</Link></li>
        </ul>
    </nav>
);

export default navbarside;
*/

function navbarside() {
	return (
		<nav className="navbarside_nav">
			<ul className="navbarside_ul">
				<li className="navbarside_item">
					<Link to="/">Design</Link>
				</li>
				<li className="navbarside_item">
					<Link to="/">Communicate</Link>
				</li>
				<li className="navbarside_item">
					<Link to="/">Registrations</Link>
				</li>
				<li className="navbarside_item">
					<Link to="/">Analytics</Link>
				</li>
				<li className="navbarside_item">
					<Link to="/">Messaging</Link>
				</li>
			</ul>
		</nav>
	);
}

export default navbarside;
