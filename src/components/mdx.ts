/**
 * Every component in ./content and ./widgets is available inside lesson MDX
 * files by its file name, without an import (e.g. <Playground>, <Callout>,
 * <OwnershipVisualizer>). Add a widget by dropping a new .astro file in
 * ./widgets — nothing else to register.
 */
const modules = import.meta.glob<{ default: unknown }>(['./content/*.astro', './widgets/*.astro'], { eager: true });

export const mdxComponents = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.astro$/, ''), mod.default]),
) as Record<string, any>;
