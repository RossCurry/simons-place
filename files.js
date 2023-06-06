import fs from 'fs';

export async function getLocalFiles() {
  const dirPath = './data';
  return new Promise(async (resolve, reject) => {
    await fs.readdir(dirPath, (err, files) => {
      if (err) reject(err);
      const jpegFiles = files.filter((filePath) => filePath.endsWith('.jpg'));
      const jpegDateInfo = jpegFiles.map((filePath) => {
        // Parse the date format
        const dateString = filePath.slice(6, -13);
        const timeString = filePath.slice(-12, -4).replaceAll('-', ':');
        const date = new Date(`${dateString}T${timeString}`);
        return {
          fileName: filePath,
          date: date,
        };
      });
      resolve(jpegDateInfo);
    });
  });
}

export async function getUploadCareFiles() {
  /**
   * fetch all file info
   * order it by date
   * return cdn links & file name info
   */
  const pubKey = process.env.PUBLIC_KEY;
  const secKey = process.env.SECRET_KEY;
  const urlApi = 'https://api.uploadcare.com/files/?stored=true';
  const date = new Date(Date.now()).toGMTString();
  const headers = {
    Authorization: `Uploadcare.Simple ${pubKey}:${secKey}`,
    'Content-type': 'application/json',
    Accept: 'application/vnd.uploadcare-v0.7+json',
    Date: date,
    'Access-Control-Allow-Origin': '*',
  };
  const response = await fetch(urlApi, {
    headers,
    method: 'GET',
  });
  if (!response.ok)
    throw Error(
      `Api error from uploadcare: ${response.status}/${response.statusText}`
    );
  const filesInfo = await response.json();
  if (!('results' in filesInfo))
    throw new Error("No 'results' in get files response");
  if (filesInfo.results.length > 100) console.warn("over 100 fotos, you need to implement pagination")
  const linksNamesDates = filesInfo.results.map((fileInfo) => {
    return {
      name: fileInfo.original_filename,
      url: fileInfo.original_file_url,
      date: parseDate(fileInfo.original_filename),
      id: fileInfo.uuid
    };
  });
  console.log('Returning uploadcare images', linksNamesDates);

  return linksNamesDates.sort((a,b) => b.date - a.date);
}

function parseDate(fileName) {
  const dateString = fileName.slice(6, -13);
  const timeString = fileName.slice(-12, -4).replaceAll('-', ':');
  console.log('dateString', `${dateString}T${timeString}`)
  const date = new Date(`${dateString}T${timeString}`);
  console.log('date', date)
  return date
}

/**
 * Example from uploadcare
 * <img src=
'https://ucarecdn.com/a26c...bc60/Image ID
-/scale_crop/900x900/smart/Crop to prominent objects
-/format/auto/Choose format automatically
-/quality/smart_retina/Adjust quality automatically'
/>
 */