import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Spacer } from "@heroui/react";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block  text-center justify-center">
        <span className={title()}>
          Bienvenue sur cette application <br />
          <strong>ELLE N'EST PAS REEL ET N'EST QUE UN EXEMPLE</strong>
        </span>
        <Spacer y={3} />
        <span className={subtitle()}>cette application est un gestionnaire d'event en local</span>
      </div>

    </section>
  );
}
