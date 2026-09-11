import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

export interface OnboardingStep {
  key: string;
  label: string;
  status: 'complete' | 'active' | 'pending';
  route: string;
}

interface Project {
  project_id: string;
  project_name: string;
  status: string;
  dataset_count?: number;
}

interface System {
  system_id: string;
  system_name: string;
  system_role: string;
}

interface DiscoverySummary {
  total_batches?: number;
}

interface MappingSummary {
  total_mappings?: number;
}

interface ExecutionHistory {
  items?: unknown[];
}

interface OnboardingProgressResult {
  steps: OnboardingStep[];
  percentage: number;
  currentStep: number;
  isComplete: boolean;
  isLoading: boolean;
  hasProject: boolean;
  refetch: () => void;
}

export function useOnboardingProgress(): OnboardingProgressResult {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProject, setHasProject] = useState(false);

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectsRes = await apiGet<{ items: Project[] }>('/migration/projects');
      const projects = projectsRes?.items ?? [];
      setHasProject(projects.length > 0);

      const project = projects[0];
      const projectId = project?.project_id;

      let hasSource = false;
      let hasTarget = false;
      let datasetCount = 0;

      if (projectId) {
        const systemsRes = await apiGet<{ data: System[] }>('/systems', { project_id: projectId });
        const systems = systemsRes?.data ?? [];
        hasSource = systems.some((s) => s.system_role === 'SOURCE');
        hasTarget = systems.some((s) => s.system_role === 'TARGET');

        const projectRes = await apiGet<{ data: Project }>(`/migration/projects/${projectId}`);
        datasetCount = projectRes?.data?.dataset_count ?? 0;
      }

      let discoveryBatches = 0;
      try {
        const discRes = await apiGet<DiscoverySummary>('/discovery/summary');
        discoveryBatches = discRes?.total_batches ?? 0;
      } catch { /* discovery may not be available */ }

      let mappingCount = 0;
      try {
        const mapRes = await apiGet<MappingSummary>('/mappings/summary');
        mappingCount = mapRes?.total_mappings ?? 0;
      } catch { /* mappings may not be available */ }

      let validationCount = 0;
      try {
        const execRes = await apiGet<ExecutionHistory>('/execution/history', { page: 1, page_size: 1 });
        validationCount = execRes?.items?.length ?? 0;
      } catch { /* execution may not be available */ }

      const projectComplete = projects.length > 0;
      const sourceComplete = hasSource;
      const targetComplete = hasTarget;
      const discoveryComplete = discoveryBatches > 0;
      const datasetsComplete = datasetCount > 0;
      const mappingsComplete = mappingCount > 0;
      const validationComplete = validationCount > 0;

      const completedCount = [
        projectComplete, sourceComplete, targetComplete,
        discoveryComplete, datasetsComplete, mappingsComplete, validationComplete,
      ].filter(Boolean).length;

      const newSteps: OnboardingStep[] = [
        { key: 'project', label: 'Create Project', status: projectComplete ? 'complete' : 'active', route: '/migration/projects' },
        { key: 'source', label: 'Connect Source', status: sourceComplete ? 'complete' : !projectComplete ? 'pending' : 'active', route: '/migration/connections' },
        { key: 'target', label: 'Connect Target', status: targetComplete ? 'complete' : !sourceComplete ? 'pending' : 'active', route: '/migration/connections' },
        { key: 'discovery', label: 'Run Discovery', status: discoveryComplete ? 'complete' : !targetComplete ? 'pending' : 'active', route: '/migration/discovery' },
        { key: 'datasets', label: 'Review Datasets', status: datasetsComplete ? 'complete' : !discoveryComplete ? 'pending' : 'active', route: '/migration/datasets' },
        { key: 'mappings', label: 'Create Mappings', status: mappingsComplete ? 'complete' : !datasetsComplete ? 'pending' : 'active', route: '/migration/mappings/spreadsheet' },
        { key: 'validation', label: 'Run Validation', status: validationComplete ? 'complete' : !mappingsComplete ? 'pending' : 'active', route: '/validation-centre' },
      ];

      const activeIdx = newSteps.findIndex((s) => s.status === 'active');
      const pct = Math.round((completedCount / 7) * 100);

      setSteps(newSteps);
      setPercentage(pct);
      setCurrentStep(activeIdx >= 0 ? activeIdx : 7);
      setIsComplete(completedCount === 7);
    } catch {
      setSteps([
        { key: 'project', label: 'Create Project', status: 'active', route: '/migration/projects' },
        { key: 'source', label: 'Connect Source', status: 'pending', route: '/migration/connections' },
        { key: 'target', label: 'Connect Target', status: 'pending', route: '/migration/connections' },
        { key: 'discovery', label: 'Run Discovery', status: 'pending', route: '/migration/discovery' },
        { key: 'datasets', label: 'Review Datasets', status: 'pending', route: '/migration/datasets' },
        { key: 'mappings', label: 'Create Mappings', status: 'pending', route: '/migration/mappings/spreadsheet' },
        { key: 'validation', label: 'Run Validation', status: 'pending', route: '/validation-centre' },
      ]);
      setPercentage(0);
      setCurrentStep(0);
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { steps, percentage, currentStep, isComplete, isLoading, hasProject, refetch: fetchProgress };
}
