// import { getFiles } from "./files.js"

class ImagesOfDad {
  /**
   * Each image is  { name, url }
   */
  constructor(images){
    this.images = images && Array.isArray(images) ? images : []
  }
  getAllImages(){
    return this.images
  }
  addImages(imageInfoArr){
    if (!Array.isArray(imageInfoArr)) this.images.push(imageInfoArr)
    console.log("imageInfoArr", Array.isArray(imageInfoArr), imageInfoArr.length)
    console.log("this.images", this.images)
    this.images.push(...imageInfoArr)
    return this.images
  }
  getImage(uuid){
    const [ image ] = this.images.filter(image => image.uuid === uuid)
    return image
  }
}

async function main(params) {
  const imagesOfDad = new ImagesOfDad()
  // console.log("hello")
//   <div class="back">
//   <h1>back</h1>
// </div>
  async function fetchDadImages() {
    const response = await fetch("/files")
    if (!response.ok) throw new Error(`Error fetching images from uploadcare, ${response.status}/${response.statusText}`)
    const images = await response.json()
    console.log('images', images)
    imagesOfDad.addImages(images)
  }
  
  function createCard(sideOfCard = "back", imgUrl = "") {
    const card = document.createElement("div")
    card.classList.add("card")
    const cardSide = document.createElement("div")
    cardSide.classList.add(sideOfCard)
    const img = document.createElement("img")
    img.classList.add("cardImg")
    img.setAttribute("src", imgUrl)
    card.appendChild(cardSide.appendChild(img))
    return card
  }

  function addCards() {
    const cardContainer = document.getElementById("cardContainer")
    console.log('cardContainer', cardContainer)
    let cardCount = 0
    const uploadCareOptimization = `-/preview/600x800/
    -/format/auto/
    -/quality/smart/`
    console.log("images of dad", imagesOfDad.getAllImages().length)
    for (const image of imagesOfDad.getAllImages()){
      // TODO optimization
      // const indx = image.url.lastIndexOf("/PHOTO")
      // const urlNoName = image.url.slice(0, indx)
      // console.log('image.url', image.url)
      // console.log('urlNoName', urlNoName)
      // const cardBack = createCard("back", urlNoName+"/"+uploadCareOptimization)
      const cardBack = createCard("back", image.url)
      cardContainer.appendChild(cardBack)
      console.log(cardCount++)
    }
  }






  await fetchDadImages()
  addCards()
}
main()