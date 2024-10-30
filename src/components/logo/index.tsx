import logo from "../../assets/images/Logo.png";
import logoWhite from "../../assets/images/Logo white.png";

export default function Logo({
  logoType,
  ...props
}: {
  logoType: "light" | "dark";
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return (
    <img src={logoType === "light" ? logoWhite : logo} alt="" {...props} />
  );
}
