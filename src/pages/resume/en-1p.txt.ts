// Plain-text one-page resume — paste into resume apps / job-board forms.
import { enOnePage } from '../../data/resume';
import { onePageText } from '../../data/onePageText';

export const GET = () =>
  new Response(onePageText(enOnePage, 'en'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
