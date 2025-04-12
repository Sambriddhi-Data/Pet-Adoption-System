import { AdoptionRequest } from "../type";
import { Calendar } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

interface AdopterProfileOverlayProps {
    request: AdoptionRequest;
}

const AdopterProfileOverlay: React.FC<AdopterProfileOverlayProps> = ({ request }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full relative">
            <Link href={`/pet-details/${request.animals.id}`} className="flex flex-col items-center mb-4">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 outline-2 rounded-full">
                        <CldImage
                            src={request.animals.image[0]}
                            height="200"
                            width="200"
                            alt={request.animals.name}
                            crop={{
                                type: 'fill',
                                source: true
                            }}
                            className="object-cover rounded-full"
                        /></div>
                    <label htmlFor={request.id} className="mt-2 text-lg">{request.animals.name}</label>
                </div>
            </Link>
            <div className="flex flex-wrap justify-between p-2 border-b space-x-4">
                {[
                    { label: "Full Name", value: request.adoptionprofile.user.name },
                    { label: "Address", value: request.adoptionprofile.user.location },
                    { label: "Email", value: request.adoptionprofile.user.email, extraClasses: "break-words max-w-[200px]" },
                    { label: "Phone number", value: request.adoptionprofile.user.phoneNumber },
                ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-gray-800">{item.label}</span>
                        <span className={`text-gray-600 text-[14px] ${item.extraClasses || ""}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 p-2">
                <Calendar color="green" />
                <span className="text-gray-800">{new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                </span>
            </div>

            <h2 className="text-xl font-bold mb-4">{request.adoptionprofile.user.name}'s Profile</h2>
            <section className="w-full border-3 mb-2 bg-gray-100 rounded-md px-4 py-2 space-y-3 border-b ">
                <h1 className=" font-semibold mb-4">Home Details</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                        <p className="font-semibold">Home Situation:</p><p> {request.adoptionprofile.home_situation}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Outside Space:</p><p> {request.adoptionprofile.outside_space}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Household Setting:</p><p> {request.adoptionprofile.household_setting}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Typical Household Activity:</p><p> {request.adoptionprofile.household_typical_activity}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Allergy to Pets:</p><p> {request.adoptionprofile.allergy ? "Yes" : "No"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Other Animals in Home:</p><p> {request.adoptionprofile.other_animals ? `Yes (${request?.adoptionprofile.other_animals_info})` : "No"}</p>
                    </div>
                </div>
            </section>
            <section className="w-full border-3 mb-2 bg-gray-100 rounded-md px-4 py-2 space-y-3 border-b ">
                <h1 className="font-semibold mb-4">Life Style and Commitment</h1>
                <div className="flex flex-wrap gap-4 text-sm ">
                    <div>
                        <p className="font-semibold">Work/Lifestyle:</p> <p className=" break-words max-w-[150px]">{request.adoptionprofile.lifestyle}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Moving/Holidays Plan:</p> <p className=" break-words max-w-[150px]">{request.adoptionprofile.move_holiday}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Experience with Pets:</p> <p className=" break-words max-w-[150px]">{request.adoptionprofile.experience}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Agreement to Terms:</p> <p>{request.adoptionprofile.agreement ? "Yes" : "No"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Minimum Age Preferred:</p> <p>{request.adoptionprofile.min_age}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {request.adoptionprofile.image.map((imgUrl, index) => (
                        <div
                            key={index}
                            className="w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md"
                        >
                            <CldImage
                                src={imgUrl}
                                width="400"
                                height="300"
                                alt={`${request.adoptionprofile.user.name}'s house `}
                                crop={{
                                    type: 'fill',
                                    source: true
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>
            <p><strong>Reason for Adoption:</strong> {request.message}</p>
        </div>
    );
};

export default AdopterProfileOverlay;
