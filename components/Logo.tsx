import * as React from 'react';
import { LogoProps } from '../app/(frontend)/(auth)/type';
import { PawPrint } from 'lucide-react';
import Image from 'next/image';

export const Logo: React.FC<LogoProps> = ({ className = '', color = '' }) => {
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      {
        color === "black" ? (
          <Image
            src='/images/paw-black.svg'
            alt='paw'
            width={60}
            height={60} 
          />

        ) :
          <Image
            src='/images/paw.svg'
            alt='paw'
            width={0}
            height={0} // Auto height
            style={{ height: "auto", width:"auto"}} // Ensures proper aspect ratio
          />
      }
      <div className={`flex flex-col items-center self-stretch my-auto w-[99px] text-${color}`}>
        <div className="font-fondamento text-xl tracking-wider">Fur-Ever</div>
        <div className="font-swanky text-2xl tracking-wider">Friends</div>
      </div>
    </div>
  );
};
