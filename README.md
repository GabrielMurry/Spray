<img src="/assets/ClimbersEyeLogoWhiteBackground.svg" width="500">

**Stage: Pre-Release (Internal Testing through App Store Connect)**

**App images below**

An app for rock climbers by a rock climber.

Easily build, edit, share, and track boulders on a spray wall.

View and filter through other user published boulders on a spray wall, switch between spray walls in a gym, or search for other gyms.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#tech-stack)
- [Features](#features)
- [Backend Functionality](#backend-functionality)
- [Screenshots](#screenshots)

# Tech-Stack
Full stack application: 
- React Native
- Expo
- Redux
- Django
- PostgreSQL
- Amazon S3 Buckets
- AWS RDS
- Heroku
- App Store Connect

# Features
Secure authentication with Django sessions and CSRF tokens.

Search for your gym or home wall via Apple Maps and Google geocoder API.

Add a new gym or home wall - edit the name, type, and location.

Add new spray walls to that gym - edit each spray wall's name and default image.

Home screen with a clean UI/UX that immediately displays the gym's name, spray walls, and a list of all published boulders in that spray wall.

Filter between spray walls in that gym or filter boulders through categorical filters or text inputs for specificity.

Add new boulder - options to use the default spray wall image, camera, or upload an image.

Edit and paint the boulder using your chosen image - green paint: starting hand holds, purple paint: foot holds, blue paint: hand and foot holds, red paint: finishing hold.

Can zoom and paint small holds whilst editing the boulder.

Using Python Imaging Library to manipulate the image by gray-scaling the entire image except for painted holds - leave the painted holds the color they are.

Storing all images in an Amazon S3 bucket and receiving the url to that image to send to the frontend and store in PostgreSQL database.

Add a boulder name, description, and more to your newly created boulder.

Publish or leave your boulder as a draft.

View any boulder - its name, grade, rating, image, setter name, date created, description, etc.

View the boulder image as a full screen with zoom and pan capabilities.

Optimistic updating when liking or bookmarking the boulder.

Log a repeated or first time ascent of a boulder - adding the number of attempts, grade and rating suggestion.

View overall statistics of that boulder - how many people have climbed the boulder, distribution graph of all suggested grades from users, and more.

View your personal statistics on that particular boulder - date ascended, suggested, grade, and number of attempts.

Add the boulder to your circuits.

Add a new circuit to your circuit list and place any boulders in that circuit (that exist on that spray wall).

Activity screen that displays and time stamps your significant activities - publishing a new boulder, ascending a boulder, repeating an ascent of a boulder, liking a boulder, bookmarking a boulder, adding a boulder to a circuit, and creating a new boulder.

Activity list are paginated to improve performance.

Profile screen that beautifully displays username profile image, current gym, current spray wall, categorical boulder data, statistics, and circuits.

Can freely change spray walls in your gym through the profile screen which changes all your boulder info (boulder info tied to each spray wall).

View all your logged boulders that displays a graph of quantity of boulders climbed at each grade difficulty, and a section list of all boulders logged in a particular spray wall for each session (day).

View liked, bookmarked, and created boulders for a particular spray wall.

View all the boulders in particular circuits you custom made.

Edit profile by changing your profile image, editing your nick name, username, email, signing out, or deleting your profile.

When changing your profile image, you can crop the image in aspect ratio 1:1, whilst also zooming and panning to desired region of the image.

Switch to a different gym in your profile that which you have shown activity in previously.

# Backend-Functionality
Django as a backend utilizing its model-template-view architectural pattern as well as Django's rest_framework.

7 Django models: Gym, SprayWall, Person, Boulder, Circuit, Like Send, Bookmark, and Activity.

Amazon S3 bucket for storing all images and using boto3 SDK for Python to retrieve those image urls for frontend use or storing in the database.

PostgreSQL as a relational database management system to sort and find related data based on primary keys, such as certain boulders in a particular spray wall, displaying user data, user boulder statistics, etc..

Over 35 API calls.

CRUD operations in all areas of data posting - boulder creations, custom profile editing, gym and spray wall editing, circuits, etc.

Organized code via categorized views, utils, helper functions, common functions, and common imports.

# Screenshots

<img src="/assets/sampleImages/CE_1.PNG" width="200">
Login
<img src="/assets/sampleImages/CE_2.PNG" width="200">
Create Account
<img src="/assets/sampleImages/CE_3.PNG" width="200">
Home
<img src="/assets/sampleImages/CE_4.PNG" width="200">
Boulder
<img src="/assets/sampleImages/CE_5.PNG" width="200">
Add Boulder
<img src="/assets/sampleImages/CE_6.PNG" width="200">
Edit Boulder
<img src="/assets/sampleImages/CE_7.PNG" width="200">
Zoom and paint boulder
<img src="/assets/sampleImages/CE_8.PNG" width="200">
NOT NEEDED
<img src="/assets/sampleImages/CE_9.PNG" width="200">
NOT NEEDED
<img src="/assets/sampleImages/CE_10.PNG" width="200">
Edited Boulder Preview
<img src="/assets/sampleImages/CE_11.PNG" width="200">
Published Boulder
<img src="/assets/sampleImages/CE_12.PNG" width="200">
Full Screen Image of Boulder
<img src="/assets/sampleImages/CE_13.PNG" width="200">
Log Ascent of Boulder
<img src="/assets/sampleImages/CE_14.PNG" width="200">
Add Boulder to a created circuit
<img src="/assets/sampleImages/CE_15.PNG" width="200">
NOT NEEDED
<img src="/assets/sampleImages/CE_16.PNG" width="200">
Boulder Statistics of all user on particular boulder
<img src="/assets/sampleImages/CE_17.PNG" width="200">
User's logged ascents on a particular boulder
<img src="/assets/sampleImages/CE_18.PNG" width="200">
Boulder settings (only author of boulder can delete boulder)
<img src="/assets/sampleImages/CE_19.PNG" width="200">
Gym settings (only for gym owners / spray wall owners)
<img src="/assets/sampleImages/CE_20.PNG" width="200">
Edit gym, spray walls for that gym, or delete gym entirely
<img src="/assets/sampleImages/CE_21.PNG" width="200">
Change gym type
<img src="/assets/sampleImages/CE_22.PNG" width="200">
Change gym name
<img src="/assets/sampleImages/CE_23.PNG" width="200">
Particular spray wall settings to change spray wall name or image
<img src="/assets/sampleImages/CE_24.PNG" width="200">
Change spray wall name
<img src="/assets/sampleImages/CE_25.PNG" width="200">
Filter list of boulders in chosen spray wall in the home screen
<img src="/assets/sampleImages/CE_26.PNG" width="200">
Map to search for gyms near you
<img src="/assets/sampleImages/CE_27.PNG" width="200">
Map search results
<img src="/assets/sampleImages/CE_28.PNG" width="200">
Map search results for a chosen gym (gym's info)
<img src="/assets/sampleImages/CE_29.PNG" width="200">
Activity of user (created boulder, sent boulder, etc)
<img src="/assets/sampleImages/CE_30.PNG" width="200">
Profile
<img src="/assets/sampleImages/CE_31.PNG" width="200">
Home screen alternate spray wall chosen
<img src="/assets/sampleImages/CE_32.PNG" width="200">
Alternate spray wall's boulder chosen (different image aspect ratio)
<img src="/assets/sampleImages/CE_33.PNG" width="200">
Profile switching to a different spray wall in a gym
<img src="/assets/sampleImages/CE_34.PNG" width="200">
Profile user's logbooked boulders
<img src="/assets/sampleImages/CE_35.PNG" width="200">
Profile user's liked boulders
<img src="/assets/sampleImages/CE_36.PNG" width="200">
Profile (scrolled down)
<img src="/assets/sampleImages/CE_37.PNG" width="200">
Profile user's top grade boulder(s)
<img src="/assets/sampleImages/CE_38.PNG" width="200">
Profile user's flahsed boulders (successfully ascended a boulder for the first time on user's first attempt)
<img src="/assets/sampleImages/CE_39.PNG" width="200">
Profile user's circuit boulders
<img src="/assets/sampleImages/CE_40.PNG" width="200">
Profile options pop up
<img src="/assets/sampleImages/CE_41.PNG" width="200">
Profile option switch to a different gym (only gyms that user has had activity in)
<img src="/assets/sampleImages/CE_42.PNG" width="200">
Edit profile
<img src="/assets/sampleImages/CE_43.PNG" width="200">
Crop image (zoom or pan. Works for any aspect ratio)
<img src="/assets/sampleImages/CE_44.PNG" width="200">
Change user's nickname in edit profile
<img src="/assets/sampleImages/CE_45.PNG" width="200">
Add new spray wall to a gym (only gym owners/admins can do this)
<img src="/assets/sampleImages/CE_46.PNG" width="200">
Home screen custom search in text input for particular boulders in that spray wall
