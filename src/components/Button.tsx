import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

export const buttonStyles = cva(
  'flex items-center justify-center px-12 py-4 rounded-full focus:outline-none transition-colors',
  {
    variants: {
      intent: {
        primary: 'bg-brand-gray-light text-brand-black',
        secondary:
          'bg-brand-black text-brand-white focus:ring-brand-accent   transition-colors',
        danger: 'bg-red-500 text-white focus:ring-red-500',
      },
      fullWidth: {
        true: 'w-full',
      },
      disabled: {
        true: 'opacity-20 cursor-not-allowed',
      },
      hover: {
        true: 'hover:bg-brand-accent hover:text-brand-black',
        false: 'hover:bg-brand-gray-dark',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

interface Props extends VariantProps<typeof buttonStyles> {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  hover?: boolean;
  disabledMessage?: string;
}

const Button = ({
  intent,
  fullWidth,
  children,
  disabled = false,
  onClick,
  disabledMessage,
  hover = true,
}: Props) => {
  return (
    <>
      {' '}
      <button
        className={buttonStyles({ intent, fullWidth, disabled, hover })}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
      {disabled ? (
        <span className="mt-2 block text-center text-sm text-error ">
          {disabledMessage}
        </span>
      ) : null}
    </>
  );
};

export default Button;
