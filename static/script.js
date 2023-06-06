class ImagesOfDad {
  /**
   * Each image is  { name, url, id, date }
   */
  constructor(images){
    this.images = images && Array.isArray(images) ? images : []
  }
  getAllImages(){
    return this.images
  }
  addImages(imageInfoArr){
    if (!Array.isArray(imageInfoArr)) this.images.push(imageInfoArr)
    this.images.push(...imageInfoArr)
    return this.images
  }
  getImage(uuid){
    const [ image ] = this.images.filter(image => image.uuid === uuid)
    return image
  }
}
const imagesOfDad = new ImagesOfDad()

async function main() {
  await fetchDadImages()
  addCards()
}
main()


async function fetchDadImages() {
  const response = await fetch("/files")
  if (!response.ok) throw new Error(`Error fetching images from uploadcare, ${response.status}/${response.statusText}`)
  const images = await response.json()
  imagesOfDad.addImages(images)
}

function addCards() {
  const cardContainer = document.getElementById("cardContainer")
  console.log("images of dad", imagesOfDad.getAllImages().length)
  for (const imageInfo of imagesOfDad.getAllImages()){
    // card frame is to help maintain flip effect
    const cardFrame = document.createElement("div")
    cardFrame.classList.add("cardFrame")
    const card = document.createElement("div")
    card.classList.add("card")
    const cardBack = createCard("back", imageInfo)
    const cardFront = createCard("front", imageInfo)
    card.appendChild(cardBack)
    card.appendChild(cardFront)
    cardFrame.appendChild(card)
    cardContainer.appendChild(cardFrame)
  }
}

function createCard(sideOfCard, imageInfo) {
  const ucareUrl = "https://ucarecdn.com/"
  const uploadCareOptimization = `-/preview/600x800/-/format/auto/-/quality/smart/`
  const optimizedUrl = ucareUrl + imageInfo.id + "/" + uploadCareOptimization 
  // const card = document.createElement("div")
  // card.classList.add("card")
  const cardSide = document.createElement("div")
  cardSide.classList.add(sideOfCard)
  const img = document.createElement("img")
  img.setAttribute("src", optimizedUrl)
  cardSide.appendChild(img)
  img.classList.add("cardImg")

  if (sideOfCard === "front"){
    const textContainer = document.createElement("div")
    const cardTitle = document.createElement("h2")
    const cardText = document.createElement("p")
    textContainer.classList.add("cardTextContainer")
    cardTitle.classList.add("cardTitle")
    cardText.classList.add("cardText")
    if (imageInfo.date !== "Invalid Date"){
      const date = new Date(imageInfo.date)
      const dateString = date.toDateString()
      cardTitle.textContent = date.getFullYear()
      cardText.textContent = dateString.slice(0, dateString.lastIndexOf(" "))
    }
    textContainer.appendChild(cardTitle)
    textContainer.appendChild(cardText)
    cardSide.appendChild(textContainer)
  }
  
  cardSide.addEventListener("click", function getCardInfo(e) {
    console.log("imageInfo", imageInfo)
  })
  return cardSide
}

