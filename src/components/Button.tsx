import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

export const buttonStyles = cva(
  "flex items-center justify-center rounded-full focus:outline-none transition-all duration-400",
  {
    variants: {
      intent: {
        primary: "bg-brand-black text-brand-white",
        brand: "bg-brand-main text-brand-white shadow-brand-main/60 shadow-md ",
        secondary:
          "bg-brand-gray-light text-brand-black focus:ring-brand-accent   transition-colors",
        danger: "bg-red-500 text-white focus:ring-red-500",
        accent:
          "bg-brand-gray-light text-brand-accent hover:bg-brand-accent hover:text-brand-white",
        outline:
          "text-black border border-black bg-transparent hover:bg-black hover:text-white",
        none: "px-0 py-0 hover:bg-brand-gray-light",
      },
      size: {
        small: "px-4 py-2",
        full: "w-full py-4",
        medium: "px-12 py-4",
      },

      disabled: {
        true: "cursor-not-allowed opacity-60 disabled shadow-none",
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
      size: "medium",
    },
  }
);

interface Props extends VariantProps<typeof buttonStyles> {
  children: string | JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  hover?: boolean;
  errorMessage?: string;
}

const Button = ({
  intent,
  size,
  children,
  disabled = false,
  onClick,
  errorMessage,
  hover = true,
  loading = false,
}: Props) => {
  return (
    <>
      {" "}
      <button
        className={buttonStyles({
          intent,
          disabled,
          hover,
          loading,
          size,
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
      {errorMessage ? (
        <span className="mt-2 block text-center text-sm text-error ">
          {errorMessage}
        </span>
      ) : null}
    </>
  );
};

export default Button;
