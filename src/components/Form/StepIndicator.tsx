import { motion } from "framer-motion";
const CheckIcon = () => {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.2,
        }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        d="M1 6L6 11L16 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const StepIndicator = ({
  step,
  currentStep,
}: {
  step: number;
  currentStep: number;
}) => {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div
      animate={status}
      transition={{ duration: 0.25 }}
      initial={false}
      variants={{
        inactive: {
          borderColor: "var(--brand-black)",
          color: "var(--brand-black)",
          scale: 1,
          opacity: 0.4,
        },
        active: {
          borderColor: "var(--brand-accent)",
          color: "var(--brand-black)",
          scale: 1.1,
          opacity: 1,
        },
        complete: {
          borderColor: "var(--brand-black)",
          color: "var(--brand-white)",
          scale: 1,
          opacity: 1,
        },
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-transparent`}
    >
      <motion.div
        animate={status}
        transition={{ type: "spring" }}
        initial={{ scale: 0, backgroundColor: "var(--brand-black)" }}
        variants={{
          inactive: {
            backgroundColor: "var(--brand-white)",
            scale: 0,
          },
          active: {
            backgroundColor: "var(--brand-accent)",
            scale: 1,
          },
          complete: {
            backgroundColor: "var(--brand-black)",
            scale: 1,
          },
        }}
        className="absolute h-full w-full rounded-full"
      ></motion.div>
      <div className="relative">
        {status === "complete" ? (
          <CheckIcon />
        ) : (
          <span className="leading-none">{step}</span>
        )}
      </div>
    </motion.div>
  );
};

export default StepIndicator;
