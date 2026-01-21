'use client'

import { useState } from 'react'
import IDScanner from './components/IDScanner'

export default function Home() {
  const [showScanner, setShowScanner] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-2xl font-bold text-gray-900">RentalNeeds</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Streamline Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"> Rental Business</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Experience the future of rental management with instant ID verification, 
            automated paperwork, and seamless customer onboarding.
          </p>
          
          <button
            onClick={() => setShowScanner(true)}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Start Demo
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant ID Verification</h3>
            <p className="text-gray-600 leading-relaxed">
              Scan and verify customer IDs in seconds with our advanced OCR technology.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automated Paperwork</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate rental agreements and documents automatically from scanned data.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Database</h3>
            <p className="text-gray-600 leading-relaxed">
              All customer data is encrypted and stored securely in the cloud.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10x</div>
              <div className="text-blue-100 text-lg">Faster Onboarding</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100 text-lg">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100 text-lg">Support Available</div>
            </div>
          </div>
        </div>
      </main>

      {/* ID Scanner Modal */}
      {showScanner && (
        <IDScanner onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}

