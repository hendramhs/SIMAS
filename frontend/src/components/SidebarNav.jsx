import NavIcon from "./NavIcon";

function SidebarNav({
  navItems,
  activePage,
  sidebarOpen,
  onNavigate,
  onClose,
}) {
  return (
    <>
      <div className="relative">
        <aside
          className={`group z-30 h-screen w-[76px] overflow-hidden border-r border-slate-800 bg-sidebar px-3 py-6 text-sideink transition-[width,transform,opacity] duration-300 max-md:fixed max-md:left-0 max-md:top-0 max-md:w-[260px] md:absolute md:inset-y-0 md:left-0 md:hover:w-[280px] ${
            sidebarOpen
              ? "opacity-100 max-md:translate-x-0"
              : "pointer-events-none opacity-0 max-md:-translate-x-full"
          }`}
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
                <span className="overflow-hidden whitespace-nowrap transition-all duration-300 max-md:max-w-[140px] max-md:opacity-100 md:max-w-0 md:opacity-0 md:group-hover:max-w-[140px] md:group-hover:opacity-100">
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
