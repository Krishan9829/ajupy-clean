export default function Empty({ text }: { text: string }) {
  return (
    <div className="text-center text-zinc-500 py-20">
      {text}
    </div>
  );
}