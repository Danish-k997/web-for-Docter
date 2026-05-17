import { FileImage, Plus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Myreport = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Medical records
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Reports
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Keep your lab reports, prescriptions, and scan documents in one
              organized place.
            </p>
          </div>

          <Link
            to="/myreport/add"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004d40]"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Add Report
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FileImage className="h-6 w-6 text-teal-700" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              Upload reports
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add up to 10 clear report images at once with report name and
              date.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-teal-700" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              Account protected
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reports are attached to your logged-in account through secure API
              authorization.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-teal-300 bg-teal-50 p-5">
            <h2 className="text-lg font-semibold text-teal-950">
              Ready to add a new report?
            </h2>
            <p className="mt-2 text-sm leading-6 text-teal-900/75">
              Use the add button to open the report form and preview every
              selected image before upload.
            </p>
            <Link
              to="/myreport/add"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 shadow-sm ring-1 ring-teal-200 transition hover:bg-teal-100"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add Report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Myreport;
