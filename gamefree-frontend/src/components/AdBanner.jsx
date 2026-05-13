import { useEffect } from "react";

export default function AdBanner({ adSlot, adFormat = "auto", style = { display: "block" } }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden flex items-center justify-center my-2">
      <ins
        className="adsbygoogle w-full"
        style={style}
        data-ad-client="ca-pub-5131242266012141"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
