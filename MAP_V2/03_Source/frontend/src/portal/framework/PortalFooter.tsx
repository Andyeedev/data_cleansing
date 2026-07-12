import type { PortalDefinition } from '../types/PortalDefinition';
import { APP_VERSION } from '../../config/constants';

interface PortalFooterProps {
  portal?: PortalDefinition;
}

export const PortalFooter = ({ portal }: PortalFooterProps) => {
  return (
    <footer className="bg-white border-t border-neutral-30 px-4 lg:px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-60">
            © {new Date().getFullYear()} MAP Nexus™
          </span>
          <span className="text-sm text-neutral-60">|</span>
          <span className="text-sm text-neutral-60">Version {APP_VERSION}</span>
          {portal && (
            <>
              <span className="text-sm text-neutral-60">|</span>
              <span className="text-sm text-neutral-60">{portal.name} v{portal.version}</span>
            </>
          )}
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
