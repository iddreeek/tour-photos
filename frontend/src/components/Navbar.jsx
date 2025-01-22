"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Map, User, Home, Upload } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/camera", icon: Camera, label: "Camera" },
    { href: "/upload", icon: Upload, label: "Upload" },
    { href: "/map", icon: Map, label: "Map" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-10">
      <div className="container mx-auto px-4 h-full">
        <ul className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center ${
                  pathname === item.href ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
