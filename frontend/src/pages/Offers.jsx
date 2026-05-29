import OfferBanner from "../components/OfferBanner";

function Offers() {
  return (
    <>
      <section className="page-heading">
        <span className="eyebrow">Daily offers</span>
        <h1>Promotion center</h1>
        <p>Daily offers are displayed to customers from the storefront banner.</p>
      </section>

      <OfferBanner />
    </>
  );
}

export default Offers;
