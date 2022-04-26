import Button, { ButtonSize } from "@/components/Button";
import ProgressBar from "@/components/form/ProgressBar";
import Selectable from "@/components/form/Selectable";
import { Heading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags";
import { MemberPublic } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { clearAllStoredFields, FORM_LINKS } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";

interface RequestFormProps {
  onToggle?: () => void;
}

export default function RequestForm({ onToggle }: RequestFormProps) {
  const router = useRouter();
  const { setItem } = useStorage();
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [disableButton, setButtonIsDisabled] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean[]>([false, false, false]);
  const [memberSelected, setMemberSelected] = useState<MemberPublic>();

  const selected = editing.findIndex((el) => el) >= 0;

  useEffect(() => {
    fetch("/api/get-members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      });
  }, []);

  useEffect(() => {
    // reset selection
    setEditing([false, false, false]);
    clearAllStoredFields("edit");
    clearAllStoredFields("new");
    // add all items in storage
    if (!memberSelected) return;
    if (memberSelected?.name) setItem("editName", memberSelected.name);
    if (memberSelected?.id) setItem("editId", memberSelected.id);
    if (memberSelected?.link) setItem("editWebsite", memberSelected.link);
    if (memberSelected?.title) setItem("editTitle", memberSelected.title);
    if (memberSelected?.yearsExperience)
      setItem("editYearsExperience", memberSelected.yearsExperience);
    if (memberSelected?.companySize)
      setItem("editCompanySize", memberSelected.companySize);
    if (memberSelected?.location)
      setItem(
        "editLocation",
        `${memberSelected.location}, ${memberSelected.region}`
      );
    if (memberSelected?.focus) {
      setItem(
        "editFocuses",
        JSON.stringify(memberSelected.focus.map((foc) => foc.id))
      );
    }
    if (memberSelected?.industry)
      setItem(
        "editIndustries",
        JSON.stringify(memberSelected.industry.map((foc) => foc.id))
      );
    if (memberSelected?.emailAbbr)
      setItem("editEmailAbbr", JSON.stringify(memberSelected.emailAbbr));
  }, [memberSelected]);

  useEffect(() => {
    setButtonIsDisabled(!selected);
  }, [editing]);

  const handleSubmit = () => {
    if (!selected) return;
    let editMap: string = "";
    FORM_LINKS.forEach((item, index) => {
      editMap += editing[index] ? "1" : "0";
    });
    router.push({
      pathname: `/edit/${FORM_LINKS[editing.findIndex((el) => el)]}`,
      query: { sections: editMap },
    });
  };

  const handleToggle = () => {
    router.push({ pathname: `/join` });
  };

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader hideCenter showModify toggleEdit={handleToggle}>
        <ProgressBar
          headline="Public"
          label="Who You Are"
          currentCount={1}
          totalCount={4}
        />
      </JoinHeader>
      <Heading>Request Changes</Heading>
      <div className="request-form">
        <label htmlFor="member-select">Request edit for:</label>
        <select
          name="member-select"
          id="member-select"
          onChange={(e) => {
            setMemberSelected(
              members.find((member) => member.id === e.target.value)
            );
          }}
        >
          {members?.length > 0 ? (
            <option value="">Please choose an option</option>
          ) : (
            <option value="">loading</option>
          )}
          {members?.map((member: MemberPublic) => (
            <option value={member.id} key={`member-${member.id}`}>
              {member.name}
            </option>
          ))}
        </select>
        {memberSelected && (
          <>
            <h4>
              I would like to <strong>update / change</strong>:
            </h4>
            <div className="request-form__options">
              <Selectable
                headline={"Basic Information"}
                byline={`${
                  (memberSelected.name ? 1 : 0) +
                  (memberSelected.location ? 1 : 0) +
                  (memberSelected.link ? 1 : 0)
                } / 3 Completed`}
                fullWidth
                selected={editing[0]}
                onClick={() =>
                  setEditing([!editing[0], editing[1], editing[2]])
                }
              />
              <Selectable
                headline={`Work Experience`}
                byline={`${
                  (memberSelected.focus ? 1 : 0) +
                  (memberSelected.title ? 1 : 0) +
                  (memberSelected.yearsExperience ? 1 : 0)
                } / 3 Completed`}
                fullWidth
                selected={editing[1]}
                onClick={() =>
                  setEditing([editing[0], !editing[1], editing[2]])
                }
              />
              <Selectable
                headline={`Company / Industry`}
                byline={`${
                  (memberSelected.industry ? 1 : 0) +
                  (memberSelected.companySize ? 1 : 0)
                } / 2 Completed`}
                fullWidth
                selected={editing[2]}
                onClick={() =>
                  setEditing([editing[0], editing[1], !editing[2]])
                }
              />
            </div>

            <Button
              size={ButtonSize.Small}
              onClick={handleSubmit}
              disabled={disableButton}
            >
              Continue
            </Button>
            <a>Remove me from this list</a>
          </>
        )}
        <style jsx>{`
          .request-form {
            margin: 0 auto 1rem;
            max-width: ${theme.layout.width.interior};
            z-index: ${theme.layout.zIndex.above};
          }
          .request-form__options {
            display: grid;
            grid-auto-rows: 4rem;
            grid-column-gap: 0.5rem;
            grid-row-gap: 0.5rem;
            margin-bottom: 1rem;
          }
          h3 {
            margin: 2rem 0 0.5rem;
            font-size: 1.6rem;
            font-weight: 400;
            color: ${theme.color.text.alt};
          }
          h4 {
            margin: 1rem 0 0.5rem;
            font-size: 1.2rem;
            font-weight: 400;
          }
          label {
            margin: 0 0.5rem 0 0;
            white-space: nowrap;
            font-size: 1.5rem;
            color: ${theme.color.text.alt};
          }
          select {
            font-size: 1.25rem;
          }
        `}</style>
      </div>
    </>
  );
}
