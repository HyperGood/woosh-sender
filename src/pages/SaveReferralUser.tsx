import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from "zod";
import Button from "~/components/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/Form/Form";
import PhoneInputField from "~/components/PhoneInput/PhoneInputField";
import { api } from "~/utils/api";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const formSchema = z.object({
  phone: z.string().refine(isPhoneValid, {
    message: "Phone number is invalid",
  }),
});

export default function SaveReferralUser() {
  const router = useRouter();

  const referrerUsername = router.query.referrer as string | undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, submitCount },
  } = form;

  const utils = api.useContext();
  const { isLoading, mutateAsync } =
    api.referralUser.createReferralUser.useMutation({
      onSuccess: () => {
        void utils.referralUser.getReferralUserData.invalidate();
      },
    });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
    async ({ phone }: z.infer<typeof formSchema>) => {
      try {
        await mutateAsync({ phone, referrerUsername });
      } catch (error) {
        toast.error(`Error: ${(error as Error).message}`);
      }
    },
    [mutateAsync, referrerUsername]
  );

  const buttonLoading = isSubmitting || isLoading;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInputField
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                We need your phone number to be able to notify you when you get
                access.
              </FormDescription>
              <FormMessage className="text-center text-error" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="full"
          disabled={(submitCount > 0 && !isValid) || isLoading}
          loading={buttonLoading}
        >
          {buttonLoading ? "One sec..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
