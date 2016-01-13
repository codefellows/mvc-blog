# Static MVC Blog

This is a simple blogging system front end. The code is organized with MVC principles in mind.

It starts small, but gains new features quickly.

## Build & Deployment

This repo is hosted by Aerobatic, where each class-specific branch lives as a subdomain.

Build locally, then deploy to Bit Bucket.

First time build:
```
  gulp clean && gulp build
```

After that, you can run a watcher that will update the build when the source files change:
```
  gulp
```

Deploy:

Setup the Bit Bucket repo as a remote. Then:

```
  git push bb class-xy
```
