const ENV = {
    SECRET_KEY: import.meta.env.VITE_SECRET_KEY || 'default_secret_key',
    validationKey: import.meta.env.VITE_SECRET_VALIDATION || 'default_validation_key',
    ENCRYPTION_KEY: import.meta.env.VITE_SECRET_KEY || 'default_secret_key'
};
export default ENV;