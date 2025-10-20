// front-end of the web

// var for posting the tweet
let tweet = document.getElementById("tweet");
let response = document.getElementById("response");
let btn = document.getElementById("btn");

// var for the navigation of the user
let logout = document.querySelector(".logout");
let profile = document.querySelector(".profile");
let post = document.querySelector(".post");


// if click on post logo then "/dashboard" will hit
post.addEventListener("click", async () => {
    window.location.href = "/dashboard";
})


// if click on logout logo then "/logout" will hit
logout.addEventListener("click", async () => {
    let res = await fetch("/logout", { method: "POST" });
    if (res.ok) {
        window.location.href = "/login";
    }
})


// if click on profile logo then "/profile" will hit
profile.addEventListener("click", async () => {
    window.location.href = "/profile";
})


// sending post to the server and giving res that Tweet Posted!
btn.addEventListener("click", async () => {
    try {
        if (tweet.value) {
            let res = await fetch("/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tweet: tweet.value })
            })

            if (!res.ok) throw new Error("Server Error");

            let resp = await res.text();

            tweet.value = "";

            response.style.visibility = "visible";
            response.innerHTML = resp;
            response.style.backgroundColor = "#10B981";


            setTimeout(() => {
                response.style.visibility = "hidden";
            }, 2000);
        }
    } catch (err) {
        resp.innerHTML = err;
    }
})


// fecthing all the new posts and putting it in the .All_preposts, think of it as a (container)
async function refreshTimeline() {
    try {
        let res = await fetch("/dashboard");
        let html = await res.text();

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        let newPosts = doc.querySelector(".All_preposts");
        let oldPosts = document.querySelector(".All_preposts");

        if (newPosts && oldPosts) {
            oldPosts.innerHTML = newPosts.innerHTML;
        }
    } catch (err) {
        console.log(err)
    }
}


// checking that if there is any new post Posted in our X mini(web app)
async function CheckNewPost() {
    try {
        let newest_Post = document.querySelector(".previousPost");
        let Post_id = newest_Post.dataset.id;

        let res = await fetch("/anyNewData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Post_id: Post_id })
        })
        let response = await res.json();

        console.log();
        if (!(response.condition)) {
            refreshTimeline();
        }
    } catch (err) {
        console.log(err)
    }
}


// checking the post in a specific interval for new post if any then refresh timeline
let timelag = 4000;

setInterval(() => {
    if (document.hasFocus()) {
        CheckNewPost();
    }
}, timelag);