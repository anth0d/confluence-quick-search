import { getSiteUrl } from './data';

const setup = ({ sOutput, cOutput }) => {
  (global as any).chrome = {
    storage: {
      sync: {
        get: (key: string, cb: any) => {
          switch (key) {
            case 'siteUrl':
              cb({ siteUrl: sOutput });
              break;
            case 'confluenceUrl':
              cb({ confluenceUrl: cOutput });
          }
        }
      }
    }
  };
};

describe('v1 url behavior', () => {
  test('no data - getSiteUrl', async () => {
    setup({ sOutput: '', cOutput: '' });
    expect(await getSiteUrl()).toBe('');
  });

  test('existing confluenceUrl - getSiteUrl', async () => {
    setup({ sOutput: '', cOutput: 'love.atlassian.net' });
    expect(await getSiteUrl()).toBe('https://love.atlassian.net/wiki');
    // to do this, I need to make sure 
    // - nothing else ever runs saveConfluenceUrl
    // - getSiteUrl falls back to confluenceUrl
    // - setup uses getSiteUrl and saveSiteUrl
    // - saving will save whatever is in the input
  });

  test('existing siteUrl - getSiteUrl', async () => {
    setup({ sOutput: 'https://mysite.com/confluence', cOutput: 'sdf' });
    expect(await getSiteUrl()).toBe('https://mysite.com/confluence');
  });

  test('existing siteUrl - getSiteUrl', async () => {
    setup({ sOutput: 'https://mysite.com/confluence', cOutput: 'sdf' });
    expect(await getSiteUrl()).toBe('https://mysite.com/confluence');
  });
});
