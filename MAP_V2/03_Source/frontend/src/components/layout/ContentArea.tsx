interface ContentAreaProps {
  children: React.ReactNode;
}

export const ContentArea = ({ children }: ContentAreaProps) => {
  return (
    <main className="flex-1 p-4 lg:p-6 bg-neutral-10 overflow-auto">
      {children}
    </main>
  );
};
