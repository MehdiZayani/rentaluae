'use client'

import { useState, useRef } from 'react'
import { createWorker } from 'tesseract.js'
import { useUploadThing } from '@/lib/uploadthing'

interface IDScannerProps {
  onClose: () => void
}

export default function IDScanner({ onClose }: IDScannerProps) {
  const [step, setStep] = useState(1) // Step 1: Choose ID Type, Step 2: ID Confirmation, Step 3: Bank Statement, Step 4: Review
  const [selectedIdType, setSelectedIdType] = useState('Driver License')
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idNumber: '',
    idType: 'Driver License',
    idImageUrl: '',
    bankStatementUrl: '',
    trustScore: 0,
    trustScoreDetails: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isEditingExtractedData, setIsEditingExtractedData] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [idImageUrl, setIdImageUrl] = useState('')
  const [bankStatementUrl, setBankStatementUrl] = useState('')
  const [trustScore, setTrustScore] = useState<number>(0)
  const [trustScoreDetails, setTrustScoreDetails] = useState<string>('')
  const [isAnalyzingBankStatement, setIsAnalyzingBankStatement] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const bankStatementCameraRef = useRef<HTMLInputElement>(null)
  const bankStatementUploadRef = useRef<HTMLInputElement>(null)

  const { startUpload: uploadId } = useUploadThing("idUploader", {
    onUploadProgress: (p) => setUploadProgress(p),
  })
  
  const { startUpload: uploadBankStatement } = useUploadThing("bankStatementUploader", {
    onUploadProgress: (p) => setUploadProgress(p),
  })

  const extractDataFromText = (text: string) => {
    // Clean and normalize the text
    const cleanText = text.replace(/\s+/g, ' ').trim()
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const data: any = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      idNumber: '',
      idType: 'Driver License'
    }

    console.log('All lines:', lines)
    console.log('Selected ID Type:', selectedIdType)

    // Look for Passport Number first (before other ID patterns)
    if (selectedIdType === 'Passport') {
      // Look for explicit "Passport No" field first
      for (const line of lines) {
        const passportNoMatch = line.match(/Passport\s+No[.:]?\s*([A-Z0-9]+)/i)
        if (passportNoMatch) {
          data.idNumber = passportNoMatch[1]
          break
        }
      }

      // If not found, look for MRZ line with passport number (second line of MRZ)
      if (!data.idNumber) {
        for (const line of lines) {
          // MRZ second line starts with passport number (9 characters)
          if (line.length > 30 && /^[A-Z0-9<]+$/.test(line) && !line.startsWith('P<')) {
            // Extract first 9 characters (passport number in MRZ)
            const passportNum = line.substring(0, 9).replace(/[<O]/g, '0').replace(/</g, '')
            if (passportNum.length >= 7 && /[A-Z]/.test(passportNum) && /\d/.test(passportNum)) {
              data.idNumber = passportNum
              break
            }
          }
        }
      }

      // Fallback: Look for passport format patterns
      if (!data.idNumber) {
        for (const line of lines) {
          // Pattern for passport numbers: letters followed by numbers (e.g., ZK8K81404)
          const passportMatch = line.match(/\b([A-Z]{1,2}\d[A-Z0-9]{5,8})\b/)
          if (passportMatch) {
            data.idNumber = passportMatch[1]
            break
          }
        }
      }
    } else {
      // Non-passport ID number patterns
      for (const line of lines) {
        // Pattern for "License No." or "License Number"
        const licenseMatch = line.match(/License\s+No[.:]?\s*(\d+)/i)
        if (licenseMatch) {
          data.idNumber = licenseMatch[1]
          continue
        }

        // Pattern for UAE ID: 784-1234-1134567-1
        const uaeIdMatch = line.match(/(\d{3}-\d{4}-\d{7}-\d)/)
        if (uaeIdMatch) {
          data.idNumber = uaeIdMatch[1]
          continue
        }

        // Pattern for US DL: DL/ID/LIC followed by number
        const usIdMatch = line.match(/(?:DL|ID|LIC)[#:\s]*([A-Z0-9-]+)/)
        if (usIdMatch && usIdMatch[1].length > 4) {
          data.idNumber = usIdMatch[1]
          continue
        }
        
        // Generic ID number pattern (standalone numbers 6+ digits)
        const numericIdMatch = line.match(/\b(\d{6,10})\b/)
        if (numericIdMatch && !data.idNumber && !line.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
          data.idNumber = numericIdMatch[1]
        }
        
        // Generic ID number pattern (letters followed by numbers)
        const genericIdMatch = line.match(/\b([A-Z]{1,3}\d{6,10})\b/)
        if (genericIdMatch && !data.idNumber) {
          data.idNumber = genericIdMatch[1]
        }
      }
    }

    // Look for Name (various patterns)
    if (selectedIdType === 'Passport') {
      // For passports, look for "Names" field
      for (const line of lines) {
        const namesMatch = line.match(/Names?\s*[:.]?\s*([A-Z][A-Z\s]+[A-Z])/i)
        if (namesMatch) {
          const fullName = namesMatch[1].trim()
          const nameParts = fullName.split(/\s+/)
          if (nameParts.length >= 2) {
            data.firstName = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ')
            data.lastName = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ')
          }
          break
        }
      }

      // Try to extract from MRZ if name not found
      if (!data.firstName && !data.lastName) {
        for (const line of lines) {
          if (line.startsWith('P<') && line.length > 20) {
            // MRZ first line: P<COUNTRY<LASTNAME<<FIRSTNAME<
            const mrzNameMatch = line.match(/P<[A-Z]{3}([A-Z]+)<<([A-Z<]+)/)
            if (mrzNameMatch) {
              data.lastName = mrzNameMatch[1].replace(/</g, ' ').trim()
              data.firstName = mrzNameMatch[2].replace(/</g, ' ').trim()
            }
          }
        }
      }
    } else {
      // For driver's licenses and other IDs
      for (const line of lines) {
        // Pattern: "Name: Firstname Lastname"
        const nameMatch1 = line.match(/Name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i)
        if (nameMatch1) {
          const nameParts = nameMatch1[1].trim().split(/\s+/)
          data.firstName = nameParts[0]
          data.lastName = nameParts.slice(1).join(' ')
          continue
        }

        // Pattern for names in format "LASTNAME, FIRSTNAME"
        const nameMatch2 = line.match(/^([A-Z]+),\s*([A-Z]+)/)
        if (nameMatch2) {
          data.lastName = nameMatch2[1]
          data.firstName = nameMatch2[2]
          continue
        }
      }
    }

    // If name still not found, look for lines with capitalized words
    if (!data.firstName && !data.lastName) {
      for (const line of lines) {
        const words = line.split(/\s+/).filter(w => w.length > 2)
        if (words.length >= 2 && words.length <= 6) {
          const allCapitalized = words.every(w => /^[A-Z][a-z]+$/.test(w) || /^[A-Z]+$/.test(w))
          if (allCapitalized && !line.includes('UNITED') && !line.includes('ARAB') && !line.includes('EMIRATES') && !line.includes('PASSPORT')) {
            const nameParts = words.filter(w => w.length > 2)
            if (nameParts.length >= 2) {
              data.firstName = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ')
              data.lastName = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ')
              break
            }
          }
        }
      }
    }

    // Look for Date of Birth (various formats)
    for (const line of lines) {
      // Pattern: DD/MM/YYYY or DD-MM-YYYY
      const dobMatch1 = line.match(/(?:Date of Birth|DOB|Birth)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i)
      if (dobMatch1) {
        // Convert to YYYY-MM-DD format for date input
        const dateParts = dobMatch1[1].split(/[\/\-]/)
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0')
          const month = dateParts[1].padStart(2, '0')
          const year = dateParts[2]
          data.dateOfBirth = `${year}-${month}-${day}`
        }
        continue
      }

      // Standalone date pattern
      const dobMatch2 = line.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/)
      if (dobMatch2 && !data.dateOfBirth) {
        const dateParts = dobMatch2[1].split(/[\/\-]/)
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0')
          const month = dateParts[1].padStart(2, '0')
          const year = dateParts[2]
          data.dateOfBirth = `${year}-${month}-${day}`
        }
      }
    }

    // Extract date from MRZ if not found
    if (!data.dateOfBirth && selectedIdType === 'Passport') {
      for (const line of lines) {
        if (line.length > 30 && /^[A-Z0-9<]+$/.test(line)) {
          // MRZ date format: YYMMDD
          const dateMatch = line.match(/(\d{6})/)
          if (dateMatch) {
            const dateStr = dateMatch[1]
            const year = parseInt('19' + dateStr.substring(0, 2))
            const month = dateStr.substring(2, 4)
            const day = dateStr.substring(4, 6)
            if (year > 1900 && year < 2100) {
              data.dateOfBirth = `${year}-${month}-${day}`
            }
          }
        }
      }
    }

    console.log('Extracted data:', data)
    return data
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanProgress(0)

    try {
      // Upload to UploadThing first
      setUploadProgress(0)
      const uploadResult = await uploadId([file])
      
      if (!uploadResult || uploadResult.length === 0) {
        throw new Error('Upload failed')
      }

      const imageUrl = uploadResult[0].url
      console.log('Image uploaded to:', imageUrl)
      setIdImageUrl(imageUrl)

      // Create OCR worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100))
          }
        }
      })

      // Perform OCR on the image
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      console.log('OCR Text extracted:', text)

      // Extract structured data from OCR text
      const extractedData = extractDataFromText(text)
      console.log('Extracted data:', extractedData)
      
      setFormData({ ...extractedData, idType: selectedIdType, idImageUrl: imageUrl })
      setScannedData(extractedData)
      // Stay on step 2 to show confirmation
      setIsScanning(false)
      setScanProgress(0)
      setUploadProgress(0)
    } catch (error) {
      console.error('Error scanning ID:', error)
      alert('Failed to scan ID. Please try again or enter data manually.')
      setIsScanning(false)
      setScanProgress(0)
      setUploadProgress(0)
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = ''
  }

  const handleBankStatementUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setUploadProgress(0)

    try {
      const uploadResult = await uploadBankStatement([file])
      
      if (!uploadResult || uploadResult.length === 0) {
        throw new Error('Upload failed')
      }

      const bankStatementImageUrl = uploadResult[0].url
      console.log('Bank statement uploaded to:', bankStatementImageUrl)
      setBankStatementUrl(bankStatementImageUrl)

      setFormData(prev => ({ ...prev, bankStatementUrl: bankStatementImageUrl }))
      setIsScanning(false)
      setUploadProgress(0)

      // Analyze bank statement with OpenAI
      setIsAnalyzingBankStatement(true)
      try {
        const analysisResponse = await fetch('/api/analyze-bank-statement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bankStatementUrl: bankStatementImageUrl })
        })

        if (analysisResponse.ok) {
          const analysis = await analysisResponse.json()
          setTrustScore(analysis.trustScore)
          const details = JSON.stringify({
            accountBalance: analysis.accountBalance,
            transactionRegularity: analysis.transactionRegularity,
            incomeStability: analysis.incomeStability,
            expenseManagement: analysis.expenseManagement,
            recommendation: analysis.recommendation
          })
          setTrustScoreDetails(details)
          setFormData(prev => ({ 
            ...prev, 
            trustScore: analysis.trustScore,
            trustScoreDetails: details
          }))
        }
      } catch (error) {
        console.error('Error analyzing bank statement:', error)
      } finally {
        setIsAnalyzingBankStatement(false)
      }
    } catch (error) {
      console.error('Error uploading bank statement:', error)
      alert('Failed to upload bank statement. Please try again.')
      setIsScanning(false)
      setUploadProgress(0)
    }

    e.target.value = ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          onClose()
        }, 2500)
      } else {
        alert('Error saving customer data')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving customer data')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">ID Scanner Demo</h2>
              <p className="text-blue-100 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-blue-400'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-blue-400'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-white' : 'bg-blue-400'}`}></div>
          </div>
        </div>

        <div className="p-8">
          {/* Step 1: Choose ID Type */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Select ID Type</h3>
              <p className="text-gray-600 mb-8">What type of identification document will you be scanning?</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedIdType('Driver License')}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedIdType === 'Driver License'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 mb-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Driver License</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedIdType('Passport')}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedIdType === 'Passport'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 mb-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Passport</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedIdType('State ID')}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedIdType === 'State ID'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">State ID</span>
                  </div>
                </button>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition"
                >
                  Continue to Scan ID
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Scan ID */}
          {step === 2 && !scannedData && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scan Your {selectedIdType}</h3>
              <p className="text-gray-600 mb-8">Take a clear photo or upload an image of your {selectedIdType.toLowerCase()}</p>
              
              {isScanning ? (
                <div className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-xl text-gray-600">
                      {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Scanning ID...'}
                    </p>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full max-w-xs mt-4">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                    {scanProgress > 0 && (
                      <div className="w-full max-w-xs mt-4">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Processing: {scanProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center mb-6">
                    <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-xl text-gray-700 mb-2">Choose how you want to scan</p>
                    <p className="text-sm text-gray-500">Make sure the document is clear and well-lit</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="group relative px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-lg">Take a Photo</span>
                        <span className="text-sm text-blue-100 mt-1">Use your camera</span>
                      </div>
                    </button>

                    <button
                      onClick={() => uploadInputRef.current?.click()}
                      className="group relative px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-lg">Upload Image</span>
                        <span className="text-sm text-purple-100 mt-1">Choose from gallery</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Step 2: ID Scan Confirmation */}
          {step === 2 && scannedData && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setStep(2)
                    setScannedData(null)
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Scan Again
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">ID Scanned Successfully!</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-semibold">Information extracted from your {selectedIdType}</span>
                </div>
              </div>

              {idImageUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scanned ID Image</label>
                  <img 
                    src={idImageUrl} 
                    alt="Scanned ID" 
                    className="w-full rounded-xl border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Extracted Information:</h4>
                  <button
                    onClick={() => {
                      setIsEditingExtractedData(true)
                      setStep(4)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="font-semibold text-gray-900">{formData.firstName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="font-semibold text-gray-900">{formData.lastName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{formData.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID Number</p>
                    <p className="font-semibold text-gray-900">{formData.idNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {!isEditingExtractedData && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Continue to Bank Statement Upload
                </button>
              )}
            </div>
          )}

          {/* Step 3: Bank Statement Upload */}
          {step === 3 && !bankStatementUrl && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Bank Statement</h3>
              
                <div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-purple-700 mb-2">
                        <span>Uploading bank statement...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center mb-6">
                    <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl text-gray-700 mb-2">Upload your bank statement</p>
                    <p className="text-sm text-gray-500">This helps us verify your financial information</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => bankStatementCameraRef.current?.click()}
                      className="group relative px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-lg">Take a Photo</span>
                        <span className="text-sm text-blue-100 mt-1">Use your camera</span>
                      </div>
                    </button>

                    <button
                      onClick={() => bankStatementUploadRef.current?.click()}
                      className="group relative px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-lg">Upload Image</span>
                        <span className="text-sm text-purple-100 mt-1">Choose from gallery</span>
                      </div>
                    </button>
                  </div>
                </div>
              
              {/* Hidden file inputs for bank statement */}
              <input
                ref={bankStatementCameraRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleBankStatementUpload}
                className="hidden"
              />
              <input
                ref={bankStatementUploadRef}
                type="file"
                accept="image/*"
                onChange={handleBankStatementUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Step 3: Bank Statement Confirmation */}
          {step === 3 && bankStatementUrl && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setStep(3)
                    setBankStatementUrl('')
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Upload Another
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank Statement Uploaded ✓</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-semibold">Bank statement uploaded successfully!</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Statement Image</label>
                <img 
                  src={bankStatementUrl} 
                  alt="Bank Statement" 
                  className="w-full rounded-xl border-2 border-gray-200"
                />
              </div>

              {/* AI Analysis Loading (hidden from client, but runs in background) */}
              {isAnalyzingBankStatement && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600 mr-3"></div>
                    <p className="text-blue-800 font-semibold">Processing bank statement...</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(4)}
                disabled={isAnalyzingBankStatement}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Review
              </button>
            </div>
          )}

          {/* Step 4: Review Data */}
          {step === 4 && scannedData && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Information</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-semibold">ID Scanned Successfully! Please review and edit if needed.</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID Type</label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option>Driver License</option>
                    <option>Passport</option>
                    <option>State ID</option>
                  </select>
                </div>
              </div>

              {/* Uploaded Images Section */}
              {(idImageUrl || bankStatementUrl) && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Uploaded Documents</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {idImageUrl && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">ID Document</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                          <img 
                            src={idImageUrl} 
                            alt="ID Document" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {bankStatementUrl && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Statement</label>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                          <img 
                            src={bankStatementUrl} 
                            alt="Bank Statement" 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    if (isEditingExtractedData) {
                      setStep(2)
                    } else {
                      setStep(2)
                      setScannedData(null)
                    }
                  }}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  {isEditingExtractedData ? 'Cancel' : 'Scan Another ID'}
                </button>
                <button
                  onClick={() => {
                    if (isEditingExtractedData) {
                      // Save changes and go back to confirmation
                      setIsEditingExtractedData(false)
                      setScannedData(formData)
                      setStep(2)
                    } else {
                      handleSave()
                    }
                  }}
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {isEditingExtractedData ? 'Save Changes' : (isSaving ? 'Saving...' : 'Save to Database')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full transform animate-bounce-in">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 text-center">Customer data has been saved successfully to the database.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
