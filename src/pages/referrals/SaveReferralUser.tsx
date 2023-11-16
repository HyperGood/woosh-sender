import { useCallback } from "react";
import Button from "~/components/Button";
import PhoneInput, { usePhoneInput } from "~/components/PhoneInput";
import { api } from "~/utils/api";

export default function SaveReferralUser() {
  const phoneInputProps = usePhoneInput();
  const { inputValue } = phoneInputProps;

  const { isLoading, mutateAsync, error } =
    api.referralUser.createReferralUser.useMutation();

  const onSubmit = useCallback(() => {
    void mutateAsync({ phone: inputValue });
    // TODO: useEffect toast when error
  }, [inputValue, mutateAsync]);

  // TODO: Add Phone validation
  return (
    <div>
      <div className="mb-5">
        We need your phone number to be able to notify you when you get access.
      </div>
      <div className="mb-16 flex items-center justify-start">
        <PhoneInput {...phoneInputProps} />
      </div>
      <div className="mb-10">
        <Button size="full" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "One sec..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
