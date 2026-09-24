import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  project_id: string;
  project_name: string;
  status: string;
}

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  availableProjects: Project[];
  setAvailableProjects: (projects: Project[]) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available projects from /api/v1/migration/projects on mount (JWT-derived)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/migration/projects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          credentials: 'include',
        });
        if (res.ok && !cancelled) {
          const json = await res.json();
          if (json.success && json.data?.items) {
            setAvailableProjects(json.data.items.map((p: any) => ({
              project_id: p.project_id,
              project_name: p.project_name,
              status: p.status,
            })));
            // Auto-select first active if none selected yet
            if (!activeProject) {
              const firstActive = json.data.items.find((p: any) => p.status === 'ACTIVE');
              if (firstActive) setActiveProject({
                project_id: firstActive.project_id,
                project_name: firstActive.project_name,
                status: firstActive.status,
              });
            }
          }
        }
      } catch {
        // Silent: project context is UX-only until backend confirms
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeProject?.project_id]);

  return (
    <ProjectContext.Provider value={{
      activeProject,
      setActiveProject,
      availableProjects,
      setAvailableProjects,
      isLoading,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
