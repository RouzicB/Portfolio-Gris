import type { ReactNode } from "react";
import PageLoader from "./components/ui/PageLoader";

/**
 * Le template est recréé à chaque changement de page :
 * l'écran de chargement (emblème animé) rejoue donc entre deux pages, puis s'efface.
 */
export default function Template({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <PageLoader />
    </>
  );
}
