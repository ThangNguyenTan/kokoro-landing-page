import type { SchemaTypeDefinition } from 'sanity';
import { clinicSettings } from './clinicSettings';
import { doctor } from './doctor';
import { faq } from './faq';
import { service } from './service';
import { testimonial } from './testimonial';

export const schemaTypes: SchemaTypeDefinition[] = [
  clinicSettings,
  service,
  doctor,
  testimonial,
  faq,
];

export { clinicSettings, service, doctor, testimonial, faq };
