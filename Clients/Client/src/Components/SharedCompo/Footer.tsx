const LINKEDIN_URL = "https://www.linkedin.com/in/dr-ayushi-sinha-b578b2191/";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
            Clinical authority through digital innovation.
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Dr. Ayushi Sinha
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            A modern digital healthcare experience built around clarity, trust,
            and accessible patient support.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit LinkedIn profile"
            className="inline-flex min-h-11 w-fit items-center gap-3 rounded-xl border border-teal-300/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-400/10 hover:text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-teal-300"
              aria-hidden
            >
              <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.34V10.5H6.06v6.84h2.28ZM7.2 9.56a1.32 1.32 0 1 0 0-2.64 1.32 1.32 0 0 0 0 2.64Zm10.74 7.78v-3.76c0-2.02-1.08-2.96-2.52-2.96a2.18 2.18 0 0 0-1.98 1.09V10.5h-2.28v6.84h2.28v-3.38c0-.18.01-.36.07-.49a1.25 1.25 0 0 1 1.17-.84c.83 0 1.16.64 1.16 1.57v3.14h2.1Z" />
            </svg>
            LinkedIn Profile
          </a>

          <p className="text-sm leading-6 text-slate-400 md:text-right">
            © 2024 Dr. Ayushi Sinha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
