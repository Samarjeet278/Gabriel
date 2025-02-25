
// // Redirect (folder.html)
// const folExtend = (template, object) => {
//   try {
//     if (!template && !object) return;
//     template.addEventListener("click", (event) => {
//       const li = event.target.closest("li");
//       if (li && li.children.length > 1) {
//         const fol = li.children[1].textContent.trim();
//         if (!fol) return;
//         localStorage.setItem("verified", "Verified Artist"); // Update Tag
//         localStorage.setItem("fol", fol); // Update Folder
//         localStorage.setItem("fol-data", JSON.stringify(object)); // Update Object
//         window.location.href = "/folder.html"; // Redirect
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


//     // folExtend(forArtist, artists); // Redirect (Artist)
