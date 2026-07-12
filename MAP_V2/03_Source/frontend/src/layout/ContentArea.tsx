interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export const ContentArea = ({
  children,
  className = '',
  scrollable = true,
}: ContentAreaProps) => {
  return (
    <div
      className={`
        bg-white border border-neutral-30 rounded-xl
        ${scrollable ? 'overflow-auto' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
