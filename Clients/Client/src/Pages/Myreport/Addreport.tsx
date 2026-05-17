import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addReport, getRequestErrorMessage } from "../../Serveces/apiservices";

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type FieldErrors = Partial<Record<"name" | "date" | "images", string>>;

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Addreport = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  const remainingSlots = MAX_IMAGES - images.length;

  const totalSize = useMemo(() => {
    const bytes = images.reduce((sum, image) => sum + image.file.size, 0);
    if (bytes < 1024 * 1024) return `${Math.max(bytes / 1024, 0).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [images]);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Report name is required";
    if (!date) nextErrors.date = "Report date is required";
    if (images.length === 0) nextErrors.images = "Select at least one image";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const incomingFiles = Array.from(fileList);
    const acceptedFiles: File[] = [];

    for (const file of incomingFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} is larger than ${MAX_FILE_SIZE_MB} MB`);
        continue;
      }

      if (acceptedFiles.length >= remainingSlots) {
        toast.info(`You can upload maximum ${MAX_IMAGES} images`);
        break;
      }

      acceptedFiles.push(file);
    }

    if (acceptedFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const nextImages = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
    setErrors((current) => ({ ...current, images: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
      return current.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const reportData = new FormData();
    reportData.append("name", name.trim());
    reportData.append("date", date);
    images.forEach((image) => reportData.append("images", image.file));

    setIsSubmitting(true);
    try {
      const response = await addReport(reportData);
      toast.success(response.message || "Report added successfully");
      navigate("/myreport");
    } catch (error) {
      toast.error(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/myreport"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to reports
        </Link>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              New report
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Add Medical Report
            </h1>
          </div>

          <form className="space-y-6 px-5 py-6 sm:px-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="report-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Patient Name
                </label>
                <input
                  id="report-name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errors.name) {
                      setErrors((current) => ({ ...current, name: undefined }));
                    }
                  }}
                  placeholder="enter your name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/15"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="report-date"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Report Date
                </label>
                <input
                  id="report-date"
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    if (errors.date) {
                      setErrors((current) => ({ ...current, date: undefined }));
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/15"
                  aria-invalid={Boolean(errors.date)}
                />
                {errors.date && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.date}</p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-slate-700">
                  Report Images
                </label>
                <span className="text-sm text-slate-500">
                  {images.length}/{MAX_IMAGES} selected
                  {images.length > 0 ? ` • ${totalSize}` : ""}
                </span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={remainingSlots === 0 || isSubmitting}
                className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-teal-300 bg-teal-50 px-4 py-8 text-center transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ImagePlus className="h-9 w-9 text-teal-800" aria-hidden />
                <span className="mt-3 text-sm font-semibold text-teal-950">
                  Choose images
                </span>
                <span className="mt-1 text-sm text-teal-900/70">
                  PNG, JPG, JPEG up to {MAX_FILE_SIZE_MB} MB each
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />

              {errors.images && (
                <p className="mt-2 text-sm text-red-600">{errors.images}</p>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      <img
                        src={image.previewUrl}
                        alt={`Selected report ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {image.file.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                to="/myreport"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#004d40] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden />
                )}
                {isSubmitting ? "Uploading..." : "Save Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Addreport;
