
export interface PaymentMethodData {
  id: string;
  name: string;
  payment_type: string;
  card_number?: string;
  card_holder?: string;
  expiration_date?: string;
  security_code?: string;
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  is_default: boolean;
}

export type PaymentMethodFormData = Omit<PaymentMethodData, 'id' | 'is_default'> & {
  is_default?: boolean;
};
