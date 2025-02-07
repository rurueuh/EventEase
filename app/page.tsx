import { Spacer } from "@heroui/react";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block  text-center justify-center">
        <span className={title()}>
          Bienvenue sur cette application <br />
          <strong>ELLE N&apos;EST PAS REEL ET N&apos;EST QUE UN EXEMPLE</strong>
        </span>
        <Spacer y={3} />
        <span className={subtitle()}>
          cette application est un gestionnaire d&apos;event en local
        </span>
      </div>
    </section>
  );
}
