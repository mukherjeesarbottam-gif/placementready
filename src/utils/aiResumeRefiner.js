export const refineDescription = async (text, type = 'project') => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const sentences = text
    .split(/[.;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) {
    return ["Spearheaded the design and development of end-to-end user-centric applications."];
  }

  const refined = sentences.map((sentence) => {
    const lower = sentence.toLowerCase();
    
    // Check keyword patterns
    if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shopping')) {
      return 'Engineered a highly responsive e-commerce application featuring dynamic state management, secure payment flows, and product catalog modules.';
    }
    if (lower.includes('react') || lower.includes('vue') || lower.includes('frontend') || lower.includes('ui')) {
      return 'Architected a pixel-perfect, reusable front-end component library in React, improving rendering efficiency and page load times by 25%.';
    }
    if (lower.includes('api') || lower.includes('backend') || lower.includes('node') || lower.includes('express') || lower.includes('server')) {
      return 'Designed and deployed RESTful microservices and API endpoints with Node.js, ensuring optimized data throughput and low latency responses.';
    }
    if (lower.includes('database') || lower.includes('sql') || lower.includes('mongodb') || lower.includes('query')) {
      return 'Optimized relational database schemas and indexed search queries to improve database transaction throughput by 30%.';
    }
    if (lower.includes('login') || lower.includes('auth') || lower.includes('security') || lower.includes('firebase')) {
      return 'Implemented robust security standards by integrating OAuth2, JWT tokens, and secure token-based authentication protocols.';
    }
    if (lower.includes('bug') || lower.includes('fix') || lower.includes('test') || lower.includes('error')) {
      return 'Identified and fixed critical system bottlenecks and software defects, improving overall application stability and user retention.';
    }
    if (lower.includes('ml') || lower.includes('model') || lower.includes('ai') || lower.includes('python')) {
      return 'Developed and fine-tuned machine learning predictive models, achieving high accuracy through data preprocessing and custom feature engineering.';
    }

    // Default general replacements based on first words
    let actionVerb = 'Designed and built';
    if (lower.startsWith('made') || lower.startsWith('did') || lower.startsWith('built') || lower.startsWith('created')) {
      actionVerb = 'Developed and deployed';
    } else if (lower.startsWith('fixed') || lower.startsWith('solved') || lower.startsWith('debugged')) {
      actionVerb = 'Resolved and optimized';
    } else if (lower.startsWith('managed') || lower.startsWith('led') || lower.startsWith('guided')) {
      actionVerb = 'Spearheaded and directed';
    } else if (lower.startsWith('designed') || lower.startsWith('drew')) {
      actionVerb = 'Conceptualized and designed';
    } else if (lower.startsWith('implemented') || lower.startsWith('added')) {
      actionVerb = 'Integrated and implemented';
    }

    // Clean up starting verbs
    let cleanedSentence = sentence
      .replace(/^(made|did|built|created|fixed|solved|debugged|managed|led|guided|designed|drew|implemented|added|i have|we have|i)\s+/i, '')
      .trim();
    
    // Capitalize first letter of cleaned sentence
    if (cleanedSentence.length > 0) {
      cleanedSentence = cleanedSentence.charAt(0).toLowerCase() + cleanedSentence.slice(1);
      return `${actionVerb} a solution that ${cleanedSentence}, driving performance and functionality.`;
    }
    
    return `${actionVerb} a high-impact solution meeting design specifications.`;
  });

  return refined;
};
