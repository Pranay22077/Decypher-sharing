# Decypher - Criminal Network Intelligence Platform

An AI-powered investigation platform designed to transform fragmented crime-related information into connected, explainable, and actionable intelligence.

## Features

- **Multi-Source Data Integration** - Ingest data from FIRs, forensic reports, CDRs, financial records, and more
- **AI-Powered Entity Extraction** - Automatically identify persons, organizations, locations, vehicles, phone numbers
- **3D Knowledge Graph** - Interactive 3D visualization of criminal networks using Three.js
- **Geospatial Intelligence** - Map-based tracking and analysis focused on India
- **Timeline Reconstruction** - Chronological event correlation and analysis
- **Financial Intelligence** - Track money trails and suspicious transactions
- **Evidence Chain Management** - Complete chain of custody with traceability
- **Security & Compliance** - Role-based access control, audit trails, encryption

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0
- **3D Graphics**: Three.js
- **Maps**: Leaflet + React Leaflet
- **Icons**: Lucide React
- **Fonts**: IBM Plex Sans, Work Sans, Noto Sans

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment

The app runs on `http://localhost:5173` by default.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── CypherNavbar.tsx
│   ├── KnowledgeGraph3D.tsx
│   ├── LeafletMap.tsx
│   └── CopilotWidget.tsx
├── pages/           # Main application pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── GraphPage.tsx
│   ├── Capabilities.tsx
│   └── ...
├── data/            # Dummy data for prototyping
├── App.tsx          # Main app component with routing
└── index.css        # Global styles
```

## Key Pages

- **Landing** - Public marketing page with features overview
- **Dashboard** - Command center with case statistics
- **Graph** - Interactive 3D network visualization
- **Map** - Geospatial intelligence with India focus
- **Timeline** - Event chronology and correlation
- **Evidence** - Evidence management with chain of custody

## Configuration

### Routing

Simple state-based routing without external router library. See `App.tsx` for page navigation logic.

### Styling

Government-grade visual language with:
- Off-white warm neutral backgrounds (#fafaf9)
- Navy blue primary color (#001f3f)
- Flat, functional UI with minimal shadows
- Professional typography

## Security Features

- Role-based access control (Admin, Senior Investigator, Investigator, Forensics)
- Multi-factor authentication support
- End-to-end encryption
- Comprehensive audit trails
- Session management

## Contributing

This is a prototype/demonstration project. For production deployment, additional security hardening, backend integration, and compliance requirements should be implemented.

## License

Proprietary - Indian Government Intelligence Platform

## Contact

For inquiries about deployment or customization, please contact the development team.

---

**Note**: This is a frontend prototype with dummy data. A production system would require:
- Backend API integration
- Real database connections
- Authentication/authorization system
- Data encryption at rest
- Compliance with IT Act 2000, Evidence Act, CrPC
- Security audits and penetration testing
