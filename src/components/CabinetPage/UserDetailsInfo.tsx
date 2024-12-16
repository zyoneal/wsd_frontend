import {UserDto} from '../../interfaces/response/UserDto';

const UserDetailsInfo = ({ user }: { user: UserDto }) => (
		<div className="space-y-10 text-sm">
			<section className="space-y-6">
				<h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<p className="flex flex-col">
						<span className="text-sm text-gray-500">Username</span>
						<span className="text-lg font-medium text-gray-900">{user.username}</span>
					</p>
				</div>
			</section>
			
			<section className="space-y-6">
				<h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
				<p className="text-sm text-gray-500">Email</p>
				<div className="text-lg font-medium text-gray-900">{user.email}</div>
			</section>
		</div>
);

export default UserDetailsInfo;
