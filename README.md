# Tram Bui | Analytical Full-Stack Portfolio

A high-performance, data-driven personal portfolio website. Built with scientific rigor to ensure maximum accessibility, performance, and measurable user engagement.

**Live Site:** [trambui-portfolio.netlify.app](https://trambui-portfolio.netlify.app/)

## 🚀 Overview

This is a full-stack application leveraging serverless functions for backend logic and advanced analytics for user behavior tracking.

The architecture focuses on:

**Data Integrity:** GA4 Custom Events to measure specific interactions.
**Security:** CSP Headers, input sanitization, and reCAPTCHA.
**Performance:** Lazy-loading and minification for fast mobile speeds.

## ✨ Key Features

* **🎨 Dynamic Dark Mode:** Persists user preference via `localStorage` and respects system preferences.
* **⚡ Serverless Backend:** Secure contact form handling using **Netlify Functions** and **Nodemailer**.
* **📊 Advanced Analytics (GA4):**
   * Custom event tracking for Resume Downloads (`file_download`).
   * Granular tracking for "GitHub" vs "Live Demo" clicks (`project_interaction`).
   * Unified lead tracking for Form Submits vs Mailto clicks (`generate_lead`).
* **🛡️ Security & Anti-Spam:**
   * Integrated **Google reCAPTCHA v2** (Lazy-loaded for performance).
   * Input sanitization on the backend to prevent XSS.
   * Strict **Content Security Policy (CSP)** headers in `netlify.toml`.
* **♿ Accessible (A11y):** WCAG AA compliant with a high Lighthouse score.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS
* **Backend:** Node.js (Netlify Functions)
* **Styling:** Tailwind CSS (Class-strategy for Dark Mode)
* **Tools:** PostCSS, Google Analytics 4, Lighthouse

## ⚙️ Getting Started

### Prerequisites

* Node.js & npm installed
* [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed globally: `npm install -g netlify-cli`

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/trambui/portfolio.git  
cd portfolio  
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory for local testing:

```env
EMAIL_USER=your-email@gmail.com  
EMAIL_PASS=your-app-password  
EMAIL_TO=destination-email@gmail.com  
RECAPTCHA_SECRET_KEY=your-google-secret-key  
```

### 3. Running Locally

**Terminal 1 (Tailwind Watcher):**

```bash
npm run watch:css  
```

**Terminal 2 (Local Server):**

```bash
netlify dev  
```

## 📊 Analytics Schema

Custom definitions configured in GA4:

| Event Name          | Parameter    | Description                      |
| ------------------- | ------------ | -------------------------------- |
| project_interaction | project_name | Name of the project card clicked |
| project_interaction | link_type    | "Live Demo" vs "GitHub Code"     |
| file_download       | file_name    | "Tram_Bui_Resume.pdf"            |
| generate_lead       | method       | "contact_form" vs "email_link"   |

## 🚀 Deployment

1.  Connect your GitHub repository to Netlify.
2.  Set the **Build Settings**:
      * **Build command:** `npm run build`
      * **Publish directory:** `.`
3.  Add the **Environment Variables** in the Netlify Dashboard.

## 📄 License

© 2026 Tram Bui. All rights reserved.
