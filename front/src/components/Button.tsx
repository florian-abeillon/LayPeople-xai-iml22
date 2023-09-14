// eslint-disable-next-line no-use-before-define
import React from 'react';

type Props = {
    // eslint-disable-next-line no-unused-vars
    onClick?: (e: any) => any,
    children?: React.ReactNode,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
}

const classNames = [
  'appearance-none',
  'h-12',
  'px-6',
  'my-2',
  'text-md',
  'text-sky-100',
  'transition-colors',
  'duration-150',
  'bg-sky-900',
  'bg-opacity-75',
  'rounded-lg',
  'focus:shadow-outline',
  'hover:bg-sky-900',
//   'mr-4',
];
const Button = ({
  onClick,
  children,
  disabled,
  type,
}: Props) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={classNames.join(' ')}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  onClick: null,
  children: null,
  disabled: false,
  type: 'button',
};

export default Button;