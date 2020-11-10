module.exports = {
  lang: 'en-US',
  title: 'Vuex',
  description: 'Global State Management for Vue.js',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'API Reference', link: '/api/vuex' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          children: [
            { text: 'What is Vuex?', link: '/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          children: [
            { text: 'Vuex', link: '/api/vuex' }
          ]
        }
      ]
    }
  }
}
