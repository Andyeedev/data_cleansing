import { APP_VERSION } from '../config/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-30 py-4 px-4 lg:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-60">
            © {currentYear} MAP Nexus™
          </span>
          <span className="text-neutral-40">|</span>
          <span className="text-sm text-neutral-60">
            Version {APP_VERSION}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-60 px-2 py-1 bg-neutral-20 rounded">
            {import.meta.env.MODE || 'development'}
          </span>
          <a
            href="/privacy"
            className="text-sm text-neutral-60 hover:text-primary-500 transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-sm text-neutral-60 hover:text-primary-500 transition-colors"
          >
            Terms
          </a>
          <a
            href="/support"
            className="text-sm text-neutral-60 hover:text-primary-500 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
