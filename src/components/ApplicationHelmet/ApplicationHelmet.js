import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';


const ApplicationHelmet = ({ title, description }) => {
	return (
		<div className="ApplicationHelmet">
			<Helmet>
				<meta charSet="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="description" content={description} />
				<title> {title} </title>
				<link rel="canonical" href="#" />
			</Helmet>
		</div>
	);
};

ApplicationHelmet.defaultProps = {
	title: 'React App',
	description: 'Web site created using create-react-app',
};

ApplicationHelmet.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

export default ApplicationHelmet;
