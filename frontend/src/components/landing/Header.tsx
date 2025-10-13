'use client'
import { Calendar, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface HeaderProps {
    showDahsboardNav? : Boolean
}

interface NavigationItem {
    label : String;
    icon : React.ComponentType<any>;
    href : String;
    active : Boolean
}
const Header : React.FC<HeaderProps> = ({showDahsboardNav = false}) => {

    const user = {
        type :'patient'
    }

    const pathName = usePathname();

    const getDashboardNavigation = () : NavigationItem[] => {
        if (!user || showDahsboardNav){
            return []
        }

        if (user?.type === 'patient'){
            return [
                {
                    label : 'Appointment',
                    icon : Calendar,
                    href : 'patient/dashboard',
                    active : pathName?.includes('/patient/dashboard') || false
                }
            ]
        }else if(user?.type === 'doctor'){
            return [
                {
                    label : 'Dashboard',
                    icon : Calendar,
                    href : 'doctor/dashboard',
                    active : pathName?.includes('/doctor/dashboard') || false
                },
                {
                    label : 'Appointment',
                    icon : Calendar,
                    href : '/doctor/appointments',
                    active : pathName?.includes('/doctor/dashboard') || false
                }
            ]
        }
        return []
    }

  return (
    <header className="border-b bg-white/95 backdrop:blur-sm fixed top-0 left-0 right-0 z-50">
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>

            {/* Left Side Logo and Navigation */}
            <div className='flex items-center space-x-8'>
                <Link href='/' className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center'>
                        <Stethoscope className='w-5 h-5 text-white'/>
                    </div>
                </Link>
            </div>
        </div>
    </header>
  )
}

export default Header