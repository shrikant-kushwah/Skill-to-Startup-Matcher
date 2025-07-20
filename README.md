# Skill-to-Startup Matcher

## Features

- Professional, modern UI with responsive design for both desktop and mobile
- User authentication with secure login, registration, and JWT-based sessions
- User profile management with a stylish dropdown in the navbar
- Students page: add, edit, and view detailed student profiles with skills, interests, and more
- Startups page: manage startup profiles, showcase opportunities, and connect with students
- Applications: apply to startups, track application status, and manage opportunities
- Messaging: send and receive messages between users with a clean interface
- Events: discover, create, and join startup-related events and hackathons
- Reviews: leave and view feedback to build trust and reputation
- Dashboard: admin overview with platform stats and quick navigation
- Success and error toasts for clear user feedback
- Scrollable, accessible modals for all forms
- Dropdowns and autocomplete for selecting related entities (students, startups, users)
- All data is fetched and updated in real-time from a Node.js/Express + MongoDB backend
- Clean codebase with comments and clear structure for easy maintenance

## Tech Stack

**Frontend:**
- React 18 (functional components & hooks)
- React Router v7 (routing & protected routes)
- Tailwind CSS (utility-first, responsive styling)
- Axios (API calls & JWT handling)
- Vite (fast dev/build tool)

**Backend:**
- Node.js & Express (REST API server)
- MongoDB & Mongoose (database & ODM)
- JWT (authentication & authorization)
- dotenv (environment variables)

**Other Tools:**
- Toast notifications for user feedback
- Modern SVG logo and emoji icons
- Responsive design for all devices

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
