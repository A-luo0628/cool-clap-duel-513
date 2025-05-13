
import dynamic from "next/dynamic";

const CoolClapDuel = dynamic(() => import("../components/CoolClapDuel"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <CoolClapDuel />
    </main>
  );
}
