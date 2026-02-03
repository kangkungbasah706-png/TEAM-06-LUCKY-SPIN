
export type SpinMode = 'REGULER' | 'EXCLUSIVE';

export interface Prize {
  id: number;
  label: string;
  color: string;
  textColor: string;
}

export interface SpinResult {
  id: string;
  prize: string;
  timestamp: number;
  mode: SpinMode;
  userName: string;
  spinNumber: number;
}

export interface UserProfile {
  name: string;
  displayName: string;
  // Fix: selectedMode is optional because it's selected during the landing phase, 
  // and names in constants.tsx only provide identity info.
  selectedMode?: SpinMode;
}
