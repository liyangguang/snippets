<template lang="pug">
._html(v-html="renderMarkdown()")
</template>


<script>
import marked from 'marked';

export default {
  props: ['markdownContent'],
  methods: {
    renderMarkdown() {
      const htmlString = marked(this.markdownContent || '');
      
      // Convert html string to dom for processing
      const tempDom = document.createElement('div');
      tempDom.innerHTML = htmlString;
      
      // process links: add protocol, open in new tab
      tempDom.querySelectorAll('a').forEach(aTag => {
        // Get the href using getAttribute instead of element.href, because element.href auto complete the url.
        const hrefText = aTag.getAttribute('href');

        // Open the link in new tab, if it's not within our site.
        if (!hrefText.startsWith('/')) aTag.target = '_blank';
        // Add prototol if missing.
        if (!hrefText.startsWith('http') && !hrefText.startsWith('mailto') && !hrefText.startsWith('/')) {
          aTag.href = 'http://' + hrefText;
        }
      });
      return tempDom.innerHTML;
    },
  },
}
</script>
