export const createHierarchy = (dependencies: Record<string, string>) => {
  return {
    name: "root",
    children: Object.entries(dependencies).map(([name, version]) => ({
      name: `${name}@${version}`,
      size: 10,
    })),
  };
};
