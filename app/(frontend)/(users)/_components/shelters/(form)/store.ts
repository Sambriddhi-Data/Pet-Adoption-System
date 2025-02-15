import { create } from 'zustand';
import {
    TPetBasicDetailsForm,
    TAddPetHealthForm,
    TPetPersonalityForm,
    PetFormData
} from "../../../(shelter)/add-pet-form";

interface PetRegistrationState {
    step: number;
    formData: {
        basicDetails: TPetBasicDetailsForm;
        healthDetails: TAddPetHealthForm;
        personalityDetails: TPetPersonalityForm;
    };
    nextStep: () => void;
    prevStep: () => void;
    getTotalSteps: () => number;
    setBasicInfo: (data: Partial<TPetBasicDetailsForm>) => void;
    setHealthInfo: (data: Partial<TAddPetHealthForm>) => void;
    setPersonalityInfo: (data: Partial<TPetPersonalityForm>) => void;
    submitForm: () => void;
}

const initialState: PetFormData = {
    basicDetails: {
        name: "",
        species: "",
        description: "",
        age: "",
        dominantBreed: "",
        sex: "unknown",
        size: "",
        status: "available",
        arrivedAtShelter: "",
        shelterId: "",
    },
    healthDetails: {
        vaccinationStatus: "unknown",
        neuteredStatus: "pending",
        dateDewormed: "",
        healthIssues: "none",
        otherHealthIssues: "",
        notes: ""
    },
    personalityDetails: {
        social: "",
        personalitySummary: "",
        houseTrained: "not trained"
    }
};

const usePetRegistrationStore = create<PetRegistrationState>((set, get) => ({
    step: 1,
    formData: initialState,

    nextStep: () => set((state) => ({
        step: Math.min(state.step + 1, get().getTotalSteps())
    })),

    prevStep: () => set((state) => ({
        step: Math.max(state.step - 1, 1)
    })),

    getTotalSteps: () => 4, // Basic, Health, Personality

    setBasicInfo: (data) =>
        set((state) => ({
            formData: {
                ...state.formData,
                basicDetails: {
                    ...state.formData.basicDetails,
                    ...data,
                },
            },
        })),

    setHealthInfo: (data) =>
        set((state) => ({
            formData: {
                ...state.formData,
                healthDetails: {
                    ...state.formData.healthDetails,
                    ...data,
                },
            },
        })),

    setPersonalityInfo: (data) =>
        set((state) => ({
            formData: {
                ...state.formData,
                personalityDetails: {
                    ...state.formData.personalityDetails,
                    ...data,
                },
            },
        })),

    submitForm: () => {
        set((state) => {
            console.log("Form submitted Successfully!");
            console.log("Submitted Data: ", state.formData);
            return {
                step: 1,
                formData: initialState
            };
        });
    },
}));

export default usePetRegistrationStore;