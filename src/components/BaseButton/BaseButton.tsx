import classnames from 'classnames';
import {ReactNode} from 'react';

interface BaseButtonProps {
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	icon?: ReactNode;
	isDisabled?: boolean;
	children: ReactNode | string;
	type?: 'submit' | 'reset' | 'button';
}

const BaseButton = ({
	                    className,
	                    onClick,
	                    icon,
	                    isDisabled,
	                    children,
	                    type,
                    }: BaseButtonProps) => (
		<button
				className={classnames(
						'border font-sans font-semibold rounded text-sm p-3 flex items-center gap-1 h-12',
						isDisabled ? 'bg-disabled-grey text-dark-grey' : className
				)}
				disabled={isDisabled}
				onClick={onClick}
				type={type}
		>
			{icon}
			{children}
		</button>
);

export default BaseButton;
