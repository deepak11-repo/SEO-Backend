// Function to calculate keyword density in a paragraph
function calculateDensity(paragraph, keyword) {
    const words = paragraph.match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const occurrences = countOccurrences(paragraph, keyword);
    return (occurrences / totalWords) * 100;
}

// Function to count occurrences of a keyword in a string
function countOccurrences(text, keyword) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    return (text.match(regex) || []).length;
}

// Function to assess SEO optimization based on various factors
function assessSEOOptimization(paragraph, primaryKeyword, secondaryKeywords) {
    // Example thresholds for scoring
    const keywordRelevanceThreshold = 1; // Minimum relevance score needed
    const keywordDensityThreshold = {
        primary: 1.5,  // Example: 1.5% for primary keyword density
        secondary: 0.8 // Example: 0.8% for secondary keyword density
    };
    const readabilityThreshold = 60; // Example readability score threshold (adjust as needed)

    // Normalize the paragraph content to lowercase
    const normalizedParagraph = paragraph.toLowerCase();

    // Calculate densities
    const primaryDensity = calculateDensity(normalizedParagraph, primaryKeyword.toLowerCase());
    const secondaryDensities = secondaryKeywords.map(keyword => calculateDensity(normalizedParagraph, keyword.toLowerCase()));

    // Assess scores
    const keywordRelevanceScore = assessKeywordRelevance(normalizedParagraph, primaryKeyword.toLowerCase(), secondaryKeywords);
    const densityScore = assessDensity(primaryDensity, secondaryDensities, keywordDensityThreshold);
    const readabilityScore = calculateReadabilityScore(paragraph);

    // Determine if optimization is needed based on individual metrics
    const optimizationNeeded = (
        keywordRelevanceScore < keywordRelevanceThreshold ||
        densityScore < 1 || // At least one secondary keyword should meet density threshold
        readabilityScore < readabilityThreshold
    );

    return {
        optimizationNeeded,
        scores: {
            keywordRelevance: keywordRelevanceScore,
            density: densityScore,
            readability: readabilityScore
        }
    };
}

// Function to assess keyword relevance in a paragraph
function assessKeywordRelevance(paragraph, primaryKeyword, secondaryKeywords) {
    const primaryRelevance = paragraph.includes(primaryKeyword) ? 3 : 1;
    const secondaryRelevance = secondaryKeywords.reduce((score, keyword) => {
        return score + (paragraph.includes(keyword) ? 1 : 0);
    }, 0);
    return primaryRelevance + secondaryRelevance;
}

// Function to assess density scores against thresholds
function assessDensity(primaryDensity, secondaryDensities, thresholds) {
    let score = 0;
    if (primaryDensity >= thresholds.primary) {
        score++;
    }
    secondaryDensities.forEach(density => {
        if (density >= thresholds.secondary) {
            score++;
        }
    });
    return score;
}

// Function to calculate readability score (Flesch-Kincaid Reading Ease score)
function calculateReadabilityScore(paragraph) {
    const words = paragraph.match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const totalSentences = paragraph.split(/[.!?]/g).length - 1;
    const avgWordsPerSentence = totalWords / totalSentences;
    const avgSyllablesPerWord = calculateAverageSyllables(words);
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return readabilityScore.toFixed(1);
}

// Function to calculate average number of syllables per word
function calculateAverageSyllables(words) {
    let totalSyllables = 0;
    words.forEach(word => {
        totalSyllables += countSyllables(word);
    });
    return totalSyllables / words.length;
}

// Function to count syllables in a word
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) {
        return 1;
    }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 0;
}


module.exports = {
    assessSEOOptimization
};
