"use client";

export default function Banner() {
  return (
    <div className="fixed no-print top-0 w-screen z-50 bg-black text-white outline outline-white/50 rounded-b-sm p-1 text-center font-semibold">
      An experiment by {" "}
      <a
        className="hover:underline"
        href="https://instagram.com/loganwhitten512"
      >
        Logan Whitten
      </a>
      {" | "} Not recomended in production
    </div>
  );
}