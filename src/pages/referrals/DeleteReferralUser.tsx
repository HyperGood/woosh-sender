import { useCallback } from "react";
import Button from "~/components/Button";
import { api } from "~/utils/api";

export default function DeleteReferralUser() {
  const utils = api.useContext();
  const { mutateAsync } = api.referralUser.deleteReferralUser.useMutation({
    onSuccess: () => {
      void utils.referralUser.getReferralUserData.invalidate();
    },
  });

  const onSubmit = useCallback(() => {
    void mutateAsync();
    // TODO: useEffect toast when error
  }, [mutateAsync]);

  return <Button onClick={onSubmit}>DeleteReferralUser</Button>;
}
