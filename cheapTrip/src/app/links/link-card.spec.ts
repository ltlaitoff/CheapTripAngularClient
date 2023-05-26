import { LinkCard } from './link-card';

describe('LinkCard', () => {
  it('should create an instance', () => {
    expect(new LinkCard('title', 'link', 'description')).toBeTruthy();
  });
});
