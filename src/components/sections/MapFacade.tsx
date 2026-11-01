export interface MapFacadeProps {
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  streetAddress: string;
  ward: string;
  city: string;
}

export function MapFacade({
  googleMapsEmbedUrl,
  googleMapsDirectionsUrl,
  streetAddress,
  ward,
  city,
}: MapFacadeProps) {
  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      {/* Direct Interactive Google Maps Embed with responsive fill */}
      <div className="relative min-h-[380px] flex-1 w-full overflow-hidden border border-[#0D3B2E] bg-[#FAFAF7]">
        <iframe
          src={googleMapsEmbedUrl}
          title={`Bản đồ vị trí Phòng Khám Y Học Cổ Truyền Kokoro tại ${streetAddress}, ${ward}, ${city}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* Direct Turn-by-Turn Mobile & Desktop Navigation CTA */}
      <a
        href={googleMapsDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-6 py-3.5 text-center text-[19px] font-bold leading-snug text-[#06231B] transition-colors hover:bg-[#C99224]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 shrink-0"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span>MỞ ỨNG DỤNG GOOGLE MAPS CHỈ ĐƯỜNG</span>
      </a>
    </div>
  );
}

export default MapFacade;
