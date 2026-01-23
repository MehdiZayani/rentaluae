'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AutomationFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      id: 1,
      title: 'AI First Contact',
      icon: '🤖',
      description: 'AI assistant engages with leads via WhatsApp or Phone Call',
      details: [
        'WhatsApp Bot responds instantly 24/7',
        'Voice AI handles phone calls naturally',
        'Answers questions about rent-to-own process',
        'Builds trust with professional conversation',
        'Captures initial interest and preferences'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'Lead Qualification',
      icon: '✅',
      description: 'AI pre-qualifies leads based on conversation',
      details: [
        'Asks about budget and car preferences',
        'Verifies employment status',
        'Checks eligibility criteria',
        'Filters out unqualified prospects',
        'Only serious leads move forward'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 3,
      title: 'Personalized Link Sent',
      icon: '🔗',
      description: 'Unique verification link sent to qualified leads',
      details: [
        'Each link contains unique Lead ID',
        'Tracks which lead is accessing the system',
        'Secure authentication with ID token',
        'Mobile-friendly verification portal',
        'Lead receives SMS and WhatsApp message'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 4,
      title: 'Document Upload & Verification',
      icon: '📄',
      description: 'Lead uploads Emirates ID, Driver License & Bank Statement',
      details: [
        'OCR automatically extracts data from documents',
        'Scans Emirates ID front and back',
        'Captures Driver License details',
        'Bank statement upload (image or PDF)',
        'All documents stored securely in cloud'
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 5,
      title: 'AI Trust Score Generation',
      icon: '🎯',
      description: 'OpenAI analyzes documents and assigns Trust Score',
      details: [
        'Bank statement analysis (0-100 score)',
        'Detects gambling, overdrafts, crypto',
        'Verifies income stability',
        'Cross-checks salary vs car affordability',
        'Flags suspicious patterns automatically'
      ],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 6,
      title: 'Human or AI Follow-Up',
      icon: '📞',
      description: 'High-score leads contacted by AI or sales team',
      details: [
        'Trust score 70+: AI schedules meeting',
        'Trust score 50-69: Sales team reviews',
        'Trust score <50: Auto-reject with feedback',
        'AI sends personalized follow-up messages',
        'Sales team calls verified hot leads'
      ],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 7,
      title: 'Final Government Verification',
      icon: '🏛️',
      description: 'Automation verifies documents with Dubai Ministry',
      details: [
        'API integration with UAE government systems',
        'Validates Emirates ID authenticity',
        'Cross-checks Driver License validity',
        'Confirms no criminal records',
        'Real-time verification in seconds'
      ],
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      id: 8,
      title: 'Contract & Delivery',
      icon: '🚗',
      description: 'Auto-generate contract and schedule Yusr Rent',
      details: [
        'AI generates rental contract automatically',
        'Pre-filled with verified customer data',
        'E-signature via SMS link',
        'Payment gateway integration',
        'Automated delivery scheduling'
      ],
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <nav className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-2xl font-bold text-gray-900">RentalNeeds</span>
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 font-semibold">
              Your Business Fully Automated
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Complete Automation
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              From First Contact to Yusr Rent
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Watch how AI and automation transform your rent-to-own business into a 24/7 self-operating machine.
            From WhatsApp messages to government verification—completely hands-free.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative pl-24 transition-all duration-300 ${
                    activeStep === step.id ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Step Number Circle */}
                  <div className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-2xl font-bold shadow-xl transform transition-all duration-300 ${
                    activeStep === step.id ? 'scale-125 shadow-2xl' : ''
                  }`}>
                    {step.icon}
                  </div>

                  {/* Step Content Card */}
                  <div className={`${step.bgColor} border-2 ${step.borderColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-500 mb-1">
                          Step {step.id}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-lg text-gray-700">
                          {step.description}
                        </p>
                      </div>
                      <div className={`px-4 py-2 bg-gradient-to-r ${step.color} text-white rounded-full text-sm font-bold whitespace-nowrap`}>
                        Automated
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      activeStep === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="mt-6 pt-6 border-t border-gray-300">
                        <h4 className="font-semibold text-gray-900 mb-3">What Happens:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Arrow to next step */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-8 -bottom-8 w-1 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-32 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why This Changes Everything
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Zero Manual Work
              </h3>
              <p className="text-gray-600">
                From first contact to contract signing, everything runs automatically. Your team only handles exceptions.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Only Qualified Leads
              </h3>
              <p className="text-gray-600">
                AI filters out unqualified prospects. Sales team only talks to verified, high-trust-score leads ready to close.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Government Verified
              </h3>
              <p className="text-gray-600">
                Final verification with Dubai Ministry ensures 100% authentic documents. Zero fraud risk.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              This isn't science fiction. This is how we'll build your system. Every step automated, every lead qualified, every document verified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                See Live Demo
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-8 py-4 bg-blue-800 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
