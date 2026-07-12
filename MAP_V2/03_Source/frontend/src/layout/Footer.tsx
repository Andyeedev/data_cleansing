import { APP_VERSION } from '../config/constants';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-30 px-4 lg:px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-60">
            © {new Date().getFullYear()} MAP Nexus™
          </span>
          <span className="text-sm text-neutral-60">|</span>
          <span className="text-sm text-neutral-60">Version {APP_VERSION}</span>
        </div>

        <div className="flex items-center gap-4">
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
