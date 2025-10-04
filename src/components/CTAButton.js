export default function CTAButton({ href = "#", children = "Get Started" }) {
  return (
    <a href={href} className="inline-flex items-center rounded-xl border px-4 py-2 hover:shadow">
      {children}
    </a>
  );
}
