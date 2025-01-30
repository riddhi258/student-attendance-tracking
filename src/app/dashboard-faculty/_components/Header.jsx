"use client"
import React from 'react'
import Image from 'next/image';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
function Header() {
  const {user}=useKindeBrowserClient();
  return (
    <div className ='p-4 shadow-sm border flex justify-end gap-2'>
      <div className='flex items-center gap-2'>
      <Image
        src={user?.picture}
        width={35}
        height={35}
        alt="user"
        className='rounded-full'
      />
      </div>
    </div>
  )
}

export default Header