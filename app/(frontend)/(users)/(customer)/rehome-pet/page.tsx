import Link from "next/link";

interface Shelter {
  id: string;
  user: {
    id: string
    name: string;
    location: string;
  };
}

async function fetchShelters(): Promise<Shelter[]> {
  const res = await fetch("http://localhost:3000/api/getShelters");
  if (!res.ok) throw new Error("Failed to fetch shelters");
  return res.json();
}

export default async function ShelterListPage() {
  const shelters = await fetchShelters();

  return (
    <div className="p-6 text-center w-full">
      <h1 className="text-2xl font-bold mb-4">Shelters</h1>
      <p className="mb-4 text-gray-500 ">This website is only a platform to aid your rehoming process. Please choose one of the shelters to request rehoming of your pet.</p>
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {shelters.map((shelter: Shelter) => (
          <Link 
            key={shelter.id} 
            href={`/public-page/${shelter.user.id}`} 
            className="block p-4 border rounded-lg w-80 hover:bg-gray-100"
          >
            <h2 className="text-lg font-semibold">{shelter.user.name}</h2>
            <p className="text-gray-600">{shelter.user.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
