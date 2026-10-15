"use client";

import React from "react";
import { Clock, MapPin, ExternalLink } from "lucide-react";
import { EMERGENCY_INFO } from "@/service/HelpCenterService/HelpCenterServiceApi";

export const HoursAndLocationCard: React.FC = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    EMERGENCY_INFO.address
  )}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* Operating Hours Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base sm:text-lg">
                Operating Hours
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500">Madrid Central Time (CET)</p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Monday — Friday</span>
              <span className="text-zinc-900 font-bold">{EMERGENCY_INFO.hours.weekdays}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Saturday</span>
              <span className="text-zinc-900 font-bold">{EMERGENCY_INFO.hours.saturday}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Sunday & Holidays</span>
              <span className="text-red-600 font-bold text-xs sm:text-sm">
                Emergency Only (24/7)
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-medium leading-relaxed">
          <span className="font-bold text-zinc-800">Technician Dispatch: </span>
          Regular maintenance visits are conducted 08:00 – 17:00. Urgent repair calls operate 24 hours a day, 365 days a year.
        </div>
      </div>

      {/* Office Location Card with Map Preview */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-base sm:text-lg">
                  Madrid Office
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500">Salamanca District</p>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Get directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-sm text-zinc-700 font-medium">
            {EMERGENCY_INFO.address}
          </p>

          {/* Interactive Map Embed */}
          <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
            <iframe
              title="Pure Pool Madrid Office Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://maps.google.com/maps?q=Calle+de+Velazquez+45+Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          Client visits by appointment. Street parking and public garages available on Calle de Velázquez.
        </p>
      </div>
    </div>
  );
};

export default HoursAndLocationCard;

