import goldCoinSvg from "../assets/gold-coin.svg";

interface CoinProps {
  className?: string;
  size?: string;
  useInText?: boolean;
}

export default function Coin({
  className = "",
  size = "1em",
  useInText = false,
}: CoinProps) {
  return (
    <img
      src={goldCoinSvg}
      alt="gold coin"
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        marginTop: useInText ? "-0.25em" : 0,
      }}
    />
  );
}
