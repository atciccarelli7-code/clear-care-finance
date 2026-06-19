import { InfoPage } from "@/components/shared/InfoPage";
import { site } from "@/config/site";

const Privacy = () => (
  <InfoPage
    eyebrow="Privacy"
    title="Privacy Policy"
    description="A plain-English privacy overview for this educational site."
    sections={[
      { title: "Website data", body: <p>The site may use basic analytics and hosting logs to understand usage and improve the experience.</p> },
      { title: "Calculators", body: <p>Calculator tools are intended for estimates and should not require sensitive records. Use rounded numbers when possible.</p> },
      { title: "Cookies and advertising", body: <p>The site may use cookies for functionality, analytics, or future advertising. If AdSense is enabled later, ad measurement may also use browser-based tools. Browser settings can manage cookies.</p> },
      { title: "Questions", body: <p>Email <a className="text-primary underline underline-offset-4" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with privacy questions.</p> },
    ]}
  />
);

export default Privacy;
