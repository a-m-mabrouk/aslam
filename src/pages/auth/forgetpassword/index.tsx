import { Link } from "react-router-dom";
import LangBtn from "../../../components/button/langBtn";
import { useAppDispatch, useAppSelector } from "../../../store";
import CheckEmail from "./checkEmail";
import NewPassword from "./newPassword";
import VerifyCode from "./verifyCode";
import { AUTH_ROUTES } from "../../../router/routes/appRoutes";
import { useEffect } from "react";
import { reset } from "../../../store/reducers/forgetpassword";

export default function Forgetpassword() {
  const { step } = useAppSelector((state) => state.forgetpassword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);
  return (
    <div className="container mx-auto grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] gap-4">
      <div className="flex justify-end py-4">
        <Link to={AUTH_ROUTES.auth} className="text-3xl">
          <span className="text-5xl text-primary">A</span>
          slam
        </Link>
        <LangBtn />
      </div>
      <div className="grid grid-cols-1 place-content-center">
        <div className="relative mx-auto grid  aspect-[5/4] w-full max-w-[500px] grid-cols-1 rounded-xl bg-white p-4">
          <CheckEmail view={step === 1} />
          <VerifyCode view={step === 2} />
          <NewPassword view={step === 3} />
        </div>
      </div>
    </div>
  );
}
