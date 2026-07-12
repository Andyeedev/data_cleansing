import { footerNavigation } from '../../config/navigation';
import { APP_VERSION } from '../../config/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-30 py-6 px-4 lg:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-60">
          © {currentYear} MAP Nexus™. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          {footerNavigation.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="text-sm text-neutral-60 hover:text-primary-500 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="text-sm text-neutral-60">
          Version {APP_VERSION}
        </div>
      </div>
    </footer>
  );
};
