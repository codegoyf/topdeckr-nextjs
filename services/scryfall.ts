// Types for Scryfall API responses
export interface ScryfallCard {
  id: string
  name: string
  mana_cost: string
  type_line: string
  image_uris?: {
    small: string
    normal: string
  }
  colors: string[]
  color_identity: string[]
  cmc: number
  rarity: string
  set_name: string
  collector_number: string
}

export interface ScryfallSearchResponse {
  data: ScryfallCard[]
  has_more: boolean
  total_cards: number
}

// Base URL for Scryfall API
const SCRYFALL_API_BASE = 'https://api.scryfall.com'

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  return response.json()
}

// Search for cards by name
export async function searchCards(query: string): Promise<ScryfallSearchResponse> {
  const encodedQuery = encodeURIComponent(query)
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/search?q=${encodedQuery}`)
  return handleResponse<ScryfallSearchResponse>(response)
}

// Search for commanders specifically
export async function searchCommanders(query: string): Promise<ScryfallSearchResponse> {
  const encodedQuery = encodeURIComponent(query)
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/search?q=${encodedQuery} is:commander`)
  return handleResponse<ScryfallSearchResponse>(response)
}

// Get a specific card by name
export async function getCardByName(name: string): Promise<ScryfallCard> {
  const encodedName = encodeURIComponent(name)
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/named?fuzzy=${encodedName}`)
  return handleResponse<ScryfallCard>(response)
}

// Get a card by its ID
export async function getCardById(id: string): Promise<ScryfallCard> {
  const response = await fetch(`${SCRYFALL_API_BASE}/cards/${id}`)
  return handleResponse<ScryfallCard>(response)
}

// Get random cards (useful for testing)
export async function getRandomCards(count: number = 10): Promise<ScryfallCard[]> {
  const cards: ScryfallCard[] = []
  
  for (let i = 0; i < count; i++) {
    try {
      const response = await fetch(`${SCRYFALL_API_BASE}/cards/random`)
      const card = await handleResponse<ScryfallCard>(response)
      cards.push(card)
    } catch (error) {
      console.warn('Failed to fetch random card:', error)
    }
  }
  
  return cards
}