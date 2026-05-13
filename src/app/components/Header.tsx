interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#125ED0] shadow-lg z-10">
      <div className="px-6 py-4 max-w-screen-lg mx-auto">
        {title && (
          <h1 className="text-[#F1F1F1] uppercase tracking-wide text-left">{title}</h1>
        )}
      </div>
    </header>
  );
}
