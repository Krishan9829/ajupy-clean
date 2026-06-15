export default function ResultCard({ item }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-white transition">

      {item.image_url && (
        <img
          src={item.image_url}
          className="w-full h-60 object-cover rounded-xl mb-4"
        />
      )}

      <p className="text-sm text-zinc-300 line-clamp-3">
        {item.prompt}
      </p>

      <p className="text-xs text-zinc-500 mt-2">
        {new Date(item.created_at).toLocaleString()}
      </p>

    </div>
  );
}