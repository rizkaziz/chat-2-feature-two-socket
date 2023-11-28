const btn_kirim = document.querySelector("#kirim");
const input = document.querySelector("#input");
const username = document.querySelector("#username");
const div_display = document.querySelector(".container-pesan");
const fileInput = document.querySelector("#file");

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

async function getChat() {
  var response = await fetch("/api/getChat");
  var body = await response.json();
  body.map((detail) => {
    var file = detail.filename != undefined ? detail.filename : "";
    const bubbleChat = createBubbleChat(detail.text, detail.username, file);
    div_display.appendChild(bubbleChat);
  });
  console.log(body);
  return body;
}
getChat();

const createBubbleChat = (chat, username, fileName, isInverted) => {
  const div_pesan = document.createElement("div");
  div_pesan.classList.add("pesan");
  var file = fileName != undefined && fileName != "" ? ` - ${fileName} ` : "";
  if (isInverted) {
    div_pesan.innerHTML += file + chat + " :" + username;
  } else {
    div_pesan.innerHTML += username + ": " + chat + file;
  }
  return div_pesan;
};

const saveToDB = async (value, username, file) => {
  if (file) {
    console.log(file);
    const formData = new FormData();
    formData.append("text", value);
    formData.append("username", username);
    formData.append("file", file);

    console.log(...formData);

    const res = await fetch("/api/postChat", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      return true;
    }
  } else {
    const res = await fetch("/api/postChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: value, username: username }),
    });

    if (res.ok) {
      return true;
    }
  }
  return false;
};

// Socket.IO setup
const socketIO = io({ path: "/socket.io" });

socketIO.on("connect", () => console.log("Socket.IO Connected"));

socketIO.on("pesan-baru", (pesan) => {
  const bubbleChat = createBubbleChat(
    pesan.text,
    pesan.username,
    pesan.file,
    true
  );
  bubbleChat.classList.add("pesan-r");
  div_display.appendChild(bubbleChat);
});

// SockJS setup
const sockjs_url = "/sockjs";
const sockjs = new SockJS(sockjs_url);
const clientId = generateUniqueId();

sockjs.onopen = function () {
  console.log("SockJS Connected");
};
sockjs.onmessage = function (e) {
  console.log("pesan", e.data);
  const pesan = JSON.parse(e.data);
  if (pesan.clientId !== clientId) {
    const bubbleChat = createBubbleChat(
      pesan.text,
      pesan.username,
      pesan.file,
      true
    );
    bubbleChat.classList.add("pesan-r");
    div_display.appendChild(bubbleChat);
  }
};
sockjs.onclose = function () {
  console.log("SockJS close");
};

btn_kirim.addEventListener("click", async () => {
  if (input.value) {
    console.log(fileInput.files);
    var file = fileInput.files.length > 0 ? fileInput.files[0] : undefined;
    var fileName = file != undefined ? file.name : "";

    const save = await saveToDB(input.value, username.value, file);

    if (save) {
      const res = await fetch("/api/getChat", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        console.log(res.params);
      }

      const bubbleChat = createBubbleChat(
        input.value,
        username.value,
        fileName
      );
      div_display.appendChild(bubbleChat);
      socketIO.emit("kirim-pesan", {
        text: input.value,
        username: username.value,
        file: fileName,
      });
      sockjs.send(
        JSON.stringify({
          text: input.value,
          username: username.value,
          file: fileName,
        })
      );
      input.value = "";
      username.value = "";
      fileInput.value = "";
    }
  }
});
