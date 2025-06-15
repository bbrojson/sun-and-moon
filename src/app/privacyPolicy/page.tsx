import Script from "next/script";

export default function Privacy() {
  return (
    <>
      <h1>privacy policy</h1>

      <Script
        id="usercentrics-ppg"
        privacy-policy-id="48ad66fe-8f92-4c4d-a84b-d6b32195b46a"
        src="https://policygenerator.usercentrics.eu/api/privacy-policy"
      />
      <div className="uc-privacy-policy"></div>
    </>
  );
}
