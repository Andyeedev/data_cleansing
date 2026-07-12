import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, LayoutDashboard, ArrowRightLeft, CheckCircle, Shield,
  AlertTriangle, BarChart3, Settings, Bot, HelpCircle, ChevronDown,
  ChevronRight, X
} from 'lucide-react';
import { mainNavigation } from '../../config/navigation';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, LayoutDashboard, ArrowRightLeft, CheckCircle, Shield,
  AlertTriangle, BarChart3, Settings, Bot, HelpCircle,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-30 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-neutral-100">MAP Nexus</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-neutral-20 rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-neutral-80" />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          <ul className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = iconMap[item.icon] || Home;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.path);

              return (
                <li key={item.path}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-80 hover:bg-neutral-20 rounded-md transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.children?.map((child) => (
                            <li key={child.path}>
                              <NavLink
                                to={child.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `block px-3 py-2 text-sm rounded-md transition-colors ${
                                    isActive
                                      ? 'bg-primary-50 text-primary-500 font-medium'
                                      : 'text-neutral-80 hover:bg-neutral-20'
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-500 font-medium'
                            : 'text-neutral-80 hover:bg-neutral-20'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
