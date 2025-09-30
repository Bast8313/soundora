import fetch from "node-fetch";
fetch("https://lohumrjasdauvpqgjvhd.supabase.co/rest/v1/", { method: "GET" })
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);

// script test pour vérifier si Node.js peut se connecter à Supabase depuis la machine independamment de l'application
// exécuter avec : node test-supabase.js
