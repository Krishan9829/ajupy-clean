import UserMenu from "./user-menu";

export default function Topbar() {
  return (
    <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
      <h1 className="font-bold text-xl">
        AJUPY AI
      </h1>

      <UserMenu />
    </div>
  );
}