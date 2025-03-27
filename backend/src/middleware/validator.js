const validateReading = (req, res, next) => {
    const { timestamp, id, face, temperature } = req.body;

    // Check all required fields exist
    if (!timestamp || !id || !face || temperature === undefined) {
        return res.status(400).json({ 
            error: 'Missing required fields' 
        });
    }

    // Validate types
    if (!Number.isInteger(timestamp)) {
        return res.status(400).json({ 
            error: 'timestamp must be an integer (unix timestamp)' 
        });
    }

    if (!Number.isInteger(id)) {
        return res.status(400).json({ 
            error: 'id must be an integer' 
        });
    }

    if (!['south', 'east', 'north', 'west'].includes(face)) {
        return res.status(400).json({ 
            error: 'face must be one of: south, east, north, west' 
        });
    }

    if (typeof temperature !== 'number') {
        return res.status(400).json({ 
            error: 'temperature must be a number' 
        });
    }

    next();
};

module.exports = { validateReading };