import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
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
import EvidenceDetail from "./pages/EvidenceDetail";
import VerifyPage from "./pages/VerifyPage";
import NetworkPage from "./pages/NetworkPage";
import ReportsPage from "./pages/ReportsPage";
import DemoGuide from "./pages/DemoGuide";
import Capabilities from "./pages/Capabilities";
import HowItWorks from "./pages/HowItWorks";
import Security from "./pages/Security";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CopilotWidget from "./components/CopilotWidget";
import GovFooter from "./components/GovFooter";
import SlideOver from "./components/SlideOver";
import { appMode, clearSession, currentSession } from "./lib/api";

type Role = "investigator" | "senior" | "forensics" | "admin";
type NavigateFn = (page: string, param?: string) => void;
const publicPaths = new Set(["/", "/login", "/capabilities", "/how-it-works", "/security", "/about", "/terms", "/privacy"]);

function pageForPath(path: string) {
  if (path === "/") return "landing";
  if (path.startsWith("/cases/") && path.split("/").length === 3) return "case-detail";
  if (path.startsWith("/entities/")) return "person";
  if (path.startsWith("/evidence/")) return "evidence";
  if (path.startsWith("/verify/")) return "verify";
  return path.split("/")[1] || "landing";
}

function Protected({ authenticated, children }: { authenticated: boolean; children: React.ReactNode }) {
  return authenticated ? children : <Navigate to="/login" replace state={{ reason: "protected" }} />;
}

export default function App() {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const stored = currentSession();
  const [isLoggedIn, setIsLoggedIn] = useState(() => appMode === "showcase" ? localStorage.getItem("decypher.showcase.auth") === "1" : Boolean(stored));
  const [userRole, setUserRole] = useState<Role>((stored?.role as Role) || "investigator");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname, location.search]);

  const pathFor = (page: string, param?: string) => {
    const routes: Record<string, string> = {
      landing: "/", login: "/login", dashboard: "/dashboard", cases: "/cases",
      "case-detail": `/cases/${param || "CASE-2026-017"}`, graph: "/graph", map: "/map",
      timeline: "/timeline", financial: "/financial", evidence: "/evidence", "document-tool": "/evidence?tool=document", "evidence-detail": `/evidence/${param || "EV-2026-0001"}`, network: "/network",
      reports: "/reports", demo: "/demo", capabilities: "/capabilities", "how-it-works": "/how-it-works",
      security: "/security", about: "/about", terms: "/terms", privacy: "/privacy",
      person: `/entities/${param || "PERSON-P001"}`,
      verify: `/verify/${encodeURIComponent(param || "")}`,
    };
    return routes[page] || "/";
  };

  const navigate: NavigateFn = (page, param) => {
    if (page === "person" && param) {
      setSelectedProfileId(param);
      return;
    }
    routerNavigate(pathFor(page, param));
  };
  const handleLogin = (role: Role) => {
    setIsLoggedIn(true); setUserRole(role);
    if (appMode === "showcase") localStorage.setItem("decypher.showcase.auth", "1");
    routerNavigate("/dashboard");
  };
  const handleLogout = () => { clearSession(); localStorage.removeItem("decypher.showcase.auth"); setIsLoggedIn(false); routerNavigate("/"); };
  const currentPage = useMemo(() => pageForPath(location.pathname), [location.pathname]);
  const showNavbar = location.pathname !== "/login" && !location.pathname.startsWith("/verify/");
  const showFooter = publicPaths.has(location.pathname) && location.pathname !== "/login";
  const guard = (element: React.ReactNode) => <Protected authenticated={isLoggedIn}>{element}</Protected>;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-base-bg)]">
      {showNavbar && <CypherNavbar currentPage={currentPage} onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} />}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Routes>
          <Route path="/" element={<Landing onNavigate={navigate} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={navigate} />} />
          <Route path="/capabilities" element={<Capabilities onNavigate={navigate} />} />
          <Route path="/how-it-works" element={<HowItWorks onNavigate={navigate} />} />
          <Route path="/security" element={<Security onNavigate={navigate} />} />
          <Route path="/about" element={<About onNavigate={navigate} />} />
          <Route path="/terms" element={<Terms onNavigate={navigate} />} />
          <Route path="/privacy" element={<Privacy onNavigate={navigate} />} />
          <Route path="/verify/:token" element={<VerifyPage onNavigate={navigate} />} />
          <Route path="/dashboard" element={guard(<Dashboard onNavigate={navigate} userRole={userRole} />)} />
          <Route path="/cases" element={guard(<CaseList onNavigate={navigate} />)} />
          <Route path="/cases/:caseId" element={guard(<CaseRoute onNavigate={navigate} />)} />
          <Route path="/cases/:caseId/evidence" element={guard(<EvidencePage onNavigate={navigate} />)} />
          <Route path="/graph" element={guard(<GraphPage onNavigate={navigate} />)} />
          <Route path="/map" element={guard(<MapPage onNavigate={navigate} />)} />
          <Route path="/timeline" element={guard(<TimelinePage onNavigate={navigate} />)} />
          <Route path="/financial" element={guard(<FinancialPage onNavigate={navigate} />)} />
          <Route path="/evidence" element={guard(<EvidencePage onNavigate={navigate} />)} />
          <Route path="/evidence/:evidenceId" element={guard(<EvidenceDetail onNavigate={navigate} />)} />
          <Route path="/network" element={guard(<NetworkPage onNavigate={navigate} />)} />
          <Route path="/reports" element={guard(<ReportsPage onNavigate={navigate} />)} />
          <Route path="/demo" element={guard(<DemoGuide onNavigate={navigate} />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <GovFooter onNavigate={navigate} />}
      {isLoggedIn && <CopilotWidget onNavigate={navigate} />}

      <SlideOver 
        isOpen={selectedProfileId !== null} 
        onClose={() => setSelectedProfileId(null)}
        width="w-full max-w-[1200px]"
      >
        {selectedProfileId && <PersonProfile personId={selectedProfileId} onNavigate={(p, param) => {
          setSelectedProfileId(null);
          navigate(p, param);
        }} />}
      </SlideOver>
    </div>
  );
}

function CaseRoute({ onNavigate }: { onNavigate: NavigateFn }) {
  const { caseId = "CASE-2026-017" } = useParams();
  return <CaseDetail caseId={caseId} onNavigate={onNavigate} />;
}

