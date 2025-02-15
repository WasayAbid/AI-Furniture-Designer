export interface WallbedConfig {
  bedSize: string;
  color: string;
  material: string;
  hasCupboard: boolean;
  cupboardCount: number | { left: number; right: number };
  cupboardLocation: string;
  hasCabinets: boolean;
  cabinetCount: number;
  cabinetPlacement: string;
  hasDressingTable: boolean;
  dressingTableStyle: string;
  dressingTableSide: string;
  dressingTableCabinets: number;
  hasSofa: boolean;
  sofaColor: string;
  style: string;
  lighting: string;
  handleStyle: string;
  prompt?: string;
  imageUrl?: string;
}
