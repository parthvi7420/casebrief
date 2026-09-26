import { EvidenceItem } from '../types/incident'

interface ExtractionPanelProps {
  evidence: EvidenceItem[]
}

export default function ExtractionPanel({ evidence }: ExtractionPanelProps) {
  // Parse all evidence to extract entities
  const urls: Set<string> = new Set()
  const amounts: Set<string> = new Set()
  const upiIds: Set<string> = new Set()
  const emails: Set<string> = new Set()
  const phones: Set<string> = new Set()
  const dates: Set<string> = new Set()

  evidence.forEach((item) => {
    const text = item.content.toLowerCase()

    // Extract URLs
    const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || []
    urlMatches.forEach((url) => urls.add(url))

    // Extract amounts
    const amountMatches = text.match(/₹[\d,]+|rs\s*[\d,]+/gi) || []
    amountMatches.forEach((amt) => amounts.add(amt))

    // Extract UPI
    const upiMatches = text.match(/[\w.]+@[\w]+/gi) || []
    upiMatches.forEach((upi) => upiIds.add(upi))

    // Extract emails
    const emailMatches = text.match(/[\w.-]+@[\w.-]+\.\w+/gi) || []
    emailMatches.forEach((email) => emails.add(email))

    // Extract phones
    const phoneMatches = text.match(/\+91[\d]{10}|91[\d]{10}/gi) || []
    phoneMatches.forEach((phone) => phones.add(phone))

    // Extract dates
    const dateMatches = text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}/gi) || []
    dateMatches.forEach((date) => dates.add(date))
  })

  const categories = [
    { title: 'URLs', items: Array.from(urls), icon: '🔗' },
    { title: 'Amounts', items: Array.from(amounts), icon: '💰' },
    { title: 'UPI IDs', items: Array.from(upiIds), icon: '📱' },
    { title: 'Emails', items: Array.from(emails), icon: '✉️' },
    { title: 'Phones', items: Array.from(phones), icon: '☎️' },
    { title: 'Dates', items: Array.from(dates), icon: '📅' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Information Extraction</h2>
      <p className="text-gray-400 mb-6">Entities identified across all evidence</p>
      <div className="grid grid-cols-2 gap-4">
        {categories.map(
          (category) =>
            category.items.length > 0 && (
              <div key={category.title} className="border border-gray-700 rounded p-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {category.icon} {category.title}
                </div>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-200 bg-gray-800/50 p-2 rounded truncate">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}
