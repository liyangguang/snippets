# Image uploader component

Uploades an image to Firebase Storage.

Usage:

```vue
<!-- Template: -->
<image-uploader @upload="handleUploadedImage($event)"></image-uploader>

// JS:
handleUploadedImage(url) {
  console.log('Image uploaded to:', url);
}
```
