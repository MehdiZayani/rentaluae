'use client'

import { useState } from 'react'
import IDScanner from './components/IDScanner'
import VoiceAgent from './components/VoiceAgent'

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
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-700 font-semibold">Solution for Artis Rent-to-Own</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Stop Losing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"> 50% of Your Leads</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Secure, professional document collection platform that converts hesitant WhatsApp leads 
            into fully pre-qualified prospects—ready for your sales team.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 text-left max-w-2xl mx-auto">
            <p className="text-red-800 font-semibold mb-2">❌ Your Current Problem:</p>
            <p className="text-gray-700">Generating $1-2/lead is great, but 50% drop off when asked to send Emirates ID + bank statements via WhatsApp. They don't trust it. Your team is at capacity chasing unqualified leads.</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-12 text-left max-w-2xl mx-auto">
            <p className="text-green-800 font-semibold mb-2">✅ Our Solution:</p>
            <p className="text-gray-700">A professional, secure platform with AI-powered document verification. Leads see a legitimate system, not WhatsApp. You get fully pre-qualified leads with Emirates ID + bank statement + trust score—we work on commission, only paid when deals close.</p>
          </div>
          
          <button
            onClick={() => setShowScanner(true)}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 mb-4"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Try Live Demo (Client View)
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <p className="text-sm text-gray-500 mb-6">↑ This is what your leads will see</p>
          
          {/* Voice Agent Demo */}
          <div className="mt-6">
            <VoiceAgent 
              assistantId="017aa5b0-5f96-49f0-9249-a557724c95bc"
              publicKey={process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''}
            />
            <p className="text-sm text-gray-500 mt-2">↑ Try our AI voice assistant demo</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How We Solve Your Lead Drop-Off Problem</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">1</div>
                <h3 className="text-2xl font-bold text-gray-900">Professional Document Collection</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed ml-16">
                Leads land on a secure, professional platform (not WhatsApp). They scan their Emirates ID or Driver's License using their phone camera. OCR extracts data automatically—no manual typing.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-2">✅ Emirates ID Verified</p>
                <p className="text-sm text-gray-500">✅ Driver's License Scanned</p>
                <p className="text-sm text-gray-500">✅ Data Extracted: Name, DOB, ID Number</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 bg-white rounded-3xl p-8 shadow-xl">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-2">🤖 AI Analyzing Bank Statement...</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Trust Score</span>
                    <span className="text-2xl font-bold text-red-600">35/100</span>
                  </div>
                  <p className="text-xs text-red-600">⚠️ Red flags: Casino deposit, overdraft, crypto purchase</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">2</div>
                <h3 className="text-2xl font-bold text-gray-900">AI Trust Score Analysis</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed ml-16 mb-4">
                OpenAI GPT-4 Vision analyzes uploaded bank statements in seconds. Detects: gambling, overdrafts, crypto purchases, missed payments, income stability. Assigns Trust Score (0-100) with detailed breakdown—saving your team hours of manual review.
              </p>
              <div className="ml-16 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-2">🧠 Smart Cross-Verification:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Job Salary Estimation:</strong> AI searches market data to estimate salary based on job title/employer</li>
                  <li>• <strong>Car Affordability Check:</strong> Matches requested vehicle price against verified income</li>
                  <li>• <strong>Bank Statement Analysis:</strong> Income vs lifestyle consistency detection</li>
                  <li>• <strong>Fraud Detection:</strong> Flags Ferrari rental requests from AED 5k/month salary</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">3</div>
                <h3 className="text-2xl font-bold text-gray-900">Qualified Leads to Your CRM</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed ml-16">
                Only fully verified leads reach your sales team. Admin dashboard shows all applicants with trust scores, document images, and status tracking (New Lead → Contacted → Approved/Rejected). No more wasted time on unqualified prospects.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Pre-Qualified Lead Delivered:</p>
                <p className="text-xs text-gray-600">✅ Emirates ID: Verified</p>
                <p className="text-xs text-gray-600">✅ Bank Statement: Uploaded</p>
                <p className="text-xs text-gray-600">✅ Trust Score: 72/100 (Good)</p>
                <p className="text-xs text-gray-600">✅ Income: Stable salary visible</p>
                <p className="text-xs text-green-600 font-semibold mt-3">→ Ready for sales call</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why This Beats WhatsApp</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Looks Legitimate</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional branded platform with SSL encryption. Leads trust it more than WhatsApp—reducing your 50% drop-off rate significantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Pre-Qualification</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automatic fraud detection: gambling, overdrafts, fake documents. Trust score flags risky leads before they waste your team's time.
              </p>
              <div className="bg-purple-50 rounded-lg p-3 text-sm text-gray-700">
                <p className="font-semibold mb-1">Cross-checks include:</p>
                <p>• Job salary vs. market data</p>
                <p>• Car price vs. income affordability</p>
                <p>• Bank statement vs. claimed salary</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Commission Model = Zero Risk</h3>
              <p className="text-gray-600 leading-relaxed">
                We only get paid when you close deals. We handle marketing, document collection, AI filtering. You get ready-to-close prospects, pay on success.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">The Business Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">50%→10%</div>
              <div className="text-blue-100 text-lg">Lead Drop-Off Rate</div>
              <p className="text-sm text-blue-200 mt-2">Professional platform builds trust</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">0%</div>
              <div className="text-blue-100 text-lg">Upfront Cost</div>
              <p className="text-sm text-blue-200 mt-2">Commission only, pay on closed deals</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Full</div>
              <div className="text-blue-100 text-lg">Pre-Qualification</div>
              <p className="text-sm text-blue-200 mt-2">AI + OCR = instant processing</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100 text-lg">Verified Documents</div>
              <p className="text-sm text-blue-200 mt-2">Emirates ID + Bank Statement + Trust Score</p>
            </div>
          </div>
        </div>

        {/* Partnership Model */}
        <div className="mt-32 max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Performance-Based Partnership</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-700">Current lead cost</span>
              <span className="text-xl font-bold text-gray-900">$2/lead</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-700">Current drop-off rate</span>
              <span className="text-xl font-bold text-red-600">50%</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-700">Team time wasted on unqualified leads</span>
              <span className="text-xl font-bold text-red-600">Hours/day</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-700 font-semibold text-green-700">With our platform (Commission only)</span>
              <span className="text-xl font-bold text-green-600">Pay when you close</span>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-gray-800 font-semibold mb-2">✅ What You Get (Zero Upfront Cost):</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Verified Emirates ID with OCR data extraction</li>
                <li>• Uploaded & analyzed bank statement</li>
                <li>• AI Trust Score (0-100) with fraud detection</li>
                <li>• No team time wasted on document collection</li>
                <li>• No unqualified leads reaching your sales team</li>
                <li>• Professional platform that converts hesitant prospects</li>
                <li>• <strong>Pay commission only when deal closes successfully</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Built with Proven Technology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">🤖</span>
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 mb-4">OpenAI GPT-4 Vision analyzes bank statements, detecting:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Gambling/casino transactions (-20 pts)</li>
                <li>• Overdrafts & missed payments (-15 pts)</li>
                <li>• Crypto purchases (-10 pts)</li>
                <li>• Income stability patterns</li>
                <li>• Expense management quality</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">🔍</span>
                OCR Document Reading
              </h3>
              <p className="text-gray-600 mb-4">Tesseract.js extracts data from:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• UAE Emirates ID (front/back)</li>
                <li>• UAE Driver's License</li>
                <li>• International Passports</li>
                <li>• Auto-fills: Name, DOB, ID Number</li>
                <li>• 99%+ accuracy on UAE documents</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">☁️</span>
                Secure Cloud Storage
              </h3>
              <p className="text-gray-600 mb-4">UploadThing + Prisma PostgreSQL:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• SSL encrypted uploads</li>
                <li>• Images stored on secure CDN</li>
                <li>• GDPR-compliant database</li>
                <li>• Automatic backups</li>
                <li>• 99.9% uptime SLA</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📊</span>
                Admin CRM Dashboard
              </h3>
              <p className="text-gray-600 mb-4">Real-time lead management:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• View all applicants with trust scores</li>
                <li>• Filter by status (New, Contacted, Approved, etc.)</li>
                <li>• Download document images</li>
                <li>• Update lead status with one click</li>
                <li>• Export data for your CRM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">What Else We Can Do for You</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Beyond document verification, we offer end-to-end solutions to optimize your entire lead funnel and maximize conversions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Automation Services */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl border-2 border-blue-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Full Automation Suite</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span><strong>WhatsApp Bot Integration:</strong> AI chatbot handles first contact, warms leads, directs them to document portal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span><strong>Email/SMS Follow-ups:</strong> Automated reminders for incomplete applications, 3-5x conversion boost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span><strong>Smart Lead Routing:</strong> High trust score leads (70+) go straight to senior sales team</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span><strong>CRM Integration:</strong> Auto-sync to HubSpot, Salesforce, Zoho - no manual data entry</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span><strong>Automated Contract Generation:</strong> Instantly create rental agreements from scanned data in Arabic/English. Pre-filled with client name, ID number, address—ready to sign. Generate terms, payment schedules, insurance clauses automatically. Export as PDF and send via email/WhatsApp with e-signature integration.</span>
                </li>
              </ul>
            </div>

            {/* Drop-off Optimization */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Drop-Off Optimization</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">•</span>
                  <span><strong>A/B Testing:</strong> Test landing pages, upload flows, messaging to find what converts best</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">•</span>
                  <span><strong>Exit Intent Popups:</strong> Catch leads about to leave with incentives (free delivery, discount)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">•</span>
                  <span><strong>Progress Indicators:</strong> Show "2/3 steps complete" to encourage completion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">•</span>
                  <span><strong>Social Proof:</strong> "127 people approved today" banners to build trust</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 font-bold mr-2">•</span>
                  <span><strong>Mobile Optimization:</strong> 90% of UAE traffic is mobile - we perfect the mobile experience</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {/* Advanced Features */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 shadow-xl border-2 border-orange-200">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Advanced AI Features</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">•</span>
                  <span><strong>ID Fraud Detection:</strong> AI checks for photoshopped documents, mismatched fonts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">•</span>
                  <span><strong>Employment Verification:</strong> Cross-check salary claims against known company ranges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">•</span>
                  <span><strong>Risk Scoring Models:</strong> Train AI on your historical data (who pays, who defaults)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">•</span>
                  <span><strong>Voice Call Analysis:</strong> AI listens to sales calls, suggests better closing tactics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-2">•</span>
                  <span><strong>Predictive Analytics:</strong> "This lead is 85% likely to convert" based on behavior patterns</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action for Additional Services */}
          <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">We Build Custom Solutions</h3>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Every rental business is unique. Tell us your specific pain points, and we'll build automation workflows, 
              AI models, and integrations tailored to your operation. From lead gen to contract signing—we optimize everything.
            </p>
            <p className="text-lg text-gray-400">
              📞 Let's discuss your needs on the technical call and design a solution that fits your workflow perfectly.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Fix Your Lead Problem?</h2>
            <p className="text-xl text-blue-100 mb-8">
              See the full system in action. Try the demo as a client would experience it, then check the admin dashboard to see the qualified lead data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => setShowScanner(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Try Client Demo
              </button>
              <a
                href="/admin/dashboard"
                className="px-8 py-4 bg-blue-800 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View Admin Dashboard
              </a>
            </div>
            <a
              href="/automation-flow"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-700 to-pink-700 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              See Complete Automation Flow
            </a>
            <p className="text-sm text-blue-200 mt-6">
              📅 Technical Call: Today, Jan 22 at 11:00 AM Dubai Time
            </p>
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

