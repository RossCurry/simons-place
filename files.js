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
  const pubKey = process.env.PUBLIC_KEY
  const secKey = process.env.SECRET_KEY
  console.log(`Uploadcare.Simple ${pubKey}:${secKey}`)
  const urlApi = "https://api.uploadcare.com/files/?stored=true"
  const date = new Date(Date.now()).toGMTString()
  console.log('date', date)
  const headers = {
    "Authorization": `Uploadcare.Simple ${pubKey}:${secKey}`,
    "Content-type" : "application/json",
    "Accept": "application/vnd.uploadcare-v0.7+json",
    "Date": date,
    "Access-Control-Allow-Origin": "*"
  }
  console.log('headers', headers)
  const response = await fetch(urlApi, {
    headers,
    method: "GET"
  })
  if (!response.ok) throw Error(`Api error from uploadcare: ${response.status}/${response.statusText}`)
  const filesInfo = await response.json()
  if (!("results" in filesInfo)) throw new Error("No 'results' in get files response")
  // TODO if you get over 100 fotos you will need to implement pagination
  const linksAndNames = filesInfo.results.map(fileInfo => {
    return {
      name: fileInfo.original_filename,
      url: fileInfo.original_file_url
    }
  })
  console.log("Returning uploadcare images", linksAndNames)
  return linksAndNames
}
