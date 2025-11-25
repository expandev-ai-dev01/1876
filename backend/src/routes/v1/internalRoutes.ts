/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Task management routes
 */
router.post('/task', taskController.postHandler);

export default router;
