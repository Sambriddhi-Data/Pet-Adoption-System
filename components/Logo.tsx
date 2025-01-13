import * as React from 'react';
import { LogoProps } from '../app/(frontend)/(auth)/type';
import { PawPrint } from 'lucide-react';

export const Logo: React.FC<LogoProps> = ({className = ''}) => {
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <PawPrint size={35} className="text-white"/>
      <div className={`flex flex-col items-center self-stretch my-auto w-[99px] text-white`}>
        <div className="font-fondamento text-xl tracking-wider">Fur-Ever</div>
        <div className="font-swanky text-2xl tracking-wider">Friends</div>
      </div>
    </div>
  );
};
