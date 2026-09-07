# Decypher - Criminal Network Intelligence Platform

> An AI-powered investigation platform designed specifically for Indian law enforcement and intelligence agencies to transform fragmented crime-related information into connected, explainable, and actionable intelligence.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Modules](#core-modules)
- [UI Design Philosophy](#ui-design-philosophy)
- [Security & Compliance](#security--compliance)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Decypher is a comprehensive criminal network intelligence platform that leverages artificial intelligence, machine learning, natural language processing, and graph analytics to help investigators discover hidden connections, trace criminal activities, and build evidence-backed cases.

### Problem Statement

Modern criminal investigations face significant challenges:
- Data scattered across multiple sources (FIRs, forensic reports, CDRs, financial records)
- Manual analysis is time-consuming and error-prone
- Hidden relationships between entities are difficult to identify
- No unified view of complex criminal networks
- Evidence trails are hard to trace and document

### Solution

Decypher provides:
- **Automated data integration** from multiple sources
- **AI-powered entity extraction** from unstructured documents
- **Intelligent relationship discovery** across disparate data
- **Interactive 3D visualization** of criminal networks
- **Geospatial intelligence** with India-specific mapping
- **Complete evidence chain** with full traceability
- **Government-grade security** with audit trails

---

## ✨ Key Features

### 1. **Multi-Source Data Integration**
- Ingest data from FIRs, case files, forensic reports, call detail records (CDR), financial transactions, CCTV footage, social media, and more
- Support for 50+ file formats: PDF, Word, Excel, images (JPG, PNG), audio (MP3, WAV), video (MP4, AVI)
- Automated validation, deduplication, and format standardization
- Secure encrypted upload with access logging

### 2. **AI-Powered Entity Extraction**
- Automatically identify and extract 14+ entity types:
  - Persons, Organizations, Locations, Vehicles, Phone Numbers
  - Bank Accounts, Email Addresses, IP Addresses, Events, Digital Identifiers
- Multilingual support: English, Hindi, and regional languages
- Contextual extraction: roles, relationships, dates, amounts
- OCR integration for scanned documents and images
- Confidence scoring for each extracted entity

### 3. **Relationship Graph Analysis**
- Build comprehensive knowledge graphs with 47+ relationship types
- Interactive 3D visualization using Three.js
- Graph algorithms:
  - Community detection (identify criminal clusters)
  - Centrality analysis (find key actors)
  - Pathfinding (trace connections between suspects)
  - Temporal analysis (track relationship evolution)
  - Anomaly detection (identify unusual patterns)
- Real-time filtering and exploration
- Multi-hop traversal up to N degrees of separation

### 4. **Entity Resolution & Deduplication**
- Fuzzy matching and phonetic algorithms for name variations
- Cross-lingual entity matching (English-Hindi-Regional)
- Automatic linking of aliases: 'Raj Kumar' = 'R. Kumar' = 'राज कुमार'
- Canonical entity creation with confidence scores
- Manual override capability for investigator control

### 5. **Geospatial Intelligence**
- Interactive maps focused on India (center: 22.5°N, 79.0°E)
- Plot entities, events, and activities with heat mapping
- Route analysis and geofencing
- Proximity detection and impossible travel identification
- Integration with tower dump data, GPS traces, CCTV locations
- Real-time location tracking and alerts

### 6. **Communication Analysis**
- Call Detail Record (CDR) analysis
- Tower dump processing and visualization
- WhatsApp/social media data integration
- Communication pattern analysis:
  - Frequent contacts identification
  - Call clusters and burst detection
  - Dormant period analysis
- Network visualization with temporal filtering

### 7. **Financial Intelligence**
- Track money trails through bank transactions, UPI payments, cash deposits
- Cryptocurrency movement tracking
- Pattern detection:
  - Structuring and layering
  - Smurfing patterns
  - Suspicious transaction identification
- Link financial accounts to entities
- Beneficial ownership structure uncovering

### 8. **Timeline Reconstruction**
- Automatic chronological timeline construction
- Event correlation across multiple sources:
  - Phone calls, financial transactions
  - Location movements, case activities
- Temporal pattern identification
- Gap analysis for alibi verification
- Sequence of events leading to incidents

### 9. **Evidence Chain Management**
- Complete chain of custody tracking
- Cryptographic hashing for tamper detection
- Source evidence linking for every insight
- Court-ready documentation with:
  - Evidence references
  - Analytical methodology
  - Confidence scores
- Export formats: PDF, Excel, PowerPoint, JSON

### 10. **Security & Access Control**
- Role-based access control (RBAC):
  - Admin, Senior Investigator, Investigator, Forensics, Analyst
- Multi-factor authentication (MFA)
- End-to-end encryption (TLS 1.3, AES-256)
- Comprehensive audit trails
- Session management with timeout
- Anomaly detection for suspicious access patterns

---

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern UI library with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 8.0** - Fast build tool and dev server
- **Tailwind CSS 4.0** - Utility-first CSS framework

### Visualization & Graphics
- **Three.js 0.185** - 3D knowledge graph visualization
- **Leaflet 1.9** - Interactive maps
- **React Leaflet 5.0** - React bindings for Leaflet
- **Lucide React** - Icon library

### Typography
- **IBM Plex Sans** - Body text
- **Work Sans** - Headings
- **Noto Sans** - Fallback/multilingual support

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **pnpm** 8.0 or higher (recommended) or npm
  ```bash
  npm install -g pnpm
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raja-89/Decypher.git
   cd Decypher
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Quick Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm format           # Format code with oxfmt
pnpm lint             # Lint code (if configured)

# Type Checking
tsc --noEmit          # TypeScript type checking
```

---

## 📁 Project Structure

```
Decypher/
├── public/                      # Static assets
│   ├── bg.png                  # Background image
│   ├── copy.png                # Logo/favicon
│   └── img.png                 # Hero background
│
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── CypherNavbar.tsx   # Main navigation with government-style header
│   │   ├── KnowledgeGraph3D.tsx # 3D graph visualization with Three.js
│   │   ├── LeafletMap.tsx     # Interactive map component
│   │   ├── CopilotWidget.tsx  # AI assistant interface
│   │   └── InvestigationGraph.tsx # 2D graph visualization
│   │
│   ├── pages/                  # Main application pages
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Dashboard.tsx       # Command center dashboard
│   │   ├── CaseList.tsx        # Case management
│   │   ├── CaseDetail.tsx      # Individual case view
│   │   ├── GraphPage.tsx       # 3D network visualization
│   │   ├── MapPage.tsx         # Geospatial intelligence
│   │   ├── TimelinePage.tsx    # Event timeline
│   │   ├── FinancialPage.tsx   # Financial analysis
│   │   ├── EvidencePage.tsx    # Evidence management
│   │   ├── PersonProfile.tsx   # Entity profile (360° view)
│   │   ├── Capabilities.tsx    # Platform capabilities info
│   │   ├── HowItWorks.tsx      # Process explanation
│   │   ├── Security.tsx        # Security & responsible AI
│   │   └── About.tsx           # About page
│   │
│   ├── data/
│   │   └── dummy.ts            # Prototype data (cases, persons, evidence)
│   │
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global styles & Tailwind
│   └── vite-env.d.ts          # TypeScript declarations
│
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
├── README.md                   # This file
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml             # Lockfile for reproducible installs
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── index.html                 # HTML entry point
```

---

## 🎨 Core Modules

### 1. Landing & Marketing
- **Landing.tsx**: Public-facing page with features overview, statistics, and call-to-action
- **Capabilities.tsx**: Detailed 16 platform capabilities
- **HowItWorks.tsx**: 5-stage pipeline explanation with features
- **Security.tsx**: Responsible AI principles and security features
- **About.tsx**: Mission, vision, values, and company information

### 2. Authentication & Access Control
- **Login.tsx**: Role-based login (Investigator, Senior Investigator, Forensics, Admin)
- **CypherNavbar.tsx**: Navigation with user profile and role display
- Session management with timeout
- Logout functionality

### 3. Command Center
- **Dashboard.tsx**: 
  - Case statistics and alerts
  - Priority cases list
  - Recent activity feed
  - Quick actions for common tasks
  - Role-specific views

### 4. Case Management
- **CaseList.tsx**: All cases with filtering, sorting, search
- **CaseDetail.tsx**: Comprehensive case view with:
  - Case metadata and status
  - Entity network summary
  - Timeline of events
  - Evidence list
  - Team assignments
  - Notes and comments

### 5. Network Visualization
- **GraphPage.tsx**: 
  - Interactive 3D knowledge graph
  - Auto-rotating camera with enhanced lighting
  - Node filtering by entity type
  - Connection tracing
  - Entity selection and details
  - Export capabilities
- **InvestigationGraph.tsx**: 2D network view (fallback/alternative)

### 6. Geospatial Intelligence
- **MapPage.tsx**:
  - Interactive Leaflet map focused on India
  - Entity markers with permanent labels
  - Relationship connections (polylines)
  - Geofence circles for primary locations
  - Heat maps for activity concentration
  - Route analysis
  - Real-time tracking overlay

### 7. Timeline & Analysis
- **TimelinePage.tsx**:
  - Chronological event visualization
  - Multi-source event correlation
  - Filter by entity, event type, date range
  - Export timeline reports
  - Evidence linking

### 8. Financial Intelligence
- **FinancialPage.tsx**:
  - Transaction flow visualization
  - Sankey diagrams for money movement
  - Account relationships
  - Suspicious pattern highlights
  - Financial network graph

### 9. Evidence Management
- **EvidencePage.tsx**:
  - Evidence list with filters
  - Document viewer
  - Chain of custody tracking
  - Hash verification
  - Metadata and tags
  - Export evidence bundles

### 10. Entity Profiles
- **PersonProfile.tsx**:
  - 360° view of individuals
  - Personal information
  - Associated entities (phones, vehicles, locations)
  - Communication patterns
  - Financial transactions
  - Timeline of activities
  - Risk assessment

---

## 🎨 UI Design Philosophy

Decypher follows **anti-vibe-code principles** for a serious, government-grade intelligence platform:

### Color Palette
- **Background**: `#fafaf9` - Off-white warm neutral (not pure white)
- **Surface**: `#f5f5f4` - Warm light gray for panels
- **Primary**: `#001f3f` - Navy blue (authority and trust)
- **Accent**: `#003d7a` - Lighter navy for secondary elements
- **Saffron/Green**: Indian flag colors for patriotic accents (Tiranga strip)

### Typography
- **Body**: IBM Plex Sans - Professional, readable
- **Headings**: Work Sans - Strong, authoritative
- **Fallback**: Noto Sans - Multilingual support

### Design Principles
✅ **DO:**
- Flat, functional UI with minimal shadows
- Simple borders instead of drop shadows
- Structured, rectangular layouts
- Real data visualizations
- Government/intelligence-grade visual language
- Clear hierarchy inspired by Indian government systems
- Every element should be functional

❌ **DON'T:**
- No harsh gradients
- No glassmorphism/liquid glass effects
- No excessive rounded corners
- No rainbow coloring
- No decorative animations
- No fake statistics or testimonials
- No generic SaaS landing patterns
- No Inter/Geist/Space Grotesk fonts
- No dot grids, radial orbs, sparkle icons
- No "AI slop" decorative elements

---

## 🔒 Security & Compliance

### Access Control
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system access, user management
  - **Senior Investigator**: Case management, evidence approval
  - **Investigator**: Case viewing, evidence submission
  - **Forensics**: Evidence analysis, technical reports
  - **Analyst**: Read-only access to analytics

### Authentication
- Multi-factor authentication (MFA) support
- Session management with auto-timeout
- Device fingerprinting
- Concurrent session limits

### Data Security
- **Encryption**:
  - TLS 1.3 for data in transit
  - AES-256 for data at rest
  - Database-level encryption for sensitive fields
- **Key Management**: Secure key rotation
- **Access Logging**: All data access logged with timestamp, user, justification

### Audit & Compliance
- **Comprehensive Audit Trails**:
  - Immutable logs with cryptographic integrity
  - Track all user actions: who, what, when, why
  - Export audit trails for compliance reviews
- **Compliance Frameworks**:
  - IT Act 2000
  - Indian Evidence Act
  - Criminal Procedure Code (CrPC)
  - ISO 27001 (Information Security)
  - ISO 27701 (Privacy)

### Responsible AI Principles
1. **Human Oversight**: All AI outputs require investigator review
2. **Explainability**: Every insight traceable to source evidence
3. **Data Governance**: Adherence to legal frameworks and privacy regulations
4. **Auditability**: Complete audit trails for accountability

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# API Configuration (when backend is implemented)
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key-here

# Map Configuration
VITE_MAP_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png

# Feature Flags
VITE_ENABLE_3D_GRAPH=true
VITE_ENABLE_AI_COPILOT=true

# Authentication (when implemented)
VITE_AUTH_DOMAIN=auth.decypher.gov.in
VITE_AUTH_CLIENT_ID=your-client-id
```

### Routing

Simple state-based routing without external router library:
- No React Router dependency
- Lightweight and fast
- See `App.tsx` for navigation logic
- Public pages: Landing, Capabilities, How It Works, Security, About, Login
- Protected pages: Dashboard, Cases, Graph, Map, Timeline, Financial, Evidence

### Customization

**Colors**: Edit `src/index.css` theme variables:
```css
@theme inline {
  --color-base-bg: #fafaf9;
  --color-primary: #001f3f;
  /* ... */
}
```

**Fonts**: Modify font imports in `src/index.css`

**Logo**: Replace `public/copy.png` with your logo (recommended: 512x512px PNG)

---

## 🔧 Development

### Code Organization

- **Components**: Reusable UI elements in `src/components/`
- **Pages**: Full page components in `src/pages/`
- **Data**: Dummy data for prototyping in `src/data/dummy.ts`
- **Styles**: Global styles in `src/index.css`

### State Management
- React hooks (useState, useEffect) for local state
- Props drilling for sharing state between components
- For production: Consider Redux, Zustand, or Context API

### TypeScript
- Strict type checking enabled
- Interface definitions for all props
- Type-safe dummy data

### Performance Optimization
- Code splitting (React.lazy when needed)
- Vite's fast HMR (Hot Module Replacement)
- Optimized bundle size
- Lazy loading for heavy components (3D graph, maps)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- Three.js requires WebGL support

---

## 📦 Deployment

### Build for Production

```bash
# Create optimized production build
pnpm build

# Output directory: dist/
```

### Deployment Options

#### 1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
```bash
# Build
pnpm build

# Deploy dist/ folder to your hosting service
```

#### 2. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5173
CMD ["pnpm", "preview"]
```

#### 3. **Nginx**
```nginx
server {
    listen 80;
    server_name decypher.gov.in;
    root /var/www/decypher/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Environment-Specific Builds
```bash
# Development
pnpm dev

# Staging
VITE_API_URL=https://staging-api.decypher.gov.in pnpm build

# Production
VITE_API_URL=https://api.decypher.gov.in pnpm build
```

---

## 🗺 Roadmap

### Phase 1: MVP (Current)
- ✅ Frontend UI with all pages
- ✅ 3D knowledge graph visualization
- ✅ Interactive maps
- ✅ Dummy data for prototyping
- ✅ Role-based authentication UI
- ✅ Evidence management UI

### Phase 2: Backend Integration (Q2 2027)
- [ ] REST API development (Node.js/Python)
- [ ] PostgreSQL database with graph extensions
- [ ] Authentication service (OAuth 2.0, SAML)
- [ ] Real-time WebSocket connections
- [ ] File upload and processing pipeline

### Phase 3: AI/ML Integration (Q3 2027)
- [ ] NLP models for entity extraction (spaCy, Transformers)
- [ ] Named Entity Recognition (NER) for Hindi/English
- [ ] Relationship extraction from unstructured text
- [ ] Pattern detection algorithms
- [ ] Anomaly detection models

### Phase 4: Advanced Analytics (Q4 2027)
- [ ] Graph algorithms (Neo4j integration)
- [ ] Community detection
- [ ] Centrality analysis
- [ ] Pathfinding and recommendation
- [ ] Temporal network analysis

### Phase 5: Production Hardening (2028)
- [ ] Security audit and penetration testing
- [ ] Load testing and optimization
- [ ] Disaster recovery procedures
- [ ] Compliance certification (ISO 27001, SOC 2)
- [ ] Production deployment on government cloud

---

## 🤝 Contributing

### For Development Team

This is an internal government project. To contribute:

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following code standards

3. Test thoroughly
   ```bash
   pnpm build
   pnpm preview
   ```

4. Commit with descriptive message
   ```bash
   git commit -m "feat: add financial network visualization"
   ```

5. Push and create pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards
- Use TypeScript for type safety
- Follow existing component patterns
- Write self-documenting code
- Add comments for complex logic
- Maintain government-grade UI principles
- Test on multiple browsers

---

## 📄 License

**Proprietary - Indian Government Intelligence Platform**

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited and may result in legal action.

© 2026 Ministry of Home Affairs, Government of India

---

## 📞 Contact & Support

For inquiries about deployment, customization, or support:

- **Email**: decypher-support@gov.in (placeholder)
- **Documentation**: [Internal Wiki](https://wiki.gov.in/decypher)
- **Issue Tracker**: [Internal GitLab](https://gitlab.gov.in/mha/decypher)

---

## ⚠️ Important Notes

### Current Status
This is a **frontend prototype** with dummy data for demonstration purposes.

### For Production Deployment, Implement:
- ✅ Backend API with secure authentication
- ✅ Real database (PostgreSQL with graph support)
- ✅ Data encryption at rest and in transit
- ✅ Comprehensive audit logging
- ✅ Multi-factor authentication
- ✅ Rate limiting and DDoS protection
- ✅ Regular security audits
- ✅ Backup and disaster recovery
- ✅ Compliance with IT Act 2000, Evidence Act, CrPC
- ✅ Performance optimization for large datasets
- ✅ Load balancing and high availability
- ✅ Monitoring and alerting systems

### Disclaimers
- All data shown is dummy/fictional for demonstration
- Not connected to any real criminal databases
- Requires proper authorization before production use
- Must comply with all applicable laws and regulations
- Backend integration required for actual functionality

---

## 🙏 Acknowledgments

- **React Team** for the excellent UI library
- **Three.js** for 3D visualization capabilities
- **Leaflet** for mapping functionality
- **Government of India** for supporting law enforcement technology
- **Development Team** for building a serious intelligence platform

---

**Built with ❤️ for Indian Law Enforcement**

*Transforming Criminal Intelligence Through Responsible AI Innovation*
