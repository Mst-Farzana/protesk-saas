import assert from 'node:assert/strict';
import test from 'node:test';

import { fallbackProductRecommendations } from '../server/utils/ai.js';

test('fallbackProductRecommendations returns best matches and keeps the catalog intact', () => {
  const products = [
    { id: '1', name: 'Laptop Pro', price: 1500, category: 'Electronics', stock: 8 },
    { id: '2', name: 'Noise Canceling Headphones', price: 220, category: 'Audio', stock: 12 },
    { id: '3', name: 'Mechanical Keyboard', price: 140, category: 'Accessories', stock: 5 },
    { id: '4', name: 'Portable SSD', price: 90, category: 'Storage', stock: 20 },
  ];

  const result = fallbackProductRecommendations(products, 'best value under 250');

  assert.equal(result.length, 3);
  assert.ok(result.every(item => item.reason && item.name));
  assert.ok(result.some(item => item.name.includes('Headphones')));
  assert.ok(result.some(item => item.name.includes('Keyboard')));
});
