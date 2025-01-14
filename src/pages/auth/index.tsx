import { useState } from "react";
import AuthLayout from "../../components/layout/auth";
import Login from "./template/login";
import Register from "./template/register";
import Info from "./template/info";

export default function Auth() {
  const [view, setView] = useState(true);
  return (
    <AuthLayout>
      <div className="relative mx-auto grid min-h-[80vh] w-full max-w-[1000px] grid-cols-1 gap-4 bg-white p-4 md:grid-cols-2">
        <Login view={view} setView={setView} />
        <Register view={!view} setView={setView} />
        <Info setView={setView} view={view} />
      </div>
    </AuthLayout>
  );
}
