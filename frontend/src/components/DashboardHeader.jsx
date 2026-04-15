function DashboardHeader({
  currentPage,
  sidebarOpen,
  onToggleSidebar,
  totals,
}) {
  const { totalReports, totalKasusBaru, totalKasusMeninggal, totalWilayah } =
    totals;

  return (
    <>
      <div className="mb-3 flex items-start gap-3">
        <button
          type="button"
          className="group inline-flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-full border border-slate-300 bg-white p-0 shadow-soft md:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          <span
            className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>

        <div>
          <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted">
            SIMAS Dashboard
          </p>
          <p className="m-0 text-sm text-muted">
            Sistem Informasi Masyarakat Sehat
          </p>
        </div>
      </div>

      <header className="panel mb-[18px] p-5">
        <h2 className="m-0 text-[1.4rem] font-semibold tracking-[-0.01em]">
          {currentPage.title}
        </h2>
        <p className="mt-2 text-muted">{currentPage.subtitle}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
            <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
              Total Laporan
            </p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {totalReports}
            </p>
          </article>
          <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
            <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
              Kasus Baru
            </p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {totalKasusBaru}
            </p>
          </article>
          <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
            <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
              Kasus Meninggal
            </p>
            <p className="mt-1 text-xl font-semibold text-danger">
              {totalKasusMeninggal}
            </p>
          </article>
          <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
            <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
              Wilayah Aktif
            </p>
            <p className="mt-1 text-xl font-semibold text-ink">
              {totalWilayah}
            </p>
          </article>
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
