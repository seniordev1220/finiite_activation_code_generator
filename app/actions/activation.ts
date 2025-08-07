'use server'

import { createHash } from 'crypto'

// Mock database - in production, replace with actual database operations
let activationDatabase: Array<{
  firstName: string
  lastName: string
  email: string
  password: string
  activationCode: string
  createdAt: Date
}> = []

interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
}

function generateDeterministicCode(userData: UserData): string {
  // Create a deterministic hash from user data
  const input = `${userData.firstName.toLowerCase()}|${userData.lastName.toLowerCase()}|${userData.email.toLowerCase()}|${userData.password}`
  const hash = createHash('sha256').update(input).digest('hex')
  
  // Convert hash to uppercase alphanumeric characters (A-Z, 0-9)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  
  // Use hash bytes to generate 9-character code
  for (let i = 0; i < 9; i++) {
    const byte = parseInt(hash.substr(i * 2, 2), 16)
    code += chars[byte % chars.length]
  }
  
  return code
}

export async function generateActivationCode(userData: UserData) {
  try {
    // Generate the deterministic activation code
    const activationCode = generateDeterministicCode(userData)
    
    // Check if this exact combination already exists
    const existingEntry = activationDatabase.find(entry => 
      entry.firstName.toLowerCase() === userData.firstName.toLowerCase() &&
      entry.lastName.toLowerCase() === userData.lastName.toLowerCase() &&
      entry.email.toLowerCase() === userData.email.toLowerCase() &&
      entry.password === userData.password
    )
    
    if (existingEntry) {
      return {
        success: true,
        message: 'Activation code retrieved successfully',
        activationCode: existingEntry.activationCode,
        isExisting: true
      }
    }
    
    // Check if the activation code already exists for different credentials
    const codeExists = activationDatabase.find(entry => 
      entry.activationCode === activationCode &&
      (entry.firstName.toLowerCase() !== userData.firstName.toLowerCase() ||
       entry.lastName.toLowerCase() !== userData.lastName.toLowerCase() ||
       entry.email.toLowerCase() !== userData.email.toLowerCase() ||
       entry.password !== userData.password)
    )
    
    if (codeExists) {
      return {
        success: false,
        message: 'Unable to generate activation code. Please try with different credentials.'
      }
    }
    
    // Store the new activation code
    activationDatabase.push({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      activationCode,
      createdAt: new Date()
    })
    
    return {
      success: true,
      message: 'Activation code generated successfully',
      activationCode,
      isExisting: false
    }
    
  } catch (error) {
    console.error('Error generating activation code:', error)
    return {
      success: false,
      message: 'Failed to generate activation code'
    }
  }
}

// Helper function to get all activation codes (for debugging)
export async function getAllActivationCodes() {
  return activationDatabase
}
