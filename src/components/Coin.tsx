import goldCoinSvg from "../assets/gold-coin.svg";
import "./Coin.css";

interface CoinProps {
  className?: string;
  size?: string;
  useInText?: boolean;
  decorative?: boolean;
}

export default function Coin({
  className = "",
  size = "1em",
  useInText = false,
  decorative = false,
}: CoinProps) {
  const coinClasses = `coin ${
    useInText ? "coin-in-text" : ""
  } ${className}`.trim();

  return (
    <img
      src={goldCoinSvg}
      alt={decorative ? "" : "guldmynt"}
      className={coinClasses}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
