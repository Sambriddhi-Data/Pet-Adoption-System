import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { PawPrint } from 'lucide-react';

interface InfoCardProps {
  status: string;
  number: number;
  color: string;
}

const InfoCard = ({status,number,color}:InfoCardProps) => {
  return (
    <div className='mt-10 text-center'>
      <div>
        <Card className="flex-col justify-center w-full bg-white bg-opacity-85 shadow-lg px-4 ">
          <CardHeader>
            <h1 className="font-bold">{status}</h1>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <p>{number}</p>
              <PawPrint size={35} color={color}/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}

export default InfoCard;