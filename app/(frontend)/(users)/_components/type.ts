export interface CancelProps {
  route?: string;
}

export interface LostPetModalProps {
  name?: string;
  image?: string[];
  address?: string;
  phoneNumber?: string;
  description?: string;
  onClick?: () => void;
  onClose?: () => void;
}

export type Pet = {
  id: string;
  name: string;
  image?: string[];
  location: string;
  phoneNumber: string;
  description?: string;
};