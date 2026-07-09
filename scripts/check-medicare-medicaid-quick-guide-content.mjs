import { checkQuickGuideContent } from "./check-quick-guide-content.mjs";

if (!checkQuickGuideContent(["hospital-discharge-medicare-quick-guide"])) {
  process.exit(1);
}
