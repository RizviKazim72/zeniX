"use client";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
  Smartphone,
  Monitor,
  Tv,
  LucideIcon,
  Facebook,
  Youtube,
} from "lucide-react";
import ZeniXLogo from "../ui/ZeniXLogo";
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external = false }) => (
  <motion.a
    href={href}
    target={external ? "_blank" : "_self"}
    rel={external ? "noopener noreferrer" : undefined}
    whileHover={{ x: 4 }}
    className="text-text-muted hover:text-netflix-red transition-[color,transform] duration-300 ease-out flex items-center gap-1"
  >
    {children}
    {external && <ExternalLink size={12} />}
  </motion.a>
);
interface SocialButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 glass-card hover:bg-netflix-red/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
    aria-label={label}
  >
    <Icon size={18} className="text-text-muted group-hover:text-netflix-red transition-colors" />
  </motion.a>
);
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "Home", href: "/", external: false },
        { label: "Movies", href: "/movies", external: false },
        { label: "TV Shows", href: "/tv-shows", external: false },
        { label: "Trending Now", href: "/trending", external: false },
        { label: "Search", href: "/search", external: false },
      ],
    },
    {
      title: "Genres",
      links: [
        { label: "Action", href: "/genres/action", external: false },
        { label: "Comedy", href: "/genres/comedy", external: false },
        { label: "Drama", href: "/genres/drama", external: false },
        { label: "Horror", href: "/genres/horror", external: false },
        { label: "Sci-Fi", href: "/genres/sci-fi", external: false },
        { label: "All Genres", href: "/genres", external: false },
      ],
    },
    {
      title: "User",
      links: [
        { label: "My Space", href: "/myspace", external: false },
        { label: "Profile", href: "/profile", external: false },
        { label: "Login", href: "/login", external: false },
        { label: "Register", href: "/register", external: false },
      ],
    },
    {
      title: "Movies",
      links: [
        { label: "Popular", href: "/movies?sort=popular", external: false },
        { label: "Top Rated", href: "/movies?sort=top_rated", external: false },
        { label: "Now Playing", href: "/movies?sort=now_playing", external: false },
        { label: "Upcoming", href: "/movies?sort=upcoming", external: false },
      ],
    },
  ];

  const socialLinks: SocialButtonProps[] = [
    { href: "https://twitter.com/zenix", icon: Twitter, label: "Twitter" },
    { href: "https://instagram.com/zenix", icon: Instagram, label: "Instagram" },
    { href: "https://facebook.com/zenix", icon: Facebook, label: "Facebook" },
    { href: "https://youtube.com/zenix", icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-bg-primary/95 backdrop-blur-xl border-t border-glass-border text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <ZeniXLogo size="lg" />
                <span className="text-2xl font-bold text-netflix-red">
                  zeniX
                </span>
              </div>
              <p className="text-text-muted mb-6 leading-relaxed">
                Your ultimate destination for movies and TV shows. Discover,
                watch, and enjoy unlimited entertainment with personalized
                recommendations.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <SocialButton key={social.label} {...social} />
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-text-muted">
                <Mail size={16} />
                <span>support@zenix.com</span>
              </div>
              <div className="flex items-center space-x-3 text-text-muted">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-text-muted">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="lg:col-span-1"
            >
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} external={link.external}>
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 nav-separator"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Stream Anywhere</h3>
            <p className="text-text-muted">Enjoy zeniX on any device — anytime, anywhere</p>
          </div>

          <div className="flex justify-center items-center flex-wrap gap-6 mb-8">
            <div className="flex items-center space-x-2 text-text-muted">
              <Smartphone size={20} />
              <span>Mobile</span>
            </div>
            <div className="flex items-center space-x-2 text-text-muted">
              <Monitor size={20} />
              <span>Desktop</span>
            </div>
            <div className="flex items-center space-x-2 text-text-muted">
              <Tv size={20} />
              <span>Tablet</span>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-netflix px-6 py-3 rounded-lg transition-all duration-300 shadow-netflix"
            >
              Open zeniX in Browser
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="nav-separator bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-text-muted text-sm text-center md:text-left">
              &copy; {currentYear} zeniX. All rights reserved. Made with{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-block"
              >
                <Heart size={14} className="inline text-netflix-red" />
              </motion.span>{" "}
              for movie lovers worldwide.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/help">Help</FooterLink>
              <div className="flex items-center space-x-2 text-text-disabled">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
