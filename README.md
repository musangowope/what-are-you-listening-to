##Quick Startup:

###Creating Spotify App and getting your Client ID and client secret
The following is just quick instructions to application. 
During the demo I will actually explain how to set everything up

1) First we need to setup an application on spotify. Go to 
https://developer.spotify.com/dashboard/login and then either login or 
register and login if you dont have an account

2) You will be taken to a dashboard with all your existing apps if you have any. 
Click on the tab My New App. Fill out the relevant details(Name, description etc.) For the
what you are building  field, you can select the "I dont know" and finish the form

3) Once you have a finished form. You will be redirected to the details page of your project. 
Click on `Edit Settings` and set the `Redirect URIs` to `http://localhost:8888/callback` and save those
setting. Back in the project details page take down your client ID, client secret as well as the 
`http://localhost:8888/callback` in note(Any document, we will be using this in our code for the server)

###Setting the details (Client ID, Client Secret and callback URI). Running the client and server.

4) From the root of this project, in your terminal, cd into `client` and run `npm install`. 
CD into `auth-server` and do the same

5) In `auth-server/authorization_code/app.js` set the `client_id` variable to the client id which you 
took down. Do the same for `client_secret` and for the `redirect_uri` use the following `http://localhost:8888/callback`

6) **Running the client:** cd into `client` and run `yarn start` or `npm run dev`

7) **Running the Server:**  from the root, in your terminal run `node auth-server/authorization_code/app.js`

Then play a song on your spotify. 
go to `http://localhost:3000/` and check what song you are playing :)

