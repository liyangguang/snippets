# A vue compoent to translate markdown to html.

Usage:
```
<!-- Template: -->
<markdown [markdownContent]="myMarkdown"></markdown>

// JS:
...
  myMarkdown: `# Hello **world**`;
...
```

- Convert markdown to html
- Change behavior of links (<a> tag)
  - Open in new tab, if not a link inside our site.
  - Clean up url.
