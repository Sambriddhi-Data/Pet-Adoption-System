export interface CancelProps {
  route?: string;
}

export interface LostPetModalProps {
  name?: string;
  image?: string[];
  address?: string;
  phoneNumber?: string;
  description?: string;
  status?: string;
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
  status: string;
};

export interface AdoptionRequest {
  id: string;
  petId: string;
  message: string;
  createdAt: string;
  status: string;
  animals: {
    id: string;
    name: string;
    species: string;
    status: string;
    image: string[];
  };
  adoptionprofile: {
    id: string;
    userId: string;
    home_situation: string;
    household_setting: string;
    household_typical_activity: string;
    min_age: string;
    outside_space: string;
    allergy: boolean;
    experience: string;
    flatmate: boolean;
    lifestyle: string;
    move_holiday: string;
    neuter_status: "";
    other_animals: boolean;
    other_animals_info: "";
    agreement: boolean;
    image: string[];
    user: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      location: string;
    };
  };
}

export interface Requests {
  adoptionRequests: {
    id: string;
    petId: string;
    adoptionProfileId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    animals: {
      id: string;
      name: string;
      species: string;
      age: string;
      size: string;
      sex: string;
      status: string;
      dominantBreed: string;
      image: string[];
      shelter: {
        user: {
          name: string;
          location: string;
          phoneNumber: string;
          email: string;
        };
      };
    };
  }[];
  rehomingRequests: {
    id: string;
    species: string;
    isBonded: boolean;
    rehomeReason: string[];
    keepDuration: string;
    isOver18: boolean;
    petName: string;
    image: string[];
    userId: string;
    status: string;
    shelter: {
      user: {
        name: string;
        location: string;
        phoneNumber: string;
        email: string;
      };
    };
    createdAt: string;
  }[];
}

export interface RehomeRequest{
    id: string;
    species: string;
    isBonded: boolean;
    rehomeReason: string[];
    keepDuration: string;
    isOver18: boolean;
    petName: string;
    image: string[];
    userId: string;
    status: string;
    shelter: {
      user: {
        name: string;
        location: string;
        phoneNumber: string;
        email: string;
      };
    };
    user:{
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      location: string;
    };
    createdAt: string;
};
