import { Hono } from 'hono'
import { prospectsRoutes } from './prospects'
import { distributeursRoutes } from './distributeurs'
import { metriquesRoutes } from './metriques'
import { contratsRoutes } from './contrats'
import { relancesRoutes } from './relances'

export const routes = new Hono()
  .route('/prospects', prospectsRoutes)
  .route('/distributeurs', distributeursRoutes)
  .route('/metriques', metriquesRoutes)
  .route('/contrats', contratsRoutes)
  .route('/relances', relancesRoutes)
