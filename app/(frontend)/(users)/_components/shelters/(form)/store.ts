import { create } from 'zustand';
import {
    TPetBasicDetailsForm,
    TAddPetHealthForm,
    TPetPersonalityForm,
    TPetImagesForm,
    PetFormData
} from "../../../(shelter)/add-pet-form";

interface PetRegistrationState {
    step: number;
    formData: {
        basicDetails: TPetBasicDetailsForm;
        healthDetails: TAddPetHealthForm;
        personalityDetails: TPetPersonalityForm;
        petImages: TPetImagesForm;
    };
    nextStep: () => void;
    prevStep: () => void;
    getTotalSteps: () => number;
    setBasicInfo: (data: Partial<TPetBasicDetailsForm>) => void;
    setHealthInfo: (data: Partial<TAddPetHealthForm>) => void;
    setPersonalityInfo: (data: Partial<TPetPersonalityForm>) => void;
    setPetImages:(data: Partial<TPetImagesForm>) => void;
    submitForm: () => void;
    resetForm: () => void;
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
        houseTrained: "not_trained"
    },
    petImages: {
        image: []
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

    getTotalSteps: () => 5, // Basic, Health, Personality

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
    setPetImages: (data) =>
        set((state) => ({
            formData: {
                ...state.formData,
                petImages: {
                    ...state.formData.petImages,
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
    resetForm: () => set({ formData: initialState, step: 1 }),
}));

export default usePetRegistrationStore;