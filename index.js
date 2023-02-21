import Mustache from "mustache";
import { readFile, writeFileSync } from "fs";
import getInfoToInstagram from "./services/puppeteer.service.js";

const MUSTACHE_MAIN = "./main.mustache";

let DATA = {
  refresh_date: new Date().toLocaleDateString("es-SV", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "America/El_Salvador",
  }),
};

async function setInstagramPosts() {
  const { recentPosts } = await getInfoToInstagram("k4rlosdev");
  if (recentPosts?.length > 0) {
    if (recentPosts?.length >= 3) {
      DATA.img1 = recentPosts[0].photo;
      DATA.img2 = recentPosts[1].photo;
      DATA.img3 = recentPosts[2].photo;
    } else {
      DATA.img1 = recentPosts[0].photo;
    }
  } else {
    DATA.img1 = "";
    DATA.img2 = "";
    DATA.img3 = "";
  }
}

async function generateReadMe() {
  readFile(MUSTACHE_MAIN, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    writeFileSync("README.md", output);
  });
}

async function main() {
  await setInstagramPosts();
  await generateReadMe();
}

main();
