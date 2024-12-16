import {useEffect, useState} from 'react';
import {UserDto} from '../../interfaces/response/UserDto';
import {userService} from '../../services/UserService';
import UserDetailsInfo from './UserDetailsInfo';

const CabinetPage = () => {
	const [user, setUser] = useState<UserDto>();
	
	useEffect(() => {
		userService
				.getCabinetInfo()
				.then((res) => setUser(res.data))
				.catch((error) => console.error(error));
	}, []);
	
	if (user) {
		return (
				<div className="p-8 max-w-7xl mx-auto">
					<div className="border-b-2 border-light-grey pb-4 mb-8">
						<h2 className="text-3xl font-extrabold text-gray-900">User Dashboard</h2>
					</div>
					<UserDetailsInfo user={user} />
				</div>
		);
	}
	
	return <div className="text-center text-lg text-gray-500">Loading...</div>;
};

export default CabinetPage;
