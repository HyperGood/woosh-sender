import type { Data } from "~/components/ComboboxSelect";

export interface Country extends Data {
  additionalProperties: {
    name: string;
    abbr: string;
    code: string;
  };
}

export const COUNTRIES = [
  {
    id: 1,
    displayValue: "🇺🇸 US +1",
    additionalProperties: {
      name: "United States of America",
      abbr: "US",
      code: "+1",
    },
  },
  {
    id: 2,
    displayValue: "🇲🇽 MX +52",
    additionalProperties: {
      name: "Mexico",
      abbr: "MX",
      code: "+52",
    },
  },
  {
    id: 3,
    displayValue: "🇨🇦 CA +1",
    additionalProperties: {
      name: "Canada",
      abbr: "CA",
      code: "+1",
    },
  },
  {
    id: 4,
    displayValue: "🇨🇴 CO +57",
    additionalProperties: {
      name: "Colombia",
      abbr: "CO",
      code: "+57",
    },
  },
  {
    id: 5,
    displayValue: "🇭🇳 HN +504",
    additionalProperties: {
      name: "Honduras",
      abbr: "HN",
      code: "+504",
    },
  },
  {
    id: 6,
    displayValue: "🇬🇹 GT +502",
    additionalProperties: {
      name: "Guatemala",
      abbr: "GT",
      code: "+502",
    },
  },
  {
    id: 7,
    displayValue: "🇦🇷 AR +54",
    additionalProperties: {
      name: "Argentina",
      abbr: "AR",
      code: "+54",
    },
  },
];
