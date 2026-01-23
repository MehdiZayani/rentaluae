'use client'

import { useState, useEffect } from 'react'
import Vapi from '@vapi-ai/web'

interface VoiceAgentProps {
  assistantId?: string
  publicKey: string
}

export default function VoiceAgent({ assistantId, publicKey }: VoiceAgentProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<string>('')

  useEffect(() => {
    // Initialize Vapi client
    const vapiClient = new Vapi(publicKey)
    setVapi(vapiClient)

    // Event listeners
    vapiClient.on('call-start', () => {
      console.log('Call started')
      setIsCallActive(true)
      setCallStatus('Connected')
    })

    vapiClient.on('call-end', () => {
      console.log('Call ended')
      setIsCallActive(false)
      setIsSpeaking(false)
      setCallStatus('')
    })

    vapiClient.on('speech-start', () => {
      console.log('AI is speaking')
      setIsSpeaking(true)
    })

    vapiClient.on('speech-end', () => {
      console.log('AI stopped speaking')
      setIsSpeaking(false)
    })

    vapiClient.on('error', (error: any) => {
      console.error('Vapi error:', error)
      setCallStatus('Error occurred')
    })

    return () => {
      vapiClient.stop()
    }
  }, [publicKey])

  const startCall = async () => {
    if (!vapi) return

    try {
      setCallStatus('Connecting...')
      
      if (assistantId) {
        // Use existing assistant
        await vapi.start(assistantId)
      } else {
        // Create inline assistant config
        await vapi.start({
          name: 'RentalNeeds AI Assistant',
          model: {
            provider: 'openai',
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `You are a professional AI assistant for RentalNeeds, a luxury rent-to-own car company in Dubai. 

Your role:
- Greet the customer warmly
- Ask about their car rental needs (type of car, duration, budget)
- Explain our rent-to-own process briefly
- Mention that we have AI-powered document verification that makes approval fast and secure
- Ask if they'd like to start the pre-qualification process
- If yes, explain they can scan their Emirates ID and upload bank statement on our platform
- Be friendly, professional, and helpful
- Keep responses concise (2-3 sentences max)
- Speak naturally like a Dubai-based sales agent

Important:
- Don't discuss technical details unless asked
- Focus on helping them understand the service
- Be enthusiastic about our AI verification system
- Mention we work on commission, so there's no upfront cost for partners`
              }
            ],
            temperature: 0.7,
          },
          voice: {
            provider: 'playht',
            voiceId: 'jennifer',
          },
          firstMessage: "Hello! Welcome to RentalNeeds. I'm here to help you find the perfect rent-to-own car in Dubai. What type of vehicle are you looking for?",
        })
      }
    } catch (error) {
      console.error('Failed to start call:', error)
      setCallStatus('Failed to connect')
      setIsCallActive(false)
    }
  }

  const endCall = () => {
    if (vapi) {
      vapi.stop()
    }
  }

  return (
    <div className="inline-flex flex-col items-center">
      {!isCallActive && !callStatus ? (
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-3xl opacity-75 blur-xl animate-gradientShift"></div>
          
          <button
            onClick={startCall}
            className="relative group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-110 overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradientMove"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            
            {/* Phone icon with ring animation */}
            <div className="relative mr-3">
              <svg className="w-6 h-6 relative z-10 group-hover:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {/* Pulsing ring around icon */}
              <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
            </div>
            
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Talk to AI Assistant</span>
            
            {/* Sparkle effects */}
            <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle"></div>
            <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-3 right-8 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0.4s' }}></div>
          </button>
        </div>
      ) : callStatus === 'Connecting...' ? (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="relative mb-4">
            {/* Connecting Animation */}
            <div className="flex items-center justify-center w-24 h-24 mb-4">
              {/* Spinning loader */}
              <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
              
              {/* Phone icon in center */}
              <svg className="w-10 h-10 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            
            <div className="flex items-center space-x-2 px-6 py-3 bg-green-50 rounded-full border border-green-200 animate-pulse">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm font-semibold text-green-800">Connecting...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="relative mb-4">
            {/* Animated Audio Waves */}
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full transition-all duration-300 ${
                    isSpeaking 
                      ? 'animate-audioWave' 
                      : 'h-4'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: isSpeaking ? '32px' : '16px'
                  }}
                />
              ))}
            </div>

            {/* Microphone Icon with Ripple Effect */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              {/* Ripple circles */}
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-ping" style={{ animationDelay: '0.3s' }}></div>
                </>
              )}
              
              {/* Microphone */}
              <div className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl transition-all duration-300 ${
                isSpeaking ? 'scale-110' : 'scale-100'
              }`}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={endCall}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <svg className="w-6 h-6 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              <span className="relative z-10">End Call</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 animate-slideUp">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-800">{callStatus}</span>
          </div>
        </div>
      )}
      
      {callStatus && !isCallActive && callStatus.includes('Error') && (
        <p className="text-sm text-red-600 mt-2 animate-shake">{callStatus}</p>
      )}
      
      <style jsx>{`
        @keyframes audioWave {
          0%, 100% { height: 16px; }
          50% { height: 32px; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes gradientShift {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-audioWave {
          animation: audioWave 0.6s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-gradientShift {
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 3s ease infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
