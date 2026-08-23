import { COVER_GRADIENTS } from './constants';
import { getApiBaseUrl } from '../services/api';

export const getCoverGradient = (title = '', author = '') => {
  const combined = (title + author).toLowerCase();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
};

export const getInitials = (text = '') => {
  if (!text) return 'BK';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getCoverImageUrl = (coverImage = '') => {
  if (!coverImage) return '';
  if (
    coverImage.startsWith('http://') ||
    coverImage.startsWith('https://') ||
    coverImage.startsWith('data:') ||
    coverImage.startsWith('blob:')
  ) {
    return coverImage;
  }

  // Get active backend URL without the trailing /api
  const apiBase = getApiBaseUrl();
  let hostBase = apiBase.replace(/\/api\/?$/, '');

  // If hostBase is empty or relative "/api", use current origin
  if (!hostBase || hostBase === '/api') {
    hostBase = '';
  }

  const cleanPath = coverImage.startsWith('/') ? coverImage : `/${coverImage}`;
  return `${hostBase}${cleanPath}`;
};

