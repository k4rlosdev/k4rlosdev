import { launch } from "puppeteer";

const getInfoToInstagram = async (userName) => {
  const browser = await launch();

  const page = await browser.newPage();

  // go to Instagram web profile
  await page
    .goto(`https://instagram.com/${userName}`, {
      waitUntil: "networkidle0",
    })
    .catch((err) => console.log("error loading url", err));

  // check username exists or not exists
  let isUsernameNotFound = await page.evaluate(() => {
    // check selector exists
    if (document.getElementsByTagName("h2")[0]) {
      // check selector text content
      if (
        document.getElementsByTagName("h2")[0]?.textContent ==
        "Sorry, this page isn't available."
      ) {
        return true;
      }
    }

    return false;
  });

  if (isUsernameNotFound) {
    // close browser
    await browser.close();
    return;
  }

  // get username
  let username = await page.evaluate(() => {
    return document.querySelectorAll("header > section > div h2")[0]
      ?.textContent;
  });

  // check the account is verified or not
  let isVerifiedAccount = await page.evaluate(() => {
    // check selector exists
    if (
      document
        .querySelectorAll("header > section > div span")[0]
        ?.getAttribute("title")
    ) {
      return true;
    } else {
      return false;
    }
  });

  // get username picture URL
  let usernamePictureUrl = await page.evaluate(() => {
    return document.querySelectorAll("header img")[0]?.getAttribute("src");
  });

  // get number of total posts
  let postsCount = await page.evaluate(() => {
    return document
      .querySelectorAll("header > section > ul > li span")[0]
      ?.textContent.replace(/\,/g, "");
  });

  // get number of total followers
  let followersCount = await page.evaluate(() => {
    return document
      .querySelectorAll("header > section > ul > li span")[2]
      ?.textContent.replace(/\,/g, "");
  });

  // get number of total followings
  let followingsCount = await page.evaluate(() => {
    return document
      .querySelectorAll("header > section > ul > li span")[4]
      ?.textContent.replace(/\,/g, "");
  });

  // check if account is private or not
  let isPrivateAccount = await page.evaluate(() => {
    // check selector exists
    if (document.getElementsByTagName("h2")[0]) {
      // check selector text content
      if (
        document.getElementsByTagName("h2")[0]?.textContent ===
        "This Account is Private"
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  // get recent posts (array of url and photo)
  let recentPosts = await page.evaluate(() => {
    let results = [];

    // loop on recent posts selector
    document
      .querySelectorAll('div[style*="flex-direction"] div > a')
      .forEach((el) => {
        // init the post object (for recent posts)
        let post = {};

        // fill the post object with URL and photo data
        post.url = "https://www.instagram.com" + el?.getAttribute("href");
        post.photo = el.querySelector("img")?.getAttribute("src");

        // add the object to results array (by push operation)
        results.push(post);
      });

    // recentPosts will contains data from results
    return results;
  });

  // close the browser
  await browser.close();

  return {
    username,
    isVerifiedAccount,
    usernamePictureUrl,
    postsCount,
    followersCount,
    followingsCount,
    isPrivateAccount,
    recentPosts,
  };
};

export default getInfoToInstagram;
