import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center">
        <img
          src="/logo_onetechly.png"
          alt="OneTechly"
          className="mx-auto mb-6 h-16 w-16 rounded-lg shadow-sm"
        />
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600">
          The link you followed may be broken, or the page may have been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700"
          >
            ← Back to home
          </Link>
          <Link
            to="/ycd"
            className="inline-flex h-11 items-center rounded-lg border px-5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Explore YouTube Content Downloader
          </Link>
        </div>
      </div>
    </main>
  );
}
