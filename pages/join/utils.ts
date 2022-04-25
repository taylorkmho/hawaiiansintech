import { useStorage } from "@/lib/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const FORM_LINKS = [`01-you`, `02-work`, `03-company`, `04-contact`];

const ALL_STORED_FIELDS = [
  "jfName",
  "jfLocation",
  "jfWebsite",
  "jfFocuses",
  "jfFocusSuggested",
  "jfTitle",
  "jfDeferTitle",
  "jfYearsExperience",
  "jfIndustries",
  "jfDeferIndustry",
  "jfIndustrySuggested",
  "jfCompanySize",
];

export const clearAllStoredFields = () => {
  const { removeItem } = useStorage();
  ALL_STORED_FIELDS.map((item) => removeItem(item));
};

interface useInvalidProps {
  currentPage: `01-you` | `02-work` | `03-company` | `04-contact`;
}

export const useInvalid = ({ currentPage }: useInvalidProps) => {
  const { getItem } = useStorage();
  const router = useRouter();
  let invalid =
    !getItem("jfName") || !getItem("jfLocation") || !getItem("jfWebsite");
  switch (currentPage) {
    case `02-work`:
      return useEffect(() => {
        if (invalid) router.push({ pathname: "01-you", query: { r: "02" } });
      }, []);
    case `03-company`:
      invalid =
        invalid ||
        !getItem("jfYearsExperience") ||
        ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
          !getItem("jfFocusSuggested")) ||
        (!getItem("jfTitle") && !getItem("jfDeferTitle"));
      return useEffect(() => {
        if (invalid) router.push({ pathname: "01-you", query: { r: "03" } });
      }, []);
    case `04-contact`:
      return useEffect(() => {
        invalid =
          invalid ||
          !getItem("jfYearsExperience") ||
          ([...JSON.parse(getItem("jfFocuses") || "[]")].length < 1 &&
            !getItem("jfFocusSuggested")) ||
          (!getItem("jfTitle") && !getItem("jfDeferTitle")) ||
          ([...JSON.parse(getItem("jfIndustries") || "[]")].length < 1 &&
            !getItem("jfDeferIndustry") &&
            !getItem("jfIndustrySuggested")) ||
          (!getItem("jfCompanySize") && getItem("jfCompanySize") !== "N/A");
        if (invalid) router.push({ pathname: "01-you", query: { r: "04" } });
      }, []);
  }
};

export const MAX_FOCUS_COUNT = 3;
