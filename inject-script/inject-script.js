function injectExternalJsFile(url, checkLoadFn) {
  return new Promise((resolve) => {
    // Append the script tag
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', url);
    document.head.appendChild(scriptEl);
    console.info(`appending ${url}`);

    // Check for it to load
    const interval = setInterval(() => {
      console.info(`waiting for ${url} to load`);
      if (checkLoadFn()) {
        console.info(`${url} loaded!`);
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}

// Example usage
injectExternalJsFile(JQUERY_URL, () => !!window.jQuery).then(() => {
  console.info(`jquery ready to use here`);
});
