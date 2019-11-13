
export const TRACKING_ID = 'UA-152084023-1';

export const _gaq = {
  push: (args: string[]) => {
    window._gaq = window._gaq || [] as GoogleAnalyticsCode;
    window._gaq.push(args);
  }
}

export const init = (trackingId: string) => {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var ss = document.getElementsByTagName('script');
  if (ss.length >= 1) {
    var s = ss[0];
    s.parentNode.insertBefore(ga, s);
  }

  _gaq.push(['_setAccount', trackingId]);
  _gaq.push(['_trackPageview']);
};
