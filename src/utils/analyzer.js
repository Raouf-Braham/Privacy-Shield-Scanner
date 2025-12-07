/**
 * Privacy Shield Scanner - Analyzer Module
 * Core analysis logic for privacy and security scanning
 */

const PrivacyAnalyzer = {
  // Scoring weights
  weights: {
    trackers: 25,
    fingerprinting: 25,
    security: 20,
    thirdParty: 15,
    cookies: 15
  },
  
  // Calculate overall privacy score
  calculateScore(results) {
    let score = 100;
    
    // Deduct for trackers (up to 25 points)
    const trackerPenalty = Math.min(results.trackers. length * 3, this.weights.trackers);
    score -= trackerPenalty;
    
    // Deduct for fingerprinting (up to 25 points)
    const fingerprintPenalty = Math.min(results.fingerprinting.length * 5, this.weights.fingerprinting);
    score -= fingerprintPenalty;
    
    // Deduct for security issues (up to 20 points)
    let securityPenalty = 0;
    if (! results.security. https) securityPenalty += 10;
    if (!results.security.csp) securityPenalty += 3;
    if (!results.security.hsts) securityPenalty += 3;
    if (!results.security.xFrameOptions) securityPenalty += 2;
    if (!results.security.xContentTypeOptions) securityPenalty += 2;
    score -= Math.min(securityPenalty, this.weights.security);
    
    // Deduct for third-party requests (up to 15 points)
    const thirdPartyPenalty = Math.min(results.thirdParty.count * 0.5, this.weights.thirdParty);
    score -= thirdPartyPenalty;
    
    // Deduct for cookies (up to 15 points)
    const cookiePenalty = Math.min(results.cookies.thirdParty * 2, this.weights.cookies);
    score -= cookiePenalty;
    
    return Math.max(0, Math.round(score));
  },
  
  // Get grade based on score
  getGrade(score) {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', color: '#22c55e' };
    if (score >= 80) return { grade: 'A', label: 'Very Good', color: '#22c55e' };
    if (score >= 70) return { grade: 'B', label: 'Good', color: '#84cc16' };
    if (score >= 60) return { grade: 'C', label: 'Moderate', color: '#eab308' };
    if (score >= 50) return { grade: 'D', label: 'Poor', color: '#f97316' };
    if (score >= 30) return { grade: 'E', label: 'Bad', color: '#ef4444' };
    return { grade: 'F', label: 'Critical', color: '#dc2626' };
  },
  
  // Get recommendations based on results
  getRecommendations(results) {
    const recommendations = [];
    
    if (! results.security.https) {
      recommendations. push({
        severity: 'critical',
        title: 'No HTTPS',
        description: 'This site is not using HTTPS. Your connection is not encrypted.',
        icon: '🔓'
      });
    }
    
    if (results.trackers.length > 5) {
      recommendations.push({
        severity: 'high',
        title: 'Multiple Trackers Detected',
        description: `Found ${results.trackers.length} trackers. Consider using a content blocker.`,
        icon: '👁️'
      });
    }
    
    if (results.fingerprinting.length > 0) {
      recommendations.push({
        severity: 'high',
        title: 'Fingerprinting Detected',
        description: 'This site uses browser fingerprinting techniques to identify you.',
        icon: '🔍'
      });
    }
    
    if (! results.security.csp) {
      recommendations.push({
        severity: 'medium',
        title: 'No Content Security Policy',
        description: 'The site lacks CSP headers, making it more vulnerable to XSS attacks.',
        icon: '⚠️'
      });
    }
    
    if (results.cookies.thirdParty > 0) {
      recommendations.push({
        severity: 'medium',
        title: 'Third-Party Cookies',
        description: `Found ${results.cookies.thirdParty} third-party cookies tracking you across sites.`,
        icon: '🍪'
      });
    }
    
    if (results.thirdParty. count > 20) {
      recommendations.push({
        severity: 'low',
        title: 'Many Third-Party Requests',
        description: `This page makes ${results.thirdParty.count} requests to external domains.`,
        icon: '🌐'
      });
    }
    
    return recommendations;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module. exports = PrivacyAnalyzer;
}