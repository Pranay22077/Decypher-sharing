// Custom flat, geometric line-icon set for Decypher.
// Drop-in replacement for the lucide-react icons the app used: same prop shape
// ({ size, className, strokeWidth, ...svgProps }), stroke = currentColor.
// Swap a file's import line `from "lucide-react"` -> `from "../components/icons"`.
import type { ComponentProps, ReactNode } from "react";

export interface IconProps extends Omit<ComponentProps<"svg">, "children"> {
  size?: number;
  strokeWidth?: number;
}

function Svg({ size = 24, strokeWidth = 2, className, children, ...rest }: IconProps & { children: ReactNode }) {
  const labelled = rest["aria-label"] != null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Activity = (p: IconProps) => (
  <Svg {...p}><path d="M3 12h4l3 7 4-15 3 8h4" /></Svg>
);
export const AlertCircle = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></Svg>
);
export const AlertTriangle = (p: IconProps) => (
  <Svg {...p}><path d="M12 4 21 19H3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></Svg>
);
export const ArrowRight = (p: IconProps) => (
  <Svg {...p}><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></Svg>
);
export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></Svg>
);
export const Award = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></Svg>
);
export const BarChart3 = (p: IconProps) => (
  <Svg {...p}><path d="M4 4v16h16" /><path d="M8 16v-4" /><path d="M12 16V8" /><path d="M16 16v-6" /></Svg>
);
export const Bell = (p: IconProps) => (
  <Svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></Svg>
);
export const Brain = (p: IconProps) => (
  <Svg {...p}><path d="M12 6a3 3 0 0 0-5.7-1.3A2.6 2.6 0 0 0 4 8a2.6 2.6 0 0 0 .7 4A2.6 2.6 0 0 0 6 16.5 2.8 2.8 0 0 0 12 18z" /><path d="M12 6a3 3 0 0 1 5.7-1.3A2.6 2.6 0 0 1 20 8a2.6 2.6 0 0 1-.7 4A2.6 2.6 0 0 1 18 16.5 2.8 2.8 0 0 1 12 18z" /></Svg>
);
export const Building = (p: IconProps) => (
  <Svg {...p}><path d="M5 21V4h10v17" /><path d="M15 9h4v12" /><path d="M3 21h18" /><path d="M8 8h.01M11 8h.01M8 12h.01M11 12h.01M8 16h.01M11 16h.01" /></Svg>
);
export const Building2 = (p: IconProps) => (
  <Svg {...p}><path d="M4 21V4h8v17" /><path d="M12 21V9h8v12" /><path d="M3 21h18" /><path d="M7 8h.01M9.5 8h.01M7 12h.01M9.5 12h.01M15.5 13h.01M15.5 16.5h.01" /></Svg>
);
export const Calendar = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="5" width="16" height="16" rx="1" /><path d="M4 9h16" /><path d="M8 3v4M16 3v4" /></Svg>
);
export const Car = (p: IconProps) => (
  <Svg {...p}><path d="M4 13l2-5.5A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.5L20 13" /><path d="M3 13h18v4H3z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /></Svg>
);
export const CheckCircle = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></Svg>
);
export const ChevronDown = (p: IconProps) => (
  <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>
);
export const ChevronRight = (p: IconProps) => (
  <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>
);
export const ClipboardList = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="4" width="14" height="17" rx="1" /><path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9z" /><path d="M8.5 11h7M8.5 15h7" /></Svg>
);
export const Clock = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
);
export const CreditCard = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M3 10h18" /><path d="M7 15h3" /></Svg>
);
export const Database = (p: IconProps) => (
  <Svg {...p}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6" /><path d="M5 12c0 1.7 3 3 7 3s7-1.3 7-3" /></Svg>
);
export const DollarSign = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v18" /><path d="M16.5 7c0-2-2-3.2-4.5-3.2S7.5 5 7.5 7 9.5 10.5 12 11s4.5 1.3 4.5 3.3S14.5 17.5 12 17.5 7.5 16.3 7.5 14.3" /></Svg>
);
export const Eye = (p: IconProps) => (
  <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const EyeOff = (p: IconProps) => (
  <Svg {...p}><path d="M4 4l16 16" /><path d="M9.5 5.4A9 9 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3 3.6" /><path d="M6 7.5A15 15 0 0 0 2 12s3.5 7 10 7a9 9 0 0 0 4-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Svg>
);
export const FastForward = (p: IconProps) => (
  <Svg {...p}><path d="M4 6l7 6-7 6z" /><path d="M13 6l7 6-7 6z" /></Svg>
);
export const FileText = (p: IconProps) => (
  <Svg {...p}><path d="M6 3h7l5 5v13H6z" /><path d="M13 3v5h5" /><path d="M9 13h6M9 17h6" /></Svg>
);
export const Filter = (p: IconProps) => (
  <Svg {...p}><path d="M3 5h18l-7 8v6l-4-2v-4z" /></Svg>
);
export const Folder = (p: IconProps) => (
  <Svg {...p}><path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></Svg>
);
export const FolderOpen = (p: IconProps) => (
  <Svg {...p}><path d="M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v2H3z" /><path d="M3 11h18l-2 8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></Svg>
);
export const GitBranch = (p: IconProps) => (
  <Svg {...p}><circle cx="7" cy="6" r="2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="8" r="2" /><path d="M7 8v8" /><path d="M17 10c0 4-4 3.5-7 4" /></Svg>
);
export const Globe = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Svg>
);
export const Headphones = (p: IconProps) => (
  <Svg {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="7" rx="1" /><rect x="17" y="13" width="4" height="7" rx="1" /></Svg>
);
export const Heart = (p: IconProps) => (
  <Svg {...p}><path d="M12 20S3 14.5 3 8.8A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 9 2.8C21 14.5 12 20 12 20z" /></Svg>
);
export const Image = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 16l-5-5-9 9" /></Svg>
);
export const Info = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></Svg>
);
export const Key = (p: IconProps) => (
  <Svg {...p}><circle cx="8" cy="8" r="4" /><path d="M11 11l9 9" /><path d="M16 16l2-2M18 18l2-2" /></Svg>
);
export const Lightbulb = (p: IconProps) => (
  <Svg {...p}><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" /><path d="M9.5 20h5" /><path d="M10.5 22h3" /></Svg>
);
export const Link = (p: IconProps) => (
  <Svg {...p}><path d="M10.5 13.5a3 3 0 0 0 4 0l3-3a3 3 0 0 0-4-4l-1 1" /><path d="M13.5 10.5a3 3 0 0 0-4 0l-3 3a3 3 0 0 0 4 4l1-1" /></Svg>
);
export const Link2 = (p: IconProps) => (
  <Svg {...p}><path d="M9 12h6" /><path d="M8 8H6a4 4 0 0 0 0 8h2" /><path d="M16 8h2a4 4 0 0 1 0 8h-2" /></Svg>
);
export const LocateFixed = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Svg>
);
export const Loader = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v4M12 17v4M5 12H3M21 12h-2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" /></Svg>
);
export const Lock = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="1" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /><path d="M12 15v2" /></Svg>
);
export const MapPin = (p: IconProps) => (
  <Svg {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const Menu = (p: IconProps) => (
  <Svg {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Svg>
);
export const MessageSquareText = (p: IconProps) => (
  <Svg {...p}><path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4V5a1 1 0 0 1 1-1z" /><path d="M8 8h8M8 11h5" /></Svg>
);
export const Network = (p: IconProps) => (
  <Svg {...p}><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M12 12H6v4M12 12h6v4" /></Svg>
);
export const Phone = (p: IconProps) => (
  <Svg {...p}><path d="M6 3h3l2 5-2.2 1.6a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></Svg>
);
export const Play = (p: IconProps) => (
  <Svg {...p}><path d="M7 5l12 7-12 7z" /></Svg>
);
export const Pause = (p: IconProps) => (
  <Svg {...p}><path d="M9 5v14M15 5v14" /></Svg>
);
export const Plus = (p: IconProps) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
);
export const Radio = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="2.5" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a9.5 9.5 0 0 0 0 14M19 5a9.5 9.5 0 0 1 0 14" /></Svg>
);
export const Search = (p: IconProps) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></Svg>
);
export const Send = (p: IconProps) => (
  <Svg {...p}><path d="M21 3 3 10.5l7 3 3 7z" /><path d="M21 3 10 13.5" /></Svg>
);
export const Server = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="7" rx="1" /><rect x="3" y="13" width="18" height="7" rx="1" /><path d="M7 7.5h.01M7 16.5h.01" /></Svg>
);
export const Shield = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l8 3v5.5c0 4.6-3.3 7.9-8 9.5-4.7-1.6-8-4.9-8-9.5V6z" /></Svg>
);
export const ShieldAlert = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l8 3v5.5c0 4.6-3.3 7.9-8 9.5-4.7-1.6-8-4.9-8-9.5V6z" /><path d="M12 8v4" /><path d="M12 15h.01" /></Svg>
);
export const Target = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 12h.01" /></Svg>
);
export const TrendingUp = (p: IconProps) => (
  <Svg {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></Svg>
);
export const Upload = (p: IconProps) => (
  <Svg {...p}><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /><path d="M8 9l4-4 4 4" /><path d="M12 5v10" /></Svg>
);
export const User = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></Svg>
);
export const UserCheck = (p: IconProps) => (
  <Svg {...p}><circle cx="9" cy="8" r="4" /><path d="M2 20a7 7 0 0 1 14 0" /><path d="M16 12l2 2 4-4" /></Svg>
);
export const Users = (p: IconProps) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M17.5 14a6 6 0 0 1 3.5 6" /></Svg>
);
export const Video = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="6" width="13" height="12" rx="1" /><path d="M16 10l5-3v10l-5-3z" /></Svg>
);
export const X = (p: IconProps) => (
  <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
);
export const XCircle = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></Svg>
);
export const Zap = (p: IconProps) => (
  <Svg {...p}><path d="M13 3 5 13h6l-1 8 8-10h-6z" /></Svg>
);
