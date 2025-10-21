# Project: X mini
## Demo Video: https://x.com/On_Akdy/status/1980602204664000531?t=ys6k7XX4nLYWgsfd49z1Ow&s=19
## Discription
### concise summamry 
In this web app a user can post a tweet which he/she will write in a textarea and hit the `post btn` so the other user's can see it in their screen within 4 sec, **But why this timelag** (*I will Explain it to you in the next section*), and the user can see the post of other users as well, and also all the tweets will be sorted like a stack means LIFO manner. A user can see it's post history of all the tweets he/she had posted yet.
### Reason for the 4 sec timealag
This is Beacuse **I am not using Websockets** to make something like realtimeline. therefore it needs a 4 sec timelag for creating that illusion of the realtimeline. Becasuse the heavy lifting is done by the basic fetch api here, from posting the tweets to fecthing data from the backend. **you may ask why fetch api intead of websockets?**, *Because I didn't learned websockets yet*.
### How it works 
So first you have to signUp then LogIn to the User accounts then Write a tweet in the textarea then hit the `post btn`, request will send to the backend with the tweet (data) then it will get stored in the database a response will be send to the front-end "tweet posted!".

now in every 4 sec interval we need to check is their any new tweet/tweet's in the database if yes then the **new tweets + old one's** will stored say in a container and then this new container will replace the old container of the tweets. **and That's how the new tweets will appear in you screen**.
## Purpose of making this project
I created this project simply because I want to understand the front-end back-end data-flow/interaction means how the front-end send some data to the backend then it get stored in the database, and how the backend send the response or data from database to the front-end.

and at the same time if I will create something meaningfull as a project it will be good. Then I came up wih the Idea to make this project.

## Tech Stack
- **front-end** -> html/ejs, css, Js
- **Back-end** -> Js -> Node.js -> (express, express-session, mongoose)
- **Database** -> MongoDB

## Pros
- I think This is a good project to understand How the front-end back-end interact with each other.
- This is easy to create, at least more easier than using websockets (but using it will make your web app more fast and robust but it will be complicated **I guess**).
- the timelag can be decreased to 3 sec,2 sec, or even 1 sec which means you can make it faster but the only trade of will be that it will put a lot load in your server.

# Cons
- It is not a Scalable project means it can not handel massive amount of users **I think** because i created this with the purpose to understand something rather to deliver a product.
