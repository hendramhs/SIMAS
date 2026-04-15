import NavIcon from "./NavIcon";

function SidebarNav({
  navItems,
  activePage,
  sidebarOpen,
  onNavigate,
  onClose,
}) {
  const mobileStateClass = sidebarOpen
    ? "max-md:translate-x-0 max-md:opacity-100"
    : "max-md:pointer-events-none max-md:-translate-x-full max-md:opacity-0";

  return (
    <>
      <div className="relative h-full">
        <aside
          className={`z-30 h-full w-[280px] overflow-x-hidden overflow-y-auto border-r border-slate-800 bg-sidebar px-3 py-6 text-sideink transition-[transform,opacity] duration-300 max-md:fixed max-md:left-0 max-md:top-0 max-md:h-screen max-md:w-[260px] md:translate-x-0 md:opacity-100 ${mobileStateClass}`}
        >
          <nav
            className="grid gap-2 max-md:grid-cols-3"
            aria-label="Navigasi halaman"
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sidebar-nav-item ${
                  activePage === item.key
                    ? "sidebar-nav-item-active"
                    : "sidebar-nav-item-idle"
                }`}
                onClick={() => onNavigate(item.key)}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                  <NavIcon type={item.key} />
                </span>
                <span className="overflow-hidden whitespace-nowrap transition-all duration-300 max-w-[140px] opacity-100 max-md:max-w-[140px]">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 border-0 bg-sidebar/30 md:hidden"
          aria-label="Tutup sidebar"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default SidebarNav;
