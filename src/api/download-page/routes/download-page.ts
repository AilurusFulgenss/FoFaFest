/**
 * download-page router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::download-page.download-page',{
    config: {
        find: {
            middlewares: ["api::download-page.download-page-populate"]
        }
    }
});

