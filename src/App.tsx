import { useState } from "react";
import CypherNavbar from "./components/CypherNavbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/CaseList";
import CaseDetail from "./pages/CaseDetail";
import PersonProfile from "./pages/PersonProfile";
import GraphPage from "./pages/GraphPage";
import MapPage from "./pages/MapPage";
import TimelinePage from "./pages/TimelinePage";
import FinancialPage from "./pages/FinancialPage";
import EvidencePage from "./pages/EvidencePage";
import Capabilities from "./pages/Capabilities";
import HowItWorks from "./pages/HowItWorks";
import Security from "./pages/Security";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CopilotWidget from "./components/CopilotWidget";
import GovFooter from "./components/GovFooter";

type Page =
  | "landing" | "login"
  | "dashboard" | "cases" | "case-detail"
  | "graph" | "map" | "timeline" | "financial" | "evidence"
  | "person"
  | "capabilities" | "how-it-works" | "security" | "about"
  | "terms" | "privacy";

type Role = "investigator" | "senior" | "forensics" | "admin";

const NO_NAVBAR_PAGES = new Set<Page>(["login"]);
const NO_FOOTER_PAGES = new Set<Page>(["login"]);

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [pageParam, setPageParam] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role>("investigator");

  const navigate = (p: string, param?: string) => {
    // Guard: redirect to login if not authenticated and trying to access app
    const appPages = ["dashboard", "cases", "case-detail", "graph", "map", "timeline", "financial", "evidence", "person"];
    if (appPages.includes(p) && !isLoggedIn) {
      setPage("login");
      return;
    }
    setPage(p as Page);
    setPageParam(param || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (role: Role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("landing");
  };

  const showNavbar = !NO_NAVBAR_PAGES.has(page);
  const showFooter = !NO_FOOTER_PAGES.has(page);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-base-bg)]">
      {showNavbar && (
        <CypherNavbar
          currentPage={page}
          onNavigate={navigate}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          userRole={userRole}
        />
      )}

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/* Public pages */}
        {page === "landing" && <Landing onNavigate={navigate} />}
        {page === "login" && <Login onLogin={handleLogin} onNavigate={navigate} />}
        {page === "capabilities" && <Capabilities onNavigate={navigate} />}
        {page === "how-it-works" && <HowItWorks onNavigate={navigate} />}
        {page === "security" && <Security onNavigate={navigate} />}
        {page === "about" && <About onNavigate={navigate} />}
        {page === "terms" && <Terms onNavigate={navigate} />}
        {page === "privacy" && <Privacy onNavigate={navigate} />}

        {/* Protected pages */}
        {isLoggedIn && (
          <>
            {page === "dashboard" && <Dashboard onNavigate={navigate} userRole={userRole} />}
            {page === "cases" && <CaseList onNavigate={navigate} />}
            {page === "case-detail" && <CaseDetail caseId={pageParam || "CASE-2026-017"} onNavigate={navigate} />}
            {page === "graph" && <GraphPage onNavigate={navigate} />}
            {page === "map" && <MapPage onNavigate={navigate} />}
            {page === "timeline" && <TimelinePage onNavigate={navigate} />}
            {page === "financial" && <FinancialPage onNavigate={navigate} />}
            {page === "evidence" && <EvidencePage onNavigate={navigate} />}
            {page === "person" && <PersonProfile personId={pageParam || "PERSON-A"} onNavigate={navigate} />}
          </>
        )}
      </main>

      {showFooter && <GovFooter onNavigate={navigate} />}
      {isLoggedIn && <CopilotWidget onNavigate={navigate} />}
    </div>
  );
}
