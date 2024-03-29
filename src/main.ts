import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<button>Kérem a videólistát</button>
<ul></ul>`;

loadClient();
const button = document.querySelector("button")!;

function loadClient() {
  gapi.load("client", () => {
    gapi.client
      .init({
        apiKey: "AIzaSyBzYykg8aExJ7z40c4HjGgaMdrRl856FQw",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
        ],
      })
      .then(() => {
        console.log("YouTube API client loaded.");
      })
      .catch((error: Error) => {
        console.error("Error loading YouTube API client:", error);
      });
  });
}

function getData() {
  return gapi.client.youtube.channels
    .list({
      part: ["snippet,contentDetails,statistics"],
      id: "UCNfGAeIGB6qTXkyvlnMv3-g",
    })
    .then((channelData: any) => {
      const playlistId =
        channelData.result.items[0].contentDetails.relatedPlaylists.uploads;
      return gapi.client.youtube.playlistItems.list({
        part: "snippet",
        playlistId,
        maxResults: 50,
      });
    })
    .then((videoListData) => {
      const videoList = videoListData.result.items!;
      const display = document.querySelector("ul")!;
      videoList.forEach((videoData, index) => {
        const row = document.createElement("li");
        const date = videoData.snippet?.publishedAt?.slice(0, 10);
        const id = videoData.snippet?.resourceId?.videoId;
        let title = videoData.snippet?.title;
        if (title?.includes("A.J. Christian - "))
          title = title.replace("A.J. Christian - ", "");
        row.innerHTML = `
          <span class="date">${index + 1}.</span> 
          <a href="https://www.youtube.com/watch?v=${id}" 
          target="blank">
          ${title} (${date})
          </a>
        `;
        display.append(row);
        button.disabled = true;
      });
    })
    .catch((error: Error) => {
      console.error("Execute error", error);
    });
}

button.onclick = getData;
