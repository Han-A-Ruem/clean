
export type BookingStep = 
  | "service" 
  | "kitchen" 
  | "bathroom" 
  | "fridge"
  | "date_selection"
  | "info" 
  | "reminder"
  | "payment_confirmation"  // Added new step
  | "disposal" 
  | "cancellation" 
  | "payment_details" 
  | "payment" 
  | "complete"
  | "address"
  | "datetime";

export interface TrashInfo {
  recyclable: boolean;
  general: boolean;
  food: boolean;
  note: string;
}

export interface CustomerInfo {
  // Contact & Location
  phoneNumber?: string | number | null;
  address?: string;
  
  // Household Details
  pet?: string;
  infant?: boolean; // Changed from string to boolean to match reservation type
  cctv?: string;
  parking?: string;
  
  // Entry Method
  house?: string;
  lobbyPassword?: string;
  unitPassword?: string;
  
  // Trash Disposal
  disposalMethod?: string;
  trashInfo?: {
    recyclable?: boolean;
    general?: boolean;
    food?: boolean;
  };
  disposalMethods?: {
    recyclable: string;
    general: string;
    food: string;
  };
  
  // Notes & Instructions
  precautions?: string;
  cleaningToolLocation?: string;
  supplyInstruction?: string;
  customMessage?: string;
  fridgeDisposalInstruction?: string;
  
  // Service Selection
  serviceHours?: number;
  selectedDates?: Date[];
  
  // Date and Time
  date?: string;
  time?: string;
  
  // Additional services
  additionalServices?: {
    laundry: boolean;
    windowFrame: boolean;
    porchCleaning: boolean;
    ironing: boolean;
  };
}

export interface CleaningType {
  type: string;
  noRefrigerator?: number;
  noToilet?: number;
}

export interface CustomOptions {
  areas: {
    kitchen: boolean;
    bathroom: boolean;
    refrigerator: boolean;
  };
  bathroomCount: number;
  kitchenExtras: {
    hoodCleaning: boolean;
    stoveCleaning: boolean;
  };
  refrigeratorCount: number;
}

export interface Address {
  street: string;
  detail: string;
}
