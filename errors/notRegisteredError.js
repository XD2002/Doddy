class NotRegisteredError extends Error {
    constructor(message = "") {
        super(message);
    }
}

module.exports = { NotRegisteredError }