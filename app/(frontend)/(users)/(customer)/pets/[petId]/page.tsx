'use client'

import { toast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ApplytoAdoptButton from '../../../_components/apply-to-adopt-button';
import { PawPrint, Calendar, Ruler, MapPin, Heart, Users, Home } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApplyToAdoptForm } from '../../../_components/forms/apply-to-adopt-form';
import { Logo } from '@/components/Logo';
import { useSession } from '@/auth-client';

interface ShelterData {
    user: {
        name: string;
        location: string;
        id: string;
    }
}

interface PetData {
    id: string;
    name: string;
    dominantBreed: string;
    species: string;
    age: string;
    sex: string;
    size: string;
    status: string;
    social: string;
    shelter: ShelterData;
    image: string[];
}
const species = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "rabbit", label: "Rabbit" },
    { value: "parrot", label: "Parrot" },
    { value: "others", label: "Others" },
];

const sex = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
];

const sizeOptions: Record<string, { value: string; label: string }[]> = {
    dog: [
        { value: "small", label: "Small (0-5 kg)" },
        { value: "medium", label: "Medium (5-15 kg)" },
        { value: "large", label: "Large (15+ kg)" },
    ],
    cat: [
        { value: "small", label: "Small (0-4 kg)" },
        { value: "medium", label: "Medium (4-6 kg)" },
        { value: "large", label: "Large (6+ kg)" },
    ],
    rabbit: [
        { value: "mini", label: "Mini (0-1.5 kg)" },
        { value: "small", label: "Small (1.5-2.5 kg)" },
        { value: "medium", label: "Medium (2.5-4 kg)" },
        { value: "large", label: "Large (4+ kg)" },
    ],
    parrot: [
        { value: "small", label: "Small (0-200 g)" },
        { value: "medium", label: "Medium (200-400 g)" },
        { value: "large", label: "Large (400+ g)" },
    ],
    others: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
    ],
};

const dominantBreed = [
    { value: "labrador", label: "Labrador Retriever" },
    { value: "golden_retriever", label: "Golden Retriever" },
    { value: "german_shepherd", label: "German Shepherd" },
    { value: "bulldog", label: "Bulldog" },
    { value: "beagle", label: "Beagle" },
    { value: "poodle", label: "Poodle" },
    { value: "rottweiler", label: "Rottweiler" },
    { value: "siberian_husky", label: "Siberian Husky" },
    { value: "doberman", label: "Doberman" },
    { value: "shih_tzu", label: "Shih Tzu" },
    { value: "chow_chow", label: "Chow Chow" },
    { value: "border_collie", label: "Border Collie" },
    { value: "dachshund", label: "Dachshund" },
    { value: "pomeranian", label: "Pomeranian" },
    { value: "boxer", label: "Boxer" },
    { value: "dalmatian", label: "Dalmatian" },
    { value: "bhotia", label: "Bhotia (Himalayan Sheepdog)" },
    { value: "tibetan_mastiff", label: "Tibetan Mastiff" },
    { value: "local_breed", label: "Local Breed" },
    { value: "mixed", label: "Mixed Breed" },
    { value: "unknown", label: "Unknown Breed" }
];

function PetInfoPage() {
    const { petId } = useParams();
    const router = useRouter();
    const [pet, setPet] = useState<PetData | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const getLabel = (value: string, options: { value: string; label: string }[]) => {
        const found = options.find(option => option.value === value);
        return found ? found.label : value.charAt(0).toUpperCase() + value.slice(1);
    };
    const { data: session } = useSession()

    useEffect(() => {
        if (petId) {
            const fetchPetDetails = async () => {
                try {
                    const response = await fetch(`/api/getPetById?id=${petId}`);
                    if (!response.ok) {
                        throw new Error();
                    }
                    const petData = await response.json();

                    // Format labels before setting state
                    const formattedPet = {
                        ...petData,
                        species: getLabel(petData.species, species),
                        sex: getLabel(petData.sex, sex),
                        dominantBreed: getLabel(petData.dominantBreed, dominantBreed),
                        size: getLabel(petData.size, sizeOptions[petData.species] || []),
                    };

                    setPet(formattedPet);
                    setSelectedImage(petData.image?.[0] || null);
                } catch (error) {
                    console.error("Error fetching pet details:", error);
                    toast({ title: "Error", description: "Failed to load pet details." });
                }
            };
            fetchPetDetails();
        }
    }, [petId]);


    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
                {pet?.name || 'Pet Info'}
            </h1>

            {pet ? (
                <div className="space-y-4">
                    {/* Main Image Display */}
                    {selectedImage && (
                        <div className="flex justify-center">
                            <img
                                src={selectedImage}
                                alt={pet.name}
                                className="w-full max-w-2xl h-64 md:h-80 lg:h-96 object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Scrollable Thumbnails */}
                    {pet.image.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-2">
                            {pet.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${pet.name} - ${index + 1}`}
                                    className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-md cursor-pointer border-2 transition ${selectedImage === img ? 'border-blue-500 scale-105' : 'border-transparent'
                                        }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pet Details Card */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                            About {pet.name}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {pet.social}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div className="flex items-center gap-2">
                                <PawPrint className="w-5 h-5 text-gray-500" />
                                <p className="font-medium">Breed:</p>
                                <span>{pet.dominantBreed}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <p className="font-medium">Age:</p>
                                <span>{pet.age}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <p className="font-medium">Gender:</p>
                                <span>{pet.sex}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-gray-500" />
                                <p className="font-medium">Size:</p>
                                <span>{pet.size}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-gray-500" />
                                <p className="font-medium">Adoption Status:</p>
                                <span
                                    className={`px-2 py-1 rounded-md text-sm font-semibold ${pet.status === 'available'
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                        }`}
                                >
                                    {pet.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shelter Information Card */}
                    {pet.shelter && (
                        <div
                            className="cursor-pointer bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-200 transition"
                            onClick={() => router.push(`/public-page/${pet.shelter.user.id}`)}
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    <Home className="inline-block w-5 h-5 text-gray-600 mr-2" />
                                    {pet.shelter.user.name}
                                </h3>
                                <p className="text-gray-600 text-sm">{pet.shelter.user.location}</p>
                            </div>
                            <span className="text-blue-500 text-sm font-medium">View Shelter &rarr;</span>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <ApplytoAdoptButton open={isFormOpen} onOpenChange={setIsFormOpen} />
                    </div>
                    {/* Apply to Adopt Button */}
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle><Logo color="black" /></DialogTitle>
                                <DialogDescription className='text-justify'>
                                    Apply to adopt by writing a personal message to tell us why you want to adopt {pet.name}. Then, click the button to confirm your application.
                                </DialogDescription>
                            </DialogHeader>
                            <ApplyToAdoptForm closeForm={() => setIsFormOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading pet details...</p>
            )}
        </div>
    );
}

export default PetInfoPage;
