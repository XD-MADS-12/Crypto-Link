// lib/security.ts
export class SecurityService {
  static generateHash(input: string): string {
    // Simple hash for demo purposes - in production, use crypto module
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  static validateUserAgent(userAgent: string): boolean {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /slurp/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /googlebot/i
    ];
    
    return !botPatterns.some(pattern => pattern.test(userAgent));
  }

  static isRateLimited(ip: string): boolean {
    // In a real app, check against Redis or similar cache
    // For demo purposes, return false
    return false;
  }

  static validateTransaction(txid: string): boolean {
    // Basic validation for transaction ID format
    if (txid.startsWith('0x')) {
      return /^[0-9a-fA-F]{64}$/.test(txid.substring(2));
    }
    return /^[0-9a-zA-Z]{26,40}$/.test(txid);
  }
}
