import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { HtmlReportConfig } from '../html/shared/ReportTypes';

interface Bookmark {
  id: string;
  sectionId: string;
  label: string;
  timestamp: string;
}

interface Comment {
  id: string;
  sectionId: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Annotation {
  id: string;
  type: 'highlight' | 'marker' | 'flag';
  sectionId: string;
  text: string;
}

interface ReportViewerState {
  reportConfig: HtmlReportConfig | null;
  reportData: Record<string, unknown>;
  zoom: number;
  zoomPreset: 'fit-width' | 'fit-page' | '100' | '125' | '150' | '200';
  isFullscreen: boolean;
  viewMode: 'normal' | 'presentation' | 'reading';
  activeSection: string | null;
  currentPages: { current: number; total: number };
  sidebarOpen: boolean;
  activeSidebarPanel: 'toc' | 'bookmarks' | 'comments' | 'metadata';
  searchQuery: string;
  searchResults: { count: number; currentMatch: number };
  highlightMatches: boolean;
  bookmarks: Bookmark[];
  comments: Comment[];
  annotations: Annotation[];
}

interface ReportViewerContextValue extends ReportViewerState {
  setReportConfig: (config: HtmlReportConfig | null) => void;
  setReportData: (data: Record<string, unknown>) => void;
  setZoom: (zoom: number) => void;
  setZoomPreset: (preset: ReportViewerState['zoomPreset']) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setViewMode: (mode: ReportViewerState['viewMode']) => void;
  setActiveSection: (sectionId: string | null) => void;
  setCurrentPages: (pages: { current: number; total: number }) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSidebarPanel: (panel: ReportViewerState['activeSidebarPanel']) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: { count: number; currentMatch: number }) => void;
  setHighlightMatches: (highlight: boolean) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  removeComment: (id: string) => void;
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
}

const ReportViewerContext = createContext<ReportViewerContextValue | undefined>(undefined);

interface ReportViewerProviderProps {
  children: ReactNode;
}

export const ReportViewerProvider: React.FC<ReportViewerProviderProps> = ({ children }) => {
  const [reportConfig, setReportConfig] = useState<HtmlReportConfig | null>(null);
  const [reportData, setReportData] = useState<Record<string, unknown>>({});
  const [zoom, setZoom] = useState(100);
  const [zoomPreset, setZoomPreset] = useState<ReportViewerState['zoomPreset']>('100');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ReportViewerState['viewMode']>('normal');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentPages, setCurrentPages] = useState({ current: 1, total: 1 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarPanel, setActiveSidebarPanel] = useState<ReportViewerState['activeSidebarPanel']>('toc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ count: 0, currentMatch: 0 });
  const [highlightMatches, setHighlightMatches] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    setBookmarks((prev) => [...prev, { ...bookmark, id: `bm-${Date.now()}`, timestamp: new Date().toISOString() }]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'timestamp'>) => {
    setComments((prev) => [...prev, { ...comment, id: `c-${Date.now()}`, timestamp: new Date().toISOString() }]);
  };

  const removeComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const addAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    setAnnotations((prev) => [...prev, { ...annotation, id: `a-${Date.now()}` }]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const value: ReportViewerContextValue = {
    reportConfig, reportData, zoom, zoomPreset, isFullscreen, viewMode,
    activeSection, currentPages, sidebarOpen, activeSidebarPanel,
    searchQuery, searchResults, highlightMatches, bookmarks, comments, annotations,
    setReportConfig, setReportData, setZoom, setZoomPreset, setIsFullscreen,
    setViewMode, setActiveSection, setCurrentPages, setSidebarOpen, setActiveSidebarPanel,
    setSearchQuery, setSearchResults, setHighlightMatches,
    addBookmark, removeBookmark, addComment, removeComment, addAnnotation, removeAnnotation,
  };

  return <ReportViewerContext.Provider value={value}>{children}</ReportViewerContext.Provider>;
};

export const useReportViewer = (): ReportViewerContextValue => {
  const context = useContext(ReportViewerContext);
  if (!context) {
    throw new Error('useReportViewer must be used within a ReportViewerProvider');
  }
  return context;
};
