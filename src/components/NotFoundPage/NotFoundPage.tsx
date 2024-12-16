import {Link} from 'react-router-dom';

const NotFoundPage = () => {
	return (
			<div className="flex flex-col gap-4 justify-center items-center h-full px-4 sm:px-8">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
					404 - Page Not Found
				</h1>
				<p className="text-xl sm:text-2xl text-dark-grey text-center">
					Unfortunately, the requested page does not exist.
				</p>
				<Link
						to="/"
						className="text-base sm:text-lg md:text-xl text-primary-blue hover:text-secondary-blue mt-4"
				>
					Return to the homepage
				</Link>
			</div>
	);
};

export default NotFoundPage;
