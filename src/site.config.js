// Central place for company + URLs.
// If APP_BASE_URL is on another host, set it here once.
const APP_BASE_URL =
  process.env.REACT_APP_APP_BASE_URL?.trim() ||
  "http://localhost:3000"; // fallback for local dev; change anytime

const Site = {
  company: {
    name: "OneTechly",
    email: "onetechly@gmail.com",
    tagline: "Tech Tips and Troubleshooting",
    blogUrl: "https://onetechlyambr19.blogspot.com/",
    logoLight: "/assets/logo-onetechly.png",
  },
  product: {
    name: "YouTube Content Downloader",
    short: "YCD",
    logo: "/assets/logo-ycd.png",
  },
  app: {
    // If your app routes live elsewhere, adjust these to full URLs
    login: `${APP_BASE_URL}/login`,
    register: `${APP_BASE_URL}/register`,
    dashboard: `${APP_BASE_URL}/dashboard`,
    pricingCheckoutEndpoint: `/api/stripe/checkout`, // if you expose this through the same origin
  },
  legal: {
    dmcaEmail: "onetechly@gmail.com",
    lastUpdated: new Date().toISOString().slice(0, 10),
  },
};

export default Site;
