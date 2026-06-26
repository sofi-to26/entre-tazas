import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="ubicacion" className="bg-corporativo text-white py-12 border-t-4 border-dorado">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-dorado"/> Ubicación</h3>
          <p className="text-gray-300">Av. Bolívar de La Parroquia,<br/>Esquina Inferior de la Plaza.<br/>Mérida, Venezuela.</p>
          <a href="#" className="text-dorado hover:underline w-max">Abrir en Google Maps</a>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Clock className="text-dorado"/> Horario de Trabajo</h3>
          <ul className="text-gray-300 space-y-2">
            <li><span className="font-semibold text-white">Lunes a Jueves:</span> 6:30 AM a 7:00 PM</li>
            <li><span className="font-semibold text-white">Viernes a Domingo:</span> 7:30 AM a 9:00 PM</li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <h3 className="text-xl font-bold">Síguenos</h3>
          <a href="https://instagram.com/entretazas___" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> @entretazas___
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;