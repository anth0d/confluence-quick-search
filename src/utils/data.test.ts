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

describe('getSiteUrl', () => {
  test('no data', async () => {
    setup({ sOutput: '', cOutput: '' });
    expect(await getSiteUrl()).toBe('');
  });

  test('existing confluenceUrl', async () => {
    setup({ sOutput: '', cOutput: 'love.atlassian.net' });
    expect(await getSiteUrl()).toBe('https://love.atlassian.net/wiki');
  });

  test('existing siteUrl', async () => {
    setup({ sOutput: 'https://mysite.com/confluence', cOutput: 'sdf' });
    expect(await getSiteUrl()).toBe('https://mysite.com/confluence');
  });
});
