const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-black/95 backdrop-blur-sm px-3 py-3 text-white shadow-lg sm:px-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
        <h1 className="text-2xl font-baloo font-extrabold leading-none tracking-tight sm:text-3xl">
          Food<span className="text-[#ff6a00]">Rush</span>
        </h1>

        <button className="order-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-[#171717] px-4 py-2 text-sm text-white/90 shadow-sm md:order-none md:w-auto">
          <svg className="h-4 w-4 text-[#ff6a00]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
          </svg>
          <span>Patna, Bihar</span>
          <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        <div className="order-4 relative w-full md:order-none md:block md:flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search resturants, dishes, cuisines..."
            className="h-11 w-full rounded-full border border-white/10 bg-[#171717] pl-11 pr-4 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-[#ff6a00]/70"
          />
        </div>

        <button className="relative flex items-center gap-2 rounded-xl bg-[#ff6a00] px-4 py-2 text-sm font-semibold text-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zm1.5 4h9L18 18H6L7.5 6z" />
          </svg>
          <span>Cart</span>
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#ff6a00]">
            3
          </span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-sm font-semibold">
          A
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

