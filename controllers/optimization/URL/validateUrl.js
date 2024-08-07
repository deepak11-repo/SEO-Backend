const axios = require("axios");

const checkURL = async (req, res) => {
    const { url } = req.query;
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
        try {
            attempt++;
            const response = await axios.get(url, { timeout: 10000, maxRedirects: 5 });
            
            // Consider status codes 200, 403 as valid
            const validStatusCodes = [200, 403];
            success = validStatusCodes.includes(response.status);
            
            res.status(200).json({ valid: success });
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed for URL: ${url}`, error.message);
            if (attempt === maxRetries) {
                // Respond with a server error and detailed error message if all retries fail
                res.status(500).json({ valid: false, error: error.message });
            }
        }
    }
};

module.exports = { checkURL };
