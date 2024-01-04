import "./style.css";

document.querySelector<HTMLDivElement>(
  "#app"
)!.innerHTML = `
<button>Kérem a videólistát</button>
<ul></ul>`;

loadClient();

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
        const button = document.querySelector("button")!;
        button.style.display = "block";
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
      videoList.map((videoData) => {
        const row = document.createElement("li");
        row.innerHTML = `<div>${videoData.snippet?.title}</div>`;
        console.log(videoData.snippet?.resourceId?.videoId);
        display.append(row);
      });
    })
    .catch((error: Error) => {
      console.error("Execute error", error);
    });
}

const button = document.querySelector("button")!;
button.onclick = getData;
