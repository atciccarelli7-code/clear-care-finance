const SEARCH_INTENT_TITLES: Record<string, string> = {
  "/hospital-financial-assistance/novant-health-north-carolina": "Novant Health Financial Assistance: Income Limits & Application",
  "/hospital-financial-assistance/ecu-health": "ECU Health Financial Assistance: Income Limits & Application",
  "/hospital-financial-assistance/atrium-health": "Atrium Health Financial Assistance: Income Limits & Application",
  "/hospital-financial-assistance/northwestern-medicine": "Northwestern Medicine Financial Assistance & Application",
  "/hospital-financial-assistance/duke-health": "Duke Health Financial Assistance: Income Limits & Application",
};

export const getSearchIntentTitle = (pathname: string) => SEARCH_INTENT_TITLES[pathname];
