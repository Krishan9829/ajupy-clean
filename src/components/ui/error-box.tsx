export default function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
      ⚠️ {message}
    </div>
  );
}