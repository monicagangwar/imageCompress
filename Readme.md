# Apis to compress images

## Installation
```
git clone https://github.com/monicagangwar/imageCompress.git
cd imageCompress
npm install
```
## Start server
```
node server.js
```
## Apis
Apis are designed to consume jpeg / png images
### compressFromPhoto
```
curl -X POST \
  http://localhost:3000/api/compressFromPhoto \
  -F 'image=${path_to_image}'
```
### compressFromUrl
```
curl -X POST \
  http://localhost:3000/api/compressFromUrl \
  -H 'content-type: application/json' \
  -d '[ "https://www.filepicker.io/api/file/Trc6VsKQouTn7lHAVKJg", "https://www.filepicker.io/api/file/XLU8pMCPQDGrdx19RkAs" ]'
```
### compressFromCsv
```
curl -X POST \
  http://localhost:3000/api/compressFromCsv \
  -F 'file=@${path_to_csv}'
```
**Csv format**
```
url
https://www.filepicker.io/api/file/XLU8pMCPQDGrdx19RkAs
https://www.filepicker.io/api/file/Trc6VsKQouTn7lHAVKJg
```
![img](https://user-images.githubusercontent.com/8946358/27519349-40e1cfd4-5a0f-11e7-958e-930fc7e70c70.png)

