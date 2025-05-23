'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Compass,
  Smartphone,
  Search,
  Upload,
  Mail,
  MessageCircle,
  Heart,
  ChevronRight,
} from 'lucide-react'
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Header: React.FC = () => {
  const { data: session } = useSession()
  const shouldFetch = Boolean(session)
  const { data: user } = useSWR(shouldFetch ? '/api/user/me' : null, fetcher)

  const [isMsgMenuOpen, setIsMsgMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchType, setSearchType] = useState<'user' | 'file'>('user') // 검색 타입 상태
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      router.push(`/search?query=${encodeURIComponent(q)}&type=${searchType}`)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start space-x-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="SafeShare Logo" width={32} height={32} />
          <span className="text-2xl font-bold text-purple-600">SafeShare</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition"
          >
            <Home size={18} /> <span>Home</span>
          </Link>
          <Link
            href="/file"
            className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition"
          >
            <Compass size={18} /> <span>Explore</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-shrink flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search..."
              className="bg-transparent focus:outline-none text-gray-600 flex-grow"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'user' | 'file')}
              className="bg-transparent text-gray-600 outline-none"
            >
              <option value="user">사용자</option>
              <option value="file">파일</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-2 font-medium text-purple-600 hover:text-purple-700"
            >
              검색
            </button>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {!session && (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition"
              >
                Signup
              </Link>
            </>
          )}

          {session && (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition"
              >
                <Upload size={18} /> <span>업로드</span>
              </Link>

              {/* 메시지 드롭다운 */}
              <div
                className="relative"
                onMouseEnter={() => setIsMsgMenuOpen(true)}
                onMouseLeave={() => setIsMsgMenuOpen(false)}
              >
                <Mail
                  size={20}
                  className="text-gray-700 hover:text-purple-600 transition cursor-pointer"
                />
                {isMsgMenuOpen && (
                  <div
                    className="absolute right-0 mt-0 w-48 bg-white shadow-lg rounded-md z-20"
                    onMouseEnter={() => setIsMsgMenuOpen(true)}
                    onMouseLeave={() => setIsMsgMenuOpen(false)}
                  >
                    <ul className="divide-y divide-gray-100">
                      <li className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MessageCircle size={16} />
                          <Link href="/messages">메시지</Link>
                        </div>
                        <ChevronRight size={16} />
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MessageCircle size={16} />
                          <span>새로운 댓글</span>
                        </div>
                        <ChevronRight size={16} />
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Heart size={16} />
                          <span>새로운 좋아요</span>
                        </div>
                        <ChevronRight size={16} />
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 사용자 이름 */}
              <span className="text-gray-800 font-medium">
                {session.user?.name}
              </span>

              {/* 사용자 드롭다운 */}
              <div
                className="relative ml-4"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                />
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-0 w-48 bg-white shadow-lg rounded-md z-10"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/user/me"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Page
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/about"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          About SafeShare
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/language"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Language (KR)
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
