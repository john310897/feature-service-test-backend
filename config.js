const DATABASE_NAME = "feature_service"
const DATABASE_USERNAME = "john310897"
const DATABASE_PASSWORD = "NoDAMdcAX56iUFOF"
const COLLECTION_NAME = "user"
const BACKEND_PORT = 3001

module.exports = {
    development: {
        DATABASE_NAME,
        DATABASE_USERNAME,
        DATABASE_PASSWORD,
        COLLECTION_NAME,
        BACKEND_PORT
    },
    production: {
        DATABASE_NAME,
        DATABASE_USERNAME,
        DATABASE_PASSWORD,
        COLLECTION_NAME,
        BACKEND_PORT
    }
};
