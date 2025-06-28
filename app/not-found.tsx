import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center p-8 max-w-md">
        <div className="text-8xl mb-4">🎭</div>
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/movies"
            className="block border border-gray-600 hover:border-gray-500 text-text-primary px-8 py-3 rounded-lg transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
