import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

export const buttonStyles = cva(
  "flex items-center justify-center px-12 py-4 rounded-full focus:outline-none transition-all duration-400",
  {
    variants: {
      intent: {
        primary: "bg-brand-black text-brand-white",
        secondary:
          "bg-brand-gray-light text-brand-black focus:ring-brand-accent   transition-colors",
        danger: "bg-red-500 text-white focus:ring-red-500",
        accent:
          "bg-brand-accent text-brand-black hover:bg-brand-black hover:text-brand-accent",
        none: "px-0 py-0 hover:bg-brand-gray-light",
      },
      fullWidth: {
        true: "w-full",
      },

      disabled: {
        true: "cursor-not-allowed bg-[#DFE0DF]",
      },
      hover: {
        true: "hover:scale-105 transition-transform duration-400",
        false: "hover:bg-brand-gray-dark",
      },
      loading: {
        true: "cursor-not-allowed bg-brand-black text-brand-white w-12 h-12 rounded-full flex items-center justify-center",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

interface Props extends VariantProps<typeof buttonStyles> {
  children: string | JSX.Element;
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
  loading = false,
}: Props) => {
  return (
    <>
      {" "}
      <button
        className={buttonStyles({
          intent,
          fullWidth,
          disabled,
          hover,
          loading,
        })}
        onClick={onClick}
        disabled={disabled}
        type="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" && onClick) onClick();
        }}
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
