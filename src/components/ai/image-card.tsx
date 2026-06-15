"use client";

export default function ImageCard({ img }: any) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3">

      {/* IMAGE */}
      <img
        src={img.image}
        alt="design"
        className="w-full h-[250px] object-cover rounded-lg"
      />

      {/* PROMPT */}
      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
        {img.prompt}
      </p>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-3 text-sm">

        {/* DOWNLOAD */}
        <a
          href={img.image}
          download
          className="text-blue-500 hover:underline"
        >
          ⬇️ Download
        </a>

        {/* COPY */}
        <button
          onClick={() => navigator.clipboard.writeText(img.prompt)}
          className="text-gray-500 hover:text-black"
        >
          📋 Copy
        </button>

      </div>
    </div>
  );
}