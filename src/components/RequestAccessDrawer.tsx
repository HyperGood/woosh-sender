import { useCallback, useState } from "react";
import { api } from "~/utils/api";
import {
  BottomDrawer,
  BottomDrawerTitle,
  BottomDrawerTrigger,
} from "./BottomDrawer";
import Button, { buttonStyles } from "./Button";
import PhoneInput, { usePhoneInput } from "./PhoneInput";

interface RequestContentProps extends ReturnType<typeof usePhoneInput> {
  onSubmit: () => void;
  isLoading: boolean;
}

function RequestContent({
  isLoading,
  onSubmit,
  ...phoneInputProps
}: RequestContentProps) {
  return (
    <>
      <BottomDrawerTitle
        className="mb-2 w-full text-left text-2xl"
        title="Request Access"
      />
      <div className="mb-5">
        Join the waitlist to access Woosh or ask a friend that uses Woosh to
        send you funds via a claim link to get access to the app.
      </div>
      <div className="mb-16 flex items-center justify-start">
        <PhoneInput {...phoneInputProps} />
      </div>
      <div className="mb-10">
        <Button size="full" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "One sec..." : "Request Access"}
        </Button>
      </div>
    </>
  );
}

function SuccessContent({ phone }: { phone: string }) {
  return (
    <>
      <BottomDrawerTitle
        className="mb-2 w-full text-left text-2xl"
        title="Yay! You're on the waitlist!"
      />
      <div className="mb-5">
        You’ll get an SMS to {phone} with a link and an invite code.
      </div>
      <div className="flex flex-grow items-center justify-center">
        <div>
          <div className="flex h-12 w-12 items-center justify-center bg-brand-main"></div>
          <p>Success!</p>
        </div>
      </div>
    </>
  );
}

export default function RequestAccessDrawer() {
  const [open, setOpen] = useState<boolean>(true);
  const phoneInputProps = usePhoneInput();
  const { inputValue } = phoneInputProps;

  const { data, isLoading, mutateAsync, error } =
    api.accessRequest.createAccessRequest.useMutation();

  const onSubmit = useCallback(() => {
    void mutateAsync({ phone: inputValue });
  }, [inputValue, mutateAsync]);

  return (
    <BottomDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <BottomDrawerTrigger
          className={buttonStyles({ intent: "secondary", size: "full" })}
          title="Request Access"
        />
      }
      content={
        data ? (
          <SuccessContent phone={data.phone} />
        ) : (
          <RequestContent
            {...phoneInputProps}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        )
      }
    />
  );
}
