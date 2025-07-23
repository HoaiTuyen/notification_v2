const registerPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Quyền thông báo bị từ chối");
    return;
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BJ3ATAJ9fPjY-WX6xdNNuVoYoc6W5Ko1KImVPNpRu1xGyiD_5sMT1J77tXJ63Vsx76Btk-Po72fzp2CQCMdET84",
  });

  await fetch("http://localhost:4000/api/save-subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" },
  });

  console.log("🔔 Push đăng ký thành công");
};

export default registerPush;
