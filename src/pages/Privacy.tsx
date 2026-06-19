import { InfoPage } from "@/components/shared/InfoPage";

const Privacy = () => (
  <InfoPage
    eyebrow="Privacy"
    title="Privacy Policy"
    description="A plain-English privacy overview for this educational site."
    sections={[
      { title: "Website data", body: <p>The site may use basic analytics and hosting logs to understand usage and improve the experience.</p> },
      { title: "Calculators", body: <p>Calculator tools are intended for estimates and should not require sensitive records.</p> },
      { title: "Cookies", body: <p>The site may use cookies for functionality, analytics, or future advertising. Browser settings can manage cookies.</p> },
    ]}
  />
);

export default Privacy;
