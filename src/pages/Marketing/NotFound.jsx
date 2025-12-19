import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
      <div className="flex justify-center mb-4">
        <Logo brand="onetechly" size="lg" withText={false} to="/" />
      </div>
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-gray-600">
        We couldn't find what you're looking for.
      </p>
      <div className="mt-6 flex gap-3 justify-center flex-col sm:flex-row">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/ycd" className="btn-primary">Explore YCD</Link>
      </div>
    </main>
  );
}


