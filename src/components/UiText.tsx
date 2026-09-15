import { type ReactNode } from "react"
import { useLocale } from "../context/LocaleContext"
import { translateUi } from "../context/uiMessages"

// Localize interface strings while preserving identifiers and source document text.
export default function UiText({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  return (
    <>
      {typeof children === "string" ? translateUi(children, locale) : children}
    </>
  )
}
export function useUiTranslation() {
  const { locale } = useLocale()
  return (text: string) => translateUi(text, locale)
}
