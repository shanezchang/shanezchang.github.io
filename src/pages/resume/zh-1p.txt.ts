// Plain-text one-page resume — paste into resume apps / job-board forms.
import { zhOnePage } from '../../data/resume';
import { onePageText } from '../../data/onePageText';

export const GET = () =>
  new Response(onePageText(zhOnePage, 'zh'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
