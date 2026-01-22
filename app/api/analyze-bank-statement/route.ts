import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { bankStatementUrl } = await request.json()

    if (!bankStatementUrl) {
      return NextResponse.json(
        { error: 'Bank statement URL is required' },
        { status: 400 }
      )
    }

    // Analyze bank statement with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a strict financial analyst for a luxury car rental company in Dubai. Analyze this bank statement and calculate a realistic Trust Score (0-100).

**CRITICAL RED FLAGS - DEDUCT HEAVILY:**
- 🚨 Casino/gambling deposits → -20 points
- 🚨 Overdrafts or missed payments → -15 points each
- 🚨 Crypto purchases → -10 points
- 🚨 Excessive cash withdrawals (>30% of income) → -10 points
- 🚨 Loan/credit payments labeled "OVERDUE" → -20 points
- 🚨 Multiple returned/bounced payments → -15 points
- 🚨 Balance near zero frequently → -10 points

**SCORING CRITERIA:**

1. **Account Balance** (30 points max):
   - 25-30 pts: Closing balance > AED 20,000
   - 15-24 pts: AED 10,000-20,000
   - 5-14 pts: AED 5,000-10,000
   - 0-4 pts: < AED 5,000

2. **Transaction Regularity** (25 points max):
   - 20-25 pts: Clear regular salary deposits, stable income pattern
   - 12-19 pts: Some regular income but irregular
   - 5-11 pts: Very irregular, unpredictable deposits
   - 0-4 pts: No clear income pattern

3. **Income Stability** (25 points max):
   - 20-25 pts: Same employer salary 3+ months, consistent amounts
   - 12-19 pts: Regular income but varying amounts
   - 5-11 pts: Inconsistent income sources
   - 0-4 pts: No stable income visible

4. **Expense Management** (20 points max):
   - 16-20 pts: No overdrafts, good spending habits, savings visible
   - 10-15 pts: Some risky spending but manageable
   - 4-9 pts: Frequent low balances, risky transactions
   - 0-3 pts: Overdrafts, gambling, missed payments, poor control

**BE STRICT:** Most real statements should score 40-70. Only score 80+ if truly exceptional with NO red flags.

Return ONLY valid JSON:
{
  "trustScore": number (0-100),
  "accountBalance": string,
  "transactionRegularity": string,
  "incomeStability": string,
  "expenseManagement": string,
  "recommendation": string (specific, mention any red flags found)
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: bankStatementUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Remove markdown code blocks if present
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }

    // Parse the response
    const analysis = JSON.parse(cleanContent)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing bank statement:', error)
    return NextResponse.json(
      { error: 'Failed to analyze bank statement' },
      { status: 500 }
    )
  }
}
