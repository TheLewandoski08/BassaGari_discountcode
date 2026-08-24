import { Analytics } from "@vercel/analytics/next";
import BassaGariReward from "./components/discountcode";

export default function Home() {
  return (
    <>
      <BassaGariReward />
      <Analytics />
    </>
  );
}
