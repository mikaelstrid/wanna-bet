import goldCoinSvg from "../assets/gold-coin.svg";

interface CoinProps {
  className?: string;
  size?: string;
}

export default function Coin({ className = "", size = "1em" }: CoinProps) {
  return (
    <img
      src={goldCoinSvg}
      alt="🪙"
      className={className}
      style={{ width: size, height: size, display: "inline-block", verticalAlign: "middle" }}
    />
  );
}
