import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "hi";

const messages = {
  en: {
    home: "Home", capabilities: "Capabilities", how: "How It Works", security: "Security", about: "About",
    dashboard: "Command Center", cases: "Cases", graph: "Investigation Graph", map: "Geo Intelligence",
    timeline: "Timeline", financial: "Financial", evidence: "Evidence", network: "Network", reports: "Reports",
    login: "Authorized Login", logout: "Sign Out", english: "English", hindi: "हिंदी", accessibility: "Accessibility",
    localRequired: "Local secure service required", product: "Decypher by Epoch",
  },
  hi: {
    home: "मुखपृष्ठ", capabilities: "क्षमताएँ", how: "कार्यप्रणाली", security: "सुरक्षा", about: "परिचय",
    dashboard: "कमांड सेंटर", cases: "केस", graph: "जाँच ग्राफ", map: "भौगोलिक खुफिया",
    timeline: "समयरेखा", financial: "वित्तीय", evidence: "साक्ष्य", network: "नेटवर्क", reports: "रिपोर्ट",
    login: "अधिकृत लॉगिन", logout: "साइन आउट", english: "English", hindi: "हिंदी", accessibility: "सुगम्यता",
    localRequired: "स्थानीय सुरक्षित सेवा आवश्यक है", product: "डिसाइफर बाय एपोक",
  },
} as const;

type MessageKey = keyof typeof messages.en;
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: (key: MessageKey) => string }>({ locale: "en", setLocale: () => {}, t: (key) => messages.en[key] });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => localStorage.getItem("ui.lang") === "hi" ? "hi" : "en");
  useEffect(() => { localStorage.setItem("ui.lang", locale); document.documentElement.lang = locale; }, [locale]);
  const value = useMemo(() => ({ locale, setLocale, t: (key: MessageKey) => messages[locale][key] }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

