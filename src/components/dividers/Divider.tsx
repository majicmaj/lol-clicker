import gold_divider from "../../assets/dividers/gold_divider.png";
import gold_divider_sm from "../../assets/dividers/gold_divider_sm.png";

export const Divider = ({ size = "lg" }) => {
  return (
    <img
      src={size === "lg" ? gold_divider : gold_divider_sm}
      alt="Divider"
      className="w-full mb-2"
    />
  );
};
