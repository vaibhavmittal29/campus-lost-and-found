import { describe, it, expect } from 'vitest'
import {
  validateTitle,
  validateCategory,
  validateLocation,
  validateDate,
  validateDescription,
  validateContact,
  validateClaimName,
  validateClaimMessage,
} from '../src/utils/validators.js'

describe('form validators', () => {
  describe('validateTitle', () => {
    it('rejects empty or whitespace-only titles', () => {
      expect(validateTitle('')).toBeTruthy()
      expect(validateTitle('   ')).toBeTruthy()
    })

    it('rejects titles under 3 characters', () => {
      expect(validateTitle('ab')).toBeTruthy()
    })

    it('accepts titles between 3 and 60 characters', () => {
      expect(validateTitle('Calculator')).toBe('')
      expect(validateTitle('a'.repeat(60))).toBe('')
    })

    it('rejects titles longer than 60 characters', () => {
      expect(validateTitle('a'.repeat(61))).toBeTruthy()
    })
  })

  describe('validateCategory and validateLocation', () => {
    it('validates required category selection', () => {
      expect(validateCategory('')).toBeTruthy()
      expect(validateCategory('all')).toBeTruthy()
      expect(validateCategory('Electronics')).toBe('')
    })

    it('validates required campus location selection', () => {
      expect(validateLocation('')).toBeTruthy()
      expect(validateLocation('all')).toBeTruthy()
      expect(validateLocation('tt')).toBe('')
    })
  })

  describe('validateDate', () => {
    it('accepts today’s date', () => {
      const today = new Date().toISOString().split('T')[0]
      expect(validateDate(today)).toBe('')
    })

    it('rejects future dates', () => {
      const future = new Date()
      future.setDate(future.getDate() + 2)
      const futureStr = future.toISOString().split('T')[0]
      expect(validateDate(futureStr)).toContain('future')
    })

    it('rejects dates older than 90 days', () => {
      const ancient = new Date()
      ancient.setDate(ancient.getDate() - 100)
      const ancientStr = ancient.toISOString().split('T')[0]
      expect(validateDate(ancientStr)).toContain('90 days')
    })
  })

  describe('validateDescription', () => {
    it('requires at least 10 characters', () => {
      expect(validateDescription('short')).toBeTruthy()
      expect(validateDescription('1234567890')).toBe('')
    })

    it('rejects over 300 characters', () => {
      expect(validateDescription('a'.repeat(301))).toBeTruthy()
    })
  })

  describe('validateContact', () => {
    it('accepts valid email addresses', () => {
      expect(validateContact('student@vitstudent.ac.in')).toBe('')
      expect(validateContact('user.name@example.com')).toBe('')
    })

    it('accepts 10-digit Indian mobile numbers', () => {
      expect(validateContact('9876543210')).toBe('')
      expect(validateContact('+919876543210')).toBe('')
    })

    it('rejects 9-digit or invalid contact formats', () => {
      expect(validateContact('987654321')).toBeTruthy()
      expect(validateContact('not-an-email-or-phone')).toBeTruthy()
    })
  })

  describe('validateClaimName and validateClaimMessage', () => {
    it('validates claim name boundaries', () => {
      expect(validateClaimName('A')).toBeTruthy()
      expect(validateClaimName('Arjun')).toBe('')
    })

    it('validates claim message boundaries', () => {
      expect(validateClaimMessage('Too short')).toBeTruthy()
      expect(validateClaimMessage('This is my water bottle with stickers.')).toBe('')
    })
  })
})
