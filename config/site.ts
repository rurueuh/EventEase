export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "EventEase",
  description: "EventEase est une application de gestion d'événements",
  navItems: [
    {
      label: "Event",
      href: "/app/event",
    },
    {
      label: "Profile",
      href: "/app/profile",
    },
    {
      label: "Connexion",
      href: "/login",
    },
    {
      label: "Déconnexion",
      href: "/logout",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/rurueuh/EventEase",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://github.com/rurueuh/EventEase",
  },
};
