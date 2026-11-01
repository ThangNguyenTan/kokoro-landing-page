import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';

const SINGLETON_TYPES = new Set(['clinicSettings']);
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

/**
 * Embedded Sanity Studio v3 Configuration for Phòng Khám YHCT Kokoro.
 * Accessible at `/admin` (via Next.js rewrites to `src/app/studio/[[...tool]]/page.tsx`).
 */
export default defineConfig({
  name: 'kokoro-wellness-clinic-studio',
  title: 'Phòng Khám YHCT Kokoro — Quản Trị Nội Dung',
  projectId,
  dataset,
  // Matches `/admin` browser URL rewritten to `/studio` in `next.config.ts`
  basePath: '/admin',
  plugins: [
    structureTool({
      title: 'Quản Trị Nội Dung',
      structure: (S) =>
        S.list()
          .title('Nội Dung Phòng Khám Kokoro')
          .items([
            S.listItem()
              .title('Cài Đặt Phòng Khám & Pháp Lý')
              .id('clinicSettings')
              .child(
                S.document()
                  .schemaType('clinicSettings')
                  .documentId('clinicSettings')
                  .title('Cài Đặt Phòng Khám & Pháp Lý'),
              ),
            S.divider(),
            S.documentTypeListItem('services').title('Dịch Vụ Y Học Cổ Truyền'),
            S.documentTypeListItem('doctors').title('Đội Ngũ Bác Sĩ & Lương Y'),
            S.documentTypeListItem('testimonials').title('Cảm Nhận Bệnh Nhân'),
            S.documentTypeListItem('faqs').title('Câu Hỏi Thường Gặp (FAQ)'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent creating multiple singleton documents from the global "+" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Restrict destructive/duplicate actions on singleton `clinicSettings`
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
});
