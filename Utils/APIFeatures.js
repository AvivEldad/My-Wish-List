const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const { getJson } = require("serpapi");

class APIFeatures {
  getItemInfo = async (name) => {
    try {
      name = name.replace(/ /g, "+");

      const data = await getJson({
        q: name,
        engine: "google_shopping",
        ijn: "0",
        api_key: process.env.SEARCH_API_KEY,
      });

      const shoppingData = data.shopping_results;
      let sum = 0;
      let hasPic = false;
      let pic = shoppingData[0].thumbnail;
      for (let product of shoppingData) {
        sum += product.extracted_price;

        if (isFromEbayOrAmazon(product.source)) {
          if (!hasPic) {
            pic = product.thumbnail;
            hasPic = true;
          }
        }
      }

      let avg = parseFloat((sum / shoppingData.length).toFixed(2));
      return [avg, pic];
    } catch (error) {
      console.error("Error in getItemInfo:", error);
      throw error;
    }
  };
}

module.exports = APIFeatures;

function isFromEbayOrAmazon(source) {
  const lowerCaseSource = source.toLowerCase();
  return /(ebay|amazon)/i.test(lowerCaseSource);
}
