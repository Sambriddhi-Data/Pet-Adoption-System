import Link from 'next/link';
import { Logo } from './Logo';

const ShelterFooter = () => {
  return (
    <footer className="bg-primary text-white pt-10 pb-4 mt-12 z-1000">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Logo and Tagline */}
        <div>
          <Logo color='white'/>
          <p className="text-gray-300 italic">Finding loving homes for furry friends</p>
        </div>
        
        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-amber-400">Contact Us</h3>
          <p className="mb-2">
            <a href="mailto:support@fureverfriends.com" className="hover:text-amber-400 transition duration-300">
              support@fureverfriends.com
            </a>
          </p>
          <p className="mb-2">Naxal Bhagwati, Kathmandu</p>
          <p className="mb-2">Phone: (+977) 9812-341-234</p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-amber-400">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-amber-400 transition duration-300">Home</Link></li>
            <li><Link href="/shelter-homepage" className="hover:text-amber-400 transition duration-300">Shelter HomePage</Link></li>
            <li><Link href="/about-us" className="hover:text-amber-400 transition duration-300">About Us</Link></li>
            <li><Link href="/adopt-pet" className="hover:text-amber-400 transition duration-300">Available Pets</Link></li>
          </ul>
        </div>
        
      </div>
      
      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Fur-Ever Friends. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-amber-400 transition duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ShelterFooter;