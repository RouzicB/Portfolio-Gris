import type { ReactNode } from "react";
import ProjectLoader from "../components/ui/ProjectLoader";

/**
 * Recréé à chaque changement d'étude de cas (le segment [slug] change) :
 * un petit chargement rejoue quand on passe d'un projet à l'autre.
 */
export default function ProjectTemplate({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <ProjectLoader />
    </>
  );
}
