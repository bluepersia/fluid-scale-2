type DocStructure = {
  [goldenId: string]: string[];
};

type MakeFluidPropertiesDoc = {
  [goldenId: string]: { anchor: string; properties: string[] }[];
};

export type { DocStructure, MakeFluidPropertiesDoc };
