import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";
import Site from "../../../site.config";

export default function DMCA() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-16 prose">
        <h1>DMCA Policy</h1>
        <p>
          OneTechly respects intellectual property rights. If you believe your copyrighted work has been
          used via our service without authorization, please send a DMCA notice to:
          <strong> {Site.legal.dmcaEmail}</strong>
        </p>
        <h2>Your notice must include</h2>
        <ol>
          <li>Identification of the copyrighted work.</li>
          <li>Identification of the material and its location (URL or description).</li>
          <li>Your contact information.</li>
          <li>A good-faith statement the use is not authorized.</li>
          <li>A statement that the information is accurate, under penalty of perjury.</li>
          <li>Physical or electronic signature of the rights owner or authorized agent.</li>
        </ol>
        <p>Upon valid notice, we act promptly, which may include disabling access and notifying the user.</p>
      </main>
      <MarketingFooter />
    </div>
  );
}

