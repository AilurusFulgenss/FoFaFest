// src/api/quarter/routes/quarter.js (หรือ .ts)

/**
 * global router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quarter.quarter',{
    config: {
        find: {
            middlewares: ["api::quarter.quarter-populate"]
        }
    }
});
