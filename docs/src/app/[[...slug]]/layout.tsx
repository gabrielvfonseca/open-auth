import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "../../lib/source";

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      githubUrl="https://github.com/gabrielvfonseca/open-auth"
      nav={{ title: "open-auth", url: "/" }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
