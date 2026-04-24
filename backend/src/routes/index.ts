import { Hono } from 'hono'
import { prospectsRoutes } from './prospects'
import { clientsRoutes } from './clients'
import { contactsRoutes } from './contacts'
import { distributeursRoutes } from './distributeurs'
import { opportunitesRoutes } from './opportunites'
import { tourneesRoutes } from './tournees'
import { interventionsRoutes } from './interventions'
import { metriquesRoutes } from './metriques'
import { contratsRoutes } from './contrats'
import { relancesRoutes } from './relances'
import { parametresRoutes } from './parametres'
import { meRoutes } from './me'
import { publicContratRoutes } from './public-contrat'

export const routes = new Hono()
  .route('/me', meRoutes)
  .route('/prospects', prospectsRoutes)
  .route('/clients', clientsRoutes)
  .route('/contacts', contactsRoutes)
  .route('/distributeurs', distributeursRoutes)
  .route('/opportunites', opportunitesRoutes)
  .route('/tournees', tourneesRoutes)
  .route('/interventions', interventionsRoutes)
  .route('/metriques', metriquesRoutes)
  .route('/contrats', contratsRoutes)
  .route('/relances', relancesRoutes)
  .route('/parametres', parametresRoutes)

export const publicRoutes = new Hono().route('/contrat', publicContratRoutes)
